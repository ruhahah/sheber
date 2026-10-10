import type { Board } from "@/lib/missions";

const PITCH = 26;
const X0 = 46;
const RAIL_Y = { "+": 46, "-": 70 };
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
// Rows a-e sit above the middle gap, f-j below it.
const letterY = (letter: string) => {
  const i = LETTERS.indexOf(letter);
  return 112 + i * PITCH + (i >= 5 ? 20 : 0);
};
const rowX = (row: number) => X0 + (row - 1) * PITCH;
const HEIGHT = letterY("j") + 30;
const LEAD_COLOR: Record<string, string> = { GND: "var(--gnd)", "5V": "var(--bad)" };

type Point = { x: number; y: number };

function at(hole: string): Point {
  const rail = hole.match(/^([+-])(\d+)$/);
  if (rail) return { x: rowX(Number(rail[2])), y: RAIL_Y[rail[1] as "+" | "-"] };
  const m = hole.match(/^(\d+)([a-j])$/);
  if (!m) throw new Error(`Breadboard: bad hole "${hole}"`);
  return { x: rowX(Number(m[1])), y: letterY(m[2]) };
}

// A breadboard from above with the parts pushed into it. The strips of metal under the
// holes are drawn faintly, as if the board were slightly see-through.
export function Breadboard({
  board,
  highlight,
  label,
}: {
  board: Board;
  // Holes to ring in red once the fault has been revealed.
  highlight?: string[];
  label: string;
}) {
  const width = rowX(board.rows) + X0;
  const rows = Array.from({ length: board.rows }, (_, i) => i + 1);
  const split = board.railSplitAfter;
  const railSegments = split
    ? [
        [1, split],
        [split + 1, board.rows],
      ]
    : [[1, board.rows]];
  const used = new Set(
    board.items.flatMap((item) =>
      item.kind === "lead"
        ? [item.at]
        : item.kind === "led"
          ? [item.long, item.short]
          : [item.from, item.to],
    ),
  );
  const ink = "var(--ink)";

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      className="block w-full text-[10px]"
      style={{ minWidth: Math.min(width, 400), maxWidth: width * 1.4 }}
      role="img"
      aria-label={label}
    >
      <rect
        x={14}
        y={32}
        width={width - 28}
        height={HEIGHT - 44}
        rx={10}
        fill="var(--sunken)"
        stroke="var(--line)"
        strokeWidth={1.5}
      />

      {(["+", "-"] as const).map((sign) => {
        const color = sign === "+" ? "var(--bad)" : "var(--gnd)";
        const y = RAIL_Y[sign];
        const printed = sign === "+" ? y - 11 : y + 11;
        return (
          <g key={sign}>
            <text x={24} y={y + 4} textAnchor="middle" fill={color} className="font-mono text-[12px]">
              {sign === "+" ? "+" : "−"}
            </text>
            {railSegments.map(([from, to]) => (
              <g key={from}>
                <rect
                  x={rowX(from) - 8}
                  y={y - 6}
                  width={rowX(to) - rowX(from) + 16}
                  height={12}
                  rx={6}
                  fill="var(--line)"
                  opacity={0.6}
                />
                <path
                  d={`M${rowX(from) - 8} ${printed}H${rowX(to) + 8}`}
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </g>
            ))}
            {rows.map((row) => (
              <circle key={row} cx={rowX(row)} cy={y} r={3} fill={ink} opacity={0.35} />
            ))}
          </g>
        );
      })}

      {rows.map((row) => (
        <g key={row}>
          <text x={rowX(row)} y={97} textAnchor="middle" fill="var(--mute)" className="font-mono text-[8px]">
            {row}
          </text>
          {["a", "f"].map((first) => (
            <rect
              key={first}
              x={rowX(row) - 6}
              y={letterY(first) - 8}
              width={12}
              height={4 * PITCH + 16}
              rx={6}
              fill="var(--line)"
              opacity={0.6}
            />
          ))}
          {LETTERS.map((letter) => (
            <circle key={letter} cx={rowX(row)} cy={letterY(letter)} r={3} fill={ink} opacity={0.35} />
          ))}
        </g>
      ))}
      {LETTERS.map((letter) => (
        <text
          key={letter}
          x={24}
          y={letterY(letter) + 3}
          textAnchor="middle"
          fill="var(--mute)"
          className="font-mono text-[8px]"
        >
          {letter}
        </text>
      ))}

      {board.items.map((item, i) => {
        if (item.kind === "lead") {
          const p = at(item.at);
          const color = LEAD_COLOR[item.label] ?? "var(--wire-1)";
          return (
            <g key={i}>
              <path d={`M${p.x} ${p.y}V26`} stroke="var(--sunken)" strokeWidth={7} />
              <path d={`M${p.x} ${p.y}V26`} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
              <rect
                x={p.x - 22}
                y={5}
                width={44}
                height={20}
                rx={6}
                fill="var(--panel)"
                stroke={color}
                strokeWidth={1.5}
              />
              <text x={p.x} y={19} textAnchor="middle" fill={ink} className="font-mono">
                {item.label}
              </text>
            </g>
          );
        }

        if (item.kind === "wire") {
          const a = at(item.from);
          const b = at(item.to);
          // Bow the wire sideways a little so it reads as a wire, not a printed line.
          const bend = { x: (a.x + b.x) / 2 + (a.x === b.x ? 12 : 0), y: (a.y + b.y) / 2 - (a.y === b.y ? 12 : 0) };
          const d = `M${a.x} ${a.y}Q${bend.x} ${bend.y} ${b.x} ${b.y}`;
          return (
            <g key={i} fill="none" strokeLinecap="round">
              <path d={d} stroke="var(--sunken)" strokeWidth={7} />
              <path d={d} stroke="var(--wire-2)" strokeWidth={3.5} />
            </g>
          );
        }

        const a = at(item.kind === "led" ? item.long : item.from);
        const b = at(item.kind === "led" ? item.short : item.to);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

        return (
          <g key={i}>
            <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={ink} strokeWidth={2} strokeLinecap="round" />
            {item.kind === "resistor" ? (
              <>
                <rect
                  x={-16}
                  y={-6}
                  width={32}
                  height={12}
                  rx={3}
                  fill="var(--panel)"
                  stroke={ink}
                  strokeWidth={1.8}
                  transform={`translate(${mid.x} ${mid.y}) rotate(${angle})`}
                />
                <text x={mid.x} y={mid.y - 11} textAnchor="middle" fill="var(--mute)">
                  {item.label}
                </text>
              </>
            ) : (
              <>
                <circle cx={mid.x} cy={mid.y} r={9} fill="var(--bad)" stroke={ink} strokeWidth={1.8} />
                <text x={a.x - 9} y={a.y - 6} textAnchor="middle" fill={ink} className="text-[12px] font-bold">
                  +
                </text>
              </>
            )}
          </g>
        );
      })}

      {[...used].map((hole) => {
        const p = at(hole);
        return <circle key={hole} cx={p.x} cy={p.y} r={3.5} fill={ink} />;
      })}

      <g className="fault-ring" fill="none" stroke="var(--bad)" strokeWidth={2.5}>
        {highlight?.map((hole) => {
          const p = at(hole);
          return <circle key={hole} cx={p.x} cy={p.y} r={10} strokeDasharray="6 4" />;
        })}
      </g>
    </svg>
  );
}
