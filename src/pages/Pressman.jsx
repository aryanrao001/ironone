import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddPressman = () => {
  const [pressmen, setPressmen] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const API_URL = `${backendUrl}/api/staff`;

  const fetchPressmen = async () => {
    try {
      const res = await axios.get(API_URL);
      setPressmen(res.data);
    } catch (err) {
      setStatus({ type: 'error', msg: '😵 Failed to fetch pressmen' });
    }
  };

  useEffect(() => {
    fetchPressmen();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('💬 Enter a name before submitting');

    setLoading(true);
    try {
      await axios.post(API_URL, { name });
      setName('');
      fetchPressmen();
      setStatus({ type: 'success', msg: '✅ Pressman added!' });
    } catch (err) {
      setStatus({ type: 'error', msg: '❌ Could not add pressman' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Delete this pressman?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPressmen();
      setStatus({ type: 'success', msg: '🧹 Deleted' });
    } catch (err) {
      setStatus({ type: 'error', msg: '🚫 Delete failed' });
    } finally {
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-14 p-10 rounded-3xl backdrop-blur-lg bg-white/40 border border-gray-200 shadow-2xl relative overflow-hidden">
      {/* Background Bubbles */}
      <div className="absolute top-0 -left-10 w-60 h-60 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full blur-3xl opacity-30 animate-pulse -z-10" />
      <div className="absolute bottom-0 -right-10 w-60 h-60 bg-gradient-to-tr from-pink-300 to-yellow-400 rounded-full blur-3xl opacity-20 animate-ping -z-10" />

      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
        🚀 Pressman Manager
      </h2>

      {status && (
        <div
          className={`mb-6 px-6 py-3 rounded-xl text-white font-semibold text-center shadow ${
            status.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="💡 Enter name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full  px-5 py-3 rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-sm shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-200 text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 text-white font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-blue-400/50 disabled:opacity-60 w-full sm:w-auto"
        >
          {loading ? '⏳ Saving...' : '➕ Add'}
        </button>
      </form>

      {pressmen.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">📋 Pressmen List</h3>
          <div className="overflow-x-auto rounded-xl shadow-md bg-white/60 backdrop-blur border border-gray-100">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-white/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3">#</th>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-center px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pressmen.map((p, index) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-200 hover:bg-blue-50/50 transition"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3 font-medium">{p.name}</td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-semibold shadow hover:scale-105 transition active:scale-95"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-500 text-lg">🫥 No pressmen yet.</p>
      )}
    </div>
  );
};

export default AddPressman;
