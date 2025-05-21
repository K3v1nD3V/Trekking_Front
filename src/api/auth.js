import api from './base';
import jwtDecode from 'jwt-decode';
// const AUTH_TOKEN_KEY = import.meta.env.JWT_SECRET;
const AUTH_TOKEN_KEY = "Trekking";
import axios from 'axios';


// Token management
export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {
      return token;
    } else {
      removeAuthToken();
      return null;
    }
  } catch {
    removeAuthToken();
    return null;
  }
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
  console.log("Login response:", response);
  
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
