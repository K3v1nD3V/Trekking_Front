import api from './base';
import axios from 'axios';


export const getVentas = async () => {
  try {
    const response = await api.get('/ventas'); // Ruta de las ventas
    return response;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

export const getVentaById = async (id) => {
  try {
    const response = await api.get(`/ventas/${id}`); //Ventas específicas
    return response;
  } catch (error) {
    console.error(`Error al obtener venta por ID ${id}:`, error);
    throw error;
  }
};

export const createVenta = async (nuevaVenta) => {
  try {
    const token = localStorage.getItem("token"); // <--- aquí se obtiene el token
    const response = await axios.post("http://localhost:3000/api/ventas", nuevaVenta, {
      headers: {
        Authorization: `Bearer ${token}` // <--- aquí se envía en el header
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creando venta:", error.response?.data || error.message);
    throw error;
  }
};

export const getClientes = async () => {
    try {
      const response = await api.get('/clientes');
      return response;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
};


export const getPaquetes = async () => {
    try {
      const response = await api.get('/paquetes');
      return response;
    } catch (error) {
      console.error('Error obteniendo paquetes:', error);
      throw error;
    }
  };

