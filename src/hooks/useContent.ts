import { useEffect, useState } from "react";
import type { ContentDoc } from ".././types/content";

export const useContent = (file: string = "content.json") => {
    const [data, setData] = useState<ContentDoc | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/data/${file}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = (await res.json()) as ContentDoc;
                if (!cancelled) setData(json);
            } catch (e) {
                if (!cancelled) setError(e as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [file]);

    return { data, loading, error };
};

// ปรับ path รูปจาก "@assets/..." หรือ "assets/..." ให้ใช้ได้กับ public
export const imgPath = (p?: string): string =>
    !p ? "" : p.startsWith("/assets") ? p : "/" + p.replace(/^@?\/?assets/, "assets");
