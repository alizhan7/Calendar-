import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/calendar';

export const fetchEvents = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchHolidays = async (year) => {
  const response = await axios.get(`${API_BASE}/holidays/${year}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE}/create`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_BASE}/delete/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchTodayOrRecommended = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/today-or-recommendation`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchRecommendation = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/recommendation`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchRecommendationsList = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/recommendations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateEvent = async (eventId, updatedEvent) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_BASE}/update/${eventId}`, updatedEvent, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
