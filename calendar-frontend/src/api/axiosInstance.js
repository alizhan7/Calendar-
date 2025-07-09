import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('📦 Token attached:', token);
  } else {
    console.warn('⚠️ No token in localStorage');
  }
  return config;
});

export default axiosInstance;
