import api from './axios';
import type { User, UpdateProfileRequest, ChangePasswordRequest } from '@/types';

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.put('/api/users/change-password', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/api/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
