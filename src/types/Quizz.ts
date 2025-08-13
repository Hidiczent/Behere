export type Option = {
  id: string;        // A/B/C/D
  text: string;
  weight: number;    // already provided in JSON
};

export type Question = {
  id: string;
  type: "single_choice_weighted";
  text: string;
  options: Option[];
};

export type PassRule = { type: "percent_of_max"; value: number };

export type Scoring = {
  option_weights?: Record<string, number>;
  max_per_question?: number;
  pass_rule?: PassRule;
};

export type Section = {
  section_id: string;
  title: string;
  language?: string;
  section?: string;
  scoring?: Scoring;
  questions: Question[];
};

export type GradeBand = {
  min: number;
  max: number;
  description: string;
};

export type OverallScoring = {
  total_questions: number;
  max_score: number;
  grade_levels: {
    excellent: GradeBand;
    good: GradeBand;
    average: GradeBand;
    needs_improvement: GradeBand;
  };
};

export type QuizData = {
  quiz_sections: Section[];
  overall_scoring?: OverallScoring;
  instructions?: Record<string, string>;
};

export type AnswerMap = Record<string, string | undefined>; // questionId -> optionId
