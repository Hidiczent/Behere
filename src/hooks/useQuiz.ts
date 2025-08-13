import { useContext } from "react";
import { QuizContext } from "../context/quiz-context-core";

export function useQuiz() {
    const ctx = useContext(QuizContext);
    if (!ctx) throw new Error("useQuiz must be used inside <QuizProvider/>");
    return ctx;
}
