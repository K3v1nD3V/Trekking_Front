import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '../api/auth';
import jwtDecode from 'jwt-decode';
import api from '../api/base';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const token = getAuthToken();
    
    if (token) {
      try {
        const decoded = jwtDecode(token);        
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ token, rol: decoded.rol });
        } else {
          removeAuthToken();
        }
      } catch (error) {
        console.error('Token inválido:', error.message);
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/usuarios/login', {
      correo: email,
      contraseña: password
    });
    setAuthToken(response.token);
    setUser({ token: response.token, rol: response.rol });
    return response.data;
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
