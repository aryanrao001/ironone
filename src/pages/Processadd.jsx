import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdatePressLogModal from "../component/UpdatePressLogModal";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


const AddPressLog = () => {


  const [pressmen, setPressmen] = useState([]);
  const [titles, setTitles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeLogs, setActiveLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [form, setForm] = useState({
    pressman: "",
    article: "",
    qty: "",
    add_on: "",
    add_on_article: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalData, setModalData] = useState({
    add_on: "",
    comp_qty: "",
    pressed_qty: "",
    balance_qty: "",
  });


  const handleEditClick = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  // Load initial data
  useEffect(() => {
    fetchPressmen();
    fetchTitles();
    fetchLogs();
  }, []);

  const fetchPressmen = async () => {
    const res = await axios.get(`${backendUrl}/api/staff`);
    setPressmen(res.data);
  };

  const fetchTitles = async () => {
    const res = await axios.get(`${backendUrl}/api/titles`);
    setTitles(res.data.data || []);
  };

  const fetchLogs = async () => {
    const res = await axios.get(`${backendUrl}/api/press-logs/bydate`);
    setLogs(res.data);
    setActiveLogs(res.data.filter((log) => !log.finish_time));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStart = async (e) => {
    e.preventDefault();

    const now = new Date();
    const start_time = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    // const start_time = now.toLocaleString("sv-SE").replace("T", " ");

    // const start_time = new Date().toISOString().slice(0, 19).replace("T", " ");
    const payload = {
      ...form,
      start_time,
      comp_qty: 0,
      pressed_qty: 0,
      balance_qty: form.qty, // Initially full qty
    };

    await axios.post(`${backendUrl}/api/press-logs`, payload);
    setForm({ pressman: "", article: "", qty: "", add_on: "", add_on_article: "" });
    fetchLogs();
  };

  const openStopModal = (log) => {
    setSelectedLog(log);
    const total = +log.qty + +log.add_on;
    setModalData({
      add_on: +log.add_on || 0,
      comp_qty: 0,
      pressed_qty: 0,
      balance_qty: total,
    });
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...modalData, [name]: +value };
    const total = +selectedLog.qty + +updated.add_on;
    const used = +updated.comp_qty + +updated.pressed_qty;

    if (used > total) return;
    updated.balance_qty = total - used;
    setModalData(updated);
  };

  const handleModalSubmit = async () => {
    try {
      const id = selectedLog.id;
      const now = new Date();
      const finish_time = now.toLocaleString("sv-SE").replace("T", " ");

      const payload = {
        pressman: selectedLog.pressman,
        article: selectedLog.article,
        qty: selectedLog.qty,
        add_on_article: selectedLog.add_on_article,
        // start_time: selectedLog.start_time, // ✅ KEEP ORIGINAL START TIME
        add_on: modalData.add_on,
        comp_qty: modalData.comp_qty,
        pressed_qty: modalData.pressed_qty,
        balance_qty: modalData.balance_qty,
        finish_time,
      };

      await axios.put(`${backendUrl}/api/press-logs/${id}`, payload);

      setShowModal(false);
      setSelectedLog(null);
      fetchLogs();
    } catch (err) {
      console.error("Stop error:", err);
      alert("Failed to stop the task.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl pb-3 font-bold mb-6 text-gray-800">📝 Add Press Log</h2>

      <form onSubmit={handleStart} className="grid grid-cols-2  md:grid-cols-3 gap-2 bg-white p-2 rounded shadow">
        <select name="pressman" value={form.pressman} onChange={handleChange} className="border px-3 py-2 rounded" >
          <option value="">Select Pressman</option>
          {pressmen.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>`
        <input type="text" placeholder="PressMan" name="pressman" className="px-3 py-3 rounded border" value={form.pressman} onChange={handleChange} />


        <select name="article" value={form.article} onChange={handleChange} className="border px-3 py-2 rounded" required>
          <option value="">Select Article</option>
          {titles.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>

        <input name="qty" placeholder="QTY" value={form.qty} onChange={handleChange} className="border px-3 py-2 rounded" type="number" required />
        <input name="add_on" placeholder="ADD ON" value={form.add_on} onChange={handleChange} className="border px-3 py-2 rounded" type="number" />
        <select name="add_on_article" value={form.add_on_article} onChange={handleChange} className="border px-3 py-2 rounded" >
          <option value="">Select Article</option>
          {titles.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>

        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Start Task
        </button>
      </form>

      {/* {showModal && selectedLog && (
        <div className="mt-6 w-full max-w-xl bg-white border border-gray-300 p-6 rounded shadow-xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            🛑 Stop Task for <span className="text-blue-600">{selectedLog.pressman}</span>
          </h2>
          <p><strong>Article</strong>: {selectedLog.article}</p>
          <p><strong>Qty</strong>: {selectedLog.qty}</p>
          <p><strong>Start Date</strong>: {new Date(selectedLog.start_time).toLocaleDateString()}</p>
          <p><strong>Start Time</strong>: {new Date(selectedLog.start_time).toLocaleTimeString()}</p>

          <div className="grid grid-cols-1 gap-2 mt-4">
            <label>Add On</label>
            <input type="number" name="add_on" value={modalData.add_on} onChange={handleModalChange} className="border px-3 py-2 rounded" />
            <label>Complaint Qty</label>
            <input type="number" name="comp_qty" value={modalData.comp_qty} onChange={handleModalChange} className="border px-3 py-2 rounded" />
            <label>Pressed Qty</label>
            <input type="number" name="pressed_qty" value={modalData.pressed_qty} onChange={handleModalChange} className="border px-3 py-2 rounded" />
            <label>Balance Qty</label>
            <input type="number" value={modalData.balance_qty} readOnly className="bg-gray-100 border px-3 py-2 rounded" />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
            <button onClick={handleModalSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit</button>
          </div>
        </div>
      )} */}

      {activeLogs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">🟡 Ongoing Tasks</h3>
          <table className="w-full border text-sm bg-white rounded overflow-hidden">
            <thead className="bg-yellow-100">
              <tr>
                <th className="border px-3 py-2">Pressman</th>
                <th className="border px-3 py-2">Article</th>
                <th className="border px-3 py-2">Start</th>
                <th className="border px-3 py-2" >Qty</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeLogs.map((log) => (
                <tr key={log.id}>
                  <td className="border px-3 py-1">{log.pressman}</td>
                  <td className="border px-3 py-1">{log.article}</td>
                  <td className="border px-3 py-1">
                    {new Date(log.start_time).toLocaleString()}
                  </td>
                  <td className="border px-3 py-1">{log.qty + log.add_on }</td>

                  <td className="border px-3 py-1 text-center">
                    <button onClick={() => openStopModal(log)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Stop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">📋 All Logs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Pressman</th>
                <th className="border px-2 py-1">Article</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Add On</th>
                <th className="border px-2 py-1">Add On article</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Start</th>
                <th className="border px-2 py-1">Finish</th>
                <th className="border px-2 py-1">Comp.</th>
                <th className="border px-2 py-1">Pressed</th>
                <th className="border px-2 py-1">Bal</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr onClick={() => handleEditClick(log)} key={log.id || i}>
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{log.pressman}</td>
                  <td className="border px-2 py-1">{log.article}</td>
                  <td className="border px-2 py-1">{log.qty}</td>
                  <td className="border px-2 py-1">{log.add_on}</td>
                  <td className="border px-2 py-1">{log.add_on_article || "----------"}</td>

                  <td className="border px-2 py-1">{+log.qty + +log.add_on || "-"}</td>
                  <td className="border px-2 py-1"> <span> {new Date(log.start_time).toLocaleTimeString()}</span>  </td>
                  {/* <td className="border px-2 py-1"> <span> {new Date(log.start_time).toLocaleTimeString()}</span>  </td> */}
                  <td className="border px-2 py-1">
                    {log.finish_time
                      ? new Date(log.finish_time).toLocaleString("en-IN", {
                        // year: "numeric",
                        // month: "short",
                        // day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                      : "-"}
                  </td>
                  <td className="border px-2 py-1">{log.comp_qty}</td>
                  <td className="border px-2 py-1">{log.pressed_qty}</td>
                  <td className="border px-2 py-1">{log.balance_qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg border border-gray-300 p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex-3/4 text-2xl font-bold text-blue-700">
                🛑  {selectedLog.pressman}
              </h2>
              {/* <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600 text-xl  "
              >
                &times;
              </button> */}
            </div>

            <div className="text-sm text-gray-700 mb-6 space-y-1">
              <p><strong>📰 Article:</strong> {selectedLog.article}</p>
              <p><strong>🧮 Qty:</strong> {selectedLog.qty}</p>
              <p>
                <strong>⏱ Start:</strong>{" "}
                {new Date(selectedLog.start_time).toLocaleString()}
              </p>
            <p><strong>👔 Add On Article </strong>: {selectedLog.add_on_article}</p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-600">Add On</label>
                <input
                  type="number"
                  name="add_on"
                  value={modalData.add_on}
                  onChange={handleModalChange}
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Complaint Qty</label>
                <input
                  type="number"
                  name="comp_qty"
                  value={modalData.comp_qty}
                  onChange={handleModalChange}
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Pressed Qty</label>
                <input
                  type="number"
                  name="pressed_qty"
                  value={modalData.pressed_qty}
                  onChange={handleModalChange}
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Balance Qty</label>
                <input
                  type="number"
                  value={modalData.balance_qty}
                  readOnly
                  className="w-full bg-gray-100 border rounded-md px-4 py-2 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8 gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


      <UpdatePressLogModal
        isOpen={isModalOpen}

        onClose={() => setIsModalOpen(false)}
        pressLog={selectedLog}
        // onUpdate={handleUpdate}
        articleList={["Shirt", "Pant", "Coat", "Blazer", "Skirt"]}
      />




      {/* <UpdatePressLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pressLog={selectedLog}
      /> */}

    </div>
  );
};

export default AddPressLog;
