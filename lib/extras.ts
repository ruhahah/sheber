// Per-mission extras that sit on top of the mission catalog: what to light up once the
// answer is revealed, where to read more, and which missions make up the short demo.

import { closedLoopExample, missions, type Diagram } from "./missions";

export type Highlight = { parts?: string[]; terminals?: string[]; lines?: number[] };

// Diagram parts and terminals, and 1-based code lines, where the fault lives.
export const highlights: Record<string, Highlight> = {
  "open-loop": { terminals: ["d1.b", "bat.−"] },
  "short-wire": { parts: ["j1"] },
  "low-voltage": { parts: ["bat"] },
  "no-resistor-9v": { parts: ["bat", "d1"] },
  "wrong-pin": { terminals: ["uno.9"], lines: [2, 6, 8] },
  "no-ground": { terminals: ["d1.b", "uno.GND"] },
  "missing-semicolon": { lines: [6] },
  "setup-once": { lines: [3, 4, 5, 6] },
  "no-second-delay": { lines: [8] },
  "led-backwards": { parts: ["d1"] },
  "missing-pinmode": { lines: [1, 2] },
  "resistor-too-large": { parts: ["r1"] },
  "floating-button": { terminals: ["uno.2"] },
  "pullup-inverted": { lines: [7] },
  "no-pwm-pin": { terminals: ["uno.7"], lines: [7] },
  "leds-in-series": { parts: ["d1", "d2"] },
  "pot-no-5v": { terminals: ["pot.1", "uno.5V"] },
  "digital-read-analog": { lines: [6] },
  "analogwrite-overflow": { lines: [7] },
  "ldr-no-divider": { terminals: ["uno.GND"] },
  "baud-mismatch": { lines: [2] },
  "sonar-swapped": { terminals: ["hc.Trig", "hc.Echo"], lines: [1, 2] },
  "i2c-swapped": { terminals: ["lcd.SCL", "lcd.SDA"] },
  "button-short": { terminals: ["sw.a"] },
  "motor-on-pin": { parts: ["m1"] },
  "servo-brownout": { terminals: ["servo.V+", "uno.5V"] },
  "no-common-ground": { terminals: ["uno.GND", "bat.−"] },
  "delay-blocks": { lines: [16, 18] },
  "millis-int": { lines: [1] },
  "assign-in-if": { lines: [14] },
  "int-division": { lines: [7] },
  "button-bounce": { parts: ["sw"] },
  "serial-pins": { terminals: ["uno.0", "uno.1"] },
};

const DOCS = "https://docs.arduino.cc";
const ref = (label: string, path: string) => ({ label, url: `${DOCS}${path}` });
const blink = ref("Blink", "/built-in-examples/basics/Blink/");
const sketches = ref("Sketches", "/learn/programming/sketches/");
const digitalPins = ref("Digital pins", "/learn/microcontrollers/digital-pins/");
const analogInput = ref("Analog input", "/learn/microcontrollers/analog-input/");
const analogWrite = ref("analogWrite()", "/language-reference/en/functions/analog-io/analogWrite/");
const servo = ref("Servo motors", "/learn/electronics/servo-motors/");

// Official Arduino documentation pages that back each mission (every link was checked).
export const sources: Record<string, { label: string; url: string }> = {
  "no-resistor-9v": blink,
  "wrong-pin": blink,
  "no-ground": blink,
  "missing-semicolon": sketches,
  "setup-once": sketches,
  "no-second-delay": ref("delay()", "/language-reference/en/functions/time/delay/"),
  "led-backwards": blink,
  "missing-pinmode": ref("pinMode()", "/language-reference/en/functions/digital-io/pinMode/"),
  "resistor-too-large": blink,
  "floating-button": digitalPins,
  "pullup-inverted": digitalPins,
  "no-pwm-pin": analogWrite,
  "pot-no-5v": analogInput,
  "digital-read-analog": ref(
    "analogRead()",
    "/language-reference/en/functions/analog-io/analogRead/",
  ),
  "analogwrite-overflow": analogWrite,
  "ldr-no-divider": analogInput,
  "baud-mismatch": ref("Serial", "/language-reference/en/functions/communication/serial/"),
  "sonar-swapped": ref("pulseIn()", "/language-reference/en/functions/advanced-io/pulseIn/"),
  "i2c-swapped": ref("Wire (I2C)", "/language-reference/en/functions/communication/wire/"),
  "button-short": digitalPins,
  "motor-on-pin": ref("Transistor motor control", "/learn/electronics/transistor-motor-control/"),
  "servo-brownout": servo,
  "no-common-ground": servo,
  "delay-blocks": ref("Blink Without Delay", "/built-in-examples/digital/BlinkWithoutDelay/"),
  "millis-int": ref("millis()", "/language-reference/en/functions/time/millis/"),
  "assign-in-if": ref("Language reference", "/language-reference/"),
  "int-division": ref("int", "/language-reference/en/variables/data-types/int/"),
  "button-bounce": ref("Debounce", "/built-in-examples/digital/Debounce/"),
  "serial-pins": ref("UNO R3", "/hardware/uno-rev3/"),
};

// Missions whose symptom was reproduced on a physical board. Add an id only after doing so.
export const verifiedOnHardware = new Set<string>([]);

// The three-minute tour: no board, first board mission, then one with a surprise.
export const DEMO = ["open-loop", "wrong-pin", "floating-button"];

// Lessons that show a circuit: lesson slug -> mission whose (correctly wired) diagram
// illustrates it. "reading-diagrams" deliberately shows one with unconnected contacts.
const lessonFigures: Record<string, string> = {
  "reading-diagrams": "pot-no-5v",
  "led-resistor": "missing-pinmode",
  buttons: "pullup-inverted",
  sensors: "baud-mismatch",
};

export function lessonFigure(slug: string): Diagram | undefined {
  if (slug === "circuit") return closedLoopExample;
  return missions.find((m) => m.id === lessonFigures[slug])?.diagram;
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// A stable shuffle of option indexes: the same on every visit from one device, different
// between devices, so classmates cannot pass each other "the answer is B".
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
