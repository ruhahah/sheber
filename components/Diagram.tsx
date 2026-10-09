import type { Diagram as DiagramData, Lang, Part } from "@/lib/missions";
import { ui } from "@/lib/ui";

const UNO = { x: 20, y: 50, w: 110 };
const PIN_Y0 = 90;
const PIN_PITCH = 52;
const LEN = 90;
const CHIP = { w: 110, head: 26, pitch: 26 };
const STUB = 16;
const LANE_X0 = 164;
const LANE_STEP = 14;
const PWM_PINS = new Set(["3", "5", "6", "9", "10", "11"]);
const SIGNAL_COLORS = ["var(--wire-1)", "var(--wire-2)", "var(--wire-3)", "var(--wire-4)"];
const RAIL_COLOR = { "5V": "var(--bad)", GND: "var(--gnd)" };

type Rail = "5V" | "GND";
type Pt = { x: number; y: number; dir: 1 | -1 };
type Wire = { d: string; color: string };

const isRail = (ref: string): ref is Rail => ref === "5V" || ref === "GND";
const chipPinY = (p: Part, i: number) => p.y + CHIP.head + 14 + i * CHIP.pitch;

function layout({ pins, parts, wires }: DiagramData) {
  const unoBottom = pins.length ? PIN_Y0 + (pins.length - 1) * PIN_PITCH + 26 : 0;
  const partsBottom = Math.max(
    ...parts.map((p) =>
      p.kind === "chip"
        ? p.y + CHIP.head + Math.max(p.left?.length ?? 0, p.right?.length ?? 0) * CHIP.pitch + 10
        : p.y + 30,
    ),
  );
  const height = Math.max(unoBottom, partsBottom) + 44;
  const railY = { "5V": 22, GND: height - 18 };

  const terminals = new Map<string, Pt>();
  pins.forEach((name, i) =>
    terminals.set(`uno.${name}`, { x: UNO.x + UNO.w, y: PIN_Y0 + i * PIN_PITCH, dir: 1 }),
  );
  for (const p of parts) {
    if (p.kind === "chip") {
      p.left?.forEach((name, i) =>
        terminals.set(`${p.id}.${name}`, { x: p.x, y: chipPinY(p, i), dir: -1 }),
      );
      p.right?.forEach((name, i) =>
        terminals.set(`${p.id}.${name}`, { x: p.x + CHIP.w, y: chipPinY(p, i), dir: 1 }),
      );
    } else {
      terminals.set(`${p.id}.a`, { x: p.x, y: p.y, dir: -1 });
      terminals.set(`${p.id}.b`, { x: p.x + LEN, y: p.y, dir: 1 });
    }
  }
  const at = (ref: string) => {
    const pt = terminals.get(ref);
    if (!pt) throw new Error(`Diagram: unknown terminal "${ref}"`);
    return pt;
  };

  const connected = new Set<string>();
  const railXs: Record<Rail, number[]> = { "5V": [], GND: [] };
  const drawn: Wire[] = [];
  let signals = 0;
  let lanes = 0;

  for (let [a, b] of wires) {
    // Normalise so a rail is always the second end and the board the first.
    if (isRail(a) || (b.startsWith("uno.") && !isRail(a) && !a.startsWith("uno."))) {
      [a, b] = [b, a];
    }
    const p = at(a);
    connected.add(a);

    if (isRail(b)) {
      const x = p.x + p.dir * STUB;
      railXs[b].push(x);
      drawn.push({ d: `M${p.x} ${p.y}H${x}V${railY[b]}`, color: RAIL_COLOR[b] });
      continue;
    }

    const q = at(b);
    connected.add(b);
    const fromUno = a.startsWith("uno.");
    const color = fromUno ? SIGNAL_COLORS[signals++ % SIGNAL_COLORS.length] : "var(--ink)";
    if (p.y === q.y) {
      drawn.push({ d: `M${p.x} ${p.y}H${q.x}`, color });
    } else {
      const midX = fromUno ? LANE_X0 + LANE_STEP * lanes++ : (p.x + q.x) / 2;
      drawn.push({ d: `M${p.x} ${p.y}H${midX}V${q.y}H${q.x}`, color });
    }
  }

  const rails = (["5V", "GND"] as const)
    .filter((r) => railXs[r].length > 0)
    .map((r) => ({
      name: r,
      y: railY[r],
      x1: Math.min(...railXs[r]),
      x2: Math.max(...railXs[r]),
      joints: railXs[r],
    }));

  // Crop the drawing to its content so it stays as large as possible on a phone.
  const contentRight = Math.max(
    UNO.x + UNO.w,
    ...parts.map((p) => (p.kind === "chip" ? p.x + CHIP.w : p.x + LEN + 6)),
    ...rails.map((r) => r.x2 + 44),
  );
  const width = Math.max(contentRight + 16, 420);

  return { width, height, terminals, connected, drawn, rails };
}

function partBox(p: Part) {
  if (p.kind === "chip") {
    const rows = Math.max(p.left?.length ?? 0, p.right?.length ?? 0);
    return { x: p.x - 7, y: p.y - 7, w: CHIP.w + 14, h: CHIP.head + rows * CHIP.pitch + 24 };
  }
  return { x: p.x - 9, y: p.y - 32, w: LEN + 18, h: 62 };
}

export function Diagram({
  diagram,
  lang,
  highlight,
  description,
}: {
  diagram: DiagramData;
  lang: Lang;
  // Parts and terminals to ring in red once the fault has been revealed.
  highlight?: { parts?: string[]; terminals?: string[] };
  // The connections in words, for people who cannot see the drawing.
  description?: string;
}) {
  const t = ui[lang];
  const { width, height, terminals, connected, drawn, rails } = layout(diagram);
  const unoHeight = (diagram.pins.length - 1) * PIN_PITCH + 66;
  const hasBoard = diagram.pins.length > 0;
  const [topLabel, bottomLabel] = diagram.railLabels ?? ["5V", "GND"];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full text-[11px]"
      style={{ minWidth: Math.min(width, 440), maxWidth: width * 1.35 }}
      role="img"
      aria-label={description ? `${t.circuit}: ${description}` : t.circuit}
    >
      {rails.map((r) => (
        <g key={r.name}>
          <line
            x1={r.x1}
            y1={r.y}
            x2={r.x2}
            y2={r.y}
            stroke={RAIL_COLOR[r.name]}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <text x={r.x2 + 10} y={r.y + 4} fill={RAIL_COLOR[r.name]} className="font-mono">
            {r.name === "5V" ? topLabel : bottomLabel}
          </text>
          {r.joints.map((x, i) => (
            <circle key={i} cx={x} cy={r.y} r={3} fill={RAIL_COLOR[r.name]} />
          ))}
        </g>
      ))}

      {drawn.map((w, i) => (
        <g key={i} fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={w.d} stroke="var(--panel)" strokeWidth={7} />
          <path d={w.d} stroke={w.color} strokeWidth={2.5} />
        </g>
      ))}

      {hasBoard && (
        <>
          <rect
            x={UNO.x}
            y={UNO.y}
            width={UNO.w}
            height={unoHeight}
            rx={8}
            fill="var(--sunken)"
            stroke="var(--line)"
            strokeWidth={1.5}
          />
          <text x={UNO.x + 12} y={UNO.y + 20} fill="var(--mute)">
            Arduino Uno
          </text>
        </>
      )}
      {diagram.pins.map((name, i) => (
        <text
          key={name}
          x={UNO.x + UNO.w - 12}
          y={PIN_Y0 + i * PIN_PITCH + 4}
          textAnchor="end"
          fill="var(--ink)"
          className="font-mono text-[12px]"
        >
          {PWM_PINS.has(name) ? `~${name}` : name}
        </text>
      ))}

      {diagram.parts.map((p) => (
        <PartGlyph key={p.id} part={p} lang={lang} />
      ))}

      {[...terminals].map(([ref, pt]) => (
        <circle
          key={ref}
          cx={pt.x}
          cy={pt.y}
          r={3.5}
          fill={connected.has(ref) ? "var(--ink)" : "var(--panel)"}
          stroke={connected.has(ref) ? "var(--ink)" : "var(--mute)"}
          strokeWidth={1.5}
        />
      ))}

      <g className="fault-ring" fill="none" stroke="var(--bad)" strokeWidth={2.5}>
        {diagram.parts
          .filter((p) => highlight?.parts?.includes(p.id))
          .map((p) => {
            const box = partBox(p);
            return (
              <rect
                key={p.id}
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={10}
                strokeDasharray="7 5"
              />
            );
          })}
        {highlight?.terminals?.map((ref) => {
          const pt = terminals.get(ref);
          return pt && <circle key={ref} cx={pt.x} cy={pt.y} r={11} />;
        })}
      </g>
    </svg>
  );
}

function PartGlyph({ part: p, lang }: { part: Part; lang: Lang }) {
  const t = ui[lang];
  const ink = "var(--ink)";
  const mute = "var(--mute)";

  if (p.kind === "chip") {
    const rows = Math.max(p.left?.length ?? 0, p.right?.length ?? 0);
    return (
      <g>
        <rect
          x={p.x}
          y={p.y}
          width={CHIP.w}
          height={CHIP.head + rows * CHIP.pitch + 10}
          rx={6}
          fill="var(--sunken)"
          stroke="var(--line)"
          strokeWidth={1.5}
        />
        <text x={p.x + CHIP.w / 2} y={p.y + 18} textAnchor="middle" fill={mute}>
          {p.title[lang]}
        </text>
        {p.left?.map((name, i) => (
          <text key={name} x={p.x + 10} y={chipPinY(p, i) + 4} fill={ink} className="font-mono">
            {name}
          </text>
        ))}
        {p.right?.map((name, i) => (
          <text
            key={name}
            x={p.x + CHIP.w - 10}
            y={chipPinY(p, i) + 4}
            textAnchor="end"
            fill={ink}
            className="font-mono"
          >
            {name}
          </text>
        ))}
      </g>
    );
  }

  const cx = p.x + LEN / 2;
  const lead = (half: number) => (
    <path
      d={`M${p.x} ${p.y}H${cx - half}M${cx + half} ${p.y}H${p.x + LEN}`}
      stroke={ink}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  );
  const label = (text: string, dy: number) => (
    <text x={cx} y={p.y + dy} textAnchor="middle" fill={mute}>
      {text}
    </text>
  );

  if (p.kind === "resistor") {
    return (
      <g>
        {lead(22)}
        <rect
          x={cx - 22}
          y={p.y - 8}
          width={44}
          height={16}
          rx={3}
          fill="var(--panel)"
          stroke={ink}
          strokeWidth={2}
        />
        {label(p.label, -16)}
      </g>
    );
  }

  if (p.kind === "led") {
    // The triangle points from the long leg (anode) to the short leg (cathode).
    const s = p.flip ? -1 : 1;
    return (
      <g>
        {lead(9)}
        <polygon
          points={`${cx - 9 * s},${p.y - 9} ${cx - 9 * s},${p.y + 9} ${cx + 9 * s},${p.y}`}
          fill={p.tint === "blue" ? "var(--wire-3)" : "var(--bad)"}
          stroke={ink}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path d={`M${cx + 9 * s} ${p.y - 9}V${p.y + 9}`} stroke={ink} strokeWidth={2.5} />
        {label(t.led, -18)}
        <text x={p.x - 4} y={p.y + 24} fill={mute}>
          {p.flip ? t.legShort : t.legLong}
        </text>
        <text x={p.x + LEN + 4} y={p.y + 24} textAnchor="end" fill={mute}>
          {p.flip ? t.legLong : t.legShort}
        </text>
      </g>
    );
  }

  if (p.kind === "wire") {
    return (
      <g>
        <path d={`M${p.x} ${p.y}H${p.x + LEN}`} stroke={ink} strokeWidth={2.5} />
        {label(t.wire, -12)}
      </g>
    );
  }

  if (p.kind === "button") {
    return (
      <g>
        {lead(14)}
        <path
          d={`M${cx - 16} ${p.y - 9}H${cx + 16}M${cx} ${p.y - 9}V${p.y - 15}`}
          stroke={ink}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx - 14} cy={p.y} r={3} fill={ink} />
        <circle cx={cx + 14} cy={p.y} r={3} fill={ink} />
        {label(t.button, -22)}
      </g>
    );
  }

  return (
    <g>
      {lead(16)}
      <circle cx={cx} cy={p.y} r={16} fill="var(--panel)" stroke={ink} strokeWidth={2} />
      <text x={cx} y={p.y + 4} textAnchor="middle" fill={ink} className="font-mono text-[12px]">
        M
      </text>
      {label(t.motor, -24)}
    </g>
  );
}
