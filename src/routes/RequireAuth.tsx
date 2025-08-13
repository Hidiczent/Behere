import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { authed, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null; // จะใส่สปินเนอร์ก็ได้
  if (!authed) {
    const redirect = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}
