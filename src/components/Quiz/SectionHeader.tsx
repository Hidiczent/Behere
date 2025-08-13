//import React from "react";
import { useQuiz } from "../../context/QuizContext";

export default function SectionHeader() {
  const { linearQuestions, currentIndex } = useQuiz();
  const q = linearQuestions[currentIndex];
  return (
    <div style={{ marginBottom: 12 }}>
      {/* <div style={{ fontSize: 12, opacity: 0.8 }}>
        {q.sectionTitle}
      </div> */}
      <h2 style={{ margin: "4px 0 0" }}>ຄຳຖາມ #{currentIndex + 1}</h2>
    </div>
  );
}
