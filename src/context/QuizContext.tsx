import React, { createContext, useContext, useMemo, useState } from "react";
import type { QuizData, Section, Question, AnswerMap } from "../types/Quizz";
import { shuffle } from "../utils/shuffle";

type PreparedQuestion = Question & { sectionId: string; sectionTitle: string };

type QuizCtx = {
  sections: Section[];
  linearQuestions: PreparedQuestion[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  answers: AnswerMap;
  setAnswer: (qid: string, optionId: string) => void;

  isSubmitted: boolean;
  setSubmitted: (s: boolean) => void;
};

const Ctx = createContext<QuizCtx | null>(null);

type Props = {
  data: QuizData;
  perSection?: number;
  seed?: number;
  children: React.ReactNode;
};

export function QuizProvider({ data, perSection = 5, seed, children }: Props) {
  const preparedSections = useMemo<Section[]>(() => {
    return data.quiz_sections.map((sec, si) => {
      const shuffledQs = shuffle(sec.questions, seed ? seed + si : undefined)
        .slice(0, Math.min(perSection, sec.questions.length))
        .map((q, qi) => ({
          ...q,
          options: shuffle(q.options, seed ? seed + si * 100 + qi : undefined),
        }));
      return { ...sec, questions: shuffledQs };
    });
  }, [data, perSection, seed]);

  const linearQuestions = useMemo<PreparedQuestion[]>(() => {
    const list: PreparedQuestion[] = [];
    preparedSections.forEach((sec) => {
      sec.questions.forEach((q) => list.push({ ...q, sectionId: sec.section_id, sectionTitle: sec.title }));
    });
    return list;
  }, [preparedSections]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isSubmitted, setSubmitted] = useState(false);

  const setAnswer = (qid: string, optionId: string) => {
    // หลัง submit แล้ว ห้ามแก้
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  };

  const value: QuizCtx = {
    sections: preparedSections,
    linearQuestions,
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswer,
    isSubmitted,
    setSubmitted,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useQuiz = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuiz must be used inside <QuizProvider/>");
  return ctx;
};
