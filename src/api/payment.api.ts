import api from './axios';
import type { CreatePaymentRequest } from '@/types';

export const paymentApi = {
  createVnpayPayment: async (data: CreatePaymentRequest): Promise<{ paymentUrl: string }> => {
    const response = await api.post('/api/payment/vnpay/create', data);
    return response.data;
  },
};
