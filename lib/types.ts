// Shared types and the few constants every page needs. This file stays tiny on purpose:
// browser code imports from here, so that the big mission and lesson catalogs
// (lib/missions.ts, lib/lessons.ts) are never bundled into the pages.

export const LANGS = ["en", "kk", "ru"] as const;
export type Lang = (typeof LANGS)[number];
export type Text = Record<Lang, string>;
export type FaultType = "component" | "code" | "wiring" | "limits" | "power";

// Two-terminal parts have terminals "a" (left) and "b" (right); x, y is terminal "a".
// Chips have named pins on their left and right edges; x, y is the top-left corner.
export type Part =
  | { id: string; kind: "resistor"; label: string; x: number; y: number }
  | { id: string; kind: "led"; x: number; y: number; flip?: boolean; tint?: "blue" }
  | { id: string; kind: "button" | "motor" | "wire" | "buzzer"; x: number; y: number }
  // The triangle points at the striped end; flip turns the stripe toward terminal "a".
  | { id: string; kind: "diode"; x: number; y: number; flip?: boolean }
  | {
      id: string;
      kind: "chip";
      title: Text;
      x: number;
      y: number;
      left?: string[];
      right?: string[];
    };

// Wire ends are "part.terminal" (the board is "uno"), or the rails "5V" / "GND".
// With no pins the board is not drawn: the circuit is just a battery and parts.
export type Diagram = {
  pins: string[];
  parts: Part[];
  wires: [string, string][];
  railLabels?: [top: string, bottom: string];
};

// A breadboard seen from above. A hole is "<row><letter>" such as "7c" (numbered rows of
// five, letters a-e above the middle gap and f-j below), or "+<row>" / "-<row>" on the
// two power rails.
export type BoardItem =
  | { kind: "resistor"; from: string; to: string; label: string }
  | { kind: "led"; long: string; short: string }
  | { kind: "wire"; from: string; to: string }
  // A wire that leaves the board for the Arduino; the label says where it goes.
  | { kind: "lead"; at: string; label: string };

export type Board = {
  rows: number;
  // The power rails are cut after this row, as on many real boards.
  railSplitAfter?: number;
  items: BoardItem[];
};

export type Mission = {
  id: string;
  // The 1-based number of the mission's group in the play order.
  level: number;
  lesson: string;
  title: Text;
  primer: Text;
  goal: Text;
  diagram: Diagram;
  // How the circuit was actually built, when the fault is in the build and not the plan.
  board?: Board;
  wiring: { from: Text; to: Text }[];
  code: string;
  symptom: Text;
  options: Text[];
  answer: number;
  faultType: FaultType;
  explanation: Text;
};

export type Lesson = {
  slug: string;
  title: Text;
  summary: Text;
  body: Text[];
  rule: Text;
};

// Diagram parts and terminals, breadboard holes, and 1-based code lines, where the fault lives.
export type Highlight = {
  parts?: string[];
  terminals?: string[];
  lines?: number[];
  holes?: string[];
};

export type Source = { label: string; url: string };

// What lists, progress bars and statistics need to know about a mission or a lesson: a few
// short fields instead of the whole thing. The server sends this index to every page once.
export type MissionInfo = Pick<Mission, "id" | "level" | "lesson" | "faultType" | "title">;
export type LessonInfo = Pick<Lesson, "slug" | "title" | "summary">;
export type Catalog = { missions: MissionInfo[]; lessons: LessonInfo[] };
