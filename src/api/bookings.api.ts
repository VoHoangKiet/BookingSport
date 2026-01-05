import api from './axios';
import type { Booking, CreateBookingRequest, TimeSlot } from '@/types';

export const bookingsApi = {
  getAvailableSlots: async (courtId: number, date: string): Promise<TimeSlot[]> => {
    const response = await api.get('/api/bookings/available', {
      params: { ma_san: courtId, ngay: date },
    });
    return response.data;
  },

  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post('/api/bookings', data);
    return response.data;
  },

  getMyHistory: async (): Promise<Booking[]> => {
    const response = await api.get('/api/bookings/my-history');
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await api.put(`/api/bookings/${id}/cancel`);
    return response.data;
  },
};
