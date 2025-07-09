// src/api/authApi.js
import axios from 'axios';

export const login = async (username, password) => {
  const response = await axios.post('http://localhost:8080/auth/login', {
    username,
    password
  });

  const token = response.data.token;
  localStorage.setItem('token', `Bearer ${token}`);
  return token;
};
