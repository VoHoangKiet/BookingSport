// @ts-nocheck
import api from "./api";

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.clear();
  window.location.href = "/login";
}

export async function login(email, mat_khau) {
  const res = await api.post("/auth/login", { email, mat_khau });
  if (res.data.success) {
    saveToken(res.data.token);
  }
  return res.data;
}
