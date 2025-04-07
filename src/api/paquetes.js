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
    return response;
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

export const updatePaquete = async (id, paqueteData) => {
  try {
    const response = await api.put(`/paquetes/${id}`, paqueteData);
    return response.data;
  } catch (error) {
    console.error(`Error updating paquete ${id}:`, error);
    throw error;
  }
};

export const deletePaquete = async (id) => {
  try {
    const response = await api.delete(`/paquetes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting paquete ${id}:`, error);
    throw error;
  }
};
