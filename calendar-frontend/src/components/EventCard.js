import React from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  const date = new Date(event.startTime);
  return (
    <div className="event-card">
      <h4>{event.title}</h4>
      <p>{event.description}</p>
      <span>{date.toLocaleString()}</span>
    </div>
  );
};

export default EventCard;
