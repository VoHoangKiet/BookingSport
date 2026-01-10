// API Types
export interface User {
  ma_nguoi_dung: number;
  email: string;
  ho_ten: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  anh_dai_dien?: string;
  loai_tai_khoan?: string;
}

export interface Sport {
  ma_bo_mon: number;
  ten_bo_mon: string;
  mo_ta?: string;
  icon?: string;
}

export interface Court {
  ma_san: number;
  ten_san: string;
  dia_chi: string;
  mo_ta?: string;
  gio_mo_cua: string;
  gio_dong_cua: string;
  hinh_anh?: string;
  anh_san?: string;
  bo_mon?: Sport;
  san_cons?: SubCourt[];
  chu_san?: User;
}

export interface SubCourt {
  ma_san_con: number;
  ten_san_con: string;
  gia_co_ban: number;
  mo_ta?: string;
  thong_tin_san?: string;
  trang_thai?: string;
  san?: Court;
  available_slots?: TimeSlot[];
}

export interface TimeSlot {
  ma_khung_gio: number;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  phu_phi: number;
  da_dat?: boolean;
}

export interface BookingDetail {
  ma_chi_tiet: number;
  khung_gio: TimeSlot;
  gia: number;
}

export interface Booking {
  ma_don: number;
  ngay_dat_san: string;
  ngay_tao: string;
  tong_tien: number;
  trang_thai: BookingStatus;
  hinh_thuc_thanh_toan: PaymentMethod;
  san_con: SubCourt;
  nguoi_dung?: User;
  chi_tiets?: BookingDetail[];
}

export type BookingStatus = 'tam_giu' | 'da_dat_coc' | 'da_thanh_toan' | 'da_huy';
export type PaymentMethod = 'tien_mat' | 'chuyen_khoan';

export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  province_code: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Request Types
export interface LoginRequest {
  email: string;
  mat_khau: string;
}

export interface RegisterRequest {
  email: string;
  mat_khau: string;
  ho_ten?: string;
}

export interface CreateBookingRequest {
  ma_san_con: number;
  ngay_dat_san: string;
  khung_gios: number[];
  hinh_thuc_thanh_toan: PaymentMethod;
}

export interface CreatePaymentRequest {
  ma_don: number;
  loai_giao_dich: 'dat_coc' | 'thanh_toan';
}

export interface UpdateProfileRequest {
  ho_ten?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
}

export interface ChangePasswordRequest {
  mat_khau_cu: string;
  mat_khau_moi: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  userId: number;
  token: string;
  newPassword: string;
}

// Search params
export interface CourtSearchParams {
  ma_bo_mon?: number;
  q?: string;
  dia_chi?: string;
}
