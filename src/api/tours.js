import api from './base';

// Obtiene todos los tours
export const getTours = async () => {
  try {
    const response = await api.get('/tours');
    console.log('Tours:', response);
    
    return response || []; // Devuelve un array vacío si no hay datos
  } catch (error) {
    console.error('Error al obtener tours:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Obtiene un tour por su ID
export const getTourById = async (id) => {
  try {
    const response = await api.get(`/tours/${id}`);
    return response.data; // Devuelve los datos del tour
  } catch (error) {
    console.error(`Error al obtener tour ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};


// Crea un nuevo tour
export const createTour = async (tourData) => {
  try {
    const response = await api.post('/tours', tourData, { requiresAuth: true });
    console.log('Respuesta del servidor:', response);
    return response; 
  } catch (error) {
    console.error('Error al crear tour:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Actualiza un tour existente
export const updateTour = async (id, tourData) => {
  try {
    const response = await api.put(`/tours/${id}`, tourData, { requiresAuth: true }); // Usa Axios para manejar el token automáticamente
    return response.data; // Devuelve los datos del tour actualizado
  } catch (error) {
    console.error(`Error al actualizar tour ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// Elimina un tour por su ID
export const deleteTour = async (id) => {
  try {
    const response = await api.delete(`/tours/${id}`, { requiresAuth: true });
    return response.data; // Devuelve los datos del tour eliminado
  } catch (error) {
    console.error(`Error al eliminar tour ${id}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

