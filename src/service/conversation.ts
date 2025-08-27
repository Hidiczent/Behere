// src/service/conversation.ts
import { api } from "./api";

// ให้คะแนน
export async function submitRating(
    conversationId: number,
    partnerId: number,
    rating: number,
    feedback?: string
) {
    console.log("DEBUG rating payload:", { conversationId, partnerId, rating, feedback });

    const res = await api.post(
        "/ratings",
        { conversationId, partnerId, rating, feedback },
        { withCredentials: true } // ใส่ไว้เผื่อ instance ไม่ได้เปิด global
    );
    return res.data;
}

// รายงาน
export async function submitReport(
    conversationId: number,
    reportedUserId: number,
    reason: "spam" | "harassment" | "other",
    detail?: string
) {
    const res = await api.post(
        "/reports",
        { conversationId, reportedUserId, reason, detail },
        { withCredentials: true } // <-- config ต้องมาเป็นอาร์กิวเมนต์ที่ 3
    );
    return res.data;
}
