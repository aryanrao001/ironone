// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // ✅ Bootstrap Icons
import './index.css'; // Your own styles (optional)
import { AppProvider } from './context/Appcontext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

