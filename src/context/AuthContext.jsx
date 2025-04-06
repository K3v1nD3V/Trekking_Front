import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '../api/auth';
import api from '../api/base';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/usuarios/login', {
      correo: email,
      contraseña: password
    });
    setAuthToken(response.data.token);
    setUser({ token: response.data.token });
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

export const useAuth = () => useContext(AuthContext);
