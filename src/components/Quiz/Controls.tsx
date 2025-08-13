import { useQuiz } from "../../context/QuizContext";

type Props = { onSubmit: () => void };

export default function Controls({ onSubmit }: Props) {
  const { currentIndex, setCurrentIndex, linearQuestions, answers, isSubmitted } = useQuiz();
  const total = linearQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const canNext = !!answers[linearQuestions[currentIndex].id];

  if (isSubmitted) {
    return null; // หลัง submit แล้ว ไม่แสดง Prev/Next/Submit
  }

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "space-between" }}>
      <button
        type="button"
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        disabled={isFirst}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ddd",
          background: isFirst ? "#f5f5f5" : "#fff",
          cursor: isFirst ? "not-allowed" : "pointer",
        }}
      >
        ◀ Prev
      </button>

      {!isLast ? (
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
          disabled={!canNext}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #4f46e5",
            background: canNext ? "#4f46e5" : "#c7d2fe",
            color: "#fff",
            cursor: canNext ? "pointer" : "not-allowed",
          }}
        >
          Next ▶
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canNext}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #16a34a",
            background: canNext ? "#16a34a" : "#bbf7d0",
            color: "#fff",
            cursor: canNext ? "pointer" : "not-allowed",
          }}
        >
          Submit ✅
        </button>
      )}
    </div>
  );
}
