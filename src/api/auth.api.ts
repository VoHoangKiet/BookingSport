import api from './axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/api/auth/forgot', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/api/auth/reset', data);
    return response.data;
  },

  refreshToken: async (token: string): Promise<{ access_token: string }> => {
    const response = await api.post('/api/auth/refresh', { token });
    return response.data;
  },

  getGoogleAuthUrl: (): string => {
    return `${api.defaults.baseURL}/api/auth/google`;
  },
};
