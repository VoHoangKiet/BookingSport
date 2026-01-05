import api from './axios';
import type { Court, SubCourt, Sport, Province, District, CourtSearchParams } from '@/types';

export const courtsApi = {
  getAll: async (): Promise<Court[]> => {
    const response = await api.get('/api/courts');
    return response.data.data;
  },

  search: async (params?: CourtSearchParams): Promise<Court[]> => {
    const response = await api.get('/api/courts/search', { params });
    return response.data.data;
  },

  getBySport: async (sportId: number): Promise<Court[]> => {
    const response = await api.get(`/api/courts/by-sport/${sportId}`);
    return response.data.data;
  },

  getById: async (id: number): Promise<Court> => {
    const response = await api.get(`/api/courts/${id}`);
    return response.data.data;
  },

  getImages: async (id: number): Promise<string[]> => {
    const response = await api.get(`/api/courts/${id}/images`);
    return response.data.data;
  },

  getSubCourts: async (courtId: number): Promise<SubCourt[]> => {
    const response = await api.get(`/api/courts/sub/${courtId}`);
    return response.data.data;
  },
};

export const sportsApi = {
  getAll: async (): Promise<Sport[]> => {
    const response = await api.get('/api/sports');
    return response.data.data;
  },
};

export const addressApi = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await api.get('/api/address/provinces');
    return response.data.data;
  },

  getDistricts: async (provinceId: string): Promise<District[]> => {
    const response = await api.get(`/api/address/districts/${provinceId}`);
    return response.data.data;
  },
};
