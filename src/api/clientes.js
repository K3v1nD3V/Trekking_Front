import api from './base';



export const getClientes = async () => {
  try {
    const response = await api.get('/clientes', { requiresAuth: true });
    return response;
  } catch (error) {
    console.error('Error fetching clientes:', error);
    throw error;
  }
};

export const getClienteById = async (id) => {
  try {
    const response = await api.get(`/clientes/${id}`, { requiresAuth: true });
    return response;
  } catch (error) {
    console.error(`Error fetching cliente ${id}:`, error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    console.log('Creando cliente con datos:', clienteData);
    const response = await api.post('/clientes', clienteData);
    console.log('cliente response: ', response);
    return response;
  } catch (error) {
    
    console.error('Error creating cliente:', error);
    throw error;
  }
};

export const updateCliente = async (id, data) => {
  try {
    console.log('📤 Enviando al backend:', data);
    const res = await api.put(`/clientes/${id}`, data);
    return res.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error(
        '❌ Errores de validación:',
        error.response.data.errors.map(e => e.msg).join(' | ')
      );
    } else {
      console.error('❌ Error desconocido:', error.message);
    }
    throw error;
  }
};


export const deleteCliente = async (id) => {
  try {
    const response = await api.delete(`/clientes/${id}`, { requiresAuth: true });
    return response.data;
  } catch (error) {
    console.error(`Error deleting cliente ${id}:`, error);
    throw error;
  }
};

export const checkClienteExistence = async (criteria) => {
  try {
    const response = await api.post('/clientes/check-existence', criteria);    
    console.log('Respuesta de verificación de existencia:', response);
    
    return response.exists; // Devuelve true si existe, false si no
  } catch (error) {
    console.error('Error verificando existencia de cliente:', error);
    throw error;
  }
};