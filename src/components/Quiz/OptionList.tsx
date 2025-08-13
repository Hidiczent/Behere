import type { Option } from "../../types/Quizz";
import { useQuiz } from "../../hooks/useQuiz";

type Props = { questionId: string; options: Option[] };

export default function OptionList({ questionId, options }: Props) {
  const { answers, setAnswer, isSubmitted } = useQuiz();
  const selected = answers[questionId];

  const base =
    "w-full text-left px-4 py-3 rounded-full border transition " +
    "hover:-translate-y-[1px] focus:outline-none focus:ring-2 " +
    "disabled:opacity-65 disabled:cursor-not-allowed";

  return (
    <div className="mt-4 grid gap-3">
      {options.map((opt, idx) => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id ?? idx}
            type="button"
            disabled={isSubmitted}
            onClick={() => setAnswer(questionId, opt.id)}
            className={[
              base,
              "bg-[#ffff] border-[#d6dee8] text-primary font-semibold",
              active && "bg-secondary border-primary ",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {opt.text}
          </button>
        );
      })}
    </div>
  );
}
