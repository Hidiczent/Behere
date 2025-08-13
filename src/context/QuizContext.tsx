import React, { useMemo, useState } from "react";
import type { QuizData, Section } from "../types/Quizz";
import { shuffle } from "../utils/shuffle";
import {
  QuizContext,
  type QuizCtx,
  type PreparedQuestion,
} from "./quiz-context-core";

type Props = {
  data: QuizData;
  perSection?: number;
  seed?: number;
  children: React.ReactNode;
};

export default function QuizProvider({
  data,
  perSection = 5,
  seed,
  children,
}: Props) {
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
      sec.questions.forEach((q) =>
        list.push({ ...q, sectionId: sec.section_id, sectionTitle: sec.title })
      );
    });
    return list;
  }, [preparedSections]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setSubmitted] = useState(false);

  const setAnswer = (qid: string, optionId: string) => {
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

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
