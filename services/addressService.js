import axios from '../axios-instance';

export const addressService = {
  getAllAddresses: async () => {
    try {
      const response = await axios.get('/addresses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAddressById: async (id) => {
    try {
      const response = await axios.get(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAddress: async (addressData) => {
    try {
      const response = await axios.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (id, addressData) => {
    try {
      const response = await axios.put(`/addresses/${id}`, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (id) => {
    try {
      const response = await axios.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setDefaultAddress: async (id) => {
    try {
      const response = await axios.put(`/addresses/${id}/set-default`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 