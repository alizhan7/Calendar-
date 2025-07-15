import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import MainCalendarPage from './pages/MainCalendarPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('week');

  return (
    <Router>
      <div className="app-container">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className="main-layout">
          {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<MainCalendarPage viewMode={viewMode} />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-event" element={<EventsPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
