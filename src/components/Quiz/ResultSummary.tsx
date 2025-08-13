import { useMemo } from "react";
import { useQuiz } from "../../context/QuizContext";


type Grade = { key: "excellent"|"good"|"average"|"needs"; label: string };

function gradeFromPercent(p: number): Grade {
  if (p >= 85) return { key: "excellent", label: "ยอดเยี่ยม" };
  if (p >= 70) return { key: "good", label: "ดี" };
  if (p >= 50) return { key: "average", label: "ปานกลาง" };
  return { key: "needs", label: "ต้องพัฒนา" };
}
function colorFromPercent(p: number): string {
  if (p >= 85) return "#16a34a";
  if (p >= 70) return "#2563eb";
  if (p >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function ResultSummary() {
  const { linearQuestions, answers } = useQuiz();

  const { score, max, percent, answered } = useMemo(() => {
    let s = 0, answeredCount = 0;
    const maxScore = linearQuestions.length * 1;
    for (const q of linearQuestions) {
      const sel = answers[q.id];
      if (sel) {
        answeredCount++;
        const opt = q.options.find(o => o.id === sel);
        if (opt) s += opt.weight ?? 0;
      }
    }
    const pct = maxScore > 0 ? Math.round((s / maxScore) * 100) : 0;
    return { score: +s.toFixed(1), max: maxScore, percent: pct, answered: answeredCount };
  }, [linearQuestions, answers]);

  const grade = gradeFromPercent(percent);
  const r = 54;
  const C = 2 * Math.PI * r;
  const dashOffset = C * (1 - percent / 100);
  const stroke = colorFromPercent(percent);

  const chipBase = "px-2.5 py-1 rounded-full text-xs font-bold tracking-wide";
  const chipColor =
    grade.key === "excellent" ? "bg-green-100 text-green-800" :
    grade.key === "good"      ? "bg-blue-100  text-blue-800"  :
    grade.key === "average"   ? "bg-amber-100 text-amber-800" :
                                "bg-red-100   text-red-800";

  return (
    <div className="max-w-[860px] mx-auto my-8 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl px-5 pb-6 pt-5 shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-[22px] font-extrabold text-slate-900 m-0">ผลการทำแบบทดสอบ</h3>
          <span className={`${chipBase} ${chipColor}`}>{grade.label}</span>
        </div>

        {/* body */}
        <div className="grid grid-cols-[140px_1fr] gap-4 items-center max-md:grid-cols-1">
          {/* ring */}
          <div className="relative w-[140px] h-[140px]" aria-label={`คะแนน ${percent}%`}>
            <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
              <circle cx="70" cy="70" r={r} stroke="#e5e7eb" fill="none" strokeWidth={12} />
              <circle
                cx="70" cy="70" r={r}
                fill="none" strokeWidth={12} strokeLinecap="round"
                stroke={stroke}
                strokeDasharray={C}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[28px] font-extrabold text-slate-900">
              {percent}%
            </div>
          </div>

          {/* stats */}
          <dl className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <dt className="text-xs text-slate-600">ตอบแล้ว</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-slate-900">
                {answered} / {linearQuestions.length} ข้อ
              </dd>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <dt className="text-xs text-slate-600">คะแนน</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-slate-900">
                {score} จาก {max}
              </dd>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <dt className="text-xs text-slate-600">คิดเป็น</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-slate-900">{percent}%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
