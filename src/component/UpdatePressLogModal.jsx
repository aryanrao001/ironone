import axios from "axios";
import React, { useState, useEffect } from "react";

const UpdatePressLogModal = ({
    isOpen,
    onClose,
    pressLog,
    onSuccess, // New prop to refresh logs and close modal from parent
    articleList = [],
}) => {
    const [formData, setFormData] = useState({});
    const [titles, setTitles] = useState();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        if (pressLog) {
            setFormData(pressLog);
        }
    }, [pressLog]);

    const fetchTitles = async () => {
        const res = await axios.get(`${backendUrl}/api/titles`);
        setTitles(res.data.data || []);
    };

    useEffect(() => {
        // fetchPressmen();
        fetchTitles();
        // fetchLogs();
    }, []);


    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const id = formData.id;

            const payload = {
                ...formData,
                qty: +formData.qty || 0,
                add_on: +formData.add_on || 0,
                comp_qty: +formData.comp_qty || 0,
                pressed_qty: +formData.pressed_qty || 0,
                bal_qty: +formData.balance_qty || 0,
                total: (+formData.qty || 0) + (+formData.add_on || 0),
            };

            const res = await axios.put(`${backendUrl}/api/press-logs/${id}`, payload);

            if (res.data) {
                onSuccess?.();   // Refresh logs or notify parent
                onClose();       // ✅ Close the modal
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update the press log.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Update Press Log</h2>
                    <p onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">
                        ✕
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Article
                            </label>
                            <select
                                name="article"
                                value={formData.article || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Article</option>
                                {titles.map((t) => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}



                            </select>





{/* 
                            <select name="article" value={form.article} onChange={handleChange} className="border px-3 py-2 rounded" required>
                                <option value="">Select Article</option>
                                {titles.map((t) => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select> */}









                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Add-On Article
                            </label>
                            <select
                                name="add_on_article"
                                value={formData.add_on_article || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Add-On Article</option>
                                 {titles.map((t) => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Main Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {[
                            { label: "Pressman", name: "pressman" },
                            { label: "Qty", name: "qty", type: "number" },
                            { label: "Add-On", name: "add_on", type: "number" },
                            { label: "Start Time", name: "start_time", type: "text", disabled: true },
                            { label: "Comp Qty", name: "comp_qty", type: "number" },
                            { label: "Pressed Qty", name: "pressed_qty", type: "number" },
                            { label: "Balance Qty", name: "balance_qty", type: "number" },
                        ].map(({ label, name, type = "text", disabled = false }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name] || ""}
                                    onChange={handleChange}
                                    disabled={disabled}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
                                        }`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePressLogModal;
