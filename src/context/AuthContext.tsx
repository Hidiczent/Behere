import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "../service/api";

type AuthContextType = {
  authed: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      await api.get("/auth/check", { withCredentials: true }); // 204 = OK
      setAuthed(true);
    } catch {
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", null, { withCredentials: true });
    } catch {
      console.error("[AuthProvider] Logout failed");
    }
    setAuthed(false);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ authed, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ปิดเฉพาะคำเตือน fast refresh ของ ESLint สำหรับฮุคที่ export จากไฟล์เดียวกับคอมโพเนนต์
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthProvider;
