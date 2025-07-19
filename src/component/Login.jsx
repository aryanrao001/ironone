import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const endpoint =
      role === 'admin'
        ? `${baseUrl}/api/auth/login`
        : `${baseUrl}/api/user/login`;

    const payload = {
      email: emailOrPhone,
      password,
    };

    try {
      const res = await axios.post(endpoint, payload);
      const { success, token, user } = res.data;

      if (success && token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);

        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else if (user.role === 'staff') {
          navigate('/dashboard/processadd');
        } else {
          setError('Unknown role. Please contact admin.');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <h2><FaUserShield className="me-2" /> Welcome to Admin Panel</h2>
        <p className="welcome-msg">Please login as Admin or Staff.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Role:</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setEmailOrPhone('');
              }}
              className="form-select"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter Your Email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>

          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
