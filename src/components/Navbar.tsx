// src/components/Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoUrl from "../assets/Logo/Artboard 3.png";
import ConfirmDialog from "./Alert/ConfirmDialog";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex items-center px-3 py-2 rounded-lg font-bold transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    isActive
      ? "bg-primary text-secondary"
      : "text-primary-700 hover:text-primary hover:bg-primary hover:text-secondary",
  ].join(" ");

export default function Navbar() {
  const { authed, loading, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <nav className="bg-secondary shadow-md px-6 flex items-center justify-between min-h-16">
      <div className="flex items-center">
        <NavLink
          to="/"
          className="inline-flex items-center cursor-pointer"
          aria-label="MyWebsite Home"
        >
          <img
            src={logoUrl}
            alt="MyWebsite"
            className="h-24 md:h-24 w-auto block shrink-0 select-none"
            loading="lazy"
          />
        </NavLink>
      </div>

      <ul className="flex items-center space-x-2 text-primary font-medium font-laoLooped ">
        <li>
          <NavLink to="/" className={linkClass}>
            ໜ້າຫຼັກ
          </NavLink>
        </li>
        <li>
          <NavLink to="/chatlopby" className={linkClass}>
            ເລືອກບົດບາດ
          </NavLink>
        </li>
        <li>
          <NavLink to="/content" className={linkClass}>
            ຄຳແນະນຳ
          </NavLink>
        </li>
        <li>
          <NavLink to="/service" className={linkClass}>
            ກ່ຽວກັບ
          </NavLink>
        </li>

        {loading ? (
          <li className="text-gray-400 px-3 py-2">กำลังตรวจสอบสถานะ…</li>
        ) : authed ? (
          <li>
            <button
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center px-3 py-2 rounded-lg font-bold transition-colors text-gray-700 hover:text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              title="Logout"
            >
              ອອກຈາກລະບົບ
            </button>
          </li>
        ) : (
          <li>
            <NavLink to="/login" className={linkClass}>
              ເຂົ້າສູ່ລະບົບ
            </NavLink>
          </li>
        )}
      </ul>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          await logout();
        }}
      />
    </nav>
  );
}
