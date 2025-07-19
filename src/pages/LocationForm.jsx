import React, { useEffect, useState } from 'react';
import './LocationForm.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const LocationForm = () => {
  const [formData, setFormData] = useState({ locationName: '', address: '' });
  const [locations, setLocations] = useState([]);
  const [editId, setEditId] = useState(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/locations`);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${baseUrl}/api/locations/${editId}`
      : `${baseUrl}/api/locations`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ locationName: '', address: '' });
        setEditId(null);
        fetchLocations();
      }
    } catch (err) {
      console.error(editId ? 'Update Error:' : 'Add Error:', err);
    }
  };

  const handleEdit = (loc) => {
    setFormData({ locationName: loc.locationName, address: loc.address });
    setEditId(loc.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this location?')) return;

    try {
      const res = await fetch(`${baseUrl}/api/locations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchLocations();
      }
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  return (
    <div className="location-full-wrapper">
      <h1 className="location-heading">📍 Manage Locations</h1>

      <div className="location-row">
        {/* Left: Form */}
        <div className="location-form-section">
          <h2>{editId ? 'Edit Location' : 'Add New Location'}</h2>
          <form onSubmit={handleSubmit}>
            <label>Location Name</label>
            <input
              type="text"
              name="locationName"
              placeholder="e.g., City Hospital"
              value={formData.locationName}
              onChange={handleChange}
              required
            />
            <label>Address</label>
            <textarea
              name="address"
              placeholder="e.g., 123 Main Street, City"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <button type="submit">
              {editId ? 'Update Location' : 'Add Location'}
            </button>
          </form>
        </div>

        {/* Right: List */}
        <div className="location-list-section">
          <h2>Saved Locations</h2>
          {locations.length === 0 ? (
            <p className="text-muted">No locations saved yet.</p>
          ) : (
            <ul>
              {locations.map((loc) => (
                <li key={loc.id}>
                  <div className="location-info">
                    <div>
                      <strong>{loc.locationName}</strong>
                      <p>{loc.address}</p>
                    </div>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(loc)} title="Edit">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="delete"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
