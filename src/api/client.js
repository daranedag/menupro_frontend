import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedMessage = error?.response?.data?.message || error?.response?.data?.error;
    if (normalizedMessage) {
      error.message = normalizedMessage;
    }

    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // Token expirado o sesión no autorizada: limpiar sesión y redirigir a login
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common.Authorization;
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
        window.location.replace('/auth');
      }
    }
    return Promise.reject(error);
  }
);
