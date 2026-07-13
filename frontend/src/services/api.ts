import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8080/api' : '/api';
export const BACKEND_URL = import.meta.env.DEV ? 'http://127.0.0.1:8080' : '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to add Authorization Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
