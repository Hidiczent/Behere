// src/components/ChatChanel/ReportModal.tsx
import { useState } from "react";
import { api } from "../../service/api";

export default function ReportModal({
  open,
  onClose,
  conversationId,
  reportedUserId,
}: {
  open: boolean;
  onClose: () => void;
  conversationId: number | null;
  reportedUserId?: number | null;
}) {
  const [reason, setReason] = useState("spam");
  const [detail, setDetail] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const submit = async () => {
    try {
      setSending(true);
      await api.post("/reports", {
        conversationId,
        reportedUserId,
        reason,
        detail,
      });
      onClose();
      alert("ສົ່ງລາຍງານແລ້ວ ຂອບໃຈທີ່ລາຍງານ 🙏");
    } catch {
      alert("ສົ່ງລາຍງານບໍ່ສຳເລັດ ກາລຸນາລອງໃໝ່ອີກຄັ້ງ");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h3 className="text-lg font-bold mb-2">ລາຍງານຜູ້ໃຊ້</h3>
        <p className="text-sm text-slate-600 mb-4">
          ຕ້ອງການລາຍງານຄູ່ສົນທະນາຫຼືບໍ່ ?
        </p>

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reason"
              value="spam"
              checked={reason === "spam"}
              onChange={() => setReason("spam")}
            />
            <span>ສະແປມ/ກວນ</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reason"
              value="harassment"
              checked={reason === "harassment"}
              onChange={() => setReason("harassment")}
            />
            <span>ຄຸກຄາມ/ບໍ່ເໝາະສົມ</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reason"
              value="other"
              checked={reason === "other"}
              onChange={() => setReason("other")}
            />
            <span>ອື່ນ ໆ</span>
          </label>
        </div>

        <textarea
          className="w-full rounded-xl border p-3 text-sm mb-4"
          rows={4}
          placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
            disabled={sending}
          >
            ບໍ່ລາຍງານ
          </button>

          <button
            onClick={submit}
            disabled={sending}
            className="px-4 py-2 rounded-xl bg-primary text-white disabled:opacity-50"
          >
            {sending ? "ກຳລັງສົ່ງ" : "ສົ່ງລາຍງານ"}
          </button>
        </div>
      </div>
    </div>
  );
}
