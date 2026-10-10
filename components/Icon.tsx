// A cog with eight flat teeth and a hole, computed so the teeth are evenly spaced.
const GEAR = (() => {
  const at = (radius: number, degrees: number) => {
    const a = (degrees * Math.PI) / 180;
    return `${(12 + radius * Math.cos(a)).toFixed(2)} ${(12 + radius * Math.sin(a)).toFixed(2)}`;
  };
  let d = "";
  for (let tooth = 0; tooth < 8; tooth++) {
    const a = tooth * 45;
    d += `${tooth ? "L" : "M"}${at(7.2, a - 14)}L${at(10, a - 8)}L${at(10, a + 8)}L${at(7.2, a + 14)}`;
  }
  return `${d}zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z`;
})();

// One small set of line icons, shared by avatars, achievements and the header.
const PATHS = {
  bolt: "M13 2 5 14h6l-1 8 8-12h-6z",
  led: "M8 11a4 4 0 0 1 8 0v4H8zM10 15v6M14 15v6",
  chip: "M7 7h10v10H7zM4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3",
  robot: "M7 9h10v9H7zM12 5v4M9.5 13h.01M14.5 13h.01M4 13v3M20 13v3M10 16h4",
  wave: "M3 12h3l2-6 4 12 3-9 2 3h4",
  battery: "M4 8h14v8H4zM18 11h2v2h-2zM8 12h4M10 10v4",
  resistor: "M2 12h4l1.5-4 3 8 3-8 3 8L18 12h4",
  wrench:
    "M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 3-3-3 3-3a5 5 0 0 0-2-2z",
  book: "M12 7a2 2 0 0 0-2-2H4v13h6a2 2 0 0 1 2 2 2 2 0 0 1 2-2h6V5h-6a2 2 0 0 0-2 2zM12 7v13",
  eye: "M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2",
  flag: "M6 21V4M6 5h11l-2 4 2 4H6",
  question: "M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.4M12 18h.01",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  repeat: "M4 11a8 8 0 0 1 14-4l2 2M20 5v4h-4M20 13a8 8 0 0 1-14 4l-2-2M4 19v-4h4",
  check: "m5 12 5 5 9-10",
  gear: GEAR,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export const AVATAR_ICONS: IconName[] = [
  "bolt",
  "led",
  "chip",
  "robot",
  "wave",
  "battery",
  "resistor",
  "wrench",
];

export const AVATAR_COLORS: Record<string, string> = {
  orange: "#e8590c",
  blue: "#1d6fd1",
  green: "#15803d",
  violet: "#7c3aed",
  red: "#c62828",
  teal: "#0e7490",
};

export function Avatar({ color, icon, size = 40 }: { color: string; icon: string; size?: number }) {
  const name = (AVATAR_ICONS as string[]).includes(icon) ? (icon as IconName) : "bolt";
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-edge text-white"
      style={{
        width: size,
        height: size,
        background: AVATAR_COLORS[color] ?? AVATAR_COLORS.orange,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.55)} />
    </span>
  );
}
