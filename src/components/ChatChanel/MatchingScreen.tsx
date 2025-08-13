import type { Props, Role } from "../../types/Message";
import catGif from "../../assets/img/cat-wait.gif";
import { Link } from "react-router-dom";

const ROLE_LABEL: Record<Role, string> = {
  venter: "ຜູ້ລະບາຍ",
  listener: "ຜູ້ຮັບຟັງ",
};

export default function MatchingScreen({
  role,
  connected,
  queuing,
  onCancel,
  onRetry,
}: Props) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl relative rounded-2xl border border-primary/30 bg-white/70 backdrop-blur p-6 md:p-10 text-center shadow">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
          ກຳລັງຈັບຄູ່ສົນທະນາ ({ROLE_LABEL[role]})
        </h2>

        {/* Clouds */}
        <div className="relative h-40 mb-4">
          <div className="cloud cloud-1 animate-float" />
          <div className="cloud cloud-2 animate-float delay-700" />
        </div>

        {/* Cat gif */}
        <div className="flex justify-center mb-2">
          <img
            src={catGif}
            alt="waiting cat"
            className="w-40 h-40 object-contain select-none pointer-events-none"
          />
        </div>

        <p className="text-sm text-slate-600 mb-4">
          {connected
            ? queuing
              ? "ກຳລັງຄົ້ນຫາຄູ່ສົນທະນາ…"
              : "ກຳລັງເຊື່ອມຕໍ່…"
            : "ກຳລັງເຊື່ອມຕໍ່…"}
        </p>

        <div className="flex items-center justify-center gap-3">
          {onRetry && connected && !queuing && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              ຈັບຄູ່ໃໝ່
            </button>
          )}

          {onCancel && (
            <Link
              to="/chatlopby" // ตรวจให้ตรงกับ router คุณ (ตอนนี้ใช้ /chatlopby)
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              ຍົກເລີກ
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
