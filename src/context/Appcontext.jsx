import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AppContext = createContext();

// Create Provider
const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  // Sync with localStorage when values change
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');

    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [token, role]);

  const logout = () => {
    setToken('');
    setRole('');
  };

  return (
    <AppContext.Provider value={{ token, setToken, role, setRole, logout }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for consuming the context
const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
