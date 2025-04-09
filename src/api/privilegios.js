import api from './base';

export const getPrivilegios = async () => {
    try {
      const response = await api.get('/privilegios');
      return response;
    } catch (error) {
      console.error('Error fetching privilegios:', error);
      throw error;
    }
  };


  export const getPrivilegiosById = async (id) => {
    try {
      const response = await api.get(`/privilegios/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching privilegio ${id}:`, error);
      throw error;
    }
  };
  