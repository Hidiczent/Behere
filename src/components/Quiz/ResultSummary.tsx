import { useMemo, type JSX } from "react";
import { useQuiz } from "../../hooks/useQuiz";

// นับ "ตัวเลือกที่ถูกจริง"
function isOptionCorrect(opt: {
  isCorrect?: boolean;
  correct?: boolean;
  weight?: number;
}): boolean {
  if (typeof opt?.isCorrect === "boolean") return opt.isCorrect;
  if (typeof opt?.correct === "boolean") return opt.correct;
  return (opt?.weight ?? 0) === 1; // fallback
}

const PASS_PERCENT = 70; // เกณฑ์ผ่านเป็นเปอร์เซ็นต์

export default function ResultSummary(): JSX.Element {
  const { linearQuestions, answers } = useQuiz();

  const { score, max, answered, correctPercent } = useMemo(() => {
    let s = 0;
    let answeredCount = 0;
    let correctCount = 0;
    const total = linearQuestions.length;

    for (const q of linearQuestions) {
      const sel = answers[q.id];
      if (!sel) continue;

      answeredCount++;
      const opt = q.options.find((o) => o.id === sel);
      if (opt) {
        s += opt.weight ?? 0; // คะแนนตาม weight (ถ้ามี partial credit)
        if (isOptionCorrect(opt)) correctCount++; // นับ “ถูกจริง”
      }
    }

    const correctPct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return {
      score: +s.toFixed(1),
      max: total,
      answered: answeredCount,
      correctPercent: correctPct,
    };
  }, [linearQuestions, answers]);

  const isPassed = correctPercent >= PASS_PERCENT;

  // วงแหวนอิงเปอร์เซ็นต์เดียวกับเกณฑ์ผ่าน
  const r = 54;
  const C = 2 * Math.PI * r;
  const dashOffset = C * (1 - correctPercent / 100);
  const stroke = isPassed ? "#16a34a" : "#ef4444";

  return (
    <div className="max-w-[860px] mx-auto my-8 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl px-5 pb-6 pt-5 shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-[22px] font-extrabold text-slate-900 m-0">
            ຜົນການທົດສອບ
          </h3>

          {/* แสดงเฉพาะเปอร์เซ็นต์ผ่าน/ไม่ผ่าน */}
          {isPassed ? (
            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-sm">
              ✅ ຜ່ານເກັນ ({correctPercent}%)
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-red-100 text-red-700 font-semibold text-sm">
              ❌ ບໍ່ຜ່ານເກັນ ({correctPercent}% – ຕ້ອງ ≥ {PASS_PERCENT}%)
            </span>
          )}
        </div>

        {/* body */}
        <div className="grid grid-cols-[140px_1fr] gap-4 items-center max-md:grid-cols-1">
          {/* ring */}
          <div
            className="relative w-[140px] h-[140px]"
            aria-label={`ເປີເຊັນຖືກ ${correctPercent}%`}
          >
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              className="-rotate-90"
            >
              <circle
                cx="70"
                cy="70"
                r={r}
                stroke="#e5e7eb"
                fill="none"
                strokeWidth={12}
              />
              <circle
                cx="70"
                cy="70"
                r={r}
                fill="none"
                strokeWidth={12}
                strokeLinecap="round"
                stroke={stroke}
                strokeDasharray={C}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[28px] font-extrabold text-slate-900">
              {correctPercent}%
            </div>
          </div>

          {/* stats (ข้อมูลกลาง ๆ ไม่บอกถูก/ผิดทีละข้อ) */}
          <dl className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <dt className="text-xs text-slate-600">ຕອບແລ້ວ</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-slate-900">
                {answered} / {max} ຂໍ້
              </dd>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <dt className="text-xs text-slate-600">ຄະແນນ</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-slate-900">
                {score} ຈາກ {max}
              </dd>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <dt className="text-xs text-slate-600">ເກັນຜ່ານ</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-slate-900">
                ≥ {PASS_PERCENT}%
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
