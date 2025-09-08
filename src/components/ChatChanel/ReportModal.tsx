// src/components/ChatChanel/ReportModal.tsx
import { useState } from "react";
import { api } from "../../service/api";
import { useAuth } from "../../context/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
  conversationId: number | null;
  // reportedUserId?: number | null; // ไม่ใช้แล้ว ฝั่ง BE อนุมานเอง
};

type TabKey = "rate" | "report";
type ReportReason = "spam" | "harassment" | "other";



export default function ReportModal({ open, onClose, conversationId }: Props) {
  const { authed } = useAuth();
  const [tab, setTab] = useState<TabKey>("rate");

  // ให้คะแนน
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  // รายงาน
  const [reason, setReason] = useState<ReportReason>("spam");
  const [detail, setDetail] = useState("");

  // loading
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    // เคลียร์สถานะฟอร์มทุกครั้งที่ปิด
    setRating(0);
    setHover(0);
    setFeedback("");
    setReason("spam");
    setDetail("");
    onClose();
  };

  const ensureConversationId = () => {
    const cid = Number(conversationId);
    if (!cid || Number.isNaN(cid)) {
      alert("ไม่พบรหัสห้องสนทนา (conversationId)");
      return null;
    }
    return cid;
  };

  const submitRating = async () => {
    if (submitting) return;
    if (!authed) {
      alert("กรุณาเข้าสู่ระบบก่อนให้คะแนน");
      return;
    }
    const cid = ensureConversationId();
    if (!cid) return;

    if (rating < 1 || rating > 5) {
      alert("กรุณาให้คะแนน 1–5 ดาว");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/ratings", {
        conversationId: cid,
        rating,
        feedback: feedback?.trim() || undefined,
      });

      if (res.data?.ok) {
        alert("ສົ່ງຄະແນນສຳເລັດ ຂອບໃຈສຳຫຼັບຄຳຕິຊົມ 🙏");
        handleClose();
      } else {
        alert(res.data?.error || "ສົ່ງຄະແນນບໍ່ສຳເລັດ");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 404) {
        alert("ยังไม่ได้เปิดใช้งาน API ให้คะแนน (/ratings) ที่ฝั่งเซิร์ฟเวอร์");
        return;
      }
      if (status === 401) {
        alert("UNAUTHORIZED: กรุณาเข้าสู่ระบบใหม่");
        return;
      }
      if (status === 400 && data?.error === "VALIDATION_ERROR") {
        alert(
          `ข้อมูลไม่ถูกต้อง: ${JSON.stringify(data.details ?? {}, null, 2)}`
        );
        return;
      }
      if (status === 400 && data) console.warn("RATING 400 →", data);

      const msg =
        data?.error || err?.message || "ສົ່ງຄະແນນບໍ່ສຳເລັດ ລອງໃໝ່ອີກຄັ້ງ";
      if (msg === "CONVERSATION_NOT_ENDED") {
        alert("ຫ້ອງສົນທະນາຍັງບໍ່ຈົບ ຈຶ່ງຍັງໃຫ້ຄະແນນບໍ່ໄດ້");
      } else if (msg === "NOT_IN_CONVERSATION") {
        alert("ບັນຊີນີ້ບໍ່ຢູ່ໃນຫ້ອງສົນທະນານີ້");
      } else if (msg === "MISSING_PARAMS") {
        alert("ຂໍ້ມູນບໍ່ຄົບ: conversationId / rating");
      } else if (msg === "INVALID_RATING") {
        alert("คะแนนไม่ถูกต้อง (ต้องอยู่ในช่วง 1–5)");
      } else {
        alert(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async () => {
    if (submitting) return;
    if (!authed) {
      alert("กรุณาเข้าสู่ระบบก่อนรายงาน");
      return;
    }
    const cid = ensureConversationId();
    if (!cid) return;

    try {
      setSubmitting(true);
      const res = await api.post("/reports", {
        conversationId: cid,
        reason,
        detail: detail?.trim() || undefined,
      });

      if (res.data?.ok) {
        alert("ສົ່ງລາຍງານແລ້ວ ຂອບໃຈທີ່ແຈ້ງໃຫ້ 🙏");
        handleClose();
      } else {
        alert(res.data?.error || "ສົ່ງລາຍງານບໍ່ສຳເລັດ");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 404) {
        alert("ยังไม่ได้เปิดใช้งาน API รายงาน (/reports) ที่ฝั่งเซิร์ฟเวอร์");
        return;
      }
      if (status === 401) {
        alert("UNAUTHORIZED: กรุณาเข้าสู่ระบบใหม่");
        return;
      }
      if (status === 400 && data?.error === "VALIDATION_ERROR") {
        alert(
          `ข้อมูลไม่ถูกต้อง: ${JSON.stringify(data.details ?? {}, null, 2)}`
        );
        return;
      }
      if (status === 400 && data) console.warn("REPORT 400 →", data);

      const msg =
        data?.error || err?.message || "ສົ່ງລາຍງານບໍ່ສຳເລັດ ລອງໃໝ່ອີກຄັ້ງ";
      if (msg === "NOT_IN_CONVERSATION") {
        alert("ບັນຊີນີ້ບໍ່ຢູ່ໃນຫ້ອງສົນທະນານີ້");
      } else if (msg === "CONVERSATION_NOT_FOUND") {
        alert("ไม่พบห้องสนทนานี้");
      } else if (msg === "CONVERSATION_NOT_ENDED") {
        alert("ยังรายงานไม่ได้: ห้องยังไม่จบ");
      } else if (msg === "MISSING_PARAMS") {
        alert("ຂໍ້ມູນບໍ່ຄົບ: conversationId / reason");
      } else {
        alert(msg);
      }
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
        disabled={submitting}
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
          <div
            className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1"
            role="tablist"
            aria-label="Rate or Report"
          >
            <button
              role="tab"
              aria-selected={tab === "rate"}
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                tab === "rate" ? "bg-white shadow" : "text-slate-600",
              ].join(" ")}
              onClick={() => setTab("rate")}
              disabled={submitting}
            >
              ໃຫ້ຄະແນນ
            </button>
            <button
              role="tab"
              aria-selected={tab === "report"}
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                tab === "report" ? "bg-white shadow" : "text-slate-600",
              ].join(" ")}
              onClick={() => setTab("report")}
              disabled={submitting}
            >
              ລາຍງານ
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
                disabled={submitting}
              />
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-slate-700">
                ບອກເຫດຜົນທີ່ຕ້ອງການລາຍງານຄູ່ສົນທະນາ
              </p>

              <div className="space-y-3 mb-4">
                {(["spam", "harassment", "other"] as ReportReason[]).map(
                  (r) => (
                    <label key={r} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        disabled={submitting}
                      />
                      <span>
                        {r === "spam"
                          ? "ສະແປມ/ກວນ"
                          : r === "harassment"
                          ? "ຄຸກຄາມ/ຂໍ້ຄວາມບໍ່ເໝາະສົມ"
                          : "ອື່ນ ໆ"}
                      </span>
                    </label>
                  )
                )}
              </div>

              <textarea
                className="w-full rounded-xl border p-3 text-sm"
                rows={4}
                placeholder="ລາຍລະອຽດເພິ່ມເຕິມ (ບໍ່ບັງຄັບ)"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                disabled={submitting}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl border text-sm font-medium"
            disabled={submitting}
          >
            ບໍ່ແມ່ນຕອນນີ້
          </button>

          {tab === "rate" ? (
            <button
              onClick={submitRating}
              disabled={submitting || rating === 0}
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
