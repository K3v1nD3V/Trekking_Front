import axios from 'axios';
import { getAuthToken, removeAuthToken } from './auth';

// Configuración base de la API
const api = axios.create({
  baseURL: 'https://trekking-back.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para autenticación
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Error de conexión';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
