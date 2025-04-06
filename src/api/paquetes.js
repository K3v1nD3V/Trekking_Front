import api from './base';

export const getPaquetes = async () => {
  try {
    const response = await api.get('/paquetes');
    return response;
  } catch (error) {
    console.error('Error fetching paquetes:', error);
    throw error;
  }
};

export const getPaqueteById = async (id) => {
  try {
    const response = await api.get(`/paquetes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching paquete ${id}:`, error);
    throw error;
  }
};

export const createPaquete = async (paqueteData) => {
  try {
    const response = await api.post('/paquetes', paqueteData);
    return response.data;
  } catch (error) {
    console.error('Error creating paquete:', error);
    throw error;
  }
};
