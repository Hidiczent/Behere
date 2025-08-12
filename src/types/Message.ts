// src/types/Message.ts
export type Role = "venter" | "listener";

export type Message = {
    id: string;
    text: string;
    time: number;       // epoch ms
    // เพิ่มทางเลือกสำหรับ UI
    role?: Role;        // บอกบทบาทของเจ้าของข้อความ (optional สำหรับ system)
    mine?: boolean;     // ข้อความของฉันเองไหม (ใช้จัดชิดขวา)
    system?: boolean;   // เป็นข้อความระบบไหม (กลาง/สีเทา)
};
