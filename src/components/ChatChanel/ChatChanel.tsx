// src/components/ChatChanel/ChatChanel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Message, Role } from "../../types/Message";
import MessageBubble from "./MessageBubble";
import MatchingScreen from "./MatchingScreen";
import { useSearchParams } from "react-router-dom";

const HTTP_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5050";
const WS_BASE = HTTP_BASE.replace(/^http(s?):\/\//i, "ws$1://");

const roleMap: Record<Role, "talker" | "listener"> = {
  venter: "talker",
  listener: "listener",
};
const DBG = import.meta.env.VITE_DEBUG_WS === "1";
const log = (...a: unknown[]) => {
  if (DBG) console.log(...a);
};

export default function ChatBubbles() {
  const [sp] = useSearchParams();
  const initialRole = (sp.get("role") as Role) || "venter";

  const [role] = useState<Role>(initialRole);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [myUid, setMyUid] = useState<number | null>(null);
  const [queuing, setQueuing] = useState(false); // สำหรับหน้า matching

  const listRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const joinedOnceRef = useRef(false);

  // refs ให้ handler ใช้ค่าล่าสุด
  const roleRef = useRef<Role>(role);
  const myUidRef = useRef<number | null>(null);
  const conversationIdRef = useRef<number | null>(null);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);
  useEffect(() => {
    myUidRef.current = myUid;
  }, [myUid]);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // auto scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const canSend = useMemo(
    () => text.trim().length > 0 && !!conversationId,
    [text, conversationId]
  );

  useEffect(() => {
    // ป้องกันเปิดซ้ำ
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)
    ) {
      log("[FE] reuse ws, readyState=", wsRef.current.readyState);
      return;
    }

    const ws = new WebSocket(`${WS_BASE}/ws`);
    wsRef.current = ws;
    log("[FE] create ws", `${WS_BASE}/ws`);

    const sendJoin = (tag: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        const payload = { type: "QUEUE_JOIN", role: roleMap[roleRef.current] };
        ws.send(JSON.stringify(payload));
        joinedOnceRef.current = true;
        setQueuing(true);
        log(`[FE] send QUEUE_JOIN (${tag})`, payload);
      } else {
        log("[FE] skip sendJoin, ws not open", ws.readyState);
      }
    };

    ws.addEventListener("open", () => {
      setConnected(true);
      log(
        "[FE] ws open. joinedOnce=",
        joinedOnceRef.current,
        "cid=",
        conversationIdRef.current
      );
      if (!conversationIdRef.current && !joinedOnceRef.current) {
        sendJoin("open");
        // กันชนจังหวะ
        setTimeout(() => {
          if (!conversationIdRef.current) sendJoin("retry");
        }, 300);
      }
    });

    ws.addEventListener("close", (e) => {
      log("[FE] ws close", e.code, e.reason);
      setConnected(false);
      setConversationId(null);
      setQueuing(false);
      joinedOnceRef.current = false;
    });

    ws.addEventListener("error", (e) => {
      log("[FE] ws error", e);
    });

    ws.addEventListener("message", (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        log("[FE] recv", msg);

        if (msg.type === "HELLO") setMyUid(msg.uid);

        if (msg.type === "QUEUED") {
          setQueuing(true);
        }

        if (msg.type === "MATCH_FOUND") {
          setConversationId(msg.conversationId);
          setQueuing(false);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              system: true,
              text: "ຈັບຄູ່ສຳເລັດ! ເລີ່ມສົນທະນາໄດ້ເລີຍ ✨",
              time: Date.now(),
            },
          ]);
        }

        if (msg.type === "MESSAGE_NEW") {
          const mine = msg.from === myUidRef.current;
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              mine,
              role: mine
                ? roleRef.current
                : roleRef.current === "venter"
                ? "listener"
                : "venter",
              text: String(msg.text ?? ""),
              time: typeof msg.at === "number" ? msg.at : Date.now(),
            },
          ]);
        }

        if (
          msg.type === "CONVERSATION_ENDED" ||
          msg.type === "PARTNER_DISCONNECTED"
        ) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              system: true,
              text: "ການສົນທະນາສິ້ນສຸດແລ້ວ",
              time: Date.now(),
            },
          ]);
          setConversationId(null);
          setQueuing(false);
          joinedOnceRef.current = false; // ให้จับคู่ใหม่ได้
        }

        if (msg.type === "ERROR") {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              system: true,
              text: `ຂໍ້ຜິດພາດ: ${msg.message}`,
              time: Date.now(),
            },
          ]);
        }
      } catch (err) {
        log("[FE] parse message error", err);
      }
    });

    return () => {
      log("[FE] cleanup ws");
      try {
        ws.close();
      } catch {
        console.log("[FE] ws close error");
      }
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [role]);

  function handleSend() {
    if (!canSend || !wsRef.current || !conversationId) return;
    const payload = {
      type: "MESSAGE",
      conversationId: Number(conversationId),
      text: text.trim(),
    };
    wsRef.current.send(JSON.stringify(payload));
    log("[FE] send MESSAGE", payload);
    setText("");
  }

  function handleEnd() {
    if (!wsRef.current || !conversationId) return;
    const payload = { type: "END", conversationId: Number(conversationId) };
    wsRef.current.send(JSON.stringify(payload));
    log("[FE] send END", payload);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === "Return") && (e.ctrlKey || e.metaKey))
      handleSend();
  }

  // ถ้ายังไม่ match ให้โชว์หน้ารอจับคู่
  if (!conversationId) {
    return (
      <MatchingScreen
        role={role}
        connected={connected}
        queuing={queuing}
        onCancel={() => window.history.back()}
      />
    );
  }

  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto p-4 flex flex-col gap-3 font-laoLooped">
      <header className="flex items-center justify-between bg-white/70 backdrop-blur rounded-2xl shadow p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">ຫ້ອງສົນທະນາໃຫ້ກຳລັງໃຈ</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="rounded-full px-2 py-1 bg-primary text-secondary">
            {label(role)}
          </span>
          <span
            className={`rounded-full px-2 py-1 ${
              conversationId
                ? "bg-green-500 text-white"
                : connected
                ? "bg-yellow-400 text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {conversationId
              ? "ກຳລັງສົນທະນາ"
              : connected
              ? "ກຳລັງຈັບຄູ່"
              : "ຍັງບໍ່ໄດ້ເຊື່ອມຕໍ່"}
          </span>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto bg-neutral-50 rounded-2xl p-3 border border-neutral-200 space-y-3"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-3 border border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <input
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="ພິມຂໍ້ຄວາມ (⌘/Ctrl + Enter เพื่อส่ง)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!conversationId}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="rounded-xl px-5 py-3 font-medium shadow disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-white hover:opacity-90"
            >
              ສົ່ງຂໍ້ຄວາມ
            </button>
            <button
              onClick={handleEnd}
              disabled={!conversationId}
              className="rounded-xl px-4 py-3 font-medium shadow disabled:opacity-40 disabled:cursor-not-allowed border"
            >
              ຈົບການສົນທະນາ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function label(r: Role) {
  return r === "venter" ? "ຜູ້ລະບາຍ" : "ຜູ້ຮັບຟັງ";
}
