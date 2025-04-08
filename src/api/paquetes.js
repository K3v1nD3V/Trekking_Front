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
    const response = await api.post('/paquetes', paqueteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error del backend:', error.response.data); // Mensaje del servidor
      console.error('Código de estado:', error.response.status); // Código de error HTTP
      console.error('Encabezados:', error.response.headers); // Detalles de los encabezados
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error configurando la solicitud:', error.message);
    }
    alert(error.response?.data?.message || 'Hubo un error desconocido al crear el paquete.');
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
