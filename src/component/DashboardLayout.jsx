import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DashboardLayout.css';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = isOpen && !isMobile ? 240 : 60;

  return (
    <div className="dashboard-container d-flex">
      <Sidebar isOpen={isOpen} isMobile={isMobile} />
      <div className="main-area" style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}>
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;




