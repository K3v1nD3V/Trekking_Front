import api from './base';

export const getVentas = async () => {
  try {
    const response = await api.get('/ventas');
    return response;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

export const getVentaById = async (id) => {
  try {
    const response = await api.get(`/ventas/${id}`);
    return response;
  } catch (error) {
    console.error(`Error al obtener venta por ID ${id}:`, error);
    throw error;
  }
};

export const createVenta = async (nuevaVenta) => {
  try {
    const response = await api.post("/ventas", nuevaVenta);
    return response.data;
  } catch (error) {
    console.error("Error creando venta:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVenta = async (id, data) => {
  try {
    const response = await api.put(`/ventas/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error actualizando venta:', error);
    throw error;
  }
};


export const getClientes = async () => {
  try {
    const response = await api.get('/clientes'); // ✅ SIN requiresAuth
    return response.data;
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    throw error;
  }
};

export const getPaquetes = async () => {
  try {
    const response = await api.get('/paquetes'); // ✅ SIN requiresAuth
    return response.data;
  } catch (error) {
    console.error('Error obteniendo paquetes:', error);
    throw error;
  }
};


  
