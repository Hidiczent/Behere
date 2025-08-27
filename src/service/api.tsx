// src/service/api.ts
import axios from "axios";
import { redirect } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:5050";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ถ้าอนาคตใช้ cookie-mode จะได้ทำงานเลย
  timeout: 15000,
});

// แนบ Authorization header จาก localStorage ทุกครั้ง
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request config:", config);
  return config;
});

// ถ้า token หมดอายุ → ลบแล้ว (ถ้าต้องการ) redirect ไปหน้า login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("access_token");
      redirect("/login");
    }
    return Promise.reject(err);
  }
);
