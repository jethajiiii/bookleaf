import axios from 'axios';

/**
 * Shared Axios client configured for BookLeaf API communication.
 * Automatically injects the stored JWT token if present.
 */
const apiBase = import.meta.env.VITE_API_URL || '';
const httpClient = axios.create({
  baseURL: apiBase ? `${apiBase.replace(/\/$/, '')}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message and validation details extraction
    const serverError = error.response?.data?.error;
    if (serverError) {
      if (serverError.message) error.message = serverError.message;
      if (serverError.details) error.details = serverError.details;
      if (serverError.code) error.code = serverError.code;
    }
    return Promise.reject(error);
  }
);

export default httpClient;
