import { useQuiz } from "../../hooks/useQuiz";

export default function ProgressBar() {
  const { linearQuestions, currentIndex } = useQuiz();
  const total = linearQuestions.length;
  const percent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <>
      <div className="h-2 bg-slate-200 rounded overflow-hidden">
        <span
          className="block h-full bg-primary transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs mt-1"></div>
    </>
  );
}
