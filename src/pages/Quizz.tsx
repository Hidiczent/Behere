
import raw from "../../public/data/quiz.json";
import type { QuizData } from "../types/Quizz";
import { QuizProvider, useQuiz } from "../context/QuizContext";
//import SectionHeader from "./components/SectionHeader";
import ProgressBar from "../components/Quiz/ProgressBar";
import QuestionView from "../components/Quiz/QuestionView";
import Controls from "../components/Quiz/Controls";
import ResultSummary from "../components/Quiz/ResultSummary";
import { useMemo } from "react";




function QuizScreen() {
  const { setSubmitted, isSubmitted } = useQuiz();

  const onSubmit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-[860px] mx-auto my-8 px-4">
        <ResultSummary />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto my-6 px-4">
      <div className="bg-[#d9f6fa] rounded-xl p-6">
        <div className="font-semibold text-sm text-slate-900/75 mb-2">ຄຳຖາມ</div>
        <QuestionView />
      </div>

      <div className="mt-4">
        <ProgressBar />
      </div>

      <Controls onSubmit={onSubmit} />
    </div>
  );
}

export default function App() {
  const data = raw as QuizData;
  const seed = useMemo(() => undefined as number | undefined, []);
  return (
    <QuizProvider data={data} perSection={5} seed={seed}>
      <QuizScreen />
    </QuizProvider>
  );
}
