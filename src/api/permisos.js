import api from './base';

export const getPermisos = async () => {
  try {
    const response = await api.get('/permisos'); // Ruta de permisos
    return response;
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    throw error;
  }
};

export const getPermisoById = async (id) => {
  try {
    const response = await api.get(`/permisos/${id}`); // Permiso específico
    return response;
  } catch (error) {
    console.error(`Error al obtener permiso con ID ${id}:`, error);
    throw error;
  }
};

export const getPrivilegios = async () => {
  try {
    const response = await api.get('/privilegios'); // Ruta de privilegios
    return response;
  } catch (error) {
    console.error('Error al obtener privilegios:', error);
    throw error;
  }
};
