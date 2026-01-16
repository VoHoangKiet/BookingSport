// @ts-nocheck
import { API_BASE_URL } from "@/lib/constants";
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
