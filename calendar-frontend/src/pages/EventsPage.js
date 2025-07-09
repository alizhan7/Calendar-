import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
const [form, setForm] = useState({
  title: '',
  description: '',
  startTime: '',
  endTime: ''
});


  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/calendar/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      console.error('❌ Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/api/calendar/create',
        {
          title: form.title,
          description: form.description,
          startTime: form.startTime,
          endTime: form.endTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ title: '', description: '', startTime: '', endTime: '' });
      fetchEvents();
    } catch (err) {
      console.error('❌ Failed to create event:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/calendar/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error('❌ Failed to delete event:', err);
    }
  };

  return (
    <div className="events-container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Create New Event</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} />
        <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} />
        <button type="submit">Add Event</button>
      </form>

      <div className="events-list">
        <h3>Your Events</h3>
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <strong>{event.title}</strong>
            <p>{event.description}</p>
            <p>
              {new Date(event.startTime).toLocaleString()} → {new Date(event.endTime).toLocaleString()}
            </p>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
