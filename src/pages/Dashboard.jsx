import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("day");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/dash/fetch`, {
        params: { filter },
      });
      setData(res.data.results || []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Pressmen Dashboard</h1>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3">
        {["day", "week", "month"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-semibold border transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 border-blue-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Error or Loading */}
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((pressman) => (
          <div
            key={pressman.pressman}
            className="bg-white shadow-lg border rounded-xl p-5 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              {pressman.pressman}
            </h2>
            <div className="space-y-2">
              <StatRow label="Total Logs" value={pressman.total_logs} />
              <StatRow label="Total Received" value={pressman.total_received} />
              <StatRow label="Pressed Qty" value={pressman.total_pressed} />
              <StatRow label="Complaints" value={pressman.total_complaints} />
              <StatRow label="Pending Qty" value={pressman.total_pending} />
            </div>
          </div>
        ))}
      </div>

      {!loading && data.length === 0 && (
        <p className="text-gray-400 mt-10">No data available.</p>
      )}
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <div className="flex justify-between text-sm text-gray-700">
    <span>{label}</span>
    <span className="font-semibold text-gray-900">{value || 0}</span>
  </div>
);

export default Dashboard;
