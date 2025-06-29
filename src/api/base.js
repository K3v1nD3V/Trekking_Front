import axios from 'axios';
import { getAuthToken, removeAuthToken } from './auth';

// Configuración base de la API
const api = axios.create({
  baseURL: 'https://trekking-back.onrender.com/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(config => {
  const token = getAuthToken();

  // Solo omitir el token si requiresAuth es false explícitamente
  if (token && config.requiresAuth !== false) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data || response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      if (window.location.pathname !== '/login') {
        console.log(error);
        // window.location.href = '/login';
      }
    }

    // Agrega mensaje custom, pero conserva todo el error
    error.customMessage =
      error.response?.data?.message || error.message || 'Error de conexión';
    return Promise.reject(error);
  }
);

export default api;
