// src/lib/ws-singleton.ts
let wsSingleton: WebSocket | null = null;

export function getChatWS(url: string) {
    if (wsSingleton && (wsSingleton.readyState === WebSocket.OPEN || wsSingleton.readyState === WebSocket.CONNECTING)) {
        return wsSingleton;
    }
    wsSingleton = new WebSocket(url);
    wsSingleton.addEventListener("close", () => {
        // ปล่อยให้สร้างใหม่รอบหน้า
        wsSingleton = null;
    });
    return wsSingleton;
}
