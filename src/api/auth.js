import api from './base';

const AUTH_TOKEN_KEY = 'trekking_auth_token';

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
  const response = await api.post('/usuarios/login', {
    correo: email,
    contraseña: password
  });
  setAuthToken(response.data.token);
  return response.data;
};

export const logout = () => {
  removeAuthToken();
};

// Verify auth status
export const checkAuth = async () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await api.get('/usuarios/me');
    return response.data;
  } catch {
    removeAuthToken();
    return null;
  }
};
