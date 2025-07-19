import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Barcode from 'react-barcode';
import './UserStaff.css';

const UserStaff = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const printAreaRef = useRef(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL; // ✅ Use VITE env

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/user-staff`);
      setReceipts(res.data);
    } catch (err) {
      console.error('❌ Error fetching receipts:', err);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handlePrint = (receipt) => {
    setSelectedReceipt(receipt);

    setTimeout(() => {
      window.print();
    }, 200); // Wait to render the barcode
  };

  return (
    <div className="user-staff-container">
      <h3>🧾 All Staff Receipts</h3>

      <table className="receipt-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bill No</th>
            <th>Client</th>
            <th>Location</th>
            <th>Total</th>
            <th>Bags</th>
            <th>Checked By</th>
            <th>Date & Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.bill_no}</td>
              <td>{r.client_name}</td>
              <td>{r.location}</td>
              <td>{r.total_items}</td>
              <td>{r.bag_items}</td>
              <td>{r.checked_by}</td>
              <td>{r.date_time}</td>
              <td>
                <button className="print-btn" onClick={() => handlePrint(r)}>🖨️ Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Hidden Printable Receipt */}
      {selectedReceipt && (
        <div id="printArea" ref={printAreaRef}>
          <div><strong>Bill:</strong> {selectedReceipt.bill_no}</div>
          <div><strong>Client:</strong> {selectedReceipt.client_name}</div>
          <div><strong>Loc:</strong> {selectedReceipt.location}</div>
          <div><strong>Total:</strong> {selectedReceipt.total_items}</div>
          <div><strong>Bag:</strong> {selectedReceipt.bag_items}</div>
          <div><strong>Checked:</strong> {selectedReceipt.checked_by}</div>
          <div><strong>Time:</strong> {selectedReceipt.date_time}</div>

          {/* ✅ Barcode rendering */}
          <div className="barcode-wrap">
            <Barcode
              value={selectedReceipt.bill_no}
              renderer="canvas"
              height={30}
              width={1.5}
              fontSize={10}
              margin={0}
              displayValue={false}
            />
          </div>
        </div>
      )}

      {/* ✅ Print styles for thermal format */}
      <style>{`
        @media print {
          @page {
            size: 2.5in auto portrait;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #printArea, #printArea * {
            visibility: visible;
          }
          #printArea {
            position: absolute;
            top: 0;
            left: 0;
            padding: 12px;
            width: 100%;
            font-size: 16px;
            line-height: 30px;
            font-weight: 600;
          }
          .barcode-wrap svg {
            margin-top: 5px;
            height: 48px !important;
          }
          .print-btn, .receipt-form {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default UserStaff;
