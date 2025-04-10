import api from './base';

export const getPermisos = async () => {
  try {
    const response = await api.get('/permisos'); // Asegúrate de que esta ruta sea correcta en tu backend
    return response;
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    throw error;
  }
};

export const getPrivilegios = async () => {
  try {
    const response = await api.get('/privilegios'); // Asegúrate de que esta ruta sea correcta en tu backend
    return response;
  } catch (error) {
    console.error('Error al obtener privilegios:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await api.get('/roles');
    return response;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getRolById = async (id) => {
  try {
    const response = await api.get(`/roles/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching rol ${id}:`, error);
    throw error;
  }
};

export const createRol = async (rolData) => {
  try {
    const response = await api.post('/roles', rolData);
    console.log('rol creado:', response);
    return response;
  } catch (error) {
    console.error('Error creating rol:', error);
    throw error;
  }
};

export const updateRol = async (id, rolData) => {
  try {
    const response = await api.put(`/roles/${id}`, rolData);
    return response.data;
  } catch (error) {
    console.error(`Error updating rol ${id}:`, error);
    throw error;
  }
};

export const deleteRol = async (id) => {
  try {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting rol ${id}:`, error);
    throw error;
  }
};
