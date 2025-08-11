// src/assets/images.ts
const raw = import.meta.glob("/src/assets/img/*.{jpg,jpeg,png,webp,avif}", {
    eager: true,
    as: "url",
});
export const images = Object.fromEntries(
    Object.entries(raw).map(([path, url]) => [path.split("/").pop()!, url as string])
) as Record<string, string>;
// ใช้: images["banner.jpg"], images["pexels-photo-404....jpg"] ฯลฯ
