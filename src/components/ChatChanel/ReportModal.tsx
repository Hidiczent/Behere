// src/components/ChatChanel/ReportModal.tsx
import { useState } from "react";
import { api } from "../../service/api"; // axios instance ของคุณ

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

  if (!open) return null;

  const submit = async () => {
    try {
      await api.post("/reports", {
        conversationId,
        reportedUserId,
        reason,
        detail,
      });
      onClose();
      alert("ส่งรายงานแล้ว ขอบคุณที่ช่วยแจ้งให้เราทราบ 🙏");
    } catch {
      alert("ส่งรายงานไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h3 className="text-lg font-bold mb-4">รายงานผู้ใช้</h3>

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reason"
              value="spam"
              checked={reason === "spam"}
              onChange={() => setReason("spam")}
            />
            <span>สแปม/กวน</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reason"
              value="harassment"
              checked={reason === "harassment"}
              onChange={() => setReason("harassment")}
            />
            <span>คุกคาม/ไม่เหมาะสม</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="reason"
              value="other"
              checked={reason === "other"}
              onChange={() => setReason("other")}
            />
            <span>อื่น ๆ</span>
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
          <button onClick={onClose} className="px-4 py-2 rounded-xl border">
            ปิด
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-xl bg-primary text-white"
          >
            ส่งรายงาน
          </button>
        </div>
      </div>
    </div>
  );
}
