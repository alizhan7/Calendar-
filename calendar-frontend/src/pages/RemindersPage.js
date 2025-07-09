import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RemindersPage.css';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const token = localStorage.getItem('token');

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reminders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReminders(response.data);
    } catch (err) {
      console.error('❌ Failed to fetch reminders', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/api/reminders',
        { message, remindAt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('');
      setRemindAt('');
      fetchReminders(); // reload
    } catch (err) {
      console.error('❌ Failed to create reminder', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/reminders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReminders(); // reload
    } catch (err) {
      console.error('❌ Failed to delete reminder', err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="reminders-container">
      <h2>🔔 Your Reminders</h2>

      <form className="reminder-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Reminder message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          required
        />
        <button type="submit">Add Reminder</button>
      </form>

      <ul className="reminder-list">
        {reminders.map((reminder) => (
          <li key={reminder.id}>
            <strong>{reminder.message}</strong> — {new Date(reminder.remindAt).toLocaleString()}
            <button onClick={() => handleDelete(reminder.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemindersPage;
