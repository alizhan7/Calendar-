import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/history';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('🔐 TOKEN =', token);
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const fetchHistory = async () => {
  const response = await axios.get(`${API_BASE}/all`, getAuthHeader());
  return response.data;
};

export const createHistoryEntry = async (data) => {
  const response = await axios.post(`${API_BASE}/create`, data, getAuthHeader());
  return response.data;
};

export const deleteHistoryEntry = async (id) => {
  const response = await axios.delete(`${API_BASE}/delete/${id}`, getAuthHeader());
  return response.data;
};

export const updateHistoryEntry = async (id, data) => {
  const response = await axios.put(`${API_BASE}/update/${id}`, data, getAuthHeader());
  return response.data;
};

export const fetchRecommendation = async () => {
  const response = await axios.get(`${API_BASE}/recommendation`, getAuthHeader());
  return response.data;
};
