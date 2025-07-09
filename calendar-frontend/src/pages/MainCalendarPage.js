import React, { useState, useEffect } from 'react';
import './MainCalendarPage.css';
import { fetchEvents } from '../api/calendarApi';

const MainCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);

  const getStartOfWeek = (date) => {
    const day = date.getDay(); // 0-6
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    const result = new Date(date);
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const weekStart = getStartOfWeek(new Date(selectedDate));
  const weekDays = [...Array(7)].map((_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const eventsThisWeek = events.filter((event) => {
    const eventDate = new Date(event.startTime || event.startDateTime);
    return weekDays.some(day => day.toDateString() === eventDate.toDateString());
  });

  // Month calendar logic (mini)
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const miniDays = [];

  for (let i = 0; i < startDay; i++) miniDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    miniDays.push(new Date(currentYear, currentMonth, i));
  }

  return (
    <div className="main-calendar-page">
      {/* Mini Calendar */}
      <div className="mini-calendar">
        <h3>{selectedDate.toLocaleString('default', { month: 'long' })} {currentYear}</h3>
        <div className="mini-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="mini-day-name">{d}</div>
          ))}
          {miniDays.map((day, i) => {
            if (!day) return <div key={i} className="mini-day dim"></div>;

            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={i}
                className={`mini-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly View */}
      <div className="week-calendar">
        <div className="week-header">
          {weekDays.map((day, i) => (
            <div key={i} className="week-day">
              {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>

        <div className="week-grid">
          {weekDays.map((day, i) => {
            const dayEvents = events.filter((event) =>
              new Date(event.startTime || event.startDateTime).toDateString() === day.toDateString()
            );
            return (
              <div key={i} className="week-column">
                {dayEvents.map(event => (
                  <div key={event.id} className="event-block">
                    <strong>{event.title}</strong>
                    <p>{event.description}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainCalendarPage;
