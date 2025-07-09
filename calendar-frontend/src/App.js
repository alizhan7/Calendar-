import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarView from './pages/CalendarView';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import './App.css'; // добавим layout-стили
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import RemindersPage from './pages/RemindersPage';
import MainCalendarPage from './pages/MainCalendarPage';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="main-layout">
          {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<MainCalendarPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-event" element={<EventsPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
