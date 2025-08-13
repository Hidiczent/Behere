import { useQuiz } from "../../hooks/useQuiz";

type Props = { onSubmit: () => void };

export default function Controls({ onSubmit }: Props) {
  const {
    currentIndex,
    setCurrentIndex,
    linearQuestions,
    answers,
    isSubmitted,
  } = useQuiz();

  const total = linearQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const canNext = !!answers[linearQuestions[currentIndex].id];

  if (isSubmitted) return null;

  return (
    <div className="mt-4 flex justify-between gap-2">
      {/* Prev */}
      <button
        type="button"
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        disabled={isFirst}
        className={[
          "rounded-lg border px-4 py-2 text-sm font-medium transition",
          isFirst
            ? "cursor-not-allowed border-slate-200 bg-primary/10 text-slate-400"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
        ].join(" ")}
      >
        ກັບຄືນ
      </button>

      {/* Next / Submit */}
      {!isLast ? (
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
          disabled={!canNext}
          className={[
            "rounded-lg border px-4 py-2 text-sm font-semibold transition",
            canNext
              ? "cursor-pointer border-secondary bg-primary text-secondary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
              : "cursor-not-allowed border-primary bg-primary/10 text-primary",
          ].join(" ")}
        >
          ຕໍ່ໄປ
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canNext}
          className={[
            "rounded-lg border px-4 py-2 text-sm font-semibold transition",
            canNext
              ? "cursor-pointer border-green-600 bg-primary text-white hover:text-secondary focus:outline-none focus:ring-2 focus:ring-green-500/60"
              : "cursor-not-allowed border-primary/10 bg-primary/10 text-primary",
          ].join(" ")}
        >
          ສົ່ງຄຳຕອບ
        </button>
      )}
    </div>
  );
}
