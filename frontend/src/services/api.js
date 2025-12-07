import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchSales = async (params = {}) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const fetchFilterOptions = async () => {
  try {
    const response = await api.get('/sales/filter-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

