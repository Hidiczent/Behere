// src/components/ChatChanel/MessageBubble.tsx
import React from "react";
import type { Message, Role } from "../../types/Message";

const ROLE_LABEL: Record<Role, string> = {
  venter: "ຜູ້ລະບາຍ",
  listener: "ຜູ້ຮັບຟັງ",
};

function timeString(ms: number) {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubbleBase({ msg }: { msg: Message }) {
  if (msg.system) {
    return (
      <div className="flex justify-center">
        <div className="text-xs text-gray-500 bg-gray-100 border rounded-full px-3 py-1">
          {msg.text}
        </div>
      </div>
    );
  }

  const isMine = !!msg.mine;
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] flex flex-col ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        <span className="mb-1 text-[10px] tracking-wide uppercase text-primary">
          {(msg.role ? ROLE_LABEL[msg.role] + " • " : "") +
            timeString(msg.time)}
        </span>
        <div
          className={[
            "rounded-2xl px-4 py-3 text-sm shadow border leading-relaxed whitespace-pre-wrap break-words",
            isMine ? "bg-primary text-white" : "bg-secondary text-primary",
          ].join(" ")}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MessageBubbleBase);
