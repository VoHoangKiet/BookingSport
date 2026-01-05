export const API_BASE_URL =
  (import.meta as unknown as { env: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL || "https://quan-ly-dat-lich-san-the-thao.onrender.com";

export const BOOKING_STATUS = {
  tam_giu: { label: "Tạm giữ", color: "yellow" },
  da_dat_coc: { label: "Đã đặt cọc", color: "blue" },
  da_thanh_toan: { label: "Đã thanh toán", color: "green" },
  da_huy: { label: "Đã hủy", color: "red" },
} as const;

export const PAYMENT_METHOD = {
  tien_mat: "Tiền mặt",
  chuyen_khoan: "Chuyển khoản",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  COURTS: "/courts",
  COURT_DETAIL: "/courts/:id",
  COURT_BOOKING: "/courts/:id/booking",
  BOOKINGS: "/bookings",
  BOOKING_DETAIL: "/bookings/:id",
  PROFILE: "/profile",
  PAYMENT_RESULT: "/payment/result",
} as const;
