import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Ресурс не найден');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Ошибка сервера. Попробуйте позже');
    }
    
    throw new Error(error.response?.data?.message || 'Произошла ошибка');
  }
);
