// src/components/ChatChanel/ChatChanel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Message, Role } from "../../types/Message";
import MessageBubble from "./MessageBubble";
import MatchingScreen from "./MatchingScreen";
import ConfirmEndModal from "../Alert/ConfirmEndModal";
import ReportModal from "./ReportModal";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ---------- URL helpers ----------
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5050";

function makeWsBase(httpBase: string) {
  const u = new URL(httpBase, window.location.origin);
  const proto = u.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${u.host}`;
}
const WS_BASE = makeWsBase(API_BASE);

// ---------- roles ----------
const roleMap: Record<Role, "talker" | "listener"> = {
  venter: "talker",
  listener: "listener",
};

// ---------- debug ----------
const DBG = import.meta.env.VITE_DEBUG_WS === "1";
const wsStateName = (s: number) =>
  s === WebSocket.CONNECTING
    ? "CONNECTING(0)"
    : s === WebSocket.OPEN
    ? "OPEN(1)"
    : s === WebSocket.CLOSING
    ? "CLOSING(2)"
    : s === WebSocket.CLOSED
    ? "CLOSED(3)"
    : `UNKNOWN(${s})`;

declare global {
  interface Window {
    __ws?: WebSocket;
  }
}

// งดรีคอนเน็กต์ชั่วคราวเมื่อโดนแทนที่
let SUPPRESS_RECONNECT_UNTIL = 0;

// ดึง token จากคุกกี้ (กันเคส cookie ไม่ถูกส่งใน WS)
function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}

export default function ChatBubbles() {
  const { authed, loading } = useAuth();

  const [sp] = useSearchParams();
  const initialRole = (sp.get("role") as Role) || "venter";

  const [role] = useState<Role>(initialRole);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [myUid, setMyUid] = useState<number | null>(null);
  const [queuing, setQueuing] = useState(false);

  // ✅ คุมออโต้คิว: เริ่มต้นให้ auto (เจอคู่แรกได้เลย) แต่ “พอจบห้อง” จะปิด auto
  const [autoQueueEnabled, setAutoQueueEnabled] = useState(true);

  // โมดัล
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [lastConversationId, setLastConversationId] = useState<number | null>(
    null
  );
  const [peerId, setPeerId] = useState<number | null>(null);

  // คุมรอบรีคอนเน็กต์
  const [wsVersion, setWsVersion] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // refs เก็บค่า state ล่าสุดให้ event handler
  const roleRef = useRef<Role>(role);
  const myUidRef = useRef<number | null>(null);
  const conversationIdRef = useRef<number | null>(null);
  const showReportRef = useRef<boolean>(false);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);
  useEffect(() => {
    myUidRef.current = myUid;
  }, [myUid]);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);
  useEffect(() => {
    showReportRef.current = showReport;
  }, [showReport]);

  // auto scroll (ลงล่างเมื่อมีข้อความใหม่)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // textarea auto-resize (สูงสุด ~6 แถว แล้วค่อยสกรอลล์)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const lineHeight = 24;
    const max = lineHeight * 6;
    ta.style.height = Math.min(ta.scrollHeight, max) + "px";
    ta.style.overflowY = ta.scrollHeight > max ? "auto" : "hidden";
  }, [text]);

  const canSend = useMemo(
    () => text.trim().length > 0 && !!conversationId,
    [text, conversationId]
  );

  // ---------- helper: log ----------
  const SID = useRef(Math.random().toString(36).slice(2, 8));
  const d = (...a: unknown[]) => {
    if (!DBG) return;
    console.log(`[FE][${SID.current}]`, ...a);
  };

  // ---------- ส่งเข้าคิว (ไม่ปิด/ไม่รีคอนเน็กต์) ----------
  const sendJoinSafe = (tag = "manual") => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      d(
        "sendJoinSafe → ws not OPEN:",
        ws ? wsStateName(ws.readyState) : "null"
      );
      return;
    }
    const payload = { type: "QUEUE_JOIN", role: roleMap[roleRef.current] };
    ws.send(JSON.stringify(payload));
    setQueuing(true);
    d("SEND QUEUE_JOIN", tag, payload);
  };

  // ---------- ป้องกันปิดแท็บ/รีเฟรช และกด Back โดยไม่ได้ตั้งใจ ----------
  // beforeunload: แสดง native confirm ของเบราว์เซอร์ + ถ้าเลือก “อยู่ต่อ” เราจะแสดงโมดัลจบห้อง
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (conversationIdRef.current) {
        setShowEndConfirm(true); // จะเห็นได้เมื่อผู้ใช้กด “อยู่ต่อ”
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // popstate: บล็อกปุ่ม Back แล้วขึ้นโมดัลยืนยัน
  useEffect(() => {
    const pushHere = () => {
      try {
        history.pushState(null, "", location.href);
      } catch {
        console.log("error pushing state");
      }
    };
    // ใส่ sentinel เมื่อเข้า/มีห้อง
    if (conversationId) pushHere();

    const onPop = (e: PopStateEvent) => {
      if (conversationIdRef.current) {
        e.preventDefault?.();
        setShowEndConfirm(true);
        // ดันกลับมาเพื่อไม่ให้ออกจากเพจจนกว่าจะยืนยัน
        pushHere();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [conversationId]);

  // ---------- เปิด/ควบคุม WebSocket ----------
  useEffect(() => {
    if (loading || !authed) {
      d("skip WS (auth loading or not authed)", { loading, authed });
      return;
    }
    if (Date.now() < SUPPRESS_RECONNECT_UNTIL) {
      d("suppress reconnect window");
      return;
    }
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)
    ) {
      d("reuse WS", wsStateName(wsRef.current.readyState));
      return;
    }

    const token = getCookie("token");
    const url = `${WS_BASE}/ws${
      token ? `?token=${encodeURIComponent(token)}` : ""
    }`;
    d("create WS v", wsVersion, url);
    const ws = new WebSocket(url);
    window.__ws = ws;
    wsRef.current = ws;

    const onOpen = () => {
      if (wsRef.current !== ws) {
        d("OPEN from stale ws -> ignore");
        return;
      }
      setConnected(true);
      d("WS OPEN");
      // 🚫 ไม่ auto-queue ถ้าปิดไว้ (หลังจบห้อง)
      if (autoQueueEnabled && !conversationIdRef.current) {
        sendJoinSafe("open");
        setTimeout(() => sendJoinSafe("retry300ms"), 300);
      }
    };

    const onClose = (e: CloseEvent) => {
      if (wsRef.current !== ws) {
        d("CLOSE from stale ws -> ignore");
        return;
      }
      const reason = e.reason || "";
      const code = e.code;
      d("WS CLOSE", code, reason || "(no reason)");
      setConnected(false);
      setQueuing(false);
      wsRef.current = null;
      if (code === 4004 || /Reconnected|Replaced/i.test(reason)) {
        SUPPRESS_RECONNECT_UNTIL = Date.now() + 2000;
        d("suppress reconnect for 2s due to replacement");
        return;
      }
      setTimeout(() => setWsVersion((v) => v + 1), 600);
    };

    const onError = (e: Event) => {
      if (wsRef.current !== ws) return;
      d("WS ERROR", e);
    };

    const onMessage = (ev: MessageEvent) => {
      if (wsRef.current !== ws) {
        d("MESSAGE from stale ws -> ignore");
        return;
      }
      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (err) {
        d("PARSE ERROR", err, ev.data);
        return;
      }
      d("RECV", msg?.type, msg);

      switch (msg.type) {
        case "REPLACED":
          SUPPRESS_RECONNECT_UNTIL = Date.now() + 3000;
          d("REPLACED → suppress reconnect 3s");
          break;

        case "HELLO":
          setMyUid(msg.uid);
          break;

        case "QUEUED":
          setQueuing(true);
          break;

        case "MATCH_FOUND":
          setConversationId(msg.conversationId);
          setLastConversationId(msg.conversationId);
          setPeerId(null);
          setQueuing(false);
          setAutoQueueEnabled(true);

          // ✅ เคลียร์ข้อความเก่าแล้วค่อยใส่ system message
          setMessages([
            {
              id: crypto.randomUUID(),
              system: true,
              text: "ຈັບຄູ່ສຳເລັດ! ✨",
              time: Date.now(),
            },
          ]);
          break;

        case "MESSAGE_NEW": {
          const mine = msg.from === myUidRef.current;
          if (!mine && typeof msg.from === "number") setPeerId(msg.from);
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
          break;
        }

        case "CONVERSATION_ENDED":
        case "PARTNER_DISCONNECTED":
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              system: true,
              text: "ການສົນທະນາສິ້ນສຸດແລ້ວ",
              time: Date.now(),
            },
          ]);
          if (typeof msg.conversationId === "number")
            setLastConversationId(msg.conversationId);
          setConversationId(null);
          setQueuing(false);
          setAutoQueueEnabled(false); // 🔒 ปิดออโต้คิวหลังจบห้อง ต้องกดเอง
          if (!showReportRef.current) setShowReport(true);
          break;

        case "ERROR":
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              system: true,
              text: `ຂໍ້ຜິດພາດ: ${msg.message}`,
              time: Date.now(),
            },
          ]);
          break;

        default:
          d("UNKNOWN MESSAGE TYPE", msg);
      }
    };

    ws.addEventListener("open", onOpen);
    ws.addEventListener("close", onClose);
    ws.addEventListener("error", onError);
    ws.addEventListener("message", onMessage);

    return () => {
      d("cleanup WS");
      if (wsRef.current === ws) {
        try {
          ws.close();
        } catch {
          console.log("error closing ws");
        }
        wsRef.current = null;
      }
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("close", onClose);
      ws.removeEventListener("error", onError);
      ws.removeEventListener("message", onMessage);
    };
  }, [role, authed, loading, wsVersion, autoQueueEnabled]);

  // Heartbeat: ส่ง QUEUE_JOIN ซ้ำ ๆ เฉพาะตอน “ยอมให้ auto คิว” เท่านั้น
  useEffect(() => {
    if (!authed || !connected || conversationId || !autoQueueEnabled) return;
    const id = setInterval(() => sendJoinSafe("heartbeat"), 1500);
    return () => clearInterval(id);
  }, [authed, connected, conversationId, role, autoQueueEnabled]);

  // หลุดล็อกอินระหว่างใช้งาน → ปิด WS
  useEffect(() => {
    if (!authed && wsRef.current) {
      d("Auth lost → force close WS");
      try {
        wsRef.current.close(4000, "Auth required");
      } catch {
        console.log("error");
      }
      wsRef.current = null;
      setConnected(false);
      setConversationId(null);
      setQueuing(false);
      setAutoQueueEnabled(false);
    }
  }, [authed]);

  function handleSend() {
    if (!canSend || !wsRef.current || !conversationId) return;
    const payload = {
      type: "MESSAGE",
      conversationId: Number(conversationId),
      text: text.trim(),
    };
    wsRef.current.send(JSON.stringify(payload));
    d("SEND MESSAGE", payload);
    setText("");
  }

  function onClickEnd() {
    if (!conversationId) return;
    d("CLICK End → open confirm modal");
    setShowEndConfirm(true);
  }

  function confirmEndNow() {
    if (!wsRef.current || !conversationId) return;
    const cid = Number(conversationId);
    setLastConversationId(cid);

    // ✅ ปิดกล่องยืนยัน + เปิดหน้าประเมิน
    setShowEndConfirm(false);
    setShowReport(true);

    // ✅ ออกจากห้องทันที (optimistic)
    setConversationId(null);
    setQueuing(false);
    setAutoQueueEnabled(false);

    // ส่ง END ไป BE
    wsRef.current.send(JSON.stringify({ type: "END", conversationId: cid }));
    d("SEND END", { conversationId: cid });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ne = e.nativeEvent as KeyboardEvent; // DOM KeyboardEvent

    // กันกดระหว่าง IME กำลังประกอบอักษร (ไทย/ลาว/ญี่ปุ่น ฯลฯ)
    if (ne.isComposing || e.key === "Process" || ne.keyCode === 229) return;

    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();
      handleSend();
    }
  }

  const matched = !!conversationId;

  if (loading) return null;

  if (!authed) {
    const redirect = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    d("Not authed → show login card");
    return (
      <section className="min-h-[60vh] grid place-items-center p-6">
        <div className="max-w-md w-full rounded-2xl border bg-white p-6 text-center">
          <h2 className="text-xl font-bold mb-2">ຕ້ອງເຂົ້າລະບົບກ່ອນ</h2>
          <p className="text-slate-600 mb-5">
            ເພື່ອເລີ່ມຈັບຄູ່ສົນທະນາ โปรดเข้าสู่ระบบก่อนนะ
          </p>
          <Link
            to={`/login?redirect=${redirect}`}
            className="inline-block rounded-xl bg-primary text-white px-5 py-3 font-medium"
          >
            ເຂົ້າລະບົບ
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {matched ? (
        // ======= ห้องแชท =======
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

          {/* ✅ โซนข้อความ: ความสูงคงที่ + มีสกรอลล์ชัดเจน */}
          <div
            ref={listRef}
            className="h-[55vh] max-h-[65vh] overflow-y-auto scroll-smooth bg-neutral-50 rounded-2xl p-3 border border-neutral-200 space-y-3"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} msg={m} />
            ))}
          </div>

          {/* ✅ ช่องพิมพ์: textarea auto-resize + สกรอลล์เมื่อยาว */}
          <div className="bg-white rounded-2xl shadow p-3 border border-neutral-200">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none max-h-32 overflow-y-auto"
                placeholder="กด Enter เพื่อส่ง (Shift+Enter ขึ้นบรรทัดใหม่)"
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
                  onClick={onClickEnd}
                  disabled={!conversationId}
                  className="rounded-xl px-4 py-3 font-medium shadow disabled:opacity-40 disabled:cursor-not-allowed border"
                >
                  ຈົບການສົນທະນາ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ======= หน้ารอจับคู่ =======
        <MatchingScreen
          role={role}
          connected={connected}
          queuing={queuing}
          onRetry={() => {
            // ผู้ใช้กด “จับคู่ใหม่” เอง -> เปิด auto แล้วค่อย JOIN
            setAutoQueueEnabled(true);
            sendJoinSafe("retry-button");
          }}
          onCancel={() => {
            d("Click cancel matching");
            setAutoQueueEnabled(false); // ยกเลิกความตั้งใจจะเข้าคิว
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: "QUEUE_LEAVE" }));
              d("SEND QUEUE_LEAVE");
            }
            history.back();
          }}
        />
      )}

      {/* โมดัลยืนยันจบ */}
      <ConfirmEndModal
        open={showEndConfirm}
        onCancel={() => {
          d("Close confirm modal");
          setShowEndConfirm(false);
        }}
        onConfirm={confirmEndNow}
      />

      {/* โมดัลรายงาน/ให้คะแนน: ❌ ไม่ auto requeue แล้ว */}
      <ReportModal
        open={showReport}
        onClose={() => {
          d("Report modal closed");
          setShowReport(false);
          setAutoQueueEnabled(false); // อยู่หน้า “กดจับคู่ใหม่” อย่างเดียว
          setQueuing(false);
        }}
        conversationId={lastConversationId}
        reportedUserId={peerId ?? undefined}
      />
    </>
  );
}

function label(r: Role) {
  return r === "venter" ? "ຜູ້ລະບາຍ" : "ຜູ້ຮັບຟັງ";
}
