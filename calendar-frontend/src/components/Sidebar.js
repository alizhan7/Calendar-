import React from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      <div className="auth-buttons">
        <button className="sidebar-btn" onClick={() => navigate('/login')}>🔑 Login</button>
        <button className="sidebar-btn" onClick={() => navigate('/register')}>📝 Register</button>
      </div>
      <Link to="/history" className="sidebar-btn">📜 History</Link>

    </aside>
  );
};

export default Sidebar;
