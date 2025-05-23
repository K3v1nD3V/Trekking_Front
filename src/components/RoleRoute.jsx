import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || user.rol !== requiredRole) {
    return <div className='acceso_denegado-container'>Acceso denegado. No tienes permiso para ver esta página.</div>;
  }

  return children;
};

export default RoleRoute;