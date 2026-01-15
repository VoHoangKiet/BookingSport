// Extended types for multi-subcourt booking

export interface SubCourtSelection {
  ma_san_con: number;
  ten_san_con: string;
  gia_co_ban: number;
  selected_slots: TimeSlotSelection[];
}

export interface TimeSlotSelection {
  ma_khung_gio: number;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  phu_phi: number;
  gia: number; // gia_co_ban + phu_phi
}

export interface MultiSubCourtBookingRequest {
  bookings: {
    ma_san_con: number;
    ngay_dat_san: string;
    khung_gios: number[];
  }[];
  hinh_thuc_thanh_toan: 'tien_mat' | 'chuyen_khoan';
  slots_loaded_at?: string; // For optimistic locking
}

export interface BookingConflictError {
  status: 409;
  message: string;
  conflicted_slots: {
    ma_san_con: number;
    ma_khung_gio: number;
  }[];
}
