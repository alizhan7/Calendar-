import React, { useState, useEffect } from 'react';
import './MainCalendarPage.css';
import EventCard from '../components/EventCard';
import {
  fetchEvents,
  fetchHolidays,
  fetchTodayOrRecommended,
  updateEvent,
  deleteEvent,
  createEvent
} from '../api/calendarApi';

const MainCalendarPage = ({ viewMode }) => {
  const [selectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const allEvents = await fetchEvents();
        const recommended = await fetchTodayOrRecommended();

        const uniqueRecommendations = recommended.filter(r =>
          !allEvents.some(e => e.title === r.title && e.startTime === r.startTime)
        ).map(r => ({
          ...r,
          title: r.title.startsWith('[Suggested]') ? r.title : `[Suggested] ${r.title}`
        }));

        setEvents([...allEvents, ...uniqueRecommendations]);

        const year = new Date().getFullYear();
        const holidays = await fetchHolidays(year);
        setHolidays(holidays);
      } catch (err) {
        console.error('Error loading calendar data:', err);
      }
    };

    loadAll();
  }, []);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const parseLocalDate = (str) => {
    const [year, month, day] = str.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const getHolidayIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('nauryz')) return '🌸';
    if (lower.includes('new year')) return '🎆';
    if (lower.includes('victory day')) return '🎖️';
    if (lower.includes('independence')) return '🇰🇿';
    if (lower.includes('capital city day')) return '🏙️';
    if (lower.includes('womens day')) return '👩';
    if (lower.includes('unity')) return '🤝';
    if (lower.includes('constitution')) return '📜';
    return '🎉';
  };

  const isHoliday = (date) =>
    holidays.find(h => isSameDay(parseLocalDate(h.date), date));

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const result = new Date(date);
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const getDisplayedDays = () => {
    const days = [];
    if (viewMode === 'day') {
      days.push(new Date(selectedDate));
    } else if (viewMode === '3days') {
      for (let i = 0; i < 3; i++) {
        const day = new Date(selectedDate);
        day.setDate(selectedDate.getDate() + i);
        days.push(day);
      }
    } else if (viewMode === 'workweek') {
      const start = getStartOfWeek(selectedDate);
      for (let i = 0; i < 5; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
      }
    } else if (viewMode === 'year') {
      return []; // year handled separately
    } else {
      const start = getStartOfWeek(selectedDate);
      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
      }
    }
    return days;
  };

  const displayedDays = getDisplayedDays();

  const handleSave = async (updatedEvent) => {
    try {
      const isSuggested = updatedEvent.title.startsWith('[Suggested] ');
      const cleanTitle = updatedEvent.title.replace('[Suggested] ', '');
      const eventToSave = {
        ...updatedEvent,
        title: cleanTitle
      };

      let savedEvent;
      if (updatedEvent.id) {
        savedEvent = await updateEvent(updatedEvent.id, eventToSave);
        setEvents(prev =>
          prev.map(e => e.id === savedEvent.id ? savedEvent : e)
        );
      } else {
        savedEvent = await createEvent(eventToSave);
        setEvents(prev => [
          ...prev.filter(e =>
            !(isSuggested &&
              e.title === updatedEvent.title &&
              e.startTime === updatedEvent.startTime)
          ),
          savedEvent
        ]);
      }

      setSelectedEvent(null);
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setSelectedEvent(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleDecline = async (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setSelectedEvent(null);
  };

  const renderYearView = () => {
    const year = selectedDate.getFullYear();

    return (
      <div className="year-view">
        {Array.from({ length: 12 }).map((_, monthIndex) => {
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
          const monthName = new Date(year, monthIndex, 1).toLocaleString('default', { month: 'long' });

          return (
            <div className="year-month" key={monthIndex}>
              <div className="year-month-name">{monthName}</div>
              <div className="year-days-grid">
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                  const date = new Date(year, monthIndex, dayIndex + 1);
                  const dayEvents = events.filter(event => {
                    const d = new Date(event.startTime || event.startDateTime);
                    return isSameDay(d, date);
                  });
                  const holiday = isHoliday(date);

                  return (
                    <div key={dayIndex} className="year-day-cell" onClick={() => {
                      setSelectedEvent({
                        title: '',
                        description: '',
                        startTime: date.toISOString(),
                        endTime: '',
                        done: false,
                      });
                    }}>
                      <div className="year-day-number">{dayIndex + 1}</div>
                      {holiday && <div className="year-event holiday">{getHolidayIcon(holiday.title)}</div>}
                      {dayEvents.map((event, i) => (
                        <div
                          key={i}
                          className={`year-event ${event.title?.startsWith('[Suggested]') ? 'suggested' : ''} ${event.done ? 'done' : ''}`}
                          title={event.title}
                        >
                          • {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="main-calendar-page">
      {viewMode === 'year' ? (
        renderYearView()
      ) : (
        <div className="week-calendar">
          <div className="week-header">
            {displayedDays.map((day, i) => (
              <div key={i} className="week-day">
                {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            ))}
          </div>

          <div className="week-grid" style={{ gridTemplateColumns: `repeat(${displayedDays.length}, 1fr)` }}>
            {displayedDays.map((day, i) => {
              const dayEvents = events.filter(event => {
                const dateStr = event.startTime || event.startDateTime;
                if (!dateStr) return false;
                const d = new Date(dateStr);
                return d.toDateString() === day.toDateString();
              });

              const holiday = isHoliday(day);

              return (
                <div key={i} className="week-column">
                  {holiday && (
                    <div className="event-block holiday-block">
                      <span style={{ marginRight: '6px' }}>{getHolidayIcon(holiday.title)}</span>
                      <strong>{holiday.title}</strong>
                    </div>
                  )}
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`event-block ${event.title?.startsWith('[Suggested]') ? 'suggested-event' : 'user-event'} ${event.done ? 'done' : ''}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <strong>{event.title}</strong>
                      <p>{event.description}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        className="create-event-button"
        onClick={() =>
          setSelectedEvent({
            title: '',
            description: '',
            startTime: new Date().toISOString(),
            endTime: '',
            done: false,
          })
        }
      >
        + Create Event
      </button>

      {selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSave}
          onDecline={handleDecline}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MainCalendarPage;
