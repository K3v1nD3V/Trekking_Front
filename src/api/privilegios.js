import api from './base';

// Obtener todos los privilegios
export const getPrivilegios = async () => {
  try {
    const response = await api.get('/privilegios', { requiresAuth: true });
    return response; // Ya es response.data gracias al interceptor
  } catch (error) {
    console.error('Error al obtener privilegios:', error);
    throw error;
  }
};

// Obtener un privilegio por su ID
export const getPrivilegiosById = async (id) => {
  try {
    const response = await api.get(`/privilegios/${id}`, { requiresAuth: true });
    return response;
  } catch (error) {
    console.error(`Error al obtener el privilegio con ID ${id}:`, error);
    throw error;
  }
};
