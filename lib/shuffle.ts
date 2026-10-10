function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Counts mission openings in this browser tab; part of the shuffle seed, so the options come
// in a new order every time a mission is opened.
let openings = 0;
export const nextOpening = () => ++openings;

// A shuffle of option indexes that is fixed for a given seed. The caller mixes the device,
// the page load and the opening count into the seed, so nobody can learn "the answer is B".
export function optionOrder(missionId: string, count: number, seed: number) {
  const order = Array.from({ length: count }, (_, i) => i);
  if (!seed) return order;
  let s = (hash(missionId) + seed) >>> 0;
  const random = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
