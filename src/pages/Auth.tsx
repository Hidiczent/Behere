// src/pages/Auth.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5050";

export default function AuthPage() {
  const [sp] = useSearchParams();
  const redirect = sp.get("redirect") || "/";

  const navigate = useNavigate();
  const { authed, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  // ถ้าล็อกอินอยู่แล้ว พาออกทันที
  useEffect(() => {
    if (!loading && authed) {
      navigate(redirect, { replace: true });
    }
  }, [authed, loading, navigate, redirect]);

  const startGoogle = () => {
    setBusy(true);
    const url = new URL("/auth/google", API_BASE);
    url.searchParams.set("redirect", redirect);
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 font-laoLooped">
      <div className="w-full max-w-md">
        {/* หัวข้อ */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">ເຂົ້າສູ່ລະບົບ</h1>
          <p className="text-gray-500 mt-1">
            ໃຊ້ບັນຊີ Google ສໍາລັບເລີ່ມຈັບຄູ່ສົນທະນາໃຫ້ກຳລັງໃຈກັນ 💛
          </p>
        </div>

        {/* การ์ด */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          {/* ปุ่ม Google เท่านั้น */}
          <button
            type="button"
            onClick={startGoogle}
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={busy || (loading ? true : false) || authed}
          >
            <GoogleIcon />
            {busy ? "ກຳລັງໄປສູ່ Google..." : "Continue with Google"}
          </button>

          {/* เส้นแบ่งเล็ก ๆ + กลับหน้าแรก */}
          <div className="text-center mt-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon /> ກັບຽໜ້າຫຼັກ
            </Link>
          </div>

          {/* สถานะโหลด */}
          {loading && (
            <p className="text-xs text-gray-400 text-center mt-4">
              ກຳລັງກວດສອບສະຖານະການເຂົ້າສູ່ລະບົບ…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Icons ===== */
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.731 32.662 29.329 36 24 36 16.82 36 11 30.18 11 23S16.82 10 24 10c3.31 0 6.314 1.234 8.59 3.256l5.657-5.657C34.676 4.221 29.62 2 24 2 11.85 2 2 11.85 2 24s9.85 22 22 22c11.385 0 21-8.615 21-20 0-1.341-.138-2.651-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.817C14.61 16.63 18.959 14 24 14c3.31 0 6.314 1.234 8.59 3.256l5.657-5.657C34.676 4.221 29.62 2 24 2 16.039 2 9.078 6.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 46c5.258 0 10.053-2.007 13.672-5.287l-6.31-5.329C29.149 36.459 26.709 37.5 24 37.5 18.705 37.5 14.348 33.986 12.71 29.182l-6.54 5.04C8.867 41.933 15.861 46 24 46z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-1.631 4.662-6.033 8-11.303 8-5.295 0-9.652-3.514-11.29-8.318l-6.54 5.04C8.867 41.933 15.861 46 24 46c11.385 0 21-8.615 21-20 0-1.341-.138-2.651-.389-3.917z"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
