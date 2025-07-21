import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    role: "staff",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL

 const fetchStaff = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/user`);
    console.log("📦 Staff Response:", res.data); // Check structure

    if (Array.isArray(res.data)) {
      setStaffList(res.data);
    } else {
      console.warn("⚠️ Unexpected API response format");
      setStaffList([]); // fallback
    }
  } catch (err) {
    console.error("Error fetching staff", err);
    setStaffList([]); // fallback
  }
};

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/user`, formData);
      fetchStaff();
      setFormData({
        name: "",
        password: "",
        role: "staff",
      });
    } catch (err) {
      console.error("Error creating staff", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await axios.delete(`${backendUrl}/api/user/${id}`);
      fetchStaff();
    } catch (err) {
      console.error("Error deleting staff", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Staff Management</h1>

      {/* Create Staff Form */}
      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-md mb-10"
      >
        {[
          ["name", "Name"],
          ["password", "Password"],
        ].map(([key, label]) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required
            placeholder={label}
            className="border p-3 rounded-md w-full"
          />
        ))}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-3 rounded-md w-full"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition mt-2"
        >
          Create Staff
        </button>
      </form>

      {/* Staff List */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(staffList) && staffList.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{staff.name}</td>
                <td className="p-3 capitalize">{staff.role}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {staffList.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-400">
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateUser;
