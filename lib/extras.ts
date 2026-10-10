// Per-mission extras that sit on top of the mission catalog: what to light up once the
// answer is revealed, where to read more, and which missions make up the short demo.

import { closedLoopExample, missions, type Diagram } from "./missions";

export type Highlight = {
  parts?: string[];
  terminals?: string[];
  lines?: number[];
  holes?: string[];
};

// Diagram parts and terminals, breadboard holes, and 1-based code lines, where the fault lives.
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
  "dim-on-battery": { parts: ["r1"] },
  "gnd-to-5v": { terminals: ["d1.b", "uno.5V"] },
  "button-to-5v": { terminals: ["sw.b"] },
  "serial-no-begin": { lines: [1, 2] },
  "print-no-newline": { lines: [7] },
  "pot-wrong-pin": { terminals: ["uno.A1"], lines: [6] },
  "sonar-no-gnd": { terminals: ["hc.GND", "uno.GND"] },
  "servo-wrong-pin": { terminals: ["uno.6"], lines: [6] },
  "battery-on-5v-pin": { terminals: ["uno.5V", "uno.Vin"] },
  "toggle-held": { lines: [9, 10] },
  "millis-no-update": { lines: [9] },
  "semicolon-after-if": { lines: [8] },
  "servo-kills-pwm": { terminals: ["uno.10"], lines: [1, 13] },
  "bb-same-row": { holes: ["7d", "7e"] },
  "bb-one-off": { holes: ["7c", "8e"] },
  "bb-split-rail": { holes: ["-7", "-8"] },
  "both-ends-gnd": { terminals: ["r1.a", "uno.8"] },
  "pot-both-5v": { terminals: ["pot.3", "uno.GND"] },
  "button-wrong-pin": { terminals: ["uno.2"], lines: [2, 7] },
  "gap-in-the-middle": { terminals: ["r1.b", "d1.a"] },
  "led-backwards-battery": { parts: ["d1"] },
  "blue-on-3v": { parts: ["bat"] },
  "too-bright-9v": { parts: ["r1"] },
  "led-on-5v": { terminals: ["r1.a", "uno.8"] },
  "second-led-forgotten": { terminals: ["uno.9"], lines: [2, 6, 8] },
  "missing-brace": { lines: [1, 3] },
  "wrong-capital": { lines: [6] },
  "delay-units": { lines: [7, 9] },
  "pinmode-other-pin": { lines: [2] },
  "resistor-too-small": { parts: ["r1"] },
  "active-low-led": { terminals: ["r1.b", "uno.5V"] },
  "button-no-pullup": { lines: [2] },
  "button-read-once": { lines: [6] },
  "bb-resistor-bypassed": { holes: ["3c", "3d"] },
  "bb-across-gap": { holes: ["7e", "7f"] },
  "pwm-percent": { lines: [6] },
  "fade-no-delay": { lines: [7] },
  "threshold-reversed": { lines: [7] },
  "pot-on-3v3": { terminals: ["uno.3.3V"] },
  "serial-write": { lines: [7] },
  "serial-quotes": { lines: [7] },
  "sonar-no-trig": { terminals: ["hc.Trig", "uno.9"] },
  "servo-no-signal": { terminals: ["servo.Signal", "uno.9"] },
  "led-on-tx": { terminals: ["uno.1"], lines: [2, 3] },
  "analog-read-digital-pin": { terminals: ["uno.3"], lines: [6] },
  "battery-reversed": { terminals: ["bat.+", "bat.−"] },
  "servo-on-3v3": { terminals: ["uno.3.3V"] },
  "two-rates": { lines: [8, 10, 13, 15] },
  "minute-overflow": { lines: [7, 9] },
  "count-resets": { lines: [7] },
  "pins-swapped-in-code": { lines: [1, 2] },
  "copy-paste-else": { lines: [10] },
};

const DOCS = "https://docs.arduino.cc";
const ref = (label: string, path: string) => ({ label, url: `${DOCS}${path}` });
const blink = ref("Blink", "/built-in-examples/basics/Blink/");
const sketches = ref("Sketches", "/learn/programming/sketches/");
const digitalPins = ref("Digital pins", "/learn/microcontrollers/digital-pins/");
const analogInput = ref("Analog input", "/learn/microcontrollers/analog-input/");
const analogWrite = ref("analogWrite()", "/language-reference/en/functions/analog-io/analogWrite/");
const servo = ref("Servo motors", "/learn/electronics/servo-motors/");
const serial = ref("Serial", "/language-reference/en/functions/communication/serial/");
const unoBoard = ref("UNO R3", "/hardware/uno-rev3/");
const analogRead = ref("analogRead()", "/language-reference/en/functions/analog-io/analogRead/");

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
  "baud-mismatch": serial,
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
  "serial-pins": unoBoard,
  "gnd-to-5v": blink,
  "button-to-5v": digitalPins,
  "serial-no-begin": serial,
  "print-no-newline": serial,
  "pot-wrong-pin": analogInput,
  "sonar-no-gnd": ref("pulseIn()", "/language-reference/en/functions/advanced-io/pulseIn/"),
  "servo-wrong-pin": servo,
  "battery-on-5v-pin": unoBoard,
  "toggle-held": digitalPins,
  "millis-no-update": ref("Blink Without Delay", "/built-in-examples/digital/BlinkWithoutDelay/"),
  "semicolon-after-if": ref("Language reference", "/language-reference/"),
  "servo-kills-pwm": servo,
  "both-ends-gnd": blink,
  "pot-both-5v": analogInput,
  "button-wrong-pin": digitalPins,
  "led-on-5v": blink,
  "second-led-forgotten": blink,
  "missing-brace": sketches,
  "wrong-capital": sketches,
  "delay-units": ref("delay()", "/language-reference/en/functions/time/delay/"),
  "pinmode-other-pin": ref("pinMode()", "/language-reference/en/functions/digital-io/pinMode/"),
  "resistor-too-small": blink,
  "active-low-led": digitalPins,
  "button-no-pullup": digitalPins,
  "button-read-once": digitalPins,
  "pwm-percent": analogWrite,
  "fade-no-delay": analogWrite,
  "threshold-reversed": analogInput,
  "pot-on-3v3": analogRead,
  "serial-write": serial,
  "serial-quotes": serial,
  "sonar-no-trig": ref("pulseIn()", "/language-reference/en/functions/advanced-io/pulseIn/"),
  "servo-no-signal": servo,
  "led-on-tx": unoBoard,
  "analog-read-digital-pin": analogRead,
  "battery-reversed": unoBoard,
  "servo-on-3v3": unoBoard,
  "two-rates": ref("Blink Without Delay", "/built-in-examples/digital/BlinkWithoutDelay/"),
  "minute-overflow": ref("int", "/language-reference/en/variables/data-types/int/"),
  "count-resets": ref("Language reference", "/language-reference/"),
  "pins-swapped-in-code": digitalPins,
  "copy-paste-else": ref("Language reference", "/language-reference/"),
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
