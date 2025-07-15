import React, { useState } from 'react';
import './EventCard.css';

const EventCard = ({ event, onSave, onClose, onDecline, onDelete }) => {
  const isSuggested = event.title?.startsWith('[Suggested]');
  const [title, setTitle] = useState(event.title || '');
  const [description, setDescription] = useState(event.description || '');
  const [startTime, setStartTime] = useState(event.startTime || event.startDateTime || '');
  const [done, setDone] = useState(event.done || false);

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title,
      description,
      startTime,
      done,
    };
    onSave(updatedEvent);
  };

  return (
    <div className="modal-overlay">
      <div className="event-modal">
        <h3>{isSuggested ? 'Suggested Event' : 'Edit Event'}</h3>

        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
        />

        {!isSuggested && (
          <>
            <label>Date & Time:</label>
            <input
              type="datetime-local"
              value={
                startTime
                  ? new Date(startTime).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) =>
                setStartTime(new Date(e.target.value).toISOString())
              }
            />

            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
              />
              <span>Mark as done</span>
            </label>
          </>
        )}

        <div className="modal-actions">
          {isSuggested ? (
            <>
              <button className="btn primary" onClick={handleSave}>
                Keep
              </button>
              <button className="btn danger" onClick={() => onDecline(event.id)}>
                Decline
              </button>
            </>
          ) : (
            <>
              <button className="btn primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn danger" onClick={() => onDelete(event.id)}>
                Delete
              </button>
            </>
          )}
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
