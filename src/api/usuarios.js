import api from './base';

export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios');
    return response;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching usuarios ${id}:`, error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/usuarios', usuarioData);
    console.log('usuario: ', response);
    return response;
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando usuario${id}:`, error);
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando usuario ${id}:`, error);
    throw error;
  }
};
