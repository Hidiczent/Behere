import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        // cookie httpOnly จะถูกส่งอัตโนมัติ เพราะ api.withCredentials = true
        await api.get("/auth/check", { withCredentials: true }); // 204 = OK
        await refreshAuth(); // อัปเดตสถานะใน context
        navigate("/", { replace: true });
      } catch (e) {
        console.error("[OAuthCallback] /auth/check failed", e);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, refreshAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      กำลังเข้าสู่ระบบด้วย Google...
    </div>
  );
}
