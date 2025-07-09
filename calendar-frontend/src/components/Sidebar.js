import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Quick Access</h3>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      <Link to="/create-event" className="sidebar-btn">Create Event</Link>
      <Link to="/tasks" className="sidebar-btn">View Tasks</Link>
      <Link to="/reminders" className="sidebar-btn">Reminders</Link>
    </aside>
  );
};

export default Sidebar;
