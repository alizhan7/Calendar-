import React, { useState, useEffect } from 'react';
import './CalendarView.css';
import { fetchEvents, createEvent } from '../api/calendarApi';
import EventCard from '../components/EventCard';


const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(console.error);
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const date = new Date(year, month, selectedDay, 12); // noon to avoid timezone issues
    const isoDate = date.toISOString();

    const newEvent = {
      title,
      description,
      startTime: isoDate,
      endTime: isoDate
    };

    try {
      await createEvent(newEvent);
      const updatedEvents = await fetchEvents(); // 🔄 force refresh
      setEvents(updatedEvents);
    } catch (err) {
      console.error('Failed to save event:', err);
    }

    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() === month &&
      eventDate.getDate() === selectedDay
    );
  });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth}>←</button>
        <h2>{monthNames[month]} {year}</h2>
        <button onClick={goToNextMonth}>→</button>
      </div>

      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div className="calendar-day header" key={day}>{day}</div>
        ))}
        {days.map((day, index) => {
          const hasEvent = events.some((event) => {
            const eventDate = new Date(event.startTime);
            return (
              eventDate.getFullYear() === year &&
              eventDate.getMonth() === month &&
              eventDate.getDate() === day
            );
          });

          return (
            <div
              className={`calendar-day ${day ? '' : 'empty'}`}
              key={index}
              onClick={() => handleDayClick(day)}
            >
              {day}
              {hasEvent && <div className="event-dot"></div>}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Event for {monthNames[month]} {selectedDay}, {year}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div style={{ marginTop: '10px' }}>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDay && (
        <div className="event-list">
          <h3>Events for {monthNames[month]} {selectedDay}, {year}</h3>
          {filteredEvents.length > 0 ? (
            <div className="event-card-list">
              {filteredEvents.map((event, idx) => (
                <EventCard key={idx} event={event} />
              ))}
            </div>
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
