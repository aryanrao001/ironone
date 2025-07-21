import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TitleManager = () => {
  const [titles, setTitles] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);


    const backendUrl = import.meta.env.VITE_BACKEND_URL;


  

  const API_URL = `${backendUrl}/api/titles`;

  const fetchTitles = async () => {
    try {
      const res = await axios.get(API_URL);
      setTitles(res.data?.data || []);
    } catch (err) {
      setStatus({ type: 'error', msg: '😵 Failed to fetch titles' });
      setTitles([]);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert('💬 Please enter a title');

    setLoading(true);
    try {
      await axios.post(API_URL, { name: newTitle });
      setNewTitle('');
      fetchTitles();
      setStatus({ type: 'success', msg: '🎉 Title added successfully!' });
    } catch (err) {
      setStatus({ type: 'error', msg: '🚫 Failed to add title' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 2500);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("❓ Are you sure you want to delete this title?");
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTitles();
      setStatus({ type: 'success', msg: '🗑️ Title deleted' });
    } catch (err) {
      setStatus({ type: 'error', msg: '🚫 Failed to delete title' });
    } finally {
      setTimeout(() => setStatus(null), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl">
      <h2 className="text-4xl font-black text-center text-indigo-600 mb-6 tracking-tight">
        🏷️ Article 
      </h2>

      {/* Status Message */}
      {status && (
        <div
          className={`mb-5 text-center font-medium py-3 rounded-xl transition-all ${
            status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status.msg}
        </div>
      )}

      {/* Add ArticleForm */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="text"
          placeholder="✨ Type a new Articlehere..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-auto w-full sm:w-auto px-4 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : '➕ Add Article'}
        </button>
      </form>

      {/* ArticleList */}
      {titles.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">📋 Your Article</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden text-sm">
              <thead className="bg-indigo-50 text-indigo-800 font-medium">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {titles.map((t, index) => (
                  <tr
                    key={t.id}
                    className="border-t hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-800">{t.name}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-sm px-3 py-1 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition shadow"
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
        <div className="text-center text-gray-500 mt-10 text-lg">
          😕 No Article found yet.
        </div>
      )}
    </div>
  );
};

export default TitleManager;

