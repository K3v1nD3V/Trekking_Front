import api from './base';

export const getClientes = async () => {
    try {
      const response = await api.get('/clientes');
      return response;
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw error;
    }
  };

  export const getClienteById = async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching cliente ${id}:`, error);
      throw error;
    }
  };

  export const createCliente = async (clienteData) => {
    try {
      const response = await api.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      console.error('Error creating cliente:', error);
      throw error;
    }
  };

  export const updateCliente = async (id, clienteData) => {
    try {
      const response = await api.put(`/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      console.error(`Error updating cliente ${id}:`, error);
      throw error;
    }
  };

  export const deleteCliente = async (id) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting cliente ${id}:`, error);
      throw error;
    }
  };
  