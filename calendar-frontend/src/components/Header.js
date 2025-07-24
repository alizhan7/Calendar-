import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, viewMode, setViewMode }) => {
  const navigate = useNavigate();

  const modes = [
    { value: 'day', label: 'Day' },
    { value: '3days', label: '3 Days' },
    { value: 'workweek', label: 'Work Week' },
    { value: 'week', label: 'Full Week' },
    { value: 'year', label: 'Year' }
  ];

  return (
    <header className="app-header">
      <div className="left-group">
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
        <div className="brand" onClick={() => navigate('/')} title="Go to Home">
          Momento
        </div>
      </div>

      <div className="right-header">
        <div className="view-mode-switch">
          {modes.map((mode) => (
            <button
              key={mode.value}
              className={`view-mode-btn ${viewMode === mode.value ? 'active' : ''}`}
              onClick={() => setViewMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
