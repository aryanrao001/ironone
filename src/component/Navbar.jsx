import React from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import './DashboardLayout.css';

const Navbar = ({ toggleSidebar, isOpen }) => {
  const sidebarWidth = isOpen ? 240 : 60;

  return (
    <div
      className="custom-navbar d-flex justify-content-between align-items-center px-3"
      style={{
        left: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <FaBars className="menu-icon" onClick={toggleSidebar} />
      </div>
      <div className="search-icon">
        <FaSearch />
      </div>
    </div>
  );
};

export default Navbar;









