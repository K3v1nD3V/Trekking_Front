import api from './base';

export const getServicios = async () => {
  try {
    const response = await api.get('/servicios');
    return response;
  } catch (error) {
    console.error('Error fetching servicios:', error);
    throw error;
  }
};

export const getServicioById = async (id) => {
  try {
    const response = await api.get(`/servicios/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching servicio ${id}:`, error);
    throw error;
  }
};

export const createServicio = async (servicioData) => {
  try {
    const response = await api.post('/servicios', servicioData);
    console.log('servico: ', response);
    return response;
  } catch (error) {
    console.error('Error creating servicio:', error);
    throw error;
  }
};

export const updateServicio = async (id, servicioData) => {
  try {
    const response = await api.put(`/servicios/${id}`, servicioData);
    return response.data;
  } catch (error) {
    console.error(`Error updating servicio ${id}:`, error);
    throw error;
  }
};

export const deleteServicio = async (id) => {
  try {
    const response = await api.delete(`/servicios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting servicio ${id}:`, error);
    throw error;
  }
};
