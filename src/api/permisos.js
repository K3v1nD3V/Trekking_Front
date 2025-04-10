import api from './base';

export const getPermisos = async () => {
  try {
    const response = await api.get('/permisos');
    return response;
  } catch (error) {
    console.error('Error fetching permisos:', error);
    throw error;
  }
};

export const getPermisoById = async (id) => {
  try {
    const response = await api.get(`/permisos/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching permiso ${id}:`, error);
    throw error;
  }
};
