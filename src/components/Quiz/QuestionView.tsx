import { useQuiz } from "../../hooks/useQuiz";
import OptionList from "./OptionList";

export default function QuestionView() {
  const { linearQuestions, currentIndex } = useQuiz();
  const q = linearQuestions[currentIndex];

  return (
    <>
      <div className="bg-secondary rounded-[14px] px-5 py-4 min-h-[84px] flex items-center leading-relaxed text-primary font-bold text-lg">
        {q.text}
      </div>
      <OptionList questionId={q.id} options={q.options} />
    </>
  );
}
