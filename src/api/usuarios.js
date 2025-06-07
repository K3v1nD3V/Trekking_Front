import api from './base';

export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios', { requiresAuth: true });
    return response;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`, { requiresAuth: true });
    return response;
  } catch (error) {
    console.error(`Error fetching usuarios ${id}:`, error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    console.log(usuarioData);
    const response = await api.post('/usuarios', usuarioData, { requiresAuth: true });
    console.log('usuario: ', response);
    return response;
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuarioData, { requiresAuth: true });
    return response.data;
  } catch (error) {
    console.error(`Error actualizando usuario${id}:`, error);
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`, { requiresAuth: true });
    return response.data;
  } catch (error) {
    console.error(`Error eliminando usuario ${id}:`, error);
    throw error;
  }
};

export const validateUsuario = async (token) => {
  console.log('Validando usuario:', token);
  try {
    const response = await api.post('/usuarios/validate', token);
    console.log('Respuesta de validación:', response);
    return response.data;
  } catch (error) {
    console.error('Error validando usuario:', error);
    throw error;
  }
}
