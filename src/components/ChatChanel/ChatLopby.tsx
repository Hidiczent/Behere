import { Link } from "react-router-dom";

type Props = {
  title?: string;
  leftText?: string;
  rightText?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftIcon?: string;
  rightIcon?: string;
  mirrorRight?: boolean;
};

export default function RoleIntro({
  title = "ສຳນວນບົດບາດ",
  leftText = "ພ້ອມທີ່ຈະລະບາຍເລື່ອງໃນໃຈໃຫ້ຜູ້ຟັງ",
  rightText = "ພ້ອມທີ່ຈະຮັບຟັງຜູ້ລະບາຍແລ້ວ",
  leftLabel = "ຜູ້ລະບາຍ",
  rightLabel = "ຜູ້ຮັບຟັງ",
  leftIcon,
  rightIcon,
  mirrorRight = true,
}: Props) {
  return (
    <section className="min-h-[70vh] bg-secondary/5 border border-secondary/20 rounded-xl flex items-center justify-center px-4">
      <div className="w-full max-w-5xl rounded-xl bg-secondary/5 border border-secondary/20 p-6 md:p-10 font-laoLooped">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-primary mb-10">
          {title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12">
          {/* left */}
          <div className="flex flex-col items-center text-center gap-4">
            {leftIcon ? (
              <img
                src={leftIcon}
                alt="venter's icon"
                className="w-24 h-24 md:w-28 md:h-28 object-contain"
                loading="lazy"
              />
            ) : (
              <FallbackBubble />
            )}

            <p className="text-primary/90 text-lg md:text-xl leading-relaxed">
              {leftText}
            </p>

            <Link
              to={{ pathname: "/chatchanel", search: "?role=venter" }}
              className="inline-block rounded-md bg-primary px-10 py-3 text-sm font-bold text-secondary shadow-sm"
            >
              {leftLabel}
            </Link>
          </div>

          {/* divider */}
          <div className="hidden md:block h-56 w-[3px] bg-primary/50 mx-auto rounded" />

          {/* right */}
          <div className="flex flex-col items-center text-center gap-4">
            {rightIcon || leftIcon ? (
              <img
                src={rightIcon ?? leftIcon!}
                alt="listener's icon"
                className={[
                  "w-24 h-24 md:w-28 md:h-28 object-contain",
                  !rightIcon && mirrorRight ? "-scale-x-100" : "",
                ].join(" ")}
                loading="lazy"
              />
            ) : (
              <FallbackBubble />
            )}

            <p className="text-primary/90 text-lg md:text-xl leading-relaxed">
              {rightText}
            </p>

            <Link
              to={{ pathname: "/chatchanel", search: "?role=listener" }}
              className="inline-block rounded-md bg-primary px-10 py-3 text-sm font-bold text-secondary shadow-sm"
            >
              {rightLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FallbackBubble() {
  return (
    <svg viewBox="0 0 64 48" className="w-24 h-24" aria-hidden="true">
      <path
        d="M8 10c0-5 6-8 24-8s24 3 24 8v10c0 5-6 8-24 8-3.8 0-7.3-.2-10.5-.6L13 34l1.7-6.4C10.8 25.6 8 23.1 8 20V10z"
        fill="#cfe3ea"
        stroke="#6b8a99"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="18" r="2.3" fill="#6b8a99" />
      <circle cx="32" cy="18" r="2.3" fill="#6b8a99" />
      <circle cx="40" cy="18" r="2.3" fill="#6b8a99" />
    </svg>
  );
}
