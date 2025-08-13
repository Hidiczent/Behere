// src/components/ChatChanel/ReportModal.tsx
import { useState } from "react";
import { api } from "../../service/api"; // axios instance ของโปรเจ็กต์

type Props = {
  open: boolean;
  onClose: () => void;
  conversationId: number | null;
  reportedUserId?: number | null; // = partnerId สำหรับให้คะแนนด้วย
};

type TabKey = "rate" | "report";

export default function ReportModal({
  open,
  onClose,
  conversationId,
  reportedUserId,
}: Props) {
  const [tab, setTab] = useState<TabKey>("rate");

  // ให้คะแนน
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  // รายงาน
  const [reason, setReason] = useState<"spam" | "harassment" | "other">("spam");
  const [detail, setDetail] = useState("");

  // loading
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const partnerId = reportedUserId ?? undefined;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitRating = async () => {
    if (!conversationId || !partnerId) {
      alert("ไม่พบข้อมูลคู่สนทนา/รหัสห้อง");
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("กรุณาให้คะแนน 1–5 ดาว");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/ratings", {
        conversationId,
        partnerId,
        rating,
        feedback,
      });
      alert("ສົ່ງຄະແນນສຳເລັດ ຂອບໃຈສຳຫຼັບຄຳຕິຊົມ 🙏");
      onClose();
    } catch {
      alert("ສົ່ງຄະແນນບໍ່ສຳເລັດ ລອງໃໝ່ອີກຄັ້ງ");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async () => {
    if (!conversationId) {
      alert("ບໍ່ພົບລະຫົດຫ້ອງສົນທະນາ");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/reports", {
        conversationId,
        reportedUserId: partnerId,
        reason,
        detail,
      });
      alert("ສົ່ງລາຍງງານແລ້ວ ຂອບໃຈທີ່ແຈ້ງໃຫ້ 🙏");
      onClose();
    } catch {
      alert("ສົ່ງລາຍງງານບໍ່ສຳເລັດ ລອງໃໝ່ອີກຄັ້ງ");
    } finally {
      setSubmitting(false);
    }
  };

  const Star = ({ index }: { index: number }) => {
    const active = (hover || rating) >= index;
    return (
      <button
        type="button"
        aria-label={`${index} ດາວ`}
        onClick={() => setRating(index)}
        onMouseEnter={() => setHover(index)}
        onMouseLeave={() => setHover(0)}
        className="text-3xl transition-transform active:scale-95"
      >
        <span className={active ? "text-yellow-500" : "text-slate-300"}>★</span>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/30"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-0 shadow"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="px-6 pt-5">
          <h3 className="text-lg font-bold">ຈົບການສົນທະນາ</h3>
          <p className="text-sm text-slate-600">ຊ່ວຍບອກເຮົາແນ່ໄດ້ບໍ່?</p>
        </div>

        <div className="mt-4 px-3">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                tab === "rate" ? "bg-white shadow" : "text-slate-600",
              ].join(" ")}
              onClick={() => setTab("rate")}
            >
              ໃຫ້ຄະແນນ{" "}
            </button>
            <button
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                tab === "report" ? "bg-white shadow" : "text-slate-600",
              ].join(" ")}
              onClick={() => setTab("report")}
            >
              รายงาน
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {tab === "rate" ? (
            <div>
              <p className="mb-3 text-sm text-slate-700">
                ປະສົບການສົນທະນາຄັ້ງນີ້ເປັນແນວໃດແນ່ ?
              </p>

              {/* Stars */}
              <div className="mb-4 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} index={i} />
                ))}
                <span className="ml-2 text-sm text-slate-600">
                  {rating ? `${rating}/5` : "ຍັງບໍ່ໃຫ້ຄະແນນ"}
                </span>
              </div>

              <textarea
                className="w-full rounded-xl border p-3 text-sm"
                rows={4}
                placeholder="ຂຽນຄຳຕິຊົມ (ບໍ່ບັງຄັບ)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-slate-700">
                ບອກເຫດຜົນທີ່ຕ້ອງການລາຍງານຄູ່ສົນທະນາ
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
                  <span>ຄຸກຄາມ/ຂໍ້ຄວາມບໍ່ເໝາະສົມ</span>
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
                className="w-full rounded-xl border p-3 text-sm"
                rows={4}
                placeholder="ລາຍລະອຽດເພິ່ມເຕິມ (ບໍ່ບັງຄັບ)"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-sm font-medium"
            disabled={submitting}
          >
            ບໍ່ແມ່ນຕອນນີ້
          </button>

          {tab === "rate" ? (
            <button
              onClick={submitRating}
              disabled={submitting || rating === 0 || !partnerId}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "ກຳລັງສົ່ງ..." : "ສົ່ງຄະແນນ"}
            </button>
          ) : (
            <button
              onClick={submitReport}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "ກຳລັງສົ່ງ..." : "ສົ່ງລາຍງານ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
