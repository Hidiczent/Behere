export function shuffle<T>(arr: T[], seed?: number): T[] {
  // Fisher–Yates; seed optionalเพื่อให้ deterministic ได้ถ้าต้องการ
  const a = arr.slice();
  let s = seed ?? Math.floor(Math.random() * 1e9);
  const rand = () => {
    // xorshift32 แบบง่าย ๆ
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    const r = (s >>> 0) / 0xffffffff;
    return r;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
