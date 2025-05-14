import api from './base';
import axios from 'axios';

const AUTH_TOKEN_KEY = 'Trekking';

// Token management
export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Authentication operations
export const login = async (email, password) => {
  console.log("Login con:", email, password);

  const response = await api.post('/usuarios/login', {
    correo: email,
    contraseña: password
  });

  setAuthToken(response.token); 
  return response;
};


export const recuperarContrasena = (correo) => {
  return api.post('/usuarios/recuperar', { correo });
};

export const cambiarContrasena = (token, nuevaContrasena) => {
  return api.post('/usuarios/cambiar-contrasena', { token, nuevaContrasena });
};

export const logout = () => {
  removeAuthToken();
};

// Verify auth status
export const checkAuth = async () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await api.get('/permisos');
    return response;
  } catch {
    removeAuthToken();
    return null;
  }
};
