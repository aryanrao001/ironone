import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserShield,
  FaTachometerAlt,
  FaUserPlus,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaPrint,
  FaTeamspeak,
  FaRibbon,
  FaUser,
  FaPage4,
  FaDashcube,
  FaUserAstronaut,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, isMobile }) => {
  const width = isOpen && !isMobile ? '240px' : '60px';
  const iconSize = 20;
  const logoutIconSize = 24;
  const logoIconSize = 28;
  const navigate = useNavigate();

  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div
      className={`sidebar text-white d-flex flex-column vh-100 ${isOpen ? 'open' : 'collapsed'}`}
      style={{ width, transition: '0.3s ease', position: 'fixed', backgroundColor: '#2575fc' }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center justify-content-center my-3">
        <FaUserShield size={logoIconSize} className="me-2" />
        {isOpen && !isMobile && <span className="fw-bold fs-5">Admin Panel</span>}
      </div>

      {/* Sidebar Items */}
      <ul className="nav flex-column px-2 mt-3">
        {role === 'admin' ? (
          <>
            <li className="nav-item mb-2">
              <Link to="/dashboard/" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaDashcube size={iconSize} className="me-3" />
                {isOpen && 'Dashboard'}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/processadd" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaTeamspeak size={iconSize} className="me-3" />
                {isOpen && 'Add Process'}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/process" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaRibbon size={iconSize} className="me-3" />
                {isOpen && 'Process List'}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/pressman" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaUser size={iconSize} className="me-3" />
                {isOpen && 'PressMan'}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/titlemanager" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaPage4 size={iconSize} className="me-3" />
                {isOpen && 'Title'}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/dashboard/user" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaUserAstronaut size={iconSize} className="me-3" />
                {isOpen && 'User'}
              </Link>
            </li>
            {/* <li className="nav-item mb-2">
              <Link to="/dashboard/chemical" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaRibbon size={iconSize} className="me-3" />
                {isOpen && 'Process List'}
              </Link>
            </li> */}
            {/* <li className="nav-item mb-2">
              <Link to="/dashboard/chemical" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaRibbon size={iconSize} className="me-3" />
                {isOpen && 'Process List'}
              </Link>
            </li> */}
          </>
        ) : role === 'staff' ? (
          <>          <li className="nav-item mb-2">
            <Link to="/dashboard/processadd" className="nav-link text-white fs-6 d-flex align-items-center">
              <FaTeamspeak size={iconSize} className="me-3" />
              {isOpen && 'Add Process'}
            </Link>
          </li>

            <li className="nav-item mb-2">
              <Link to="/dashboard/process" className="nav-link text-white fs-6 d-flex align-items-center">
                <FaRibbon size={iconSize} className="me-3" />
                {isOpen && 'Process List'}
              </Link>
            </li>
          </>

        ) : null}
      </ul>

      {/* Logout */}
      <div className="mt-auto px-2 mb-4">
        <div
          className="nav-link logout-btn text-white d-flex align-items-center fw-semibold"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <FaSignOutAlt size={logoutIconSize} className="me-3" />
          {isOpen && 'Logout'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
