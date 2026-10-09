// Hero illustration: a board, an LED, and a wire with a break that the LED keeps flickering on.
export function BrokenCircuit() {
  const ink = "var(--ink)";
  return (
    <svg viewBox="0 0 300 150" className="block w-full" aria-hidden="true">
      <rect
        x="12"
        y="34"
        width="74"
        height="84"
        rx="8"
        fill="var(--sunken)"
        stroke={ink}
        strokeWidth="2"
      />
      <rect x="24" y="48" width="30" height="20" rx="3" fill="none" stroke={ink} strokeWidth="2" />
      <path d="M24 84H74M24 96H62" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <circle cx="86" cy="56" r="4" fill={ink} />
      <circle cx="86" cy="104" r="4" fill={ink} />

      <path
        d="M86 56H142M176 56H214"
        fill="none"
        stroke="var(--wire-1)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M246 56H276V104H86"
        fill="none"
        stroke="var(--gnd)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g className="spark" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        <path d="M152 44l4 8M166 44l-4 8M152 68l4-8M166 68l-4-8" />
      </g>
      <circle
        cx="159"
        cy="56"
        r="24"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeDasharray="5 6"
      />
      <path d="M176 73l14 14" stroke={ink} strokeWidth="5" strokeLinecap="round" />

      <circle cx="230" cy="56" r="26" fill="var(--bad)" opacity="0.15" className="flicker" />
      <circle
        cx="230"
        cy="56"
        r="15"
        fill="var(--bad)"
        stroke={ink}
        strokeWidth="2"
        className="flicker"
      />
      <circle cx="230" cy="56" r="15" fill="none" stroke={ink} strokeWidth="2" />
    </svg>
  );
}
