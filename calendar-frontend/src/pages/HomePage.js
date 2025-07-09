import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h2>Welcome to Event Calendar</h2>
      <p>Click below to view your calendar:</p>
      <Link to="/calendar">
        <button>Go to Calendar</button>
      </Link>
    </div>
  );
};

export default HomePage;
