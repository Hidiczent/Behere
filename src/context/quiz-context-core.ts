import { createContext } from "react";
import type { Section, Question, AnswerMap } from "../types/Quizz";

export type PreparedQuestion = Question & {
  sectionId: string;
  sectionTitle: string;
};

export type QuizCtx = {
  sections: Section[];
  linearQuestions: PreparedQuestion[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  answers: AnswerMap;
  setAnswer: (qid: string, optionId: string) => void;
  isSubmitted: boolean;
  setSubmitted: (s: boolean) => void;
};

// ✅ ไม่มีคอมโพเนนต์ในไฟล์นี้
export const QuizContext = createContext<QuizCtx | null>(null);
