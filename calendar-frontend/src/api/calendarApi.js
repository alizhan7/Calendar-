import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/calendar';

export const fetchEvents = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE}/create`, eventData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
