// src/components/ChatChanel/ConfirmEndModal.tsx

export default function ConfirmEndModal({
  open, onCancel, onConfirm,
}: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h3 className="text-lg font-bold mb-2">ยืนยันจบการสนทนา?</h3>
        <p className="text-sm text-slate-600 mb-6">เมื่อจบแล้วคุณสามารถกลับไปจับคู่ใหม่ได้</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl border">ยกเลิก</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-500 text-white">จบการสนทนา</button>
        </div>
      </div>
    </div>
  );
}
