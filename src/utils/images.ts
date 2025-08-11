// utils/images.ts
// สร้างแผนที่ไฟล์รูป -> URL ที่ Vite แปลงให้
const CONTENT_IMAGES = import.meta.glob(
    "/src/assets/img/content/*.{png,jpg,jpeg,webp,svg}",
    { eager: true, import: "default" }
) as Record<string, string>;

export function resolveContentImage(input?: string) {
    if (!input) return "";
    const filename = input.split("/").pop()!;             // confiden1.jpg
    // หาไฟล์ที่ลงท้ายด้วยชื่อเดียวกัน
    const entry = Object.entries(CONTENT_IMAGES).find(([k]) => k.endsWith(filename));
    return entry?.[1] ?? "";  // ได้เป็น URL พร้อมใช้ใน <img src=...>
}
