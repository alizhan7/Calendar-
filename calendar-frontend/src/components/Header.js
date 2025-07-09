import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1>Event Calendar</h1>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link> {/* ✅ Newly added */}
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
};

export default Header;
