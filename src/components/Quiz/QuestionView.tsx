

import { useQuiz } from "../../context/QuizContext";
import OptionList from "./OptionList";





export default function QuestionView() {
  const { linearQuestions, currentIndex } = useQuiz();
  const q = linearQuestions[currentIndex];

  return (
    <>
      <div className="bg-[#cfe8f2] rounded-[14px] px-5 py-4 min-h-[84px] flex items-center leading-relaxed">
        {q.text}
      </div>
      <OptionList questionId={q.id} options={q.options} />
    </>
  );
}