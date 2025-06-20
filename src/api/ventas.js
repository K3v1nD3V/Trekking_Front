import api from './base';

export const getVentas = async () => {
  try {
    const response = await api.get('/ventas', { requiresAuth: true }); // Ruta de las ventas
    return response;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

export const getVentaById = async (id) => {
  try {
    const response = await api.get(`/ventas/${id}`); //Ventas específicas
    return response.data;
  } catch (error) {
    console.error(`Error al obtener venta por ID ${id}:`, error);
    throw error;
  }
};

export const createVenta = async (nuevaVenta) => {
  console.log("Creando venta:", nuevaVenta);
  try {
    const response = await api.post("/ventas", nuevaVenta, { requiresAuth: true });
    return response;
  } catch (error) {
    console.error("Error creando venta:", error.response?.data || error.message);
    throw error;
  }
};

export const getClientes = async () => {
    try {
      const response = await api.get('/clientes', { requiresAuth: true });
      return response;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
};


export const getPaquetes = async () => {
    try {
      const response = await api.get('/paquetes', { requiresAuth: true });
      return response;
    } catch (error) {
      console.error('Error obteniendo paquetes:', error);
      throw error;
    }
  };

  export const updateVenta = async (id, data) => {
    console.log('updateVenta called with id:', id, 'and data:', data);
  try {
    const response = await api.put(`/ventas/${id}`, data, { requiresAuth: true });
    return response;
  } catch (error) {
    console.error('updateVenta error:', error);
    throw error;
  }
};


  
