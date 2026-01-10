import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth.store';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 by logging out
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token invalid or expired - logout and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
