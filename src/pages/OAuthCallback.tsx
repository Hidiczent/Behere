// src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";
import { useAuth } from "../context/AuthContext";

function extractHashToken(): string | null {
  const m = window.location.hash.match(/(?:^|&)token=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        // 1) DEV friendly: ถ้ามี token ใน hash -> เก็บเป็น Bearer
        const tokenFromHash = extractHashToken();
        if (tokenFromHash) {
          localStorage.setItem("access_token", tokenFromHash);
          // ล้าง hash ออกจาก URL
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }

        // 2) ตรวจสิทธิ์ (รองรับทั้ง cookie และ Bearer)
        await api.get("/auth/check", { withCredentials: true }); // 204 = OK

        // 3) อัปเดต auth context แล้วพากลับหน้าแรก/ที่ต้องการ
        await refreshAuth?.();
        navigate("/", { replace: true });
      } catch (e) {
        // ถ้าตรวจไม่ผ่าน ให้ล้าง token แล้วไปหน้า login
        localStorage.removeItem("access_token");
        console.error("[OAuthCallback] /auth/check failed", e);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, refreshAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      ກຳລັງເຂົ້າສູ່ລະບົບດ້ວຍ Google...
    </div>
  );
}
