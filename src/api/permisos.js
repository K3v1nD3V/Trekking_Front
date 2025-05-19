import api from './base';

export const getPermisos = async () => {
  try {
    const response = await api.get('/permisos', { requiresAuth: true }); // Ruta de permisos
    return response;
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    throw error;
  }
};

export const getPermisoById = async (id) => {
  try {
    const response = await api.get(`/permisos/${id}`, { requiresAuth: true }); // Permiso específico
    return response;
  } catch (error) {
    console.error(`Error al obtener permiso con ID ${id}:`, error);
    throw error;
  }
};

export const getPrivilegios = async () => {
  try {
    const response = await api.get('/privilegios', { requiresAuth: true }); // Ruta de privilegios
    return response;
  } catch (error) {
    console.error('Error al obtener privilegios:', error);
    throw error;
  }
};
