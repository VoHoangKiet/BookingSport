import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(dateStr: string | Date): string {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' && dateStr.includes('-') && !dateStr.includes('T')
    ? (() => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      })()
    : new Date(dateStr);

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(time: string): string {
  return time.slice(0, 5); // "08:00:00" -> "08:00"
}

export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    tam_giu: 'bg-yellow-100 text-yellow-800',
    da_dat_coc: 'bg-blue-100 text-blue-800',
    da_thanh_toan: 'bg-green-100 text-green-800',
    da_xac_nhan: 'bg-green-100 text-green-800',
    da_huy: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getBookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    tam_giu: 'Tạm giữ',
    da_dat_coc: 'Đã đặt cọc',
    da_thanh_toan: 'Đã thanh toán',
    da_xac_nhan: 'Đã thanh toán',
    da_huy: 'Đã hủy',
  };
  return labels[status] || status;
}
