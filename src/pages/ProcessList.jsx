import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
// import "jspdf-autotable"
import autoTable from "jspdf-autotable";


const ITEMS_PER_PAGE = 10;

const ProcessList = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    axios
      .get(`${backendUrl}/api/press-logs`)
      .then((res) => {
        setLogs(res.data);
        setFilteredLogs(res.data);
      })
      .catch((err) => {
        console.warn("⚠️ Backend failed.", err.message);
      });
  }, []);

  useEffect(() => {
    const filtered = logs.filter((log) =>
      log.pressman.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
    setCurrentPage(1); // reset to page 1 on new search
  }, [searchTerm, logs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PressLogs"); // ✅ Fixed line
    XLSX.writeFile(workbook, "PressLogs.xlsx");
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "#", "Pressman", "Article", "Qty", "Add On", "Add On Article",
      "Total", "Start", "Finish", "Comp.", "Pressed", "Bal"
    ];
    const tableRows = filteredLogs.map((log, index) => [
      index + 1,
      log.pressman,
      log.article,
      log.qty,
      log.add_on,
      log.add_on_article,
      +log.qty + +log.add_on || "-",
      log.start_time,
      log.finish_time || "-",
      log.comp_qty,
      log.pressed_qty,
      log.balance_qty
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      margin: { top: 20 },
      styles: { fontSize: 8 },
    });

    doc.save("PressLogs.pdf");
  };





  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📋 Press Logs Table</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Pressman..."
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📥 Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          📄 Export to PDF
        </button>
      </div>

      <div className="overflow-x-auto border rounded-xl shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Pressman</th>
              <th className="py-3 px-4 border">Article</th>
              <th className="py-3 px-4 border">Qty</th>
              <th className="py-3 px-4 border">Add On</th>
              <th className="py-3 px-4 border">Add On Article</th>
              <th className="py-3 px-4 border">Total</th>
              <th className="py-3 px-4 border">Start</th>
              <th className="py-3 px-4 border">Finish</th>
              <th className="py-3 px-4 border">Comp.</th>
              <th className="py-3 px-4 border">Pressed</th>
              <th className="py-3 px-4 border">Bal</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paginatedLogs.map((log, index) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td className="py-2 px-4 border">{log.pressman}</td>
                <td className="py-2 px-4 border">{log.article}</td>
                <td className="py-2 px-4 border">{log.qty}</td>
                <td className="py-2 px-4 border">{log.add_on}</td>
                <td className="py-2 px-4 border">{log.add_on_article}</td>
                <td className="py-2 px-4 border">{+log.qty + +log.add_on || "-"}</td>
                <td className="py-2 px-4 border"> {new Date(log.start_time).toLocaleDateString()} <br /> {new Date(log.start_time).toLocaleTimeString()} </td>
                <td className="py-2 px-4 border">
                  {log.finish_time
                    ? (
                      <>
                        {new Date(log.finish_time).toLocaleDateString()} <br />
                        {new Date(log.finish_time).toLocaleTimeString()}
                      </>
                    )
                    : "-"
                  }
                </td>
                <td className="py-2 px-4 border">{log.comp_qty}</td>
                <td className="py-2 px-4 border">{log.pressed_qty}</td>
                <td className="py-2 px-4 border">{log.balance_qty}</td>
              </tr>
            ))}
            {paginatedLogs.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-500">
                  No press logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-md border ${currentPage === page
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessList;
