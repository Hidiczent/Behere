// src/pages/Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../service/api";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5050";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") {
        await api.post("/auth/login", { email, password });
      } else {
        await api.post("/auth/register", { email, password });
      }
      navigate("/");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : err instanceof Error
        ? err.message
        : "Error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  // เริ่ม OAuth ผ่าน Passport (backend จะ redirect -> /oauth/callback?token=...)
  const startGoogle = () => {
    const url = new URL("/auth/google", API_BASE);
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </h1>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`btn ${
              mode === "login" ? "bg-black text-white border-black" : "border"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`btn ${
              mode === "register"
                ? "bg-black text-white border-black"
                : "border"
            }`}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">อีเมล</label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">รหัสผ่าน</label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-black"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="btn bg-black text-white border-black disabled:opacity-60"
          >
            {busy
              ? "กำลังดำเนินการ..."
              : mode === "login"
              ? "เข้าสู่ระบบ"
              : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">หรือ</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          type="button"
          onClick={startGoogle}
          className="btn border flex items-center justify-center gap-2"
          disabled={busy}
        >
          <GoogleIcon /> Continue with Google
        </button>
      </div>
    </div>
  );
}

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
