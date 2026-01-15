import api from './axios';
import type { Booking, CreateBookingRequest, SubCourt } from '@/types';

export const bookingsApi = {
  getAvailableSlots: async (courtId: number, date: string): Promise<SubCourt[]> => {
    const response = await api.get('/api/bookings/available', {
      params: { ma_san: courtId, ngay: date },
    });
    // Transform string prices to numbers
    return (response.data.data || response.data).map((sub: Record<string, unknown>) => ({
      ...sub,
      gia_co_ban: parseFloat(String(sub.gia_co_ban)) || 0,
      available_slots: (sub.available_slots as Record<string, unknown>[])?.map((slot) => ({
        ...slot,
        phu_phi: parseFloat(String(slot.phu_phi)) || 0,
      })) || [],
    }));
  },

  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post('/api/bookings', data);
    return response.data;
  },

  createMulti: async (data: import('@/types').MultiSubCourtBookingRequest): Promise<Booking> => {
    const response = await api.post('/api/bookings/multi', data);
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

  getTimeSlots: async (): Promise<{ ma_khung_gio: number; gio_bat_dau: string; gio_ket_thuc: string; phu_phi: number }[]> => {
    const response = await api.get('/api/configs/time-slots');
    return response.data.data || [];
  },
};
