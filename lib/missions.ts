import type { Board, Diagram, Mission, Part, Text } from "./types";

// The full mission catalog. It is large, so only the server reads it: pages receive the one
// mission they show, and lists use the light index from lib/catalog.ts.
const same = (s: string): Text => ({ en: s, kk: s, ru: s });
const pin = (n: string): Text => ({ en: `Pin ${n}`, kk: `${n}-пин`, ru: `Пин ${n}` });

const ledLong: Text = {
  en: "LED long leg",
  kk: "Жарықдиодтың ұзын аяғы",
  ru: "Длинная ножка светодиода",
};
const ledShort: Text = {
  en: "LED short leg",
  kk: "Жарықдиодтың қысқа аяғы",
  ru: "Короткая ножка светодиода",
};
const resistor: Text = { en: "220 Ω resistor", kk: "220 Ом резистор", ru: "Резистор 220 Ом" };
const resistorOut: Text = {
  en: "Resistor, other end",
  kk: "Резистордың екінші ұшы",
  ru: "Другой конец резистора",
};
const potLeg1: Text = {
  en: "Potentiometer leg 1",
  kk: "Потенциометрдің 1-аяғы",
  ru: "Ножка 1 потенциометра",
};
const potLeg2: Text = {
  en: "Potentiometer leg 2 (middle)",
  kk: "Потенциометрдің 2-аяғы (ортаңғы)",
  ru: "Ножка 2 потенциометра (средняя)",
};
const potLeg3: Text = {
  en: "Potentiometer leg 3",
  kk: "Потенциометрдің 3-аяғы",
  ru: "Ножка 3 потенциометра",
};
const potTitle: Text = { en: "Potentiometer", kk: "Потенциометр", ru: "Потенциометр" };
const servoTitle: Text = { en: "Servo MG996R", kk: "Серво MG996R", ru: "Серво MG996R" };
const smallServoTitle: Text = { en: "Servo SG90", kk: "Серво SG90", ru: "Серво SG90" };
const servoV: Text = { en: "Servo V+", kk: "Серво V+", ru: "Серво V+" };
const servoSignal: Text = { en: "Servo Signal", kk: "Серво Signal", ru: "Серво Signal" };
const servoGnd: Text = { en: "Servo GND", kk: "Серво GND", ru: "Серво GND" };

const blinkGoal: Text = {
  en: "The LED blinks: half a second on, half a second off.",
  kk: "Жарықдиод жыпылықтайды: жарты секунд жанады, жарты секунд сөнеді.",
  ru: "Светодиод мигает: полсекунды горит, полсекунды не горит.",
};
const sweepGoal: Text = {
  en: "The servo turns to 0°, waits a second, turns to 180°, waits a second, and repeats.",
  kk: "Серво 0°-қа бұрылады, бір секунд күтеді, 180°-қа бұрылады, бір секунд күтеді, осылай қайталайды.",
  ru: "Серво поворачивается на 0°, ждёт секунду, поворачивается на 180°, ждёт секунду и повторяет.",
};
const dimSymptom: Text = {
  en: "The LED does blink, but so faintly that you can only see it in a dark room.",
  kk: "Жарықдиод жыпылықтайды, бірақ соншалықты әлсіз, оны тек қараңғы бөлмеде көруге болады.",
  ru: "Светодиод мигает, но так слабо, что это видно только в тёмной комнате.",
};

const blinkCode = `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`;

const potReadCode = `void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0);
  Serial.println(value);
  delay(200);
}`;

const sweepCode = `#include <Servo.h>

Servo arm;

void setup() {
  arm.attach(9);
}

void loop() {
  arm.write(0);
  delay(1000);
  arm.write(180);
  delay(1000);
}`;

const buttonGoal: Text = {
  en: "The LED is on while the button is held and off when it is released.",
  kk: "Батырма басулы тұрғанда жарықдиод жанады, жібергенде сөнеді.",
  ru: "Светодиод горит, пока кнопка нажата, и гаснет, когда её отпускают.",
};
const buttonLegA: Text = { en: "Button, leg A", kk: "Батырманың A аяғы", ru: "Кнопка, ножка A" };
const buttonLegB: Text = { en: "Button, leg B", kk: "Батырманың B аяғы", ru: "Кнопка, ножка B" };

// A button from pin 2 to GND (for INPUT_PULLUP) plus an LED on pin 8.
const pullupButtonCircuit: Diagram = {
  pins: ["2", "8", "GND"],
  parts: [
    { id: "sw", kind: "button", x: 400, y: 90 },
    { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 142 },
    { id: "d1", kind: "led", x: 370, y: 142 },
  ],
  wires: [
    ["uno.2", "sw.a"],
    ["sw.b", "GND"],
    ["uno.8", "r1.a"],
    ["r1.b", "d1.a"],
    ["d1.b", "GND"],
    ["uno.GND", "GND"],
  ],
};
const pullupButtonWiring = [
  { from: pin("2"), to: buttonLegA },
  { from: buttonLegB, to: same("GND") },
  { from: pin("8"), to: resistor },
  { from: resistorOut, to: ledLong },
  { from: ledShort, to: same("GND") },
];

const lightGoal: Text = {
  en: "The LED lights up.",
  kk: "Жарықдиод жанады.",
  ru: "Светодиод загорается.",
};
const neverLights: Text = {
  en: "The sketch uploads without errors, but the LED never lights up.",
  kk: "Скетч қатесіз жүктеледі, бірақ жарықдиод мүлдем жанбайды.",
  ru: "Скетч загружается без ошибок, но светодиод не загорается совсем.",
};
const optLedBackwards: Text = {
  en: "The LED is plugged in backwards",
  kk: "Жарықдиод теріс қосылған",
  ru: "Светодиод вставлен наоборот",
};
const batteryPlus: Text = { en: "Battery +", kk: "Батарея +", ru: "Батарея +" };
const batteryMinus: Text = { en: "Battery −", kk: "Батарея −", ru: "Батарея −" };
const ledWiring = (pinName: string) => [
  { from: pin(pinName), to: resistor },
  { from: resistorOut, to: ledLong },
  { from: ledShort, to: same("GND") },
];

// A battery on the left feeding the top (+) and bottom (−) lines, with no board.
const batteryCircuit = (
  volts: string,
  parts: Part[],
  wires: [string, string][],
  closed = true,
): Diagram => ({
  pins: [],
  railLabels: ["+", "−"],
  parts: [
    {
      id: "bat",
      kind: "chip",
      title: {
        en: `Battery ${volts} V`,
        kk: `Батарея ${volts.replace(".", ",")} В`,
        ru: `Батарея ${volts.replace(".", ",")} В`,
      },
      x: 20,
      y: 60,
      right: ["+", "−"],
    },
    ...parts,
  ],
  wires: [["bat.+", "5V"], ...(closed ? ([["bat.−", "GND"]] as [string, string][]) : []), ...wires],
});

const potCircuit: Diagram = {
  pins: ["5V", "A0", "GND"],
  parts: [{ id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] }],
  wires: [
    ["uno.5V", "5V"],
    ["pot.1", "5V"],
    ["uno.A0", "pot.2"],
    ["pot.3", "GND"],
    ["uno.GND", "GND"],
  ],
};
const potWiring = [
  { from: potLeg1, to: same("5V") },
  { from: potLeg2, to: same("A0") },
  { from: potLeg3, to: same("GND") },
];

// Texts and circuits that several missions share.
const oNotOutput: Text = {
  en: "Pin 8 is never set as OUTPUT",
  kk: "8-пин OUTPUT режиміне қойылмаған",
  ru: "Пин 8 не настроен как OUTPUT",
};
const oRes220Large: Text = {
  en: "The 220 Ω resistor is too large",
  kk: "220 Ом резистор тым үлкен",
  ru: "Резистор 220 Ом слишком большой",
};
const oLoopOpen: Text = {
  en: "The loop is not closed",
  kk: "Тізбек тұйықталмаған",
  ru: "Цепь не замкнута",
};
const oBaud: Text = {
  en: "The sketch and the Serial Monitor use different baud rates",
  kk: "Скетч пен Serial Monitor әртүрлі бод жылдамдығын қолданады",
  ru: "В скетче и в Serial Monitor выбрана разная скорость",
};
const oPotWorn: Text = {
  en: "The potentiometer is worn out",
  kk: "Потенциометр тозған",
  ru: "Потенциометр износился",
};
const oButtonResistor: Text = {
  en: "The button needs an external resistor",
  kk: "Батырмаға сыртқы резистор керек",
  ru: "Кнопке нужен внешний резистор",
};
const oCheckHigh: Text = {
  en: "The code should check for HIGH instead of LOW",
  kk: "Код LOW орнына HIGH мәнін тексеруі керек",
  ru: "Код должен проверять HIGH вместо LOW",
};
const oNoPwm9: Text = {
  en: "Pin 9 cannot produce PWM",
  kk: "9-пин ШИМ (PWM) шығара алмайды",
  ru: "Пин 9 не умеет выдавать ШИМ",
};
const potGoal: Text = {
  en: "Turning the knob changes the number in the Serial Monitor from 0 to 1023.",
  kk: "Тұтқаны бұрағанда Serial Monitor-дағы сан 0-ден 1023-ке дейін өзгереді.",
  ru: "При повороте ручки число в Serial Monitor меняется от 0 до 1023.",
};
const sonarGoal: Text = {
  en: "The Serial Monitor shows the distance to the nearest obstacle in centimetres.",
  kk: "Serial Monitor ең жақын кедергіге дейінгі қашықтықты сантиметрмен көрсетеді.",
  ru: "Serial Monitor показывает расстояние до ближайшего препятствия в сантиметрах.",
};
const fadeGoal: Text = {
  en: "The LED brightens smoothly from off to full, then starts again.",
  kk: "Жарықдиод сөнген күйден толық жарыққа дейін біртіндеп жанады, сосын қайта басталады.",
  ru: "Светодиод плавно разгорается от нуля до полной яркости, затем всё повторяется.",
};
const batteryGoal: Text = {
  en: "The board runs from a battery, without the USB cable.",
  kk: "Плата USB кабелінсіз, батареядан жұмыс істейді.",
  ru: "Плата работает от батарейки, без USB-кабеля.",
};
const sonarZero: Text = {
  en: "The Serial Monitor prints 0 about once a second, wherever the obstacle is.",
  kk: "Кедергі қай жерде тұрса да, Serial Monitor шамамен секундына бір рет 0 шығарады.",
  ru: "Serial Monitor примерно раз в секунду печатает 0, где бы ни стояло препятствие.",
};
const driftSymptom: Text = {
  en: "The numbers in the Serial Monitor drift up and down by themselves and do not follow the knob.",
  kk: "Serial Monitor-дағы сандар өздігінен жоғары-төмен өзгеріп тұрады және тұтқаға бағынбайды.",
  ru: "Числа в Serial Monitor сами по себе плавают вверх-вниз и не зависят от ручки.",
};
const alwaysOn: Text = {
  en: "The LED is on all the time, whether the button is pressed or not.",
  kk: "Батырма басылса да, басылмаса да жарықдиод үнемі жанып тұрады.",
  ru: "Светодиод горит постоянно, нажата кнопка или нет.",
};
const servoStill: Text = {
  en: "The servo has power but does not move at all. The board does not restart.",
  kk: "Сервода қорек бар, бірақ ол мүлдем қозғалмайды. Плата қайта іске қосылмайды.",
  ru: "У серво есть питание, но он совсем не двигается. Плата не перезагружается.",
};
const halfBright: Text = {
  en: "The LED does not blink. It glows steadily at about half brightness.",
  kk: "Жарықдиод жыпылықтамайды. Ол шамамен жарты жарықпен тұрақты жанып тұрады.",
  ru: "Светодиод не мигает. Он ровно светится примерно вполсилы.",
};
const tooBright: Text = {
  en: "The LED blinks, but far too brightly, and it gets hot.",
  kk: "Жарықдиод жыпылықтайды, бірақ тым жарық жанып, қызады.",
  ru: "Светодиод мигает, но слишком ярко, и нагревается.",
};
const batteryLedWiring = [
  { from: batteryPlus, to: resistor },
  { from: resistorOut, to: ledLong },
  { from: ledShort, to: batteryMinus },
];
const sonarCode = `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long cm = duration / 58;
  Serial.println(cm);
  delay(200);
}`;

// Two LEDs with their own resistors on pins 8 and 9.
const twoLedCircuit: Diagram = {
  pins: ["8", "9", "GND"],
  parts: [
    { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 90 },
    { id: "d1", kind: "led", x: 370, y: 90 },
    { id: "r2", kind: "resistor", label: "220 Ω", x: 250, y: 194 },
    { id: "d2", kind: "led", x: 370, y: 194 },
  ],
  wires: [
    ["uno.8", "r1.a"],
    ["r1.b", "d1.a"],
    ["d1.b", "GND"],
    ["uno.9", "r2.a"],
    ["r2.b", "d2.a"],
    ["d2.b", "GND"],
    ["uno.GND", "GND"],
  ],
};
const twoLedWiring = [
  {
    from: pin("8"),
    to: {
      en: "Resistor and LED 1, then GND",
      kk: "Резистор және 1-жарықдиод, сосын GND",
      ru: "Резистор и светодиод 1, затем GND",
    },
  },
  {
    from: pin("9"),
    to: {
      en: "Resistor and LED 2, then GND",
      kk: "Резистор және 2-жарықдиод, сосын GND",
      ru: "Резистор и светодиод 2, затем GND",
    },
  },
];

// Just a button between pin 2 and GND.
const buttonOnlyCircuit: Diagram = {
  pins: ["2", "GND"],
  parts: [{ id: "sw", kind: "button", x: 250, y: 90 }],
  wires: [
    ["uno.2", "sw.a"],
    ["sw.b", "GND"],
    ["uno.GND", "GND"],
  ],
};
const buttonOnlyWiring = [
  { from: pin("2"), to: buttonLegA },
  { from: buttonLegB, to: same("GND") },
];

// The three breadboard missions share their options: same picture style, different fault.
const optSameRow: Text = {
  en: "Both legs of the LED are in the same row of five holes, so the current goes around it",
  kk: "Жарықдиодтың екі аяғы да бес тесіктен тұратын бір қатарда тұр, сондықтан ток оны айналып өтеді",
  ru: "Обе ножки светодиода стоят в одном ряду из пяти отверстий, и ток идёт в обход него",
};
const optOneOff: Text = {
  en: "The resistor and the LED are in neighbouring rows and are not connected",
  kk: "Резистор мен жарықдиод көрші қатарларда тұр және өзара қосылмаған",
  ru: "Резистор и светодиод стоят в соседних рядах и не соединены",
};
const optSplitRail: Text = {
  en: "The minus rail is split in the middle and its two halves are not joined",
  kk: "Минус шинасы ортасынан бөлінген, ал оның екі жартысы өзара қосылмаған",
  ru: "Шина минуса разорвана посередине, и её половины не соединены",
};

// One LED with a series resistor on a single pin, returning to GND.
const ledCircuit = (
  pinName: string,
  opts: { flip?: boolean; label?: string } = {},
): Diagram => ({
  pins: [pinName, "GND"],
  parts: [
    { id: "r1", kind: "resistor", label: opts.label ?? "220 Ω", x: 250, y: 90 },
    { id: "d1", kind: "led", x: 370, y: 90, flip: opts.flip },
  ],
  wires: [
    [`uno.${pinName}`, "r1.a"],
    ["r1.b", "d1.a"],
    ["d1.b", "GND"],
    ["uno.GND", "GND"],
  ],
});

// Colour, sound, temperature, transistors and motor drivers: shared texts and circuits.
const oCommonAnode: Text = {
  en: "The LED is a common-anode type",
  kk: "Бұл — ортақ анодты жарықдиод",
  ru: "Это светодиод с общим анодом",
};
const oRgbSwapped: Text = {
  en: "In the code the red and blue pin numbers are swapped",
  kk: "Кодта қызыл мен көк пиндердің нөмірлері ауысып кеткен",
  ru: "В коде перепутаны номера пинов красного и синего",
};
const oNoPwm10: Text = {
  en: "Pin 10 cannot produce PWM",
  kk: "10-пин ШИМ (PWM) шығара алмайды",
  ru: "Пин 10 не умеет выдавать ШИМ",
};
const oSensorBackwards: Text = {
  en: "The sensor is plugged in backwards",
  kk: "Датчик теріс қойылған",
  ru: "Датчик вставлен наоборот",
};
const oMotorBackwards: Text = {
  en: "The motor is wired backwards",
  kk: "Мотор теріс қосылған",
  ru: "Мотор подключён наоборот",
};

const redLeg: Text = { en: "Red leg (R)", kk: "Қызыл аяқ (R)", ru: "Красная ножка (R)" };
const greenLeg: Text = { en: "Green leg (G)", kk: "Жасыл аяқ (G)", ru: "Зелёная ножка (G)" };
const blueLeg: Text = { en: "Blue leg (B)", kk: "Көк аяқ (B)", ru: "Синяя ножка (B)" };
const commonLeg: Text = {
  en: "Common leg (COM, the longest)",
  kk: "Ортақ аяқ (COM, ең ұзыны)",
  ru: "Общая ножка (COM, самая длинная)",
};
const throughResistor = (leg: Text): Text => ({
  en: `${leg.en}, through a 220 Ω resistor`,
  kk: `${leg.kk}, 220 Ом резистор арқылы`,
  ru: `${leg.ru}, через резистор 220 Ом`,
});

// An RGB LED on PWM pins 9, 10 and 11 with a resistor on every colour leg. The common leg
// goes to GND (common cathode) or to 5V (common anode).
const rgbCircuit = (anode = false): Diagram => {
  const y = anode ? 142 : 90;
  return {
    pins: anode ? ["5V", "9", "10", "11"] : ["9", "10", "11", "GND"],
    parts: [
      { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y },
      { id: "r2", kind: "resistor", label: "220 Ω", x: 250, y: y + 52 },
      { id: "r3", kind: "resistor", label: "220 Ω", x: 250, y: y + 104 },
      {
        id: "rgb",
        kind: "chip",
        title: anode
          ? { en: "RGB LED, common +", kk: "RGB, ортақ +", ru: "RGB, общий +" }
          : { en: "RGB LED, common −", kk: "RGB, ортақ −", ru: "RGB, общий −" },
        x: 400,
        y: y - 14,
        left: ["R", "G", "B"],
        right: ["COM"],
      },
    ],
    wires: [
      ["uno.9", "r1.a"],
      ["uno.10", "r2.a"],
      ["uno.11", "r3.a"],
      ["r1.b", "rgb.R"],
      ["r2.b", "rgb.G"],
      ["r3.b", "rgb.B"],
      ["rgb.COM", anode ? "5V" : "GND"],
      [anode ? "uno.5V" : "uno.GND", anode ? "5V" : "GND"],
    ],
  };
};
const rgbWiring = (common: string) => [
  { from: pin("9"), to: throughResistor(redLeg) },
  { from: pin("10"), to: throughResistor(greenLeg) },
  { from: pin("11"), to: throughResistor(blueLeg) },
  { from: commonLeg, to: same(common) },
];
const rgbSketch = (loop: string) => `const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
${loop}
}`;

const buzzerLeg1: Text = {
  en: "Buzzer, leg 1",
  kk: "Пьезодинамиктің 1-аяғы",
  ru: "Пьезодинамик, ножка 1",
};
const buzzerLeg2: Text = {
  en: "Buzzer, leg 2",
  kk: "Пьезодинамиктің 2-аяғы",
  ru: "Пьезодинамик, ножка 2",
};
const buzzerCircuit: Diagram = {
  pins: ["8", "GND"],
  parts: [{ id: "bz", kind: "buzzer", x: 250, y: 90 }],
  wires: [
    ["uno.8", "bz.a"],
    ["bz.b", "GND"],
    ["uno.GND", "GND"],
  ],
};
const buzzerWiring = [
  { from: pin("8"), to: buzzerLeg1 },
  { from: buzzerLeg2, to: same("GND") },
];

const tempGoal: Text = {
  en: "The Serial Monitor shows the room temperature in degrees Celsius once a second.",
  kk: "Serial Monitor секундына бір рет бөлме температурасын Цельсий градусымен көрсетеді.",
  ru: "Serial Monitor раз в секунду показывает температуру в комнате в градусах Цельсия.",
};
const tempCode = `void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(A0);
  float volts = reading * 5.0 / 1024.0;
  float celsius = (volts - 0.5) * 100.0;
  Serial.println(celsius);
  delay(1000);
}`;
// A three-legged sensor on one signal pin, A0 unless told otherwise. The legs are listed
// from top to bottom: the first goes to 5V, the middle one to the signal pin and the last to
// GND, so a reversed list draws a reversed part.
type SensorLegs = [string, string, string];
const sensorCircuit = (
  title: string,
  legs: SensorLegs = ["+Vs", "Vout", "GND"],
  signal = "A0",
): Diagram => ({
  pins: ["5V", signal, "GND"],
  parts: [{ id: "tmp", kind: "chip", title: same(title), x: 330, y: 76, left: legs }],
  wires: [
    ["uno.5V", "5V"],
    [`tmp.${legs[0]}`, "5V"],
    [`uno.${signal}`, `tmp.${legs[1]}`],
    [`tmp.${legs[2]}`, "GND"],
    ["uno.GND", "GND"],
  ],
});
const sensorWiring = (
  name: string,
  legs: SensorLegs = ["+Vs", "Vout", "GND"],
  signal: Text = same("A0"),
) => [
  { from: same(`${name} ${legs[0]}`), to: same("5V") },
  { from: same(`${name} ${legs[1]}`), to: signal },
  { from: same(`${name} ${legs[2]}`), to: same("GND") },
];

const motorGoal: Text = {
  en: "The motor runs for two seconds, stops for two seconds, and repeats.",
  kk: "Мотор екі секунд айналады, екі секунд тоқтайды, осылай қайталайды.",
  ru: "Мотор две секунды вращается, две секунды стоит и так повторяет.",
};
const motorOnOffCode = `void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  digitalWrite(9, HIGH);
  delay(2000);
  digitalWrite(9, LOW);
  delay(2000);
}`;
const motorLeg1: Text = { en: "Motor, terminal 1", kk: "Мотордың 1-контактісі", ru: "Мотор, контакт 1" };
const motorLeg2: Text = { en: "Motor, terminal 2", kk: "Мотордың 2-контактісі", ru: "Мотор, контакт 2" };
const arduinoGnd = same("Arduino GND");

type TransistorOptions = {
  model?: string;
  baseResistor?: boolean;
  swapped?: boolean;
  diode?: "flip" | "none";
};

// A pin switching a battery-powered motor through an NPN transistor: base resistor,
// motor on the collector, emitter to GND and a protective diode across the motor.
const transistorCircuit = (opts: TransistorOptions = {}): Diagram => {
  const parts: Part[] = [];
  const wires: [string, string][] = [];
  if (opts.baseResistor === false) {
    wires.push(["uno.9", "q1.B"]);
  } else {
    parts.push({ id: "r1", kind: "resistor", label: "1 kΩ", x: 170, y: 90 });
    wires.push(["uno.9", "r1.a"], ["r1.b", "q1.B"]);
  }
  parts.push(
    {
      id: "q1",
      kind: "chip",
      title: same(`NPN ${opts.model ?? "PN2222"}`),
      x: 300,
      y: 50,
      left: ["B"],
      right: opts.swapped ? ["E", "C"] : ["C", "E"],
    },
    { id: "m1", kind: "motor", x: 450, y: 90 },
  );
  wires.push(
    [opts.swapped ? "q1.E" : "q1.C", "m1.a"],
    [opts.swapped ? "q1.C" : "q1.E", "GND"],
    ["m1.b", "5V"],
  );
  if (opts.diode !== "none") {
    parts.push({ id: "d1", kind: "diode", x: 450, y: 156, flip: opts.diode === "flip" });
    wires.push(["d1.a", "m1.a"], ["d1.b", "m1.b"]);
  }
  parts.push({
    id: "bat",
    kind: "chip",
    title: { en: "Battery 4×AA", kk: "Батарея 4×AA", ru: "Батарея 4×AA" },
    x: 450,
    y: 196,
    right: ["+", "−"],
  });
  wires.push(["bat.+", "5V"], ["bat.−", "GND"], ["uno.GND", "GND"]);
  return { pins: ["9", "GND"], railLabels: ["6V", "GND"], parts, wires };
};
const transistorWiring = (opts: TransistorOptions = {}) => {
  const base: Text = {
    en: "Transistor base (B)",
    kk: "Транзистордың базасы (B)",
    ru: "База транзистора (B)",
  };
  const collector: Text = {
    en: "Transistor collector (C)",
    kk: "Транзистордың коллекторы (C)",
    ru: "Коллектор транзистора (C)",
  };
  const emitter: Text = {
    en: "Transistor emitter (E)",
    kk: "Транзистордың эмиттері (E)",
    ru: "Эмиттер транзистора (E)",
  };
  const rows: { from: Text; to: Text }[] = [];
  if (opts.baseResistor === false) {
    rows.push({ from: pin("9"), to: base });
  } else {
    rows.push(
      {
        from: pin("9"),
        to: { en: "1 kΩ resistor", kk: "1 кОм резистор", ru: "Резистор 1 кОм" },
      },
      { from: resistorOut, to: base },
    );
  }
  rows.push(
    { from: opts.swapped ? emitter : collector, to: motorLeg1 },
    { from: opts.swapped ? collector : emitter, to: same("GND") },
    { from: motorLeg2, to: batteryPlus },
  );
  if (opts.diode !== "none") {
    rows.push({
      from: { en: "Diode", kk: "Диод", ru: "Диод" },
      to:
        opts.diode === "flip"
          ? {
              en: "Across the motor, stripe toward the transistor",
              kk: "Моторға параллель, жолағы транзисторға қарай",
              ru: "Параллельно мотору, полоской к транзистору",
            }
          : {
              en: "Across the motor, stripe toward battery +",
              kk: "Моторға параллель, жолағы батарея плюсіне қарай",
              ru: "Параллельно мотору, полоской к плюсу батареи",
            },
    });
  }
  rows.push({ from: batteryMinus, to: arduinoGnd });
  return rows;
};

const driverGoal: Text = {
  en: "The motor spins steadily in one direction.",
  kk: "Мотор бір бағытта бірқалыпты айналады.",
  ru: "Мотор ровно вращается в одну сторону.",
};
type DriverOptions = { ena?: string; cells?: number; ground?: boolean };

// One motor on an L298N driver with its own battery. The top line is the battery plus.
const driverCircuit = (opts: DriverOptions = {}): Diagram => {
  const ena = opts.ena ?? "9";
  const cells = opts.cells ?? 6;
  const wires: [string, string][] = [
    [`uno.${ena}`, "drv.ENA"],
    ["uno.8", "drv.IN1"],
    ["uno.7", "drv.IN2"],
    ["drv.OUT1", "m1.1"],
    ["drv.OUT2", "m1.2"],
    ["drv.12V", "5V"],
    ["bat.+", "5V"],
    ["drv.GND", "GND"],
    ["bat.−", "GND"],
  ];
  if (opts.ground !== false) wires.push(["uno.GND", "GND"]);
  return {
    pins: [ena, "8", "7", "GND"],
    railLabels: [`${cells * 1.5}V`, "GND"],
    parts: [
      {
        id: "drv",
        kind: "chip",
        title: same("L298N"),
        x: 250,
        y: 37,
        left: ["ENA", "IN1", "IN2", "GND"],
        right: ["12V", "OUT1", "OUT2"],
      },
      {
        id: "m1",
        kind: "chip",
        title: { en: "DC motor", kk: "Мотор", ru: "Мотор" },
        x: 410,
        y: 63,
        left: ["1", "2"],
      },
      {
        id: "bat",
        kind: "chip",
        title: {
          en: `Battery ${cells}×AA`,
          kk: `Батарея ${cells}×AA`,
          ru: `Батарея ${cells}×AA`,
        },
        x: 410,
        y: 171,
        right: ["+", "−"],
      },
    ],
    wires,
  };
};
const driverWiring = (opts: DriverOptions = {}) => {
  const rows = [
    { from: pin(opts.ena ?? "9"), to: same("L298N ENA") },
    { from: pin("8"), to: same("L298N IN1") },
    { from: pin("7"), to: same("L298N IN2") },
    {
      from: same("L298N OUT1, OUT2"),
      to: { en: "Motor, both terminals", kk: "Мотордың екі контактісі", ru: "Мотор, оба контакта" },
    },
    { from: batteryPlus, to: same("L298N 12V") },
    { from: batteryMinus, to: same("L298N GND") },
  ];
  if (opts.ground !== false) rows.push({ from: same("L298N GND"), to: arduinoGnd });
  return rows;
};
const driverSketch = (ena: string, in2Level: string, speed: number) => `const int enA = ${ena};
const int in1 = 8;
const int in2 = 7;

void setup() {
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
}

void loop() {
  digitalWrite(in1, HIGH);
  digitalWrite(in2, ${in2Level});
  analogWrite(enA, ${speed});
}`;

// Line sensors, loops and arrays, functions, memory and interrupts: shared texts and circuits.
const lineGoal: Text = {
  en: "The Serial Monitor prints LINE while the sensor is over the black tape and FLOOR while it is over the white floor.",
  kk: "Датчик қара таспаның үстінде тұрғанда Serial Monitor LINE, ақ еденнің үстінде тұрғанда FLOOR деп шығарады.",
  ru: "Serial Monitor печатает LINE, пока датчик над чёрной лентой, и FLOOR, пока он над белым полом.",
};
const lineAnalog: SensorLegs = ["VCC", "AO", "GND"];
const lineDigital: SensorLegs = ["VCC", "DO", "GND"];
const lineAnalogCode = (threshold: number) => `const int threshold = ${threshold};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0);
  if (value > threshold) {
    Serial.println("LINE");
  } else {
    Serial.println("FLOOR");
  }
  delay(200);
}`;
const lineDigitalCode = (lineLevel: string) => `void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT);
}

void loop() {
  if (digitalRead(2) == ${lineLevel}) {
    Serial.println("LINE");
  } else {
    Serial.println("FLOOR");
  }
  delay(200);
}`;

// Three LEDs with their own resistors on pins 8, 9 and 10. The middle row has the LED
// before the resistor (the order in a series chain does not matter) so the labels fit.
const threeLedCircuit: Diagram = {
  pins: ["8", "9", "10", "GND"],
  parts: [
    { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 90 },
    { id: "d1", kind: "led", x: 370, y: 90 },
    { id: "d2", kind: "led", x: 250, y: 142 },
    { id: "r2", kind: "resistor", label: "220 Ω", x: 370, y: 142 },
    { id: "r3", kind: "resistor", label: "220 Ω", x: 250, y: 194 },
    { id: "d3", kind: "led", x: 370, y: 194 },
  ],
  wires: [
    ["uno.8", "r1.a"],
    ["r1.b", "d1.a"],
    ["d1.b", "GND"],
    ["uno.9", "d2.a"],
    ["d2.b", "r2.a"],
    ["r2.b", "GND"],
    ["uno.10", "r3.a"],
    ["r3.b", "d3.a"],
    ["d3.b", "GND"],
    ["uno.GND", "GND"],
  ],
};
const threeLedWiring = [
  ...twoLedWiring,
  {
    from: pin("10"),
    to: {
      en: "Resistor and LED 3, then GND",
      kk: "Резистор және 3-жарықдиод, сосын GND",
      ru: "Резистор и светодиод 3, затем GND",
    },
  },
];
const threePinSetup = `int pins[3] = {8, 9, 10};

void setup() {
  for (int i = 0; i < 3; i++) {
    pinMode(pins[i], OUTPUT);
  }
}
`;

const blinkTwiceCode = (call: string) => `void blinkTwice() {
  digitalWrite(8, HIGH);
  delay(150);
  digitalWrite(8, LOW);
  delay(150);
  digitalWrite(8, HIGH);
  delay(150);
  digitalWrite(8, LOW);
  delay(150);
}

void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  ${call}
}`;

// A button to GND on the given pin, plus an LED on pin 8.
const buttonLedCircuit = (buttonPin: string): Diagram => ({
  pins: [buttonPin, "8", "GND"],
  parts: [
    { id: "sw", kind: "button", x: 400, y: 90 },
    { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 142 },
    { id: "d1", kind: "led", x: 370, y: 142 },
  ],
  wires: [
    [`uno.${buttonPin}`, "sw.a"],
    ["sw.b", "GND"],
    ["uno.8", "r1.a"],
    ["r1.b", "d1.a"],
    ["d1.b", "GND"],
    ["uno.GND", "GND"],
  ],
});
const pressGoal: Text = {
  en: "The Serial Monitor shows how many times the button has been pressed.",
  kk: "Serial Monitor батырманың неше рет басылғанын көрсетеді.",
  ru: "Serial Monitor показывает, сколько раз была нажата кнопка.",
};
const interruptCounterCode = (pinMode: string, mode: string) => `volatile int presses = 0;

void onPress() {
  presses = presses + 1;
}

void setup() {
  Serial.begin(9600);
  pinMode(2, ${pinMode});
  attachInterrupt(digitalPinToInterrupt(2), onPress, ${mode});
}

void loop() {
  Serial.println(presses);
  delay(500);
}`;

const catalog: Omit<Mission, "level">[] = [
  {
    id: "led-backwards",
    lesson: "led-resistor",
    title: {
      en: "The LED that stays dark",
      kk: "Жанбайтын жарықдиод",
      ru: "Светодиод, который не горит",
    },
    primer: {
      en: "An LED lets current through in one direction only. The long leg (anode) must face the higher voltage, the short leg (cathode) must face GND. A resistor in series limits the current so the LED doesn't burn out.",
      kk: "Жарықдиод токты тек бір бағытта өткізеді. Ұзын аяғы (анод) жоғары кернеу жағына, қысқа аяғы (катод) GND жағына қарауы керек. Тізбектей қосылған резистор токты шектеп, жарықдиодты күйіп кетуден сақтайды.",
      ru: "Светодиод пропускает ток только в одну сторону. Длинная ножка (анод) должна смотреть в сторону большего напряжения, короткая (катод) — в сторону GND. Резистор, включённый последовательно, ограничивает ток, чтобы светодиод не сгорел.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8", { flip: true }),
    wiring: [
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledShort },
      { from: ledLong, to: same("GND") },
    ],
    code: blinkCode,
    symptom: {
      en: "The sketch uploads without errors, but the LED never lights up.",
      kk: "Скетч қатесіз жүктеледі, бірақ жарықдиод мүлдем жанбайды.",
      ru: "Скетч загружается без ошибок, но светодиод не загорается совсем.",
    },
    options: [
      {
        en: "The 220 Ω resistor is too large for an LED",
        kk: "220 Ом резистор жарықдиод үшін тым үлкен",
        ru: "Резистор 220 Ом слишком большой для светодиода",
      },
      {
        en: "The LED is plugged in backwards",
        kk: "Жарықдиод теріс қосылған",
        ru: "Светодиод вставлен наоборот",
      },
      {
        en: "delay(500) is too short for the eye to notice",
        kk: "delay(500) тым қысқа, көз байқап үлгермейді",
        ru: "delay(500) слишком короткая, глаз не успевает заметить",
      },
      {
        en: "Pin 8 should be set as INPUT",
        kk: "8-пин INPUT режимінде болуы керек",
        ru: "Пин 8 нужно настроить как INPUT",
      },
    ],
    answer: 1,
    faultType: "component",
    explanation: {
      en: "The short leg (cathode) is wired toward pin 8 and the long leg toward GND, so the LED blocks the current. Turn it around: long leg toward the resistor, short leg to GND. 220 Ω is a normal value, and half a second is easy to see.",
      kk: "Қысқа аяғы (катод) 8-пин жағына, ұзын аяғы GND-ға қосылған, сондықтан жарықдиод токты өткізбейді. Оны аударып қос: ұзын аяғы резисторға, қысқа аяғы GND-ға. 220 Ом — қалыпты мән, ал жарты секундты көз оңай байқайды.",
      ru: "Короткая ножка (катод) подключена в сторону пина 8, а длинная — к GND, поэтому светодиод не пропускает ток. Переверни его: длинная ножка к резистору, короткая к GND. 220 Ом — обычное значение, а полсекунды глаз замечает легко.",
    },
  },
  {
    id: "missing-pinmode",
    lesson: "digital-pins",
    title: {
      en: "The LED that barely glows",
      kk: "Әрең жанатын жарықдиод",
      ru: "Светодиод, который еле светится",
    },
    primer: {
      en: "Every Arduino pin starts as an input. To power something from a pin you must first switch it to output with pinMode(pin, OUTPUT). An input pin can only leak a tiny current.",
      kk: "Arduino-ның әр пині бастапқыда кіріс (INPUT) режимінде тұрады. Пиннен бір нәрсені қоректендіру үшін алдымен оны pinMode(pin, OUTPUT) арқылы шығыс режиміне ауыстыру керек. Кіріс режиміндегі пин өте аз ғана ток бере алады.",
      ru: "Каждый пин Arduino сначала работает как вход (INPUT). Чтобы питать что-то от пина, его нужно переключить в режим выхода: pinMode(pin, OUTPUT). Пин в режиме входа может отдать только крошечный ток.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: [
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `void setup() {
}

void loop() {
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`,
    symptom: dimSymptom,
    options: [
      {
        en: "The 220 Ω resistor is too large",
        kk: "220 Ом резистор тым үлкен",
        ru: "Резистор 220 Ом слишком большой",
      },
      {
        en: "The LED is plugged in backwards",
        kk: "Жарықдиод теріс қосылған",
        ru: "Светодиод вставлен наоборот",
      },
      {
        en: "The USB cable does not give enough power",
        kk: "USB кабелі жеткілікті қуат бермейді",
        ru: "USB-кабель не даёт достаточно питания",
      },
      {
        en: "Pin 8 is never set as OUTPUT",
        kk: "8-пин OUTPUT режиміне қойылмаған",
        ru: "Пин 8 не настроен как OUTPUT",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "setup() is empty, so pin 8 stays an input. digitalWrite(8, HIGH) then only switches on a weak internal pull-up resistor (tens of kilohms), and almost no current reaches the LED. Add pinMode(8, OUTPUT) in setup(). A backwards LED would not glow at all.",
      kk: "setup() бос, сондықтан 8-пин кіріс режимінде қалады. Бұл жағдайда digitalWrite(8, HIGH) тек ішкі әлсіз pull-up резисторын (ондаған килоом) қосады, жарықдиодқа ток жетпейді десе де болады. setup() ішіне pinMode(8, OUTPUT) қос. Теріс қосылған жарықдиод мүлдем жанбас еді.",
      ru: "Функция setup() пустая, поэтому пин 8 остаётся входом. Тогда digitalWrite(8, HIGH) включает только слабый внутренний подтягивающий резистор (десятки килоом), и до светодиода почти не доходит ток. Добавь pinMode(8, OUTPUT) в setup(). Перевёрнутый светодиод не светился бы вообще.",
    },
  },
  {
    id: "resistor-too-large",
    lesson: "electricity",
    title: {
      en: "Same symptom, different fault",
      kk: "Белгісі бірдей, ақауы басқа",
      ru: "Симптом тот же, поломка другая",
    },
    primer: {
      en: "Ohm's law: current = voltage ÷ resistance. A red LED drops about 2 V, so on a 5 V pin the resistor gets the remaining 3 V. With 220 Ω that gives about 14 mA, which is bright. The larger the resistor, the smaller the current and the dimmer the LED. In resistor values, k means ×1000.",
      kk: "Ом заңы: ток = кернеу ÷ кедергі. Қызыл жарықдиодта шамамен 2 В түседі, сондықтан 5 В пинде резисторға қалған 3 В тиеді. 220 Ом болғанда бұл шамамен 14 мА береді — жарық жақсы жанады. Резистор неғұрлым үлкен болса, ток соғұрлым аз, жарықдиод соғұрлым күңгірт. Резистор мәніндегі «к» әрпі ×1000 дегенді білдіреді.",
      ru: "Закон Ома: ток = напряжение ÷ сопротивление. На красном светодиоде падает около 2 В, значит при 5 В на пине резистору достаются оставшиеся 3 В. С резистором 220 Ом получается около 14 мА — светодиод горит ярко. Чем больше резистор, тем меньше ток и тем тусклее свет. Буква «к» в номинале означает ×1000.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8", { label: "100 kΩ" }),
    wiring: [
      {
        from: pin("8"),
        to: { en: "100 kΩ resistor", kk: "100 кОм резистор", ru: "Резистор 100 кОм" },
      },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: blinkCode,
    symptom: dimSymptom,
    options: [
      {
        en: "Pin 8 is never set as OUTPUT",
        kk: "8-пин OUTPUT режиміне қойылмаған",
        ru: "Пин 8 не настроен как OUTPUT",
      },
      {
        en: "The LED is plugged in backwards",
        kk: "Жарықдиод теріс қосылған",
        ru: "Светодиод вставлен наоборот",
      },
      {
        en: "The resistor is far too large",
        kk: "Резистор тым үлкен",
        ru: "Резистор слишком большой",
      },
      { en: "delay(500) is too long", kk: "delay(500) тым ұзақ", ru: "delay(500) слишком длинная" },
    ],
    answer: 2,
    faultType: "component",
    explanation: {
      en: "This time pinMode is there, so the code is fine. The resistor is 100 kΩ, not 220 Ω: 3 V ÷ 100 000 Ω = 0.03 mA, hundreds of times less than the LED needs. Swap it for 220 Ω. Two different faults can produce the same symptom, so check both the code and the parts.",
      kk: "Бұл жолы pinMode орнында, демек код дұрыс. Резистор 220 Ом емес, 100 кОм: 3 В ÷ 100 000 Ом = 0,03 мА, бұл жарықдиодқа керегінен жүздеген есе аз. Оны 220 Ом резисторға ауыстыр. Екі түрлі ақау бірдей белгі беруі мүмкін, сондықтан кодты да, бөлшектерді де тексер.",
      ru: "В этот раз pinMode на месте, значит код в порядке. Резистор здесь 100 кОм, а не 220 Ом: 3 В ÷ 100 000 Ом = 0,03 мА, в сотни раз меньше, чем нужно светодиоду. Замени его на 220 Ом. Две разные поломки могут давать один и тот же симптом, поэтому проверяй и код, и детали.",
    },
  },
  {
    id: "floating-button",
    lesson: "digital-pins",
    title: {
      en: "The button with a mind of its own",
      kk: "Өз бетімен қосылатын батырма",
      ru: "Кнопка, которая живёт своей жизнью",
    },
    primer: {
      en: "A digital input reads HIGH or LOW reliably only when it is connected to something. A pin connected to nothing is \"floating\": it picks up electrical noise and returns random values. A pull-down or pull-up resistor gives it a definite level.",
      kk: "Сандық кіріс тек бір нәрсеге қосылып тұрғанда ғана HIGH немесе LOW мәнін нақты оқиды. Ештеңеге қосылмаған пин «ілініп тұрады»: ол электр шуын қабылдап, кездейсоқ мән береді. Pull-down немесе pull-up резисторы оған нақты деңгей береді.",
      ru: "Цифровой вход надёжно читает HIGH или LOW только тогда, когда он к чему-то подключён. Пин, который ни к чему не подключён, «висит в воздухе»: он ловит электрические помехи и выдаёт случайные значения. Подтягивающий резистор (pull-down или pull-up) задаёт ему определённый уровень.",
    },
    goal: {
      en: "The LED is on while the button is held and off when it is released.",
      kk: "Батырма басулы тұрғанда жарықдиод жанады, жібергенде сөнеді.",
      ru: "Светодиод горит, пока кнопка нажата, и гаснет, когда её отпускают.",
    },
    diagram: {
      pins: ["5V", "2", "8", "GND"],
      parts: [
        { id: "sw", kind: "button", x: 250, y: 142 },
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 194 },
        { id: "d1", kind: "led", x: 370, y: 194 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["uno.2", "sw.a"],
        ["sw.b", "5V"],
        ["uno.8", "r1.a"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      {
        from: pin("2"),
        to: { en: "Button, leg A", kk: "Батырманың A аяғы", ru: "Кнопка, ножка A" },
      },
      {
        from: { en: "Button, leg B", kk: "Батырманың B аяғы", ru: "Кнопка, ножка B" },
        to: same("5V"),
      },
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `void setup() {
  pinMode(2, INPUT);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == HIGH) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
}`,
    symptom: {
      en: "Pressing the button works. But with the button released, the LED flickers on and off by itself, especially when a hand comes near the wires.",
      kk: "Батырманы басқанда бәрі дұрыс. Бірақ батырма жіберулі тұрғанда жарықдиод өздігінен жанып-сөніп тұрады, әсіресе қолды сымдарға жақындатқанда.",
      ru: "При нажатии всё работает. Но когда кнопка отпущена, светодиод сам по себе мигает, особенно если поднести руку к проводам.",
    },
    options: [
      {
        en: "Pin 2 is floating when the button is released",
        kk: "Батырма жіберулі кезде 2-пин ешқайда қосылмай, ілініп тұр",
        ru: "Когда кнопка отпущена, пин 2 висит в воздухе",
      },
      {
        en: "The button is worn out and needs replacing",
        kk: "Батырма тозған, ауыстыру керек",
        ru: "Кнопка износилась, её нужно заменить",
      },
      {
        en: "The code should use = instead of ==",
        kk: "Кодта == орнына = қолдану керек",
        ru: "В коде нужно писать = вместо ==",
      },
      {
        en: "The loop needs a delay to slow it down",
        kk: "loop ішіне баяулататын delay керек",
        ru: "В loop нужна задержка delay",
      },
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "With the button released, pin 2 is connected to nothing, so it reads noise. Add a 10 kΩ resistor from pin 2 to GND (pull-down). Or wire the button between pin 2 and GND and use pinMode(2, INPUT_PULLUP); then a pressed button reads LOW.",
      kk: "Батырма жіберулі кезде 2-пин ештеңеге қосылмаған, сондықтан ол шуды оқиды. 2-пин мен GND арасына 10 кОм резистор қос (pull-down). Немесе батырманы 2-пин мен GND арасына қосып, pinMode(2, INPUT_PULLUP) қолдан; сонда басылған батырма LOW болып оқылады.",
      ru: "Когда кнопка отпущена, пин 2 ни к чему не подключён и читает помехи. Добавь резистор 10 кОм между пином 2 и GND (pull-down). Или подключи кнопку между пином 2 и GND и используй pinMode(2, INPUT_PULLUP); тогда нажатая кнопка будет читаться как LOW.",
    },
  },
  {
    id: "pullup-inverted",
    lesson: "digital-pins",
    title: {
      en: "The button that works backwards",
      kk: "Керісінше істейтін батырма",
      ru: "Кнопка, которая работает наоборот",
    },
    primer: {
      en: "INPUT_PULLUP connects the pin to 5 V through a resistor inside the board. So a released button reads HIGH. The button is wired to GND, and pressing it pulls the pin down to LOW. The logic is upside down: pressed means LOW.",
      kk: "INPUT_PULLUP пинді плата ішіндегі резистор арқылы 5 В-қа қосады. Сондықтан жіберулі батырма HIGH болып оқылады. Батырма GND-ға қосылған, оны басқанда пин LOW деңгейіне түседі. Логика керісінше: басылған — LOW.",
      ru: "INPUT_PULLUP соединяет пин с 5 В через резистор внутри платы. Поэтому отпущенная кнопка читается как HIGH. Кнопка подключена к GND, и при нажатии пин опускается до LOW. Логика перевёрнута: нажато — значит LOW.",
    },
    goal: buttonGoal,
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == HIGH) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
}`,
    symptom: {
      en: "The LED is on all the time and goes out only while the button is held.",
      kk: "Жарықдиод үнемі жанып тұрады, тек батырма басулы тұрғанда ғана сөнеді.",
      ru: "Светодиод горит всё время и гаснет только пока кнопка нажата.",
    },
    options: [
      {
        en: "The LED is plugged in backwards",
        kk: "Жарықдиод теріс қосылған",
        ru: "Светодиод вставлен наоборот",
      },
      {
        en: "The button needs an external resistor",
        kk: "Батырмаға сыртқы резистор керек",
        ru: "Кнопке нужен внешний резистор",
      },
      {
        en: "With INPUT_PULLUP a pressed button reads LOW, but the code checks for HIGH",
        kk: "INPUT_PULLUP кезінде басылған батырма LOW болып оқылады, ал код HIGH мәнін тексереді",
        ru: "С INPUT_PULLUP нажатая кнопка читается как LOW, а код проверяет HIGH",
      },
      {
        en: "Pin 2 cannot be used as an input",
        kk: "2-пинді кіріс ретінде қолдануға болмайды",
        ru: "Пин 2 нельзя использовать как вход",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The wiring is correct. With INPUT_PULLUP the pin reads HIGH when the button is released and LOW when it is pressed, so the code does the opposite of what was intended. Change the condition to digitalRead(2) == LOW.",
      kk: "Сызба дұрыс. INPUT_PULLUP кезінде батырма жіберулі болса пин HIGH, басылса LOW оқиды, сондықтан код ойлағанға керісінше істейді. Шартты digitalRead(2) == LOW деп өзгерт.",
      ru: "Схема собрана правильно. С INPUT_PULLUP пин читает HIGH, когда кнопка отпущена, и LOW, когда нажата, поэтому код делает обратное задуманному. Поменяй условие на digitalRead(2) == LOW.",
    },
  },
  {
    id: "no-pwm-pin",
    lesson: "analog-pwm",
    title: {
      en: "The fade that jumps",
      kk: "Секіріп жанатын жарықдиод",
      ru: "Яркость, которая прыгает",
    },
    primer: {
      en: "analogWrite() dims an LED by switching the pin on and off very fast (PWM). On an Arduino Uno only pins 3, 5, 6, 9, 10 and 11 can do this; they are marked with ~ on the board.",
      kk: "analogWrite() пинді өте жылдам қосып-өшіру арқылы (ШИМ, PWM) жарықдиодтың жарығын реттейді. Arduino Uno-да мұны тек 3, 5, 6, 9, 10 және 11-пиндер істей алады; платада олар ~ белгісімен көрсетілген.",
      ru: "analogWrite() меняет яркость светодиода, очень быстро включая и выключая пин (ШИМ, PWM). На Arduino Uno это умеют только пины 3, 5, 6, 9, 10 и 11; на плате они отмечены значком ~.",
    },
    goal: {
      en: "The LED brightens smoothly from off to full, then starts again.",
      kk: "Жарықдиод сөнген күйден толық жарыққа дейін біртіндеп жанады, сосын қайта басталады.",
      ru: "Светодиод плавно разгорается от нуля до полной яркости, затем всё повторяется.",
    },
    diagram: ledCircuit("7"),
    wiring: [
      { from: pin("7"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `void setup() {
  pinMode(7, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b++) {
    analogWrite(7, b);
    delay(10);
  }
}`,
    symptom: {
      en: "The LED stays off for about a second, then snaps to full brightness for about a second. There is no smooth change.",
      kk: "Жарықдиод шамамен бір секунд сөніп тұрады, сосын кенет толық жарықпен шамамен бір секунд жанады. Біртіндеп өзгеру жоқ.",
      ru: "Светодиод около секунды не горит, затем резко включается на полную яркость примерно на секунду. Плавного изменения нет.",
    },
    options: [
      {
        en: "delay(10) is too short for a smooth fade",
        kk: "delay(10) біртіндеп жану үшін тым қысқа",
        ru: "delay(10) слишком короткая для плавного перехода",
      },
      {
        en: "The variable should be float, not int",
        kk: "Айнымалы int емес, float болуы керек",
        ru: "Переменная должна быть float, а не int",
      },
      {
        en: "Pin 7 cannot produce PWM",
        kk: "7-пин ШИМ (PWM) шығара алмайды",
        ru: "Пин 7 не умеет выдавать ШИМ",
      },
      {
        en: "An ordinary LED cannot be dimmed",
        kk: "Қарапайым жарықдиодтың жарығын реттеуге болмайды",
        ru: "Яркость обычного светодиода нельзя менять",
      },
    ],
    answer: 2,
    faultType: "limits",
    explanation: {
      en: "Pin 7 has no PWM on the Uno. On such a pin analogWrite() just outputs LOW for values below 128 and HIGH from 128 up, which is exactly the jump you see. Move the wire to a ~ pin such as 9 and change the code to match.",
      kk: "Uno-да 7-пинде ШИМ жоқ. Мұндай пинде analogWrite() 128-ден төмен мәндерде жай LOW, 128-ден бастап HIGH шығарады — көрген секіріс осы. Сымды ~ белгісі бар пинге, мысалы 9-ға ауыстырып, кодты да соған сәйкес өзгерт.",
      ru: "На Uno у пина 7 нет ШИМ. На таком пине analogWrite() просто выдаёт LOW для значений меньше 128 и HIGH начиная со 128 — отсюда и скачок. Переставь провод на пин со значком ~, например 9, и поправь номер в коде.",
    },
  },
  {
    id: "leds-in-series",
    lesson: "led-resistor",
    title: {
      en: "Two LEDs, no light",
      kk: "Екі жарықдиод, жарық жоқ",
      ru: "Два светодиода, а света нет",
    },
    primer: {
      en: "Every LED needs a certain voltage before it lets current through: about 2 V for red, about 3 V for blue and white. When parts are connected one after another (in series), their voltages add up, and the source has to cover the total.",
      kk: "Әр жарықдиод ток өткізуі үшін белгілі бір кернеу қажет: қызылға шамамен 2 В, көк пен аққа шамамен 3 В. Бөлшектер бірінен соң бірі (тізбектей) қосылғанда олардың кернеулері қосылады, ал қорек көзі сол қосындыны жабуы керек.",
      ru: "Каждому светодиоду нужно определённое напряжение, чтобы он начал пропускать ток: красному около 2 В, синему и белому около 3 В. Когда детали включены одна за другой (последовательно), их напряжения складываются, и источник должен покрыть сумму.",
    },
    goal: {
      en: "Two blue LEDs blink together.",
      kk: "Екі көк жарықдиод бірге жыпылықтайды.",
      ru: "Два синих светодиода мигают вместе.",
    },
    diagram: {
      pins: ["8", "GND"],
      parts: [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 90 },
        { id: "d1", kind: "led", x: 370, y: 90, tint: "blue" },
        { id: "d2", kind: "led", x: 490, y: 90, tint: "blue" },
      ],
      wires: [
        ["uno.8", "r1.a"],
        ["r1.b", "d1.a"],
        ["d1.b", "d2.a"],
        ["d2.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: pin("8"), to: resistor },
      {
        from: resistorOut,
        to: {
          en: "LED 1 long leg",
          kk: "1-жарықдиодтың ұзын аяғы",
          ru: "Длинная ножка светодиода 1",
        },
      },
      {
        from: {
          en: "LED 1 short leg",
          kk: "1-жарықдиодтың қысқа аяғы",
          ru: "Короткая ножка светодиода 1",
        },
        to: {
          en: "LED 2 long leg",
          kk: "2-жарықдиодтың ұзын аяғы",
          ru: "Длинная ножка светодиода 2",
        },
      },
      {
        from: {
          en: "LED 2 short leg",
          kk: "2-жарықдиодтың қысқа аяғы",
          ru: "Короткая ножка светодиода 2",
        },
        to: same("GND"),
      },
    ],
    code: blinkCode,
    symptom: {
      en: "Neither LED lights up, although both are the right way round and each works when tested alone.",
      kk: "Екі жарықдиод та дұрыс бағытта тұр және жеке тексергенде әрқайсысы жанады, бірақ бірге екеуі де жанбайды.",
      ru: "Ни один светодиод не загорается, хотя оба стоят правильной стороной и по отдельности каждый работает.",
    },
    options: [
      {
        en: "The 220 Ω resistor is too large for two LEDs",
        kk: "220 Ом резистор екі жарықдиод үшін тым үлкен",
        ru: "Резистор 220 Ом слишком большой для двух светодиодов",
      },
      {
        en: "Pin 8 cannot power more than one part",
        kk: "8-пин бірден артық бөлшекті қоректендіре алмайды",
        ru: "Пин 8 не может питать больше одной детали",
      },
      {
        en: "Blue LEDs only work with analogWrite",
        kk: "Көк жарықдиодтар тек analogWrite-пен жұмыс істейді",
        ru: "Синие светодиоды работают только с analogWrite",
      },
      {
        en: "Two blue LEDs in series need about 6 V, and the pin gives only 5 V",
        kk: "Тізбектей қосылған екі көк жарықдиодқа шамамен 6 В керек, ал пин тек 5 В береді",
        ru: "Двум синим светодиодам последовательно нужно около 6 В, а пин даёт только 5 В",
      },
    ],
    answer: 3,
    faultType: "limits",
    explanation: {
      en: "In series the LED voltages add up: 3 V + 3 V = 6 V, more than the 5 V the pin can give, so almost no current flows. Give each LED its own resistor and its own pin (or connect the two LED-plus-resistor branches side by side from one pin). Two red LEDs, about 4 V in total, would have worked.",
      kk: "Тізбектей қосылғанда жарықдиодтардың кернеулері қосылады: 3 В + 3 В = 6 В, бұл пин бере алатын 5 В-тан көп, сондықтан ток өтпейді десе де болады. Әр жарықдиодқа өз резисторын және өз пинін бер (немесе «жарықдиод + резистор» екі тармағын бір пиннен қатар қос). Екі қызыл жарықдиод, барлығы шамамен 4 В, жұмыс істер еді.",
      ru: "При последовательном включении напряжения светодиодов складываются: 3 В + 3 В = 6 В, это больше 5 В, которые даёт пин, поэтому ток почти не течёт. Дай каждому светодиоду свой резистор и свой пин (или подключи две ветки «светодиод + резистор» рядом от одного пина). Два красных светодиода, в сумме около 4 В, заработали бы.",
    },
  },
  {
    id: "pot-no-5v",
    lesson: "analog-pwm",
    title: {
      en: "The knob that reads zero",
      kk: "Нөл көрсететін тұтқа",
      ru: "Ручка, которая показывает ноль",
    },
    primer: {
      en: "A potentiometer is a voltage divider with three legs. The two outer legs go to 5V and GND, and the middle leg outputs a voltage between them that depends on the knob position. analogRead() turns that voltage into a number from 0 to 1023.",
      kk: "Потенциометр — үш аяғы бар кернеу бөлгіш. Шеткі екі аяғы 5V мен GND-ға қосылады, ал ортаңғы аяғы тұтқаның күйіне байланысты солардың арасындағы кернеуді шығарады. analogRead() бұл кернеуді 0-ден 1023-ке дейінгі санға айналдырады.",
      ru: "Потенциометр — это делитель напряжения с тремя ножками. Две крайние подключают к 5V и GND, а средняя выдаёт напряжение между ними, которое зависит от положения ручки. analogRead() превращает это напряжение в число от 0 до 1023.",
    },
    goal: {
      en: "Turning the knob changes the number in the Serial Monitor from 0 to 1023.",
      kk: "Тұтқаны бұрағанда Serial Monitor-дағы сан 0-ден 1023-ке дейін өзгереді.",
      ru: "При повороте ручки число в Serial Monitor меняется от 0 до 1023.",
    },
    diagram: {
      pins: ["5V", "A0", "GND"],
      parts: [
        { id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] },
      ],
      wires: [
        ["uno.A0", "pot.2"],
        ["pot.3", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: potLeg2, to: same("A0") },
      { from: potLeg3, to: same("GND") },
    ],
    code: potReadCode,
    symptom: {
      en: "The Serial Monitor prints 0 (sometimes 1 or 2) no matter how the knob is turned.",
      kk: "Тұтқаны қалай бұрасаң да, Serial Monitor 0 (кейде 1 немесе 2) шығарады.",
      ru: "Serial Monitor печатает 0 (иногда 1 или 2), как бы ни крутили ручку.",
    },
    options: [
      {
        en: "One outer leg is not connected to 5V",
        kk: "Шеткі аяқтарының бірі 5V-қа қосылмаған",
        ru: "Одна из крайних ножек не подключена к 5V",
      },
      {
        en: "The potentiometer is burned out",
        kk: "Потенциометр күйіп кеткен",
        ru: "Потенциометр сгорел",
      },
      {
        en: "A0 must be set with pinMode before analogRead",
        kk: "analogRead алдында A0-ді pinMode арқылы баптау керек",
        ru: "Перед analogRead пин A0 нужно настроить через pinMode",
      },
      {
        en: "delay(200) is too long to catch the change",
        kk: "delay(200) тым ұзақ, өзгерісті ұстап үлгермейді",
        ru: "delay(200) слишком длинная, изменения не успевают отобразиться",
      },
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "Leg 1 of the potentiometer is not connected to anything, so there is no voltage to divide. The middle leg is simply tied to GND through the resistance and always reads about 0. Connect leg 1 to 5V.",
      kk: "Потенциометрдің 1-аяғы ештеңеге қосылмаған, сондықтан бөлетін кернеу жоқ. Ортаңғы аяғы кедергі арқылы тек GND-ға қосылып тұр да, үнемі 0-ге жуық мән оқиды. 1-аяқты 5V-қа қос.",
      ru: "Ножка 1 потенциометра ни к чему не подключена, поэтому делить нечего. Средняя ножка через сопротивление соединена только с GND и всегда читает около 0. Подключи ножку 1 к 5V.",
    },
  },
  {
    id: "analogwrite-overflow",
    lesson: "analog-pwm",
    title: {
      en: "The dimmer that restarts",
      kk: "Қайта басталатын реттегіш",
      ru: "Регулятор, который начинает сначала",
    },
    primer: {
      en: "analogRead() returns 0–1023 (10 bits). analogWrite() accepts only 0–255 (8 bits). If you give analogWrite() a bigger number on pin 6, it keeps only the lowest 8 bits, so 256 becomes 0, 257 becomes 1, and so on.",
      kk: "analogRead() 0–1023 аралығындағы мән қайтарады (10 бит). analogWrite() тек 0–255 аралығын қабылдайды (8 бит). 6-пинде одан үлкен сан берсең, ол тек төменгі 8 битін қалдырады: 256 — 0-ге, 257 — 1-ге айналады, әрі қарай солай.",
      ru: "analogRead() возвращает 0–1023 (10 бит). analogWrite() принимает только 0–255 (8 бит). Если на пине 6 передать число больше, останутся только младшие 8 бит: 256 превратится в 0, 257 — в 1 и так далее.",
    },
    goal: {
      en: "Turning the knob from one end to the other takes the LED smoothly from off to full brightness.",
      kk: "Тұтқаны бір шетінен екінші шетіне бұрағанда жарықдиод сөнген күйден толық жарыққа дейін біртіндеп жанады.",
      ru: "При повороте ручки от края до края светодиод плавно разгорается от нуля до полной яркости.",
    },
    diagram: {
      pins: ["5V", "A0", "6", "GND"],
      parts: [
        { id: "pot", kind: "chip", title: potTitle, x: 520, y: 50, left: ["1", "2", "3"] },
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 194 },
        { id: "d1", kind: "led", x: 370, y: 194 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["pot.1", "5V"],
        ["uno.A0", "pot.2"],
        ["pot.3", "GND"],
        ["uno.6", "r1.a"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: potLeg1, to: same("5V") },
      { from: potLeg2, to: same("A0") },
      { from: potLeg3, to: same("GND") },
      { from: pin("6"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `void setup() {
  pinMode(6, OUTPUT);
}

void loop() {
  int value = analogRead(A0);
  analogWrite(6, value);
}`,
    symptom: {
      en: "Over one full turn of the knob the LED goes from dark to bright four times, dropping back to dark each time.",
      kk: "Тұтқаны толық бір бұрағанда жарықдиод күңгірттен жарыққа дейін төрт рет жанып, әр жолы қайта сөнеді.",
      ru: "За один полный поворот ручки светодиод четыре раза разгорается от тусклого до яркого и каждый раз снова гаснет.",
    },
    options: [
      {
        en: "The potentiometer is worn and skips",
        kk: "Потенциометр тозған, секіріп тұр",
        ru: "Потенциометр износился и проскакивает",
      },
      {
        en: "analogRead gives 0–1023, but analogWrite takes only 0–255",
        kk: "analogRead 0–1023 береді, ал analogWrite тек 0–255 қабылдайды",
        ru: "analogRead даёт 0–1023, а analogWrite принимает только 0–255",
      },
      {
        en: "Pin 6 cannot produce PWM",
        kk: "6-пин ШИМ (PWM) шығара алмайды",
        ru: "Пин 6 не умеет выдавать ШИМ",
      },
      {
        en: "The loop runs too fast without a delay",
        kk: "delay болмағандықтан loop тым жылдам айналады",
        ru: "Без delay цикл loop крутится слишком быстро",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The reading goes up to 1023, but analogWrite() only uses 0–255, so the brightness wraps around four times (1024 ÷ 256 = 4). Scale the value first: analogWrite(6, value / 4), or use map(value, 0, 1023, 0, 255).",
      kk: "Оқылған мән 1023-ке дейін жетеді, ал analogWrite() тек 0–255 аралығын пайдаланады, сондықтан жарық төрт рет қайта басталады (1024 ÷ 256 = 4). Алдымен мәнді кішірейт: analogWrite(6, value / 4) немесе map(value, 0, 1023, 0, 255) қолдан.",
      ru: "Значение доходит до 1023, а analogWrite() использует только 0–255, поэтому яркость четыре раза начинается сначала (1024 ÷ 256 = 4). Сначала уменьши значение: analogWrite(6, value / 4) или map(value, 0, 1023, 0, 255).",
    },
  },
  {
    id: "baud-mismatch",
    lesson: "serial",
    title: {
      en: "The monitor that prints nonsense",
      kk: "Түсініксіз таңбалар шығаратын монитор",
      ru: "Монитор, который печатает абракадабру",
    },
    primer: {
      en: "Serial sends text one bit at a time at an agreed speed, called the baud rate. The Arduino and the Serial Monitor must use the same speed. If they differ, the bits are cut in the wrong places and turn into random symbols.",
      kk: "Serial мәтінді келісілген жылдамдықпен бір-бір биттен жібереді; бұл жылдамдық бод (baud) деп аталады. Arduino мен Serial Monitor бірдей жылдамдықты қолдануы керек. Жылдамдық әртүрлі болса, биттер дұрыс емес жерден бөлініп, кездейсоқ таңбаларға айналады.",
      ru: "Serial передаёт текст по одному биту с условленной скоростью — она называется скоростью в бодах (baud). У Arduino и Serial Monitor скорость должна совпадать. Если она разная, биты режутся не в тех местах и превращаются в случайные символы.",
    },
    goal: {
      en: "The Serial Monitor shows the potentiometer reading as a number, five times a second.",
      kk: "Serial Monitor потенциометр мәнін секундына бес рет сан түрінде көрсетеді.",
      ru: "Serial Monitor показывает значение потенциометра числом, пять раз в секунду.",
    },
    diagram: {
      pins: ["5V", "A0", "GND"],
      parts: [
        { id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["pot.1", "5V"],
        ["uno.A0", "pot.2"],
        ["pot.3", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: potLeg1, to: same("5V") },
      { from: potLeg2, to: same("A0") },
      { from: potLeg3, to: same("GND") },
    ],
    code: potReadCode,
    symptom: {
      en: "The Serial Monitor, set to 115200 baud, fills with random symbols like ÿ§x¤ instead of numbers.",
      kk: "115200 бод жылдамдығына қойылған Serial Monitor сандардың орнына ÿ§x¤ сияқты кездейсоқ таңбаларға толады.",
      ru: "Serial Monitor, настроенный на 115200 бод, вместо чисел заполняется случайными символами вроде ÿ§x¤.",
    },
    options: [
      {
        en: "The potentiometer sends a broken signal",
        kk: "Потенциометр бұзылған сигнал жіберіп тұр",
        ru: "Потенциометр передаёт испорченный сигнал",
      },
      {
        en: "Serial.println cannot print an int",
        kk: "Serial.println int түрін шығара алмайды",
        ru: "Serial.println не умеет печатать int",
      },
      {
        en: "The USB cable is too long",
        kk: "USB кабелі тым ұзын",
        ru: "USB-кабель слишком длинный",
      },
      {
        en: "The sketch and the Serial Monitor use different baud rates",
        kk: "Скетч пен Serial Monitor әртүрлі бод жылдамдығын қолданады",
        ru: "В скетче и в Serial Monitor выбрана разная скорость",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The sketch talks at 9600 baud, the monitor listens at 115200. Nothing is wrong with the circuit. Set the monitor to 9600, or change the code to Serial.begin(115200).",
      kk: "Скетч 9600 бодпен жібереді, ал монитор 115200-де тыңдайды. Тізбекте ақау жоқ. Мониторды 9600-ге қой немесе кодты Serial.begin(115200) деп өзгерт.",
      ru: "Скетч передаёт на скорости 9600 бод, а монитор слушает на 115200. Со схемой всё в порядке. Поставь в мониторе 9600 или поменяй код на Serial.begin(115200).",
    },
  },
  {
    id: "sonar-swapped",
    lesson: "debugging",
    title: {
      en: "The sensor that sees nothing",
      kk: "Ештеңе көрмейтін датчик",
      ru: "Датчик, который ничего не видит",
    },
    primer: {
      en: "The HC-SR04 measures distance with sound. The Arduino sends a short pulse to the Trig pin; the sensor emits ultrasound and holds its Echo pin HIGH for as long as the sound takes to come back. pulseIn() measures that time, and returns 0 if no pulse arrives.",
      kk: "HC-SR04 қашықтықты дыбыс арқылы өлшейді. Arduino Trig пиніне қысқа импульс жібереді; датчик ультрадыбыс шығарып, дыбыс қайтып келгенше Echo пинін HIGH күйінде ұстайды. pulseIn() осы уақытты өлшейді, ал импульс келмесе 0 қайтарады.",
      ru: "HC-SR04 измеряет расстояние звуком. Arduino подаёт короткий импульс на пин Trig; датчик излучает ультразвук и держит пин Echo в HIGH столько времени, сколько звук летит туда и обратно. pulseIn() измеряет это время и возвращает 0, если импульс не пришёл.",
    },
    goal: {
      en: "The Serial Monitor shows the distance to the nearest obstacle in centimetres.",
      kk: "Serial Monitor ең жақын кедергіге дейінгі қашықтықты сантиметрмен көрсетеді.",
      ru: "Serial Monitor показывает расстояние до ближайшего препятствия в сантиметрах.",
    },
    diagram: {
      pins: ["5V", "9", "10", "GND"],
      parts: [
        {
          id: "hc",
          kind: "chip",
          title: same("HC-SR04"),
          x: 330,
          y: 102,
          left: ["VCC", "Trig", "Echo", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["hc.VCC", "5V"],
        ["uno.9", "hc.Trig"],
        ["uno.10", "hc.Echo"],
        ["hc.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: same("HC-SR04 VCC"), to: same("5V") },
      { from: same("HC-SR04 Trig"), to: pin("9") },
      { from: same("HC-SR04 Echo"), to: pin("10") },
      { from: same("HC-SR04 GND"), to: same("GND") },
    ],
    code: `const int trigPin = 10;
const int echoPin = 9;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long cm = duration / 58;
  Serial.println(cm);
  delay(200);
}`,
    symptom: {
      en: "The Serial Monitor prints 0 about once a second, wherever the obstacle is.",
      kk: "Кедергі қай жерде тұрса да, Serial Monitor шамамен секундына бір рет 0 шығарады.",
      ru: "Serial Monitor примерно раз в секунду печатает 0, где бы ни стояло препятствие.",
    },
    options: [
      {
        en: "The sensor cannot measure in a lit room",
        kk: "Датчик жарық бөлмеде өлшей алмайды",
        ru: "Датчик не может измерять в светлой комнате",
      },
      { en: "The division by 58 is wrong", kk: "58-ге бөлу қате", ru: "Деление на 58 неверное" },
      {
        en: "Trig and Echo are swapped between the wiring and the code",
        kk: "Сызба мен кодта Trig пен Echo орындары ауысып кеткен",
        ru: "Trig и Echo перепутаны между схемой и кодом",
      },
      {
        en: "Serial.begin must come after pinMode",
        kk: "Serial.begin pinMode-тан кейін тұруы керек",
        ru: "Serial.begin должен стоять после pinMode",
      },
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "In the wiring Trig is on pin 9 and Echo on pin 10, but the code says trigPin = 10 and echoPin = 9. The trigger pulse never reaches Trig, so no echo comes back and pulseIn() times out with 0. Swap the two numbers in the code (or the two wires).",
      kk: "Сызбада Trig 9-пинге, Echo 10-пинге қосылған, ал кодта trigPin = 10 және echoPin = 9 деп жазылған. Іске қосу импульсі Trig-ке жетпейді, сондықтан жаңғырық қайтпайды, pulseIn() күту уақыты біткенде 0 қайтарады. Кодтағы екі санды (немесе екі сымды) ауыстыр.",
      ru: "На схеме Trig подключён к пину 9, а Echo — к пину 10, но в коде написано trigPin = 10 и echoPin = 9. Запускающий импульс не доходит до Trig, эхо не возвращается, и pulseIn() по тайм-ауту возвращает 0. Поменяй местами два числа в коде (или два провода).",
    },
  },
  {
    id: "i2c-swapped",
    lesson: "special-pins",
    title: {
      en: "The screen with nothing to say",
      kk: "Ештеңе көрсетпейтін экран",
      ru: "Экран, которому нечего сказать",
    },
    primer: {
      en: "I2C is a way to connect a display or sensor with just two signal wires: SDA carries the data and SCL carries the clock that keeps both sides in step. On an Arduino Uno these have fixed pins: SDA is A4 and SCL is A5.",
      kk: "I2C — дисплейді немесе датчикті тек екі сигнал сымымен қосу тәсілі: SDA деректерді тасиды, ал SCL екі жақты үйлестіріп тұратын тактілік сигналды береді. Arduino Uno-да олардың пиндері тұрақты: SDA — A4, SCL — A5.",
      ru: "I2C — способ подключить дисплей или датчик всего двумя сигнальными проводами: SDA передаёт данные, а SCL — тактовый сигнал, который синхронизирует обе стороны. На Arduino Uno у них фиксированные пины: SDA — это A4, SCL — это A5.",
    },
    goal: {
      en: "The display shows the word Hello.",
      kk: "Дисплей Hello сөзін көрсетеді.",
      ru: "Дисплей показывает слово Hello.",
    },
    diagram: {
      pins: ["5V", "A4", "A5", "GND"],
      parts: [
        {
          id: "lcd",
          kind: "chip",
          title: same("LCD 16×2 (I2C)"),
          x: 330,
          y: 102,
          left: ["VCC", "SCL", "SDA", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["lcd.VCC", "5V"],
        ["uno.A4", "lcd.SCL"],
        ["uno.A5", "lcd.SDA"],
        ["lcd.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: same("LCD VCC"), to: same("5V") },
      { from: same("LCD SCL"), to: same("A4") },
      { from: same("LCD SDA"), to: same("A5") },
      { from: same("LCD GND"), to: same("GND") },
    ],
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Hello");
}

void loop() {
}`,
    symptom: {
      en: "The backlight is on, but no text appears. An I2C scanner sketch reports that no devices were found.",
      kk: "Артқы жарық жанып тұр, бірақ мәтін шықпайды. I2C сканер скетчі ешқандай құрылғы табылмағанын хабарлайды.",
      ru: "Подсветка горит, но текст не появляется. Скетч-сканер I2C сообщает, что устройств не найдено.",
    },
    options: [
      {
        en: "lcd.print() only works inside loop()",
        kk: "lcd.print() тек loop() ішінде жұмыс істейді",
        ru: "lcd.print() работает только внутри loop()",
      },
      {
        en: "SDA and SCL are swapped",
        kk: "SDA мен SCL орындары ауысып кеткен",
        ru: "SDA и SCL перепутаны местами",
      },
      {
        en: "The display has too few columns for this word",
        kk: "Бұл сөз үшін дисплейдің бағандары жетпейді",
        ru: "У дисплея не хватает столбцов для этого слова",
      },
      {
        en: "The display needs its own resistor on VCC",
        kk: "Дисплейдің VCC сымына жеке резистор керек",
        ru: "Дисплею нужен отдельный резистор на VCC",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "On the Uno, SDA is A4 and SCL is A5, but here SCL goes to A4 and SDA to A5. With the two lines crossed the board cannot talk to the display at all, which is why the scanner finds nothing. Swap the two wires.",
      kk: "Uno-да SDA — A4, SCL — A5, ал мұнда SCL A4-ке, SDA A5-ке қосылған. Екі желі айқасып кеткендіктен плата дисплеймен мүлдем байланыса алмайды, сканердің ештеңе таппайтыны да содан. Екі сымның орнын ауыстыр.",
      ru: "На Uno SDA — это A4, а SCL — A5, но здесь SCL идёт на A4, а SDA на A5. С перепутанными линиями плата вообще не может общаться с дисплеем, поэтому сканер ничего не находит. Поменяй два провода местами.",
    },
  },
  {
    id: "button-short",
    lesson: "circuit",
    title: {
      en: "The button that kills the board",
      kk: "Платаны өшіретін батырма",
      ru: "Кнопка, которая выключает плату",
    },
    primer: {
      en: "A short circuit is a path from 5V to GND with nothing in between to limit the current. The current becomes huge, the voltage collapses, and the board or the USB port shuts down to protect itself. Between 5V and GND there must always be a load or a resistor.",
      kk: "Қысқа тұйықталу — 5V мен GND арасында токты шектейтін ештеңе жоқ жол. Ток өте үлкен болып, кернеу құлайды да, плата немесе USB порты өзін қорғау үшін өшеді. 5V мен GND арасында әрқашан жүктеме немесе резистор болуы керек.",
      ru: "Короткое замыкание — это путь от 5V к GND, на котором ничто не ограничивает ток. Ток становится огромным, напряжение падает, и плата или USB-порт отключаются, чтобы защитить себя. Между 5V и GND всегда должна быть нагрузка или резистор.",
    },
    goal: {
      en: "The Serial Monitor prints 1 while the button is held and 0 when it is released.",
      kk: "Батырма басулы тұрғанда Serial Monitor 1, жіберілгенде 0 шығарады.",
      ru: "Serial Monitor печатает 1, пока кнопка нажата, и 0, когда она отпущена.",
    },
    diagram: {
      pins: ["5V", "2", "GND"],
      parts: [{ id: "sw", kind: "button", x: 250, y: 142 }],
      wires: [
        ["uno.5V", "5V"],
        ["uno.2", "sw.a"],
        ["sw.b", "5V"],
        ["sw.a", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: pin("2"), to: buttonLegA },
      {
        from: buttonLegA,
        to: { en: "GND (plain wire)", kk: "GND (жай сым)", ru: "GND (обычный провод)" },
      },
      { from: buttonLegB, to: same("5V") },
    ],
    code: `void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT);
}

void loop() {
  Serial.println(digitalRead(2));
  delay(100);
}`,
    symptom: {
      en: "While the button is released the monitor prints 0. The moment it is pressed, the board's power light goes out and the computer reports that the USB device was disconnected.",
      kk: "Батырма жіберулі кезде монитор 0 шығарады. Оны басқан сәтте платаның қорек шамы сөнеді де, компьютер USB құрылғысы ажыратылғанын хабарлайды.",
      ru: "Пока кнопка отпущена, монитор печатает 0. В момент нажатия индикатор питания на плате гаснет, а компьютер сообщает, что USB-устройство отключено.",
    },
    options: [
      {
        en: "Pressing the button connects 5V straight to GND",
        kk: "Батырманы басқанда 5V тікелей GND-ға қосылады",
        ru: "При нажатии кнопка соединяет 5V напрямую с GND",
      },
      {
        en: "delay(100) is too short and overloads the USB port",
        kk: "delay(100) тым қысқа, USB портына артық жүктеме түсіреді",
        ru: "delay(100) слишком короткая и перегружает USB-порт",
      },
      {
        en: "Pin 2 should be set as OUTPUT",
        kk: "2-пин OUTPUT режимінде болуы керек",
        ru: "Пин 2 нужно настроить как OUTPUT",
      },
      {
        en: "Serial cannot work together with a button",
        kk: "Serial батырмамен бірге жұмыс істей алмайды",
        ru: "Serial не может работать одновременно с кнопкой",
      },
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "Pin 2 is tied to GND with a plain wire where a pull-down resistor should be. When the button closes, 5V is connected to GND through nothing but wire: a short circuit. Replace that wire with a 10 kΩ resistor. Then only half a milliamp flows when the button is pressed, and the pin reads a clean HIGH.",
      kk: "2-пин GND-ға pull-down резисторы тұруы тиіс жерде жай сыммен қосылған. Батырма тұйықталғанда 5V сым арқылы тікелей GND-ға қосылады — бұл қысқа тұйықталу. Сол сымды 10 кОм резистормен ауыстыр. Сонда батырма басылғанда тек жарты миллиампер ток өтеді, ал пин анық HIGH оқиды.",
      ru: "Пин 2 соединён с GND обычным проводом там, где должен стоять резистор подтяжки к земле (pull-down). Когда кнопка замыкается, 5V соединяется с GND одним только проводом — это короткое замыкание. Замени этот провод резистором 10 кОм. Тогда при нажатии потечёт всего полмиллиампера, а пин прочитает чистый HIGH.",
    },
  },
  {
    id: "motor-on-pin",
    lesson: "power",
    title: {
      en: "The motor that won't spin",
      kk: "Айналмайтын мотор",
      ru: "Мотор, который не крутится",
    },
    primer: {
      en: "An Arduino pin is a signal source, not a power supply: it can safely give about 20 mA. A small DC motor needs hundreds of milliamps, and more when it starts. Loads like that are switched through a transistor or a motor driver, with their own power source.",
      kk: "Arduino пині — қорек көзі емес, сигнал көзі: ол қауіпсіз түрде шамамен 20 мА ғана бере алады. Кішкентай тұрақты ток моторына жүздеген миллиампер керек, іске қосылғанда одан да көп. Мұндай жүктемелер транзистор немесе мотор драйвері арқылы, өз қорек көзімен қосылады.",
      ru: "Пин Arduino — источник сигнала, а не питания: он безопасно отдаёт около 20 мА. Маленькому мотору постоянного тока нужны сотни миллиампер, а при старте ещё больше. Такие нагрузки включают через транзистор или драйвер мотора, от отдельного источника питания.",
    },
    goal: {
      en: "The motor spins at about half speed.",
      kk: "Мотор шамамен жарты жылдамдықпен айналады.",
      ru: "Мотор вращается примерно на половине скорости.",
    },
    diagram: {
      pins: ["9", "GND"],
      parts: [{ id: "m1", kind: "motor", x: 250, y: 90 }],
      wires: [
        ["uno.9", "m1.a"],
        ["m1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      {
        from: pin("9"),
        to: { en: "Motor, terminal 1", kk: "Мотордың 1-контактісі", ru: "Мотор, контакт 1" },
      },
      {
        from: { en: "Motor, terminal 2", kk: "Мотордың 2-контактісі", ru: "Мотор, контакт 2" },
        to: same("GND"),
      },
    ],
    code: `void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, 128);
}`,
    symptom: {
      en: "The motor only hums or twitches and does not spin. The Arduino chip gets warm.",
      kk: "Мотор тек ызыңдайды немесе дірілдейді, бірақ айналмайды. Arduino микросхемасы қызады.",
      ru: "Мотор только гудит или дёргается, но не вращается. Микросхема Arduino нагревается.",
    },
    options: [
      {
        en: "128 is too low; only 255 can start a motor",
        kk: "128 тым аз; моторды тек 255 қана қозғалта алады",
        ru: "128 слишком мало; мотор запускается только от 255",
      },
      {
        en: "Pin 9 cannot produce PWM",
        kk: "9-пин ШИМ (PWM) шығара алмайды",
        ru: "Пин 9 не умеет выдавать ШИМ",
      },
      {
        en: "The motor is wired backwards",
        kk: "Мотор теріс қосылған",
        ru: "Мотор подключён наоборот",
      },
      {
        en: "A pin cannot supply enough current for a motor",
        kk: "Пин моторға жеткілікті ток бере алмайды",
        ru: "Пин не может дать мотору достаточный ток",
      },
    ],
    answer: 3,
    faultType: "limits",
    explanation: {
      en: "The motor is connected straight to pin 9, which can give about 20 mA while the motor wants hundreds. The pin is overloaded and can be damaged. Drive the motor through a transistor or a driver board such as the L298N, powered from a battery, and let the pin only send the signal. A reversed DC motor would simply spin the other way.",
      kk: "Мотор тікелей 9-пинге қосылған; пин шамамен 20 мА бере алады, ал моторға жүздеген миллиампер керек. Пинге артық жүктеме түсіп, ол зақымдануы мүмкін. Моторды транзистор немесе L298N сияқты драйвер платасы арқылы батареядан қоректендір, ал пин тек сигнал жіберсін. Теріс қосылған мотор жай кері бағытта айналар еді.",
      ru: "Мотор подключён прямо к пину 9, который отдаёт около 20 мА, а мотору нужны сотни. Пин перегружен и может выйти из строя. Питай мотор от батареи через транзистор или плату-драйвер, например L298N, а пин пусть только подаёт сигнал. Мотор, подключённый наоборот, просто вращался бы в другую сторону.",
    },
  },
  {
    id: "servo-brownout",
    lesson: "power",
    title: {
      en: "The board that keeps restarting",
      kk: "Қайта-қайта өшіп-қосылатын плата",
      ru: "Плата, которая всё время перезагружается",
    },
    primer: {
      en: "A servo motor draws a burst of current every time it starts to move; a large one can pull more than 1 A. The Uno's 5V pin, fed from USB, can give roughly 0.5 A in total. If the voltage dips, the microcontroller resets.",
      kk: "Сервомотор қозғала бастаған сайын көп ток тартады; үлкен серво 1 А-ден де артық алуы мүмкін. USB-ден қоректенетін Uno-ның 5V пині барлығы шамамен 0,5 А бере алады. Кернеу төмендеп кетсе, микроконтроллер қайта іске қосылады.",
      ru: "Сервомотор потребляет большой ток каждый раз, когда начинает движение; крупный серво может брать больше 1 А. Пин 5V у Uno при питании от USB отдаёт в сумме примерно 0,5 А. Если напряжение проседает, микроконтроллер перезагружается.",
    },
    goal: sweepGoal,
    diagram: {
      pins: ["5V", "9", "GND"],
      parts: [
        {
          id: "servo",
          kind: "chip",
          title: servoTitle,
          x: 330,
          y: 76,
          left: ["V+", "Signal", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["servo.V+", "5V"],
        ["uno.9", "servo.Signal"],
        ["servo.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: servoV, to: same("5V") },
      { from: servoSignal, to: pin("9") },
      { from: servoGnd, to: same("GND") },
    ],
    code: sweepCode,
    symptom: {
      en: "The servo jerks a little, then the board restarts: the sketch begins again from setup(). This repeats forever and the servo never reaches 180°.",
      kk: "Серво сәл жұлқынады, сосын плата қайта іске қосылады: скетч setup()-тан қайта басталады. Бұл шексіз қайталанады, серво 180°-қа жетпейді.",
      ru: "Серво чуть дёргается, после чего плата перезагружается: скетч снова начинается с setup(). Так повторяется бесконечно, серво не доходит до 180°.",
    },
    options: [
      {
        en: "The servo takes more current than the 5V pin can give",
        kk: "Серво 5V пині бере алатыннан көп ток тартады",
        ru: "Серво потребляет больше тока, чем может дать пин 5V",
      },
      {
        en: "delay(1000) is too short for a servo",
        kk: "delay(1000) серво үшін тым қысқа",
        ru: "delay(1000) слишком короткая для серво",
      },
      {
        en: "A servo cannot turn to 180°",
        kk: "Серво 180°-қа бұрыла алмайды",
        ru: "Серво не может повернуться на 180°",
      },
      {
        en: "Pin 9 is the wrong pin for a servo signal",
        kk: "9-пин серво сигналына жарамайды",
        ru: "Пин 9 не подходит для сигнала серво",
      },
    ],
    answer: 0,
    faultType: "power",
    explanation: {
      en: "The large servo is powered from the Uno's 5V pin. When it starts moving it pulls so much current that the voltage drops and the microcontroller resets. Give the servo its own 5–6 V supply (for example 4×AA), connect only the signal wire to pin 9, and join the supply's minus to Arduino GND.",
      kk: "Үлкен серво Uno-ның 5V пинінен қоректеніп тұр. Қозғала бастағанда ол соншалықты көп ток тартады, кернеу түсіп кетіп, микроконтроллер қайта іске қосылады. Сервоға бөлек 5–6 В қорек көзін бер (мысалы, 4×AA), 9-пинге тек сигнал сымын қос, ал қорек көзінің минусын Arduino GND-мен біріктір.",
      ru: "Большой серво питается от пина 5V платы Uno. В начале движения он берёт столько тока, что напряжение проседает и микроконтроллер перезагружается. Дай серво отдельный источник 5–6 В (например, 4×AA), к пину 9 подключи только сигнальный провод, а минус источника соедини с GND Arduino.",
    },
  },
  {
    id: "no-common-ground",
    lesson: "circuit",
    title: {
      en: "The servo that ignores orders",
      kk: "Бұйрыққа бағынбайтын серво",
      ru: "Серво, который не слушается",
    },
    primer: {
      en: "Voltage is always measured between two points. For the servo to understand the signal from pin 9, it must share the same zero level as the Arduino. That is why the minus of every power source in a project is joined together: a common ground.",
      kk: "Кернеу әрқашан екі нүктенің арасында өлшенеді. Серво 9-пиннен келетін сигналды түсінуі үшін оның нөлдік деңгейі Arduino-мен ортақ болуы керек. Сол себепті жобадағы барлық қорек көздерінің минусы өзара қосылады — бұл ортақ жер (common ground) деп аталады.",
      ru: "Напряжение всегда измеряется между двумя точками. Чтобы серво понял сигнал с пина 9, у него должен быть общий с Arduino нулевой уровень. Поэтому минусы всех источников питания в проекте соединяют вместе — это называется общей землёй (common ground).",
    },
    goal: sweepGoal,
    diagram: {
      pins: ["9", "GND"],
      parts: [
        {
          id: "servo",
          kind: "chip",
          title: servoTitle,
          x: 300,
          y: 50,
          left: ["Signal"],
          right: ["V+", "GND"],
        },
        {
          id: "bat",
          kind: "chip",
          title: { en: "Battery 4×AA", kk: "Батарея 4×AA", ru: "Батарея 4×AA" },
          x: 500,
          y: 50,
          left: ["+", "−"],
        },
      ],
      wires: [
        ["uno.9", "servo.Signal"],
        ["servo.V+", "bat.+"],
        ["servo.GND", "bat.−"],
      ],
    },
    wiring: [
      { from: { en: "Battery +", kk: "Батарея +", ru: "Батарея +" }, to: servoV },
      { from: { en: "Battery −", kk: "Батарея −", ru: "Батарея −" }, to: servoGnd },
      { from: pin("9"), to: servoSignal },
    ],
    code: sweepCode,
    symptom: {
      en: "The servo has power but twitches randomly or does not move at all. The board itself runs fine and does not restart.",
      kk: "Сервода қорек бар, бірақ ол кездейсоқ дірілдейді немесе мүлдем қозғалмайды. Платаның өзі дұрыс жұмыс істеп тұр, қайта қосылмайды.",
      ru: "Питание у серво есть, но он хаотично дёргается или не двигается вовсе. Сама плата работает нормально и не перезагружается.",
    },
    options: [
      {
        en: "Four AA batteries are too weak for a servo",
        kk: "Төрт AA батарея серво үшін тым әлсіз",
        ru: "Четыре батарейки AA слишком слабые для серво",
      },
      {
        en: "The battery minus is not connected to Arduino GND",
        kk: "Батареяның минусы Arduino GND-ға қосылмаған",
        ru: "Минус батареи не соединён с GND Arduino",
      },
      {
        en: "The servo must be powered from the 5V pin",
        kk: "Серво 5V пинінен қоректенуі керек",
        ru: "Серво обязательно нужно питать от пина 5V",
      },
      {
        en: "Servo.h does not work with external power",
        kk: "Servo.h сыртқы қорекпен жұмыс істемейді",
        ru: "Servo.h не работает с внешним питанием",
      },
    ],
    answer: 1,
    faultType: "power",
    explanation: {
      en: "The servo and the Arduino have separate power sources with no shared ground, so the signal on pin 9 has nothing to be measured against. Add one wire from the battery minus (servo GND) to an Arduino GND pin. Do not connect the battery plus to the 5V pin.",
      kk: "Серво мен Arduino-ның қорек көздері бөлек және ортақ жері жоқ, сондықтан 9-пиндегі сигналды салыстыратын деңгей жоқ. Батареяның минусынан (сервоның GND-сынан) Arduino-ның GND пиніне бір сым қос. Батареяның плюсін 5V пиніне қоспа.",
      ru: "У серво и Arduino отдельные источники питания без общей земли, поэтому сигналу на пине 9 не от чего отсчитываться. Добавь один провод от минуса батареи (GND серво) к пину GND Arduino. Плюс батареи к пину 5V не подключай.",
    },
  },
  {
    id: "delay-blocks",
    lesson: "timing",
    title: {
      en: "The button that gets ignored",
      kk: "Елеусіз қалатын батырма",
      ru: "Кнопка, которую не замечают",
    },
    primer: {
      en: "delay() stops the whole program. While it waits, the board reads no buttons and no sensors. A program that must both wait and watch cannot use long delays; it checks the clock with millis() instead and keeps looping.",
      kk: "delay() бүкіл бағдарламаны тоқтатады. Күтіп тұрғанда плата батырманы да, датчикті де оқымайды. Әрі күтуі, әрі бақылауы керек бағдарлама ұзақ delay қолдана алмайды; оның орнына millis() арқылы уақытты тексеріп, циклді тоқтатпай айналдыра береді.",
      ru: "delay() останавливает всю программу. Пока идёт ожидание, плата не читает ни кнопки, ни датчики. Программа, которая должна и ждать, и следить, не может использовать длинные задержки; вместо этого она сверяется с часами через millis() и продолжает крутить цикл.",
    },
    goal: {
      en: "The LED switches on and off every second, and every press of the button is counted and printed.",
      kk: "Жарықдиод әр секунд сайын жанып-сөнеді, ал батырманың әр басылуы саналып, экранға шығады.",
      ru: "Светодиод каждую секунду переключается, а каждое нажатие кнопки считается и выводится на печать.",
    },
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `int count = 0;

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    count++;
    Serial.println(count);
  }

  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
}`,
    symptom: {
      en: "The LED blinks correctly, but quick presses are almost never counted. A press only registers if the button is held down for a second or two.",
      kk: "Жарықдиод дұрыс жыпылықтайды, бірақ жылдам басулар саналмайды десе де болады. Батырманы бір-екі секунд басып тұрғанда ғана басу тіркеледі.",
      ru: "Светодиод мигает правильно, но быстрые нажатия почти никогда не считаются. Нажатие засчитывается, только если держать кнопку секунду-две.",
    },
    options: [
      {
        en: "The button needs an external pull-up resistor",
        kk: "Батырмаға сыртқы pull-up резисторы керек",
        ru: "Кнопке нужен внешний подтягивающий резистор",
      },
      {
        en: "The program spends almost all its time inside delay() and does not read the button",
        kk: "Бағдарлама уақытының бәрін дерлік delay() ішінде өткізеді де, батырманы оқымайды",
        ru: "Программа почти всё время стоит в delay() и не читает кнопку",
      },
      {
        en: "count should be a float",
        kk: "count айнымалысы float болуы керек",
        ru: "Переменная count должна быть float",
      },
      {
        en: "9600 baud is too slow to print the count",
        kk: "9600 бод санды шығару үшін тым баяу",
        ru: "9600 бод — слишком медленно, чтобы вывести счёт",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The button is read once per loop, and one loop takes two seconds because of the two delays. A short press that falls inside a delay is never seen. Remove the delays: remember when the LED last changed with millis(), switch it when a second has passed, and let the loop run freely so the button is checked thousands of times a second.",
      kk: "Батырма әр циклде бір рет оқылады, ал екі delay-ге байланысты бір цикл екі секундқа созылады. delay кезіне түскен қысқа басу мүлдем байқалмайды. delay-лерді алып таста: жарықдиод соңғы рет қашан ауысқанын millis() арқылы есте сақта, бір секунд өткенде оны ауыстыр, ал цикл еркін айнала берсін — сонда батырма секундына мыңдаған рет тексеріледі.",
      ru: "Кнопка читается один раз за цикл, а один цикл из-за двух задержек длится две секунды. Короткое нажатие, попавшее внутрь delay, не замечается вообще. Убери задержки: запоминай через millis(), когда светодиод переключался в последний раз, переключай его, когда прошла секунда, и пусть цикл крутится свободно — тогда кнопка проверяется тысячи раз в секунду.",
    },
  },
  {
    id: "millis-int",
    lesson: "timing",
    title: {
      en: "The blink that breaks after half a minute",
      kk: "Жарты минуттан кейін бұзылатын жыпылық",
      ru: "Мигание, которое ломается через полминуты",
    },
    primer: {
      en: "millis() returns the number of milliseconds since the board started, as an unsigned long: a type that holds numbers up to about 4 billion. An int on the Uno holds only −32 768 to 32 767. Put a bigger number into an int and it wraps around to a wrong value.",
      kk: "millis() плата іске қосылғаннан бергі миллисекунд санын unsigned long түрінде қайтарады — бұл түр шамамен 4 миллиардқа дейінгі сандарды сақтайды. Uno-дағы int тек −32 768-ден 32 767-ге дейінгі санды сақтай алады. int-ке одан үлкен сан салсаң, ол сыймай, қате мәнге айналады.",
      ru: "millis() возвращает число миллисекунд с момента запуска платы в виде unsigned long — этот тип вмещает числа примерно до 4 миллиардов. Тип int на Uno вмещает только от −32 768 до 32 767. Если положить в int число больше, оно «переворачивается» и превращается в неверное значение.",
    },
    goal: {
      en: "The LED switches on and off every second, without using delay().",
      kk: "Жарықдиод delay() қолданбай, әр секунд сайын жанып-сөнеді.",
      ru: "Светодиод каждую секунду переключается, без использования delay().",
    },
    diagram: ledCircuit("8"),
    wiring: [
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `int lastChange = 0;
bool on = false;

void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  if (millis() - lastChange >= 1000) {
    lastChange = millis();
    on = !on;
    digitalWrite(8, on);
  }
}`,
    symptom: {
      en: "For the first half-minute after a reset the LED blinks correctly. Then it stops blinking and glows steadily at about half brightness.",
      kk: "Қайта іске қосқаннан кейінгі алғашқы жарты минутта жарықдиод дұрыс жыпылықтайды. Содан кейін жыпылықтауын қойып, шамамен жарты жарықпен тұрақты жанып тұрады.",
      ru: "Первые полминуты после перезапуска светодиод мигает правильно. Потом он перестаёт мигать и ровно светится примерно вполсилы.",
    },
    options: [
      {
        en: "lastChange is an int and overflows after about 32 seconds",
        kk: "lastChange — int, ол шамамен 32 секундтан кейін толып кетеді",
        ru: "lastChange имеет тип int и переполняется примерно через 32 секунды",
      },
      {
        en: "The LED overheats after half a minute",
        kk: "Жарықдиод жарты минуттан кейін қызып кетеді",
        ru: "Светодиод перегревается через полминуты",
      },
      {
        en: "millis() stops counting after 30 seconds",
        kk: "millis() 30 секундтан кейін санауын тоқтатады",
        ru: "millis() перестаёт считать через 30 секунд",
      },
      {
        en: "digitalWrite cannot take a bool",
        kk: "digitalWrite bool түрін қабылдай алмайды",
        ru: "digitalWrite не принимает bool",
      },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "After 32 767 ms, about 32 seconds, the time no longer fits in an int. lastChange gets a wrong value, the comparison becomes true on every pass of the loop, and the LED is switched thousands of times a second, which looks like half brightness. Declare it as unsigned long lastChange = 0; so it has the same type as millis().",
      kk: "32 767 мс-тан, яғни шамамен 32 секундтан кейін уақыт int-ке сыймайды. lastChange қате мән алады, салыстыру циклдің әр айналымында ақиқат болады да, жарықдиод секундына мыңдаған рет ауысады — бұл жарты жарық сияқты көрінеді. Оны unsigned long lastChange = 0; деп жарияла, сонда оның түрі millis()-пен бірдей болады.",
      ru: "После 32 767 мс, то есть примерно через 32 секунды, время перестаёт помещаться в int. В lastChange попадает неверное значение, сравнение становится истинным на каждом проходе цикла, и светодиод переключается тысячи раз в секунду — это выглядит как половина яркости. Объяви переменную как unsigned long lastChange = 0;, чтобы её тип совпадал с millis().",
    },
  },
  {
    id: "serial-pins",
    lesson: "special-pins",
    title: {
      en: "The sketch that won't upload",
      kk: "Жүктелмейтін скетч",
      ru: "Скетч, который не загружается",
    },
    primer: {
      en: "Pins 0 (RX) and 1 (TX) are the Uno's serial port. The same two lines go to the USB chip, so the computer uses them to upload sketches and to talk to the Serial Monitor. Anything else connected to these pins talks over the top of the computer.",
      kk: "0 (RX) және 1 (TX) пиндері — Uno-ның тізбекті порты. Дәл осы екі желі USB микросхемасына да барады, сондықтан компьютер скетч жүктеу және Serial Monitor-мен байланысу үшін соларды қолданады. Бұл пиндерге қосылған басқа кез келген нәрсе компьютердің сөзін бөледі.",
      ru: "Пины 0 (RX) и 1 (TX) — это последовательный порт Uno. Те же две линии идут к USB-микросхеме, поэтому компьютер использует их, чтобы загружать скетчи и общаться с Serial Monitor. Всё остальное, подключённое к этим пинам, перебивает компьютер.",
    },
    goal: {
      en: "A phone sends text over Bluetooth, and the Arduino prints it to the Serial Monitor.",
      kk: "Телефон Bluetooth арқылы мәтін жібереді, ал Arduino оны Serial Monitor-ға шығарады.",
      ru: "Телефон отправляет текст по Bluetooth, а Arduino выводит его в Serial Monitor.",
    },
    diagram: {
      pins: ["5V", "0", "1", "GND"],
      parts: [
        {
          id: "bt",
          kind: "chip",
          title: same("HC-05 Bluetooth"),
          x: 330,
          y: 102,
          left: ["VCC", "TXD", "RXD", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["bt.VCC", "5V"],
        ["uno.0", "bt.TXD"],
        ["uno.1", "bt.RXD"],
        ["bt.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: same("HC-05 VCC"), to: same("5V") },
      {
        from: same("HC-05 TXD"),
        to: { en: "Pin 0 (RX)", kk: "0-пин (RX)", ru: "Пин 0 (RX)" },
      },
      {
        from: same("HC-05 RXD"),
        to: { en: "Pin 1 (TX)", kk: "1-пин (TX)", ru: "Пин 1 (TX)" },
      },
      { from: same("HC-05 GND"), to: same("GND") },
    ],
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    Serial.write(Serial.read());
  }
}`,
    symptom: {
      en: "Every upload fails with an error such as \"programmer is not responding\". With the Bluetooth module unplugged, the same sketch uploads fine.",
      kk: "Әр жүктеу «programmer is not responding» сияқты қатемен аяқталады. Bluetooth модулін ажыратқанда сол скетч еш қиындықсыз жүктеледі.",
      ru: "Каждая загрузка заканчивается ошибкой вроде «programmer is not responding». Если отключить Bluetooth-модуль, тот же скетч загружается без проблем.",
    },
    options: [
      {
        en: "The sketch is too large for the Uno",
        kk: "Скетч Uno үшін тым үлкен",
        ru: "Скетч слишком большой для Uno",
      },
      {
        en: "The module draws too much current from 5V",
        kk: "Модуль 5V-тан тым көп ток тартады",
        ru: "Модуль берёт слишком большой ток от 5V",
      },
      {
        en: "9600 baud is too slow for uploading",
        kk: "9600 бод жүктеу үшін тым баяу",
        ru: "9600 бод — слишком медленно для загрузки",
      },
      {
        en: "The module sits on pins 0 and 1, which the computer needs for uploading",
        kk: "Модуль компьютерге жүктеу үшін қажет 0 және 1-пиндерде тұр",
        ru: "Модуль занимает пины 0 и 1, которые нужны компьютеру для загрузки",
      },
    ],
    answer: 3,
    faultType: "limits",
    explanation: {
      en: "Uploading goes through pins 0 and 1. The Bluetooth module is connected to the same pins and holds the line while the computer is trying to send the sketch. Move the module to two other pins, for example 10 and 11, and read it with the SoftwareSerial library. Then USB and Bluetooth each have their own line.",
      kk: "Жүктеу 0 және 1-пиндер арқылы өтеді. Bluetooth модулі дәл сол пиндерге қосылған және компьютер скетчті жібермек болғанда желіні бос қалдырмайды. Модульді басқа екі пинге, мысалы 10 мен 11-ге ауыстырып, оны SoftwareSerial кітапханасымен оқы. Сонда USB мен Bluetooth-тың әрқайсысында өз желісі болады.",
      ru: "Загрузка идёт через пины 0 и 1. Bluetooth-модуль подключён к тем же пинам и занимает линию, когда компьютер пытается передать скетч. Переставь модуль на два других пина, например 10 и 11, и читай его через библиотеку SoftwareSerial. Тогда у USB и у Bluetooth будет по своей линии.",
    },
  },

  // Level 1: electricity from zero, no board and no code.
  {
    id: "open-loop",
    lesson: "circuit",
    title: {
      en: "The light with no way back",
      kk: "Қайтар жолы жоқ жарық",
      ru: "Свет без обратной дороги",
    },
    primer: {
      en: "Electric current is a flow of charge, and it only flows around a complete loop: out of the battery's plus, through the parts, and back into the battery's minus. If the loop is broken anywhere, nothing flows at all.",
      kk: "Электр тогы — зарядтың ағыны, және ол тек тұйық жолмен ғана ағады: батареяның плюсінен шығып, бөлшектер арқылы өтіп, батареяның минусына қайтады. Жол бір жерінен үзілсе, ток мүлдем ақпайды.",
      ru: "Электрический ток — это поток заряда, и течёт он только по замкнутому пути: из плюса батарейки, через детали и обратно в минус батарейки. Если путь где-то разорван, ток не течёт совсем.",
    },
    goal: lightGoal,
    diagram: batteryCircuit(
      "4.5",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100 },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
      ],
      false,
    ),
    wiring: [
      { from: batteryPlus, to: resistor },
      { from: resistorOut, to: ledLong },
    ],
    code: "",
    symptom: {
      en: "The LED does not light up.",
      kk: "Жарықдиод жанбайды.",
      ru: "Светодиод не горит.",
    },
    options: [
      {
        en: "The battery is too strong for one LED",
        kk: "Батарея бір жарықдиод үшін тым күшті",
        ru: "Батарейка слишком мощная для одного светодиода",
      },
      {
        en: "The loop is not closed: nothing connects the LED back to the battery's minus",
        kk: "Тізбек тұйықталмаған: жарықдиодты батареяның минусына ештеңе қоспайды",
        ru: "Цепь не замкнута: светодиод ничем не соединён с минусом батарейки",
      },
      {
        en: "The resistor should come after the LED, not before it",
        kk: "Резистор жарықдиодтан бұрын емес, кейін тұруы керек",
        ru: "Резистор должен стоять после светодиода, а не перед ним",
      },
      {
        en: "An LED needs two batteries",
        kk: "Жарықдиодқа екі батарея керек",
        ru: "Светодиоду нужны две батарейки",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "Current leaves the battery's plus, passes the resistor and reaches the LED, but from there it has nowhere to go: the LED's short leg and the battery's minus are both left unconnected. Add a wire from the short leg to the minus. The order of the resistor and the LED in the loop does not matter.",
      kk: "Ток батареяның плюсінен шығып, резистор арқылы жарықдиодқа жетеді, бірақ одан әрі баратын жері жоқ: жарықдиодтың қысқа аяғы да, батареяның минусы да қосылмай қалған. Қысқа аяқтан минусқа дейін сым қос. Резистор мен жарықдиодтың тізбектегі реті маңызды емес.",
      ru: "Ток выходит из плюса батарейки, проходит резистор и доходит до светодиода, но дальше ему некуда идти: и короткая ножка светодиода, и минус батарейки остались неподключёнными. Добавь провод от короткой ножки к минусу. Порядок резистора и светодиода в цепи значения не имеет.",
    },
  },
  {
    id: "short-wire",
    lesson: "circuit",
    title: { en: "The shortcut", kk: "Төте жол", ru: "Короткий путь" },
    primer: {
      en: "Current takes the easiest path. A plain wire has almost no resistance, so if a wire offers a way from plus to minus that skips the parts, nearly all the current goes that way. This is a short circuit: the parts get nothing, and the battery heats up and drains fast.",
      kk: "Ток ең оңай жолды таңдайды. Жай сымның кедергісі жоқтың қасы, сондықтан сым плюстен минусқа бөлшектерді айналып өтетін жол ашса, токтың бәрі дерлік сол жолмен кетеді. Бұл — қысқа тұйықталу: бөлшектерге ештеңе жетпейді, ал батарея қызып, тез таусылады.",
      ru: "Ток выбирает самый лёгкий путь. У обычного провода почти нет сопротивления, поэтому если провод открывает дорогу от плюса к минусу в обход деталей, почти весь ток пойдёт по нему. Это короткое замыкание: деталям ничего не достаётся, а батарейка греется и быстро садится.",
    },
    goal: lightGoal,
    diagram: batteryCircuit(
      "4.5",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100 },
        { id: "j1", kind: "wire", x: 500, y: 100 },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["j1.a", "5V"],
        ["j1.b", "GND"],
      ],
    ),
    wiring: [
      { from: batteryPlus, to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: batteryMinus },
      {
        from: batteryPlus,
        to: {
          en: "Battery − (extra wire)",
          kk: "Батарея − (артық сым)",
          ru: "Батарея − (лишний провод)",
        },
      },
    ],
    code: "",
    symptom: {
      en: "The LED stays dark, and the battery becomes hot to the touch.",
      kk: "Жарықдиод жанбайды, ал батарея ұстағанда ыстық болып тұр.",
      ru: "Светодиод не горит, а батарейка становится горячей на ощупь.",
    },
    options: [
      {
        en: "An extra wire joins plus straight to minus, so the current skips the LED",
        kk: "Артық сым плюсті тікелей минусқа қосып тұр, сондықтан ток жарықдиодты айналып өтеді",
        ru: "Лишний провод соединяет плюс прямо с минусом, и ток идёт в обход светодиода",
      },
      optLedBackwards,
      { en: "The resistor is too large", kk: "Резистор тым үлкен", ru: "Резистор слишком большой" },
      { en: "The battery is flat", kk: "Батареяның заряды біткен", ru: "Батарейка села" },
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "The LED branch is wired correctly, but next to it a plain wire runs from plus to minus. The current rushes through that wire instead of the LED. Remove the extra wire. A flat battery would not get hot.",
      kk: "Жарықдиод тармағы дұрыс жиналған, бірақ оның жанында плюстен минусқа жай сым тартылған. Ток жарықдиод арқылы емес, сол сым арқылы ағады. Артық сымды алып таста. Заряды біткен батарея қызбас еді.",
      ru: "Ветка со светодиодом собрана правильно, но рядом с ней от плюса к минусу идёт обычный провод. Ток устремляется по нему, а не через светодиод. Убери лишний провод. Севшая батарейка не грелась бы.",
    },
  },
  {
    id: "low-voltage",
    lesson: "electricity",
    title: {
      en: "One battery is not enough",
      kk: "Бір батарея жеткіліксіз",
      ru: "Одной батарейки мало",
    },
    primer: {
      en: "Voltage is the push a battery gives. One AA battery pushes with 1.5 V. A red LED lets current through only when the push is about 2 V or more; below that it behaves like a closed door.",
      kk: "Кернеу — батарея беретін итеру күші. Бір AA батарея 1,5 В береді. Қызыл жарықдиод итеру шамамен 2 В немесе одан жоғары болғанда ғана ток өткізеді; одан төмен болса, ол жабық есік сияқты.",
      ru: "Напряжение — это сила, с которой батарейка толкает ток. Одна батарейка AA даёт 1,5 В. Красный светодиод пропускает ток, только когда толчок около 2 В или больше; при меньшем он ведёт себя как закрытая дверь.",
    },
    goal: lightGoal,
    diagram: batteryCircuit(
      "1.5",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100 },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: [
      { from: batteryPlus, to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: batteryMinus },
    ],
    code: "",
    symptom: {
      en: "The loop is closed and the LED is the right way round, but it does not light up.",
      kk: "Тізбек тұйық, жарықдиод дұрыс бағытта тұр, бірақ ол жанбайды.",
      ru: "Цепь замкнута, светодиод стоит правильной стороной, но не горит.",
    },
    options: [
      { en: "The wires are too long", kk: "Сымдар тым ұзын", ru: "Провода слишком длинные" },
      {
        en: "The loop needs a second resistor",
        kk: "Тізбекке екінші резистор керек",
        ru: "В цепи нужен второй резистор",
      },
      {
        en: "1.5 V is less than the 2 V the LED needs",
        kk: "1,5 В жарықдиодқа қажет 2 В-тан аз",
        ru: "1,5 В меньше, чем 2 В, которые нужны светодиоду",
      },
      {
        en: "The LED must be connected before the resistor",
        kk: "Жарықдиод резистордан бұрын қосылуы керек",
        ru: "Светодиод нужно подключить перед резистором",
      },
    ],
    answer: 2,
    faultType: "power",
    explanation: {
      en: "The circuit is correct, but the battery's 1.5 V is not enough to open the LED, so almost no current flows. Put two AA batteries in a row: their voltages add up to 3 V, and the LED lights.",
      kk: "Тізбек дұрыс, бірақ батареяның 1,5 В кернеуі жарықдиодты «ашуға» жетпейді, сондықтан ток өтпейді десе де болады. Екі AA батареяны бірінен соң бірін қой: олардың кернеулері қосылып, 3 В болады да, жарықдиод жанады.",
      ru: "Цепь собрана верно, но 1,5 В от батарейки не хватает, чтобы «открыть» светодиод, поэтому ток почти не течёт. Поставь две батарейки AA друг за другом: их напряжения сложатся в 3 В, и светодиод загорится.",
    },
  },
  {
    id: "no-resistor-9v",
    lesson: "led-resistor",
    title: {
      en: "The flash and the silence",
      kk: "Жарқ етіп, сөніп қалды",
      ru: "Вспышка и тишина",
    },
    primer: {
      en: "The more voltage pushes and the less resistance holds back, the larger the current. An LED has almost no resistance of its own once it opens, so something else must limit the current. That is the resistor's job.",
      kk: "Кернеу неғұрлым көп итерсе және кедергі неғұрлым аз тежесе, ток соғұрлым үлкен болады. Жарықдиод «ашылғаннан» кейін оның өз кедергісі жоқтың қасы, сондықтан токты басқа нәрсе шектеуі керек. Бұл — резистордың міндеті.",
      ru: "Чем сильнее толкает напряжение и чем меньше мешает сопротивление, тем больше ток. У открывшегося светодиода собственного сопротивления почти нет, поэтому ток должно ограничивать что-то другое. Это работа резистора.",
    },
    goal: lightGoal,
    diagram: batteryCircuit(
      "9",
      [{ id: "d1", kind: "led", x: 230, y: 100 }],
      [
        ["d1.a", "5V"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: [
      { from: batteryPlus, to: ledLong },
      { from: ledShort, to: batteryMinus },
    ],
    code: "",
    symptom: {
      en: "The LED flashes very brightly for a moment, then goes dark and never lights again.",
      kk: "Жарықдиод бір сәтке өте жарық жанып, сосын сөнеді де, қайта жанбайды.",
      ru: "Светодиод на мгновение очень ярко вспыхивает, затем гаснет и больше не загорается.",
    },
    options: [
      optLedBackwards,
      {
        en: "The battery ran out in one second",
        kk: "Батарея бір секундта таусылды",
        ru: "Батарейка разрядилась за секунду",
      },
      { en: "The loop was not closed", kk: "Тізбек тұйықталмаған", ru: "Цепь не замкнута" },
      {
        en: "There is no resistor, so the current was far too large and burned the LED",
        kk: "Резистор жоқ, сондықтан ток тым үлкен болып, жарықдиодты күйдірді",
        ru: "Резистора нет, поэтому ток был слишком большим и сжёг светодиод",
      },
    ],
    answer: 3,
    faultType: "component",
    explanation: {
      en: "With 9 V and nothing to limit it, the current through the LED was many times more than it can survive, and it burned out. Always put a resistor in series. For 9 V and a red LED: (9 − 2) ÷ 0.015 A ≈ 470 Ω. A backwards LED would not have flashed at all.",
      kk: "9 В кернеуде және токты шектейтін ештеңе болмағанда, жарықдиод арқылы өткен ток ол шыдай алатын мөлшерден бірнеше есе көп болып, ол күйіп кетті. Әрқашан тізбектей резистор қой. 9 В және қызыл жарықдиод үшін: (9 − 2) ÷ 0,015 А ≈ 470 Ом. Теріс қосылған жарықдиод мүлдем жарқ етпес еді.",
      ru: "При 9 В и без ограничения ток через светодиод оказался во много раз больше допустимого, и светодиод сгорел. Всегда ставь последовательно резистор. Для 9 В и красного светодиода: (9 − 2) ÷ 0,015 А ≈ 470 Ом. Перевёрнутый светодиод не вспыхнул бы вообще.",
    },
  },

  // Level 2: first steps with the board.
  {
    id: "wrong-pin",
    lesson: "what-is-arduino",
    title: {
      en: "The LED at the wrong address",
      kk: "Мекенжайы қате жарықдиод",
      ru: "Светодиод не по тому адресу",
    },
    primer: {
      en: "An Arduino is a small computer with numbered contacts called pins. The program, called a sketch, switches a pin on and off by its number. The number in the code must be the pin the wire is actually plugged into.",
      kk: "Arduino — пин деп аталатын нөмірленген контактілері бар кішкентай компьютер. Скетч деп аталатын бағдарлама пинді нөмірі бойынша қосып-өшіреді. Кодтағы нөмір сым шынымен қосылған пинмен бірдей болуы керек.",
      ru: "Arduino — это маленький компьютер с пронумерованными контактами, которые называют пинами. Программа, её называют скетчем, включает и выключает пин по его номеру. Номер в коде должен совпадать с пином, в который на самом деле вставлен провод.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("9"),
    wiring: ledWiring("9"),
    code: blinkCode,
    symptom: neverLights,
    options: [
      optLedBackwards,
      {
        en: "The 220 Ω resistor is too large",
        kk: "220 Ом резистор тым үлкен",
        ru: "Резистор 220 Ом слишком большой",
      },
      {
        en: "The LED is wired to pin 9, but the code switches pin 8",
        kk: "Жарықдиод 9-пинге қосылған, ал код 8-пинді қосып-өшіреді",
        ru: "Светодиод подключён к пину 9, а код переключает пин 8",
      },
      { en: "delay(500) is too long", kk: "delay(500) тым ұзақ", ru: "delay(500) слишком длинная" },
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "The code blinks pin 8, where nothing is connected. The LED sits on pin 9 and never gets a signal. Either move the wire to pin 8 or change every 8 in the code to 9. The LED itself is the right way round: long leg toward the pin.",
      kk: "Код ештеңе қосылмаған 8-пинді жыпылықтатады. Жарықдиод 9-пинде тұр және оған сигнал келмейді. Не сымды 8-пинге ауыстыр, не кодтағы әр 8-ді 9-ға өзгерт. Жарықдиодтың өзі дұрыс бағытта тұр: ұзын аяғы пин жағында.",
      ru: "Код мигает пином 8, к которому ничего не подключено. Светодиод стоит на пине 9 и сигнала не получает. Либо переставь провод на пин 8, либо замени в коде каждую 8 на 9. Сам светодиод стоит правильно: длинная ножка в сторону пина.",
    },
  },
  {
    id: "no-ground",
    lesson: "what-is-arduino",
    title: { en: "Half a circuit", kk: "Жарты тізбек", ru: "Половина цепи" },
    primer: {
      en: "A pin set HIGH works like the plus of a battery, and the pin marked GND is the minus. The rule of the closed loop still holds: current must leave the pin, pass through the parts, and return to GND.",
      kk: "HIGH күйіне қойылған пин батареяның плюсі сияқты жұмыс істейді, ал GND деп белгіленген пин — минус. Тұйық тізбек ережесі мұнда да сақталады: ток пиннен шығып, бөлшектер арқылы өтіп, GND-ға қайтуы керек.",
      ru: "Пин в состоянии HIGH работает как плюс батарейки, а пин с надписью GND — это минус. Правило замкнутой цепи действует и здесь: ток должен выйти из пина, пройти через детали и вернуться в GND.",
    },
    goal: blinkGoal,
    diagram: {
      pins: ["8", "GND"],
      parts: [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 90 },
        { id: "d1", kind: "led", x: 370, y: 90 },
      ],
      wires: [
        ["uno.8", "r1.a"],
        ["r1.b", "d1.a"],
      ],
    },
    wiring: [
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledLong },
    ],
    code: blinkCode,
    symptom: neverLights,
    options: [
      {
        en: "Pin 8 is never set as OUTPUT",
        kk: "8-пин OUTPUT режиміне қойылмаған",
        ru: "Пин 8 не настроен как OUTPUT",
      },
      {
        en: "The LED's short leg is not connected to GND, so the loop is open",
        kk: "Жарықдиодтың қысқа аяғы GND-ға қосылмаған, сондықтан тізбек ашық",
        ru: "Короткая ножка светодиода не подключена к GND, поэтому цепь разомкнута",
      },
      {
        en: "The sketch needs Serial.begin to run",
        kk: "Скетч жұмыс істеуі үшін Serial.begin керек",
        ru: "Чтобы скетч работал, нужен Serial.begin",
      },
      {
        en: "Pin 8 cannot power an LED",
        kk: "8-пин жарықдиодты қоректендіре алмайды",
        ru: "Пин 8 не может питать светодиод",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "The code is fine and pin 8 does go HIGH, but the current has no way back: nothing connects the LED's short leg to GND. Add that wire and the loop is closed. It is the same fault as a battery circuit with a missing return wire.",
      kk: "Код дұрыс және 8-пин шынымен HIGH болады, бірақ токтың қайтар жолы жоқ: жарықдиодтың қысқа аяғын GND-ға ештеңе қоспайды. Сол сымды қоссаң, тізбек тұйықталады. Бұл — қайтар сымы жоқ батарея тізбегіндегі ақаудың дәл өзі.",
      ru: "Код в порядке, и пин 8 действительно переходит в HIGH, но току некуда вернуться: короткая ножка светодиода ничем не соединена с GND. Добавь этот провод, и цепь замкнётся. Это та же поломка, что и в цепи с батарейкой без обратного провода.",
    },
  },
  {
    id: "missing-semicolon",
    lesson: "sketch-structure",
    title: {
      en: "The sketch that refuses to start",
      kk: "Іске қосылғысы келмейтін скетч",
      ru: "Скетч, который отказывается запускаться",
    },
    primer: {
      en: "Before a sketch reaches the board, the computer checks its grammar. Every command must end with a semicolon, and every opening bracket needs a closing one. If the grammar is wrong, nothing is uploaded and an error message names the place where the check got stuck.",
      kk: "Скетч платаға жетпес бұрын компьютер оның «грамматикасын» тексереді. Әр команда нүктелі үтірмен аяқталуы керек, ал әр ашылған жақшаның жабылатын жұбы болуы тиіс. Грамматика қате болса, ештеңе жүктелмейді, ал қате туралы хабар тексеру тоқтаған жерді көрсетеді.",
      ru: "Прежде чем скетч попадёт на плату, компьютер проверяет его «грамматику». Каждая команда должна заканчиваться точкой с запятой, а у каждой открывающей скобки должна быть закрывающая. Если грамматика нарушена, ничего не загружается, а сообщение об ошибке называет место, где проверка споткнулась.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH)
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`,
    symptom: {
      en: "The sketch does not upload. The editor shows: error: expected ';' before 'delay'.",
      kk: "Скетч жүктелмейді. Редактор мынаны көрсетеді: error: expected ';' before 'delay'.",
      ru: "Скетч не загружается. Редактор показывает: error: expected ';' before 'delay'.",
    },
    options: [
      {
        en: "The semicolon is missing after digitalWrite(8, HIGH)",
        kk: "digitalWrite(8, HIGH) жолынан кейін нүктелі үтір қойылмаған",
        ru: "После digitalWrite(8, HIGH) не стоит точка с запятой",
      },
      {
        en: "The word delay is spelled wrong",
        kk: "delay сөзі қате жазылған",
        ru: "Слово delay написано с ошибкой",
      },
      {
        en: "The board is not connected to the computer",
        kk: "Плата компьютерге қосылмаған",
        ru: "Плата не подключена к компьютеру",
      },
      optLedBackwards,
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "The line digitalWrite(8, HIGH) has no semicolon at the end. The check only notices when it reaches the next word, delay, which is why the message points there. Look at the line just above the one named in an error. The circuit has nothing to do with it: the sketch never reached the board.",
      kk: "digitalWrite(8, HIGH) жолының соңында нүктелі үтір жоқ. Тексеру мұны тек келесі сөзге, яғни delay-ге жеткенде байқайды, хабардың сол жерді көрсететіні содан. Қатеде аталған жолдың дәл үстіндегі жолға қара. Тізбектің бұған қатысы жоқ: скетч платаға жеткен де жоқ.",
      ru: "В конце строки digitalWrite(8, HIGH) нет точки с запятой. Проверка замечает это, только дойдя до следующего слова, delay, поэтому сообщение указывает туда. Смотри на строку прямо над той, что названа в ошибке. Схема тут ни при чём: скетч до платы даже не дошёл.",
    },
  },
  {
    id: "setup-once",
    lesson: "sketch-structure",
    title: {
      en: "The LED that blinks only once",
      kk: "Бір-ақ рет жыпылықтайтын жарықдиод",
      ru: "Светодиод, который мигает один раз",
    },
    primer: {
      en: "Every sketch has two parts. setup() runs once, when the board is switched on or reset. loop() runs after it, over and over, for as long as the board has power. Anything that should keep happening belongs in loop().",
      kk: "Әр скетч екі бөліктен тұрады. setup() плата қосылғанда немесе қайта іске қосылғанда бір рет орындалады. loop() одан кейін, платада қорек бар кезде қайта-қайта орындала береді. Үздіксіз қайталануы керек нәрсенің бәрі loop() ішінде тұруы тиіс.",
      ru: "В каждом скетче две части. setup() выполняется один раз, когда плату включают или перезапускают. loop() выполняется после него снова и снова, пока у платы есть питание. Всё, что должно происходить постоянно, должно стоять в loop().",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}

void loop() {
}`,
    symptom: {
      en: "After power-up the LED lights for half a second, goes out, and never lights again until the board is reset.",
      kk: "Қорек қосылғаннан кейін жарықдиод жарты секунд жанып, сөнеді де, плата қайта іске қосылғанша қайта жанбайды.",
      ru: "После включения светодиод загорается на полсекунды, гаснет и больше не загорается, пока плату не перезапустят.",
    },
    options: [
      {
        en: "The LED burned out after the first flash",
        kk: "Жарықдиод бірінші жанғаннан кейін күйіп кетті",
        ru: "Светодиод сгорел после первой вспышки",
      },
      {
        en: "The blinking commands are in setup(), which runs only once",
        kk: "Жыпылықтату командалары тек бір рет орындалатын setup() ішінде тұр",
        ru: "Команды мигания стоят в setup(), который выполняется только один раз",
      },
      {
        en: "delay(500) stops the board for good",
        kk: "delay(500) платаны біржола тоқтатады",
        ru: "delay(500) останавливает плату навсегда",
      },
      {
        en: "A sketch is not allowed to have an empty loop()",
        kk: "Скетчте бос loop() болуына рұқсат жоқ",
        ru: "В скетче не может быть пустого loop()",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The commands that switch the LED are inside setup(), so they run a single time. loop() is empty, so after that the board does nothing. Leave pinMode in setup() and move the two digitalWrite lines and the two delays into loop().",
      kk: "Жарықдиодты қосып-өшіретін командалар setup() ішінде тұр, сондықтан олар бір-ақ рет орындалады. loop() бос, демек содан кейін плата ештеңе істемейді. pinMode-ты setup() ішінде қалдырып, екі digitalWrite жолы мен екі delay-ді loop() ішіне көшір.",
      ru: "Команды, которые переключают светодиод, стоят внутри setup(), поэтому выполняются один раз. loop() пустой, так что после этого плата ничего не делает. Оставь pinMode в setup(), а две строки digitalWrite и две задержки перенеси в loop().",
    },
  },
  {
    id: "no-second-delay",
    lesson: "sketch-structure",
    title: {
      en: "The blink nobody can see",
      kk: "Ешкім көре алмайтын жыпылық",
      ru: "Мигание, которого не видно",
    },
    primer: {
      en: "The board runs commands one after another, extremely fast: a line takes a few millionths of a second. delay() is the only thing that makes it wait. When loop() reaches its last line, it jumps straight back to the first one.",
      kk: "Плата командаларды бірінен соң бірін өте жылдам орындайды: бір жолға секундтың бірнеше миллионнан бір бөлігі кетеді. Оны күттіретін жалғыз нәрсе — delay(). loop() соңғы жолға жеткенде бірден бірінші жолға қайта оралады.",
      ru: "Плата выполняет команды одну за другой, очень быстро: на строку уходят миллионные доли секунды. Заставить её ждать может только delay(). Когда loop() доходит до последней строки, он сразу перескакивает обратно на первую.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
}`,
    symptom: {
      en: "The LED looks permanently on. No blinking can be seen.",
      kk: "Жарықдиод үнемі жанып тұрғандай көрінеді. Жыпылықтау байқалмайды.",
      ru: "Светодиод выглядит постоянно включённым. Мигания не видно.",
    },
    options: [
      {
        en: "digitalWrite(8, LOW) does not work on pin 8",
        kk: "digitalWrite(8, LOW) 8-пинде жұмыс істемейді",
        ru: "digitalWrite(8, LOW) не работает на пине 8",
      },
      {
        en: "The LED is too bright to see it blink",
        kk: "Жарықдиод тым жарық, сондықтан жыпылықтауы көрінбейді",
        ru: "Светодиод слишком яркий, чтобы заметить мигание",
      },
      {
        en: "There is no delay after switching the LED off, so it is switched back on at once",
        kk: "Жарықдиодты өшіргеннен кейін delay жоқ, сондықтан ол бірден қайта қосылады",
        ru: "После выключения светодиода нет задержки, поэтому он сразу включается снова",
      },
      {
        en: "pinMode must be repeated inside loop()",
        kk: "pinMode-ты loop() ішінде қайталау керек",
        ru: "pinMode нужно повторять внутри loop()",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The LED is switched off, but loop() restarts immediately and switches it on again a few millionths of a second later. The eye cannot see a gap that short. Add delay(500); after digitalWrite(8, LOW) so the LED stays off for half a second too.",
      kk: "Жарықдиод өшіріледі, бірақ loop() бірден қайта басталып, оны секундтың бірнеше миллионнан бір бөлігінен кейін қайта қосады. Көз мұндай қысқа үзілісті көре алмайды. Жарықдиод жарты секунд сөніп те тұруы үшін digitalWrite(8, LOW) жолынан кейін delay(500); қос.",
      ru: "Светодиод выключается, но loop() тут же начинается заново и через миллионные доли секунды включает его снова. Такой короткий промежуток глаз не видит. Добавь delay(500); после digitalWrite(8, LOW), чтобы светодиод полсекунды побыл и выключенным.",
    },
  },

  // Level 4 additions: sensors.
  {
    id: "digital-read-analog",
    lesson: "sensors",
    title: {
      en: "The knob with only two positions",
      kk: "Тек екі күйі бар тұтқа",
      ru: "Ручка всего с двумя положениями",
    },
    primer: {
      en: "A pin can be read in two ways. digitalRead() answers only yes or no: HIGH (1) or LOW (0). analogRead() measures how much: a number from 0 to 1023. A knob or a light sensor needs the second kind.",
      kk: "Пинді екі тәсілмен оқуға болады. digitalRead() тек «иә» немесе «жоқ» деп жауап береді: HIGH (1) немесе LOW (0). analogRead() «қаншалықты» екенін өлшейді: 0-ден 1023-ке дейінгі сан. Тұтқаға немесе жарық датчигіне екінші түрі керек.",
      ru: "Пин можно читать двумя способами. digitalRead() отвечает только «да» или «нет»: HIGH (1) или LOW (0). analogRead() измеряет «сколько»: число от 0 до 1023. Для ручки или датчика света нужен второй способ.",
    },
    goal: {
      en: "Turning the knob changes the number in the Serial Monitor from 0 to 1023.",
      kk: "Тұтқаны бұрағанда Serial Monitor-дағы сан 0-ден 1023-ке дейін өзгереді.",
      ru: "При повороте ручки число в Serial Monitor меняется от 0 до 1023.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = digitalRead(A0);
  Serial.println(value);
  delay(200);
}`,
    symptom: {
      en: "The Serial Monitor prints only 0 or 1. Somewhere near the middle of the turn it flips from one to the other.",
      kk: "Serial Monitor тек 0 немесе 1 шығарады. Бұрылыстың ортасына жақын бір жерде ол бірінен екіншісіне ауысады.",
      ru: "Serial Monitor печатает только 0 или 1. Где-то около середины поворота одно сменяется другим.",
    },
    options: [
      {
        en: "The code uses digitalRead, which can only return 0 or 1",
        kk: "Кодта тек 0 немесе 1 қайтара алатын digitalRead қолданылған",
        ru: "В коде используется digitalRead, который возвращает только 0 или 1",
      },
      {
        en: "The potentiometer is broken in the middle",
        kk: "Потенциометр ортасынан сынған",
        ru: "Потенциометр сломан посередине",
      },
      {
        en: "A0 cannot be used with Serial",
        kk: "A0-ді Serial-мен бірге қолдануға болмайды",
        ru: "A0 нельзя использовать вместе с Serial",
      },
      {
        en: "The variable must be a float",
        kk: "Айнымалы float болуы керек",
        ru: "Переменная должна быть float",
      },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "The wiring is right, but digitalRead() only tells whether the voltage is above or below roughly half of 5 V. Change it to analogRead(A0) to get the full range from 0 to 1023.",
      kk: "Сызба дұрыс, бірақ digitalRead() кернеу 5 В-тың шамамен жартысынан жоғары ма, төмен бе — соны ғана айтады. 0-ден 1023-ке дейінгі толық ауқымды алу үшін оны analogRead(A0) деп өзгерт.",
      ru: "Схема собрана верно, но digitalRead() сообщает только, выше или ниже напряжение примерно половины от 5 В. Замени его на analogRead(A0), чтобы получить весь диапазон от 0 до 1023.",
    },
  },
  {
    id: "ldr-no-divider",
    lesson: "sensors",
    title: {
      en: "The light sensor that sees only daylight",
      kk: "Тек күндізді көретін жарық датчигі",
      ru: "Датчик света, который видит только день",
    },
    primer: {
      en: "A photoresistor (LDR) changes its resistance with light, but an Arduino pin measures voltage, not resistance. To turn one into the other, the LDR is paired with a fixed resistor: the two share the 5 V between them, and the pin reads the point in the middle. This pair is called a voltage divider.",
      kk: "Фоторезистор (LDR) жарыққа байланысты кедергісін өзгертеді, бірақ Arduino пині кедергіні емес, кернеуді өлшейді. Бірін екіншісіне айналдыру үшін LDR тұрақты резистормен жұптастырылады: екеуі 5 В-ты өзара бөліседі, ал пин ортадағы нүктені оқиды. Бұл жұп кернеу бөлгіш деп аталады.",
      ru: "Фоторезистор (LDR) меняет сопротивление в зависимости от света, но пин Arduino измеряет напряжение, а не сопротивление. Чтобы превратить одно в другое, фоторезистор ставят в пару с постоянным резистором: они делят 5 В между собой, а пин читает точку посередине. Такая пара называется делителем напряжения.",
    },
    goal: {
      en: "The number in the Serial Monitor goes up in bright light and down when the sensor is covered.",
      kk: "Жарық көп болғанда Serial Monitor-дағы сан өседі, датчикті жапқанда азаяды.",
      ru: "Число в Serial Monitor растёт на ярком свету и падает, когда датчик закрывают.",
    },
    diagram: {
      pins: ["5V", "A0", "GND"],
      parts: [{ id: "ldr", kind: "resistor", label: "LDR", x: 250, y: 142 }],
      wires: [
        ["uno.5V", "5V"],
        ["uno.A0", "ldr.a"],
        ["ldr.b", "5V"],
      ],
    },
    wiring: [
      {
        from: same("A0"),
        to: {
          en: "Photoresistor, leg 1",
          kk: "Фоторезистордың 1-аяғы",
          ru: "Фоторезистор, ножка 1",
        },
      },
      {
        from: {
          en: "Photoresistor, leg 2",
          kk: "Фоторезистордың 2-аяғы",
          ru: "Фоторезистор, ножка 2",
        },
        to: same("5V"),
      },
    ],
    code: potReadCode,
    symptom: {
      en: "The Serial Monitor prints numbers close to 1023 whether the sensor is in bright light or covered by a hand.",
      kk: "Датчик жарықта тұрса да, қолмен жабылса да, Serial Monitor 1023-ке жақын сандарды шығарады.",
      ru: "Serial Monitor печатает числа около 1023 и на ярком свету, и когда датчик закрыт рукой.",
    },
    options: [
      {
        en: "The photoresistor is plugged in backwards",
        kk: "Фоторезистор теріс қосылған",
        ru: "Фоторезистор вставлен наоборот",
      },
      {
        en: "A0 must be set as INPUT_PULLUP",
        kk: "A0-ді INPUT_PULLUP режиміне қою керек",
        ru: "A0 нужно настроить как INPUT_PULLUP",
      },
      {
        en: "delay(200) hides the changes",
        kk: "delay(200) өзгерістерді жасырады",
        ru: "delay(200) скрывает изменения",
      },
      {
        en: "There is no fixed resistor from A0 to GND, so there is no voltage divider",
        kk: "A0 мен GND арасында тұрақты резистор жоқ, демек кернеу бөлгіш те жоқ",
        ru: "Между A0 и GND нет постоянного резистора, значит нет делителя напряжения",
      },
    ],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "The photoresistor connects A0 to 5V, and nothing connects A0 to GND. With no second resistor to share the voltage, the pin always sits near 5 V. Add a 10 kΩ resistor from A0 to GND. A photoresistor has no direction, so it cannot be backwards.",
      kk: "Фоторезистор A0-ді 5V-қа қосады, ал A0-ді GND-ға ештеңе қоспайды. Кернеуді бөлісетін екінші резистор болмағандықтан, пинде әрдайым 5 В-қа жуық кернеу тұрады. A0 мен GND арасына 10 кОм резистор қос. Фоторезистордың бағыты жоқ, сондықтан оны теріс қосу мүмкін емес.",
      ru: "Фоторезистор соединяет A0 с 5V, а с GND пин A0 не соединяет ничто. Без второго резистора, с которым можно поделить напряжение, на пине всегда около 5 В. Добавь резистор 10 кОм между A0 и GND. У фоторезистора нет направления, поэтому вставить его наоборот нельзя.",
    },
  },

  // Level 6 additions: code that looks right.
  {
    id: "assign-in-if",
    lesson: "code-traps",
    title: {
      en: "The prize that comes too early",
      kk: "Тым ерте берілген сыйлық",
      ru: "Приз, который выдают слишком рано",
    },
    primer: {
      en: "In code a single = means \"put this value in\", and a double == means \"is it equal to?\". They look alike and both are accepted by the compiler, but if (x = 5) does not ask a question: it sets x to 5 and then counts as true.",
      kk: "Кодта жалғыз = «осы мәнді сал» дегенді, ал қос == «тең бе?» дегенді білдіреді. Олар бір-біріне ұқсас және компилятор екеуін де қабылдайды, бірақ if (x = 5) сұрақ қоймайды: ол x-ке 5 мәнін береді де, ақиқат болып есептеледі.",
      ru: "В коде одиночный = означает «положи это значение», а двойной == означает «равно ли?». Они похожи, и компилятор принимает оба, но if (x = 5) не задаёт вопрос: он кладёт в x число 5 и после этого считается истиной.",
    },
    goal: {
      en: "The LED turns on after the button has been pressed five times.",
      kk: "Батырма бес рет басылғаннан кейін жарықдиод жанады.",
      ru: "Светодиод загорается после пяти нажатий кнопки.",
    },
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `int presses = 0;

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    presses++;
    delay(300);
  }

  if (presses = 5) {
    digitalWrite(8, HIGH);
  }
}`,
    symptom: {
      en: "The LED turns on the moment the board gets power, before the button has been touched.",
      kk: "Жарықдиод платаға қорек берілген сәтте, батырмаға әлі тимей тұрып жанады.",
      ru: "Светодиод загорается сразу при подаче питания, ещё до того, как к кнопке прикоснулись.",
    },
    options: [
      {
        en: "The button is wired to the wrong pin",
        kk: "Батырма қате пинге қосылған",
        ru: "Кнопка подключена не к тому пину",
      },
      {
        en: "presses = 5 sets the variable instead of comparing it",
        kk: "presses = 5 айнымалыны салыстырмайды, оған мән береді",
        ru: "presses = 5 не сравнивает переменную, а записывает в неё значение",
      },
      {
        en: "delay(300) presses the button five times",
        kk: "delay(300) батырманы бес рет басады",
        ru: "delay(300) нажимает кнопку пять раз",
      },
      {
        en: "INPUT_PULLUP switches the LED on",
        kk: "INPUT_PULLUP жарықдиодты қосады",
        ru: "INPUT_PULLUP включает светодиод",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "if (presses = 5) puts 5 into presses and is treated as true, so the LED is switched on in the very first pass of loop(). Write if (presses == 5), or better if (presses >= 5) so the LED stays on after more presses.",
      kk: "if (presses = 5) presses айнымалысына 5 мәнін салады да, ақиқат деп саналады, сондықтан жарықдиод loop()-тың ең бірінші айналымында-ақ қосылады. if (presses == 5) деп жаз, ал одан да дұрысы — if (presses >= 5), сонда одан көп басқанда да жарықдиод жанып тұрады.",
      ru: "if (presses = 5) кладёт в presses число 5 и считается истиной, поэтому светодиод включается на самом первом проходе loop(). Напиши if (presses == 5), а лучше if (presses >= 5), чтобы светодиод оставался включённым и после следующих нажатий.",
    },
  },
  {
    id: "int-division",
    lesson: "code-traps",
    title: {
      en: "The voltmeter stuck at zero",
      kk: "Нөлде тұрып қалған вольтметр",
      ru: "Вольтметр, застрявший на нуле",
    },
    primer: {
      en: "When both numbers in a division are whole numbers, the result is a whole number too: the fraction is thrown away. So 5 / 1023 is not 0.0049, it is 0. To keep the fraction, at least one of the numbers must be written with a decimal point, like 5.0.",
      kk: "Бөлудегі екі сан да бүтін болса, нәтиже де бүтін болады: бөлшек бөлігі алынып тасталады. Сондықтан 5 / 1023 — 0,0049 емес, 0. Бөлшекті сақтау үшін сандардың кемінде біреуі ондық нүктемен жазылуы керек, мысалы 5.0.",
      ru: "Когда оба числа при делении целые, результат тоже целый: дробная часть отбрасывается. Поэтому 5 / 1023 — это не 0,0049, а 0. Чтобы сохранить дробь, хотя бы одно из чисел нужно записать с десятичной точкой, например 5.0.",
    },
    goal: {
      en: "The Serial Monitor shows the voltage on A0, from 0.00 to 5.00 V, as the knob is turned.",
      kk: "Тұтқаны бұрағанда Serial Monitor A0-дегі кернеуді 0.00-ден 5.00 В-қа дейін көрсетеді.",
      ru: "При повороте ручки Serial Monitor показывает напряжение на A0 от 0.00 до 5.00 В.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(A0);
  float volts = reading * (5 / 1023);
  Serial.println(volts);
  delay(500);
}`,
    symptom: {
      en: "The Serial Monitor prints 0.00 at every position of the knob.",
      kk: "Тұтқаның кез келген күйінде Serial Monitor 0.00 шығарады.",
      ru: "При любом положении ручки Serial Monitor печатает 0.00.",
    },
    options: [
      {
        en: "The potentiometer is not connected to 5V",
        kk: "Потенциометр 5V-қа қосылмаған",
        ru: "Потенциометр не подключён к 5V",
      },
      {
        en: "Serial.println cannot print a float",
        kk: "Serial.println float түрін шығара алмайды",
        ru: "Serial.println не умеет печатать float",
      },
      {
        en: "5 / 1023 is whole-number division and gives 0",
        kk: "5 / 1023 — бүтін сандарды бөлу, оның нәтижесі 0",
        ru: "5 / 1023 — деление целых чисел, и оно даёт 0",
      },
      { en: "delay(500) is too long", kk: "delay(500) тым ұзақ", ru: "delay(500) слишком длинная" },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The wiring is complete, so the reading is fine. But 5 / 1023 is calculated first, with whole numbers, and gives 0; anything times 0 is 0. Write reading * (5.0 / 1023.0) so the division keeps its fraction.",
      kk: "Сызба толық, демек оқылған мән дұрыс. Бірақ алдымен 5 / 1023 бүтін сандармен есептеліп, 0 береді; ал кез келген санды 0-ге көбейтсең, 0 шығады. Бөлу бөлшегін сақтауы үшін reading * (5.0 / 1023.0) деп жаз.",
      ru: "Схема собрана полностью, так что показание верное. Но сначала считается 5 / 1023 в целых числах, и получается 0; а любое число, умноженное на 0, даёт 0. Напиши reading * (5.0 / 1023.0), чтобы деление сохранило дробную часть.",
    },
  },
  {
    id: "button-bounce",
    lesson: "buttons",
    title: {
      en: "The button that counts double",
      kk: "Екі еселеп санайтын батырма",
      ru: "Кнопка, которая считает дважды",
    },
    primer: {
      en: "Inside a button two pieces of metal touch. For a few thousandths of a second after they meet, they bounce apart and together again. A person cannot feel it, but the board is fast enough to see every bounce as a separate press.",
      kk: "Батырманың ішінде екі металл бөлік түйіседі. Түйіскеннен кейін секундтың бірнеше мыңнан бір бөлігі бойы олар бір-бірінен ыршып, қайта түйіседі. Адам мұны сезбейді, бірақ плата соншалықты жылдам, әр ыршуды жеке басу ретінде көреді.",
      ru: "Внутри кнопки соприкасаются два кусочка металла. Несколько тысячных долей секунды после касания они отскакивают друг от друга и смыкаются снова. Человек этого не чувствует, но плата достаточно быстра, чтобы принять каждый отскок за отдельное нажатие.",
    },
    goal: {
      en: "Every press of the button adds exactly 1 to the count in the Serial Monitor.",
      kk: "Батырманың әр басылуы Serial Monitor-дағы санға дәл 1 қосады.",
      ru: "Каждое нажатие кнопки прибавляет к счёту в Serial Monitor ровно 1.",
    },
    diagram: {
      pins: ["2", "GND"],
      parts: [{ id: "sw", kind: "button", x: 250, y: 90 }],
      wires: [
        ["uno.2", "sw.a"],
        ["sw.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: pin("2"), to: buttonLegA },
      { from: buttonLegB, to: same("GND") },
    ],
    code: `int count = 0;
bool wasPressed = false;

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  bool pressed = digitalRead(2) == LOW;
  if (pressed && !wasPressed) {
    count++;
    Serial.println(count);
  }
  wasPressed = pressed;
}`,
    symptom: {
      en: "Most presses add 1, but every so often a single press makes the count jump by 2, 3 or even 4.",
      kk: "Басулардың көбі 1 қосады, бірақ анда-санда бір ғана басу санды 2-ге, 3-ке, тіпті 4-ке секіртеді.",
      ru: "Большинство нажатий прибавляет 1, но время от времени одно нажатие увеличивает счёт сразу на 2, 3 или даже 4.",
    },
    options: [
      {
        en: "The contacts bounce, and the fast loop counts each bounce",
        kk: "Контактілер ыршиды, ал жылдам цикл әр ыршуды санайды",
        ru: "Контакты дребезжат, а быстрый цикл считает каждый отскок",
      },
      {
        en: "count++ sometimes adds more than 1",
        kk: "count++ кейде 1-ден көп қосады",
        ru: "count++ иногда прибавляет больше 1",
      },
      { en: "The pin is floating", kk: "Пин ілініп тұр", ru: "Пин висит в воздухе" },
      {
        en: "9600 baud repeats lines",
        kk: "9600 бод жолдарды қайталайды",
        ru: "На скорости 9600 бод строки повторяются",
      },
    ],
    answer: 0,
    faultType: "component",
    explanation: {
      en: "The code is logically right, and INPUT_PULLUP keeps the pin from floating. The extra counts come from contact bounce: one press is really several quick on-off flickers. After you detect a change, ignore the button for about 30 ms, for example with a short delay(30) or by comparing times with millis(). This is called debouncing.",
      kk: "Кодтың логикасы дұрыс, ал INPUT_PULLUP пинді ілініп қалудан сақтайды. Артық санаулар контактілердің ыршуынан пайда болады: бір басу шын мәнінде бірнеше жылдам қосылып-өшу. Өзгерісті байқағаннан кейін батырманы шамамен 30 мс елеме — мысалы, қысқа delay(30) арқылы немесе millis() көмегімен уақытты салыстырып. Бұл контакт дірілін басу (debounce) деп аталады.",
      ru: "Логика кода верная, а INPUT_PULLUP не даёт пину висеть в воздухе. Лишние отсчёты появляются из-за дребезга контактов: одно нажатие на самом деле состоит из нескольких быстрых включений и выключений. Обнаружив изменение, не обращай внимания на кнопку примерно 30 мс — например, с помощью короткого delay(30) или сравнивая время через millis(). Это называется подавлением дребезга (debounce).",
    },
  },

  // A second and third mission for topics that had only one.
  {
    id: "dim-on-battery",
    lesson: "electricity",
    title: { en: "Lit, but barely", kk: "Жанады, бірақ әрең", ru: "Горит, но еле-еле" },
    primer: {
      en: "A resistor and an LED in a row share the battery's voltage. The LED takes its 2 V first; what is left pushes current through the resistor. Current = what is left ÷ resistance, so with a small battery the resistor must be small too.",
      kk: "Тізбектей қосылған резистор мен жарықдиод батарея кернеуін өзара бөліседі. Алдымен жарықдиод өзінің 2 В-ын алады; қалғаны токты резистор арқылы итереді. Ток = қалған кернеу ÷ кедергі, сондықтан батарея кіші болса, резистор да кіші болуы керек.",
      ru: "Резистор и светодиод, включённые друг за другом, делят напряжение батарейки. Сначала светодиод забирает свои 2 В; то, что осталось, толкает ток через резистор. Ток = остаток ÷ сопротивление, поэтому при маленькой батарейке резистор тоже должен быть маленьким.",
    },
    goal: {
      en: "The LED shines brightly.",
      kk: "Жарықдиод жарық жанады.",
      ru: "Светодиод ярко горит.",
    },
    diagram: batteryCircuit(
      "3",
      [
        { id: "r1", kind: "resistor", label: "1 kΩ", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100 },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: [
      {
        from: batteryPlus,
        to: { en: "1 kΩ resistor", kk: "1 кОм резистор", ru: "Резистор 1 кОм" },
      },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: batteryMinus },
    ],
    code: "",
    symptom: {
      en: "The LED glows so weakly that it is hard to tell whether it is on.",
      kk: "Жарықдиод соншалықты әлсіз жанады, оның қосулы екенін айыру қиын.",
      ru: "Светодиод светится так слабо, что трудно понять, включён ли он.",
    },
    options: [
      { en: "The loop is not closed", kk: "Тізбек тұйықталмаған", ru: "Цепь не замкнута" },
      optLedBackwards,
      {
        en: "The resistor is too large for a 3 V battery",
        kk: "3 В батарея үшін резистор тым үлкен",
        ru: "Резистор слишком большой для батарейки 3 В",
      },
      {
        en: "A 3 V battery cannot light an LED at all",
        kk: "3 В батарея жарықдиодты мүлдем жандыра алмайды",
        ru: "Батарейка 3 В вообще не может зажечь светодиод",
      },
    ],
    answer: 2,
    faultType: "component",
    explanation: {
      en: "The loop is closed and the LED is the right way round, which is why it glows at all. After the LED takes 2 V only 1 V is left, and 1 V ÷ 1000 Ω = 1 mA, far below the 10–15 mA a bright LED needs. Use a resistor of about 68 Ω: 1 V ÷ 68 Ω ≈ 15 mA.",
      kk: "Тізбек тұйық және жарықдиод дұрыс бағытта тұр, сондықтан ол аз да болса жанады. Жарықдиод 2 В алғаннан кейін тек 1 В қалады, ал 1 В ÷ 1000 Ом = 1 мА — бұл жарық жануға қажет 10–15 мА-ден әлдеқайда аз. Шамамен 68 Ом резистор қой: 1 В ÷ 68 Ом ≈ 15 мА.",
      ru: "Цепь замкнута, и светодиод стоит правильно, поэтому он вообще светится. После того как светодиод забрал 2 В, остаётся всего 1 В, а 1 В ÷ 1000 Ом = 1 мА — намного меньше 10–15 мА, нужных для яркого свечения. Поставь резистор около 68 Ом: 1 В ÷ 68 Ом ≈ 15 мА.",
    },
  },
  {
    id: "gnd-to-5v",
    lesson: "what-is-arduino",
    title: { en: "Plus on both sides", kk: "Екі жағында да плюс", ru: "Плюс с обеих сторон" },
    primer: {
      en: "Current flows only when there is a difference in voltage between the two ends of a part. A pin set HIGH is at 5 V. The 5V pin is also at 5 V. Between two points at the same voltage nothing flows.",
      kk: "Ток тек бөлшектің екі ұшының арасында кернеу айырмасы болғанда ғана ағады. HIGH күйіндегі пинде 5 В болады. 5V пинінде де 5 В. Кернеуі бірдей екі нүктенің арасында ештеңе ақпайды.",
      ru: "Ток течёт только тогда, когда между двумя концами детали есть разница напряжений. На пине в состоянии HIGH — 5 В. На пине 5V тоже 5 В. Между двумя точками с одинаковым напряжением ничего не течёт.",
    },
    goal: blinkGoal,
    diagram: {
      pins: ["5V", "8"],
      parts: [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 142 },
        { id: "d1", kind: "led", x: 370, y: 142 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["uno.8", "r1.a"],
        ["r1.b", "d1.a"],
        ["d1.b", "5V"],
      ],
    },
    wiring: [
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("5V") },
    ],
    code: blinkCode,
    symptom: neverLights,
    options: [
      {
        en: "Pin 8 is never set as OUTPUT",
        kk: "8-пин OUTPUT режиміне қойылмаған",
        ru: "Пин 8 не настроен как OUTPUT",
      },
      {
        en: "delay(500) is too short for the eye to notice",
        kk: "delay(500) тым қысқа, көз байқап үлгермейді",
        ru: "delay(500) слишком короткая, глаз не успевает заметить",
      },
      {
        en: "The 220 Ω resistor is too large",
        kk: "220 Ом резистор тым үлкен",
        ru: "Резистор 220 Ом слишком большой",
      },
      {
        en: "The LED's short leg goes to 5V instead of GND",
        kk: "Жарықдиодтың қысқа аяғы GND орнына 5V-қа қосылған",
        ru: "Короткая ножка светодиода подключена к 5V вместо GND",
      },
    ],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "The LED's short leg is on 5V. When pin 8 is HIGH, both ends of the circuit are at 5 V and no current flows; when it is LOW, the LED faces the wrong way. Either way it stays dark. Move the short leg to GND.",
      kk: "Жарықдиодтың қысқа аяғы 5V-қа қосылған. 8-пин HIGH болғанда тізбектің екі ұшында да 5 В тұрады да, ток ақпайды; ал LOW болғанда жарықдиод токқа қарсы бағытта тұрады. Екі жағдайда да ол жанбайды. Қысқа аяқты GND-ға ауыстыр.",
      ru: "Короткая ножка светодиода стоит на 5V. Когда пин 8 в HIGH, на обоих концах цепи 5 В и ток не течёт; когда в LOW, светодиод оказывается включён навстречу току. В обоих случаях он не горит. Переставь короткую ножку на GND.",
    },
  },
  {
    id: "button-to-5v",
    lesson: "buttons",
    title: {
      en: "The button nobody hears",
      kk: "Ешкім естімейтін батырма",
      ru: "Кнопка, которую никто не слышит",
    },
    primer: {
      en: "INPUT_PULLUP holds the pin at HIGH through a resistor inside the board. A button can only change that by connecting the pin to GND. If the button connects the pin to 5V instead, pressing it changes nothing: HIGH stays HIGH.",
      kk: "INPUT_PULLUP пинді плата ішіндегі резистор арқылы HIGH күйінде ұстайды. Батырма мұны тек пинді GND-ға қосу арқылы ғана өзгерте алады. Ал батырма пинді 5V-қа қосса, оны басқаннан ештеңе өзгермейді: HIGH сол HIGH күйінде қалады.",
      ru: "INPUT_PULLUP удерживает пин в HIGH через резистор внутри платы. Кнопка может изменить это, только соединив пин с GND. Если же кнопка соединяет пин с 5V, нажатие ничего не меняет: HIGH остаётся HIGH.",
    },
    goal: buttonGoal,
    diagram: {
      pins: ["5V", "2", "8", "GND"],
      parts: [
        { id: "sw", kind: "button", x: 250, y: 142 },
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 194 },
        { id: "d1", kind: "led", x: 370, y: 194 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["uno.2", "sw.a"],
        ["sw.b", "5V"],
        ["uno.8", "r1.a"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: pin("2"), to: buttonLegA },
      { from: buttonLegB, to: same("5V") },
      { from: pin("8"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
}`,
    symptom: {
      en: "The LED never lights, however long the button is held.",
      kk: "Батырманы қанша уақыт басып тұрсаң да, жарықдиод жанбайды.",
      ru: "Светодиод не загорается, сколько бы ни держали кнопку.",
    },
    options: [
      {
        en: "The button connects pin 2 to 5V, but with INPUT_PULLUP it must connect it to GND",
        kk: "Батырма 2-пинді 5V-қа қосады, ал INPUT_PULLUP кезінде ол GND-ға қосуы керек",
        ru: "Кнопка соединяет пин 2 с 5V, а с INPUT_PULLUP она должна соединять его с GND",
      },
      {
        en: "The code should check for HIGH instead of LOW",
        kk: "Код LOW орнына HIGH мәнін тексеруі керек",
        ru: "Код должен проверять HIGH вместо LOW",
      },
      { en: "Pin 2 is floating", kk: "2-пин ілініп тұр", ru: "Пин 2 висит в воздухе" },
      optLedBackwards,
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "With INPUT_PULLUP pin 2 already rests at HIGH. The button joins it to 5V, which is HIGH as well, so the pin never reads LOW and the LED never turns on. Move the button's second leg from 5V to GND. The pin is not floating: the internal pull-up holds it.",
      kk: "INPUT_PULLUP кезінде 2-пин онсыз да HIGH күйінде тұрады. Батырма оны 5V-қа қосады, ал ол да HIGH, сондықтан пин ешқашан LOW оқымайды және жарықдиод қосылмайды. Батырманың екінші аяғын 5V-тан GND-ға ауыстыр. Пин ілініп тұрған жоқ: оны ішкі pull-up резисторы ұстап тұр.",
      ru: "С INPUT_PULLUP пин 2 и так находится в HIGH. Кнопка соединяет его с 5V, а это тоже HIGH, поэтому пин никогда не читает LOW и светодиод не включается. Переставь вторую ножку кнопки с 5V на GND. Пин не висит в воздухе: его держит внутренняя подтяжка.",
    },
  },
  {
    id: "serial-no-begin",
    lesson: "serial",
    title: { en: "The silent monitor", kk: "Үнсіз монитор", ru: "Молчащий монитор" },
    primer: {
      en: "The serial port does nothing until it is switched on. Serial.begin(9600) in setup() starts it and sets the speed. Without that line, Serial.println() runs but nothing leaves the board.",
      kk: "Тізбекті порт қосылмайынша ештеңе істемейді. setup() ішіндегі Serial.begin(9600) оны іске қосып, жылдамдығын белгілейді. Бұл жол болмаса, Serial.println() орындалады, бірақ платадан ештеңе шықпайды.",
      ru: "Последовательный порт ничего не делает, пока его не включили. Строка Serial.begin(9600) в setup() запускает его и задаёт скорость. Без неё Serial.println() выполняется, но с платы ничего не уходит.",
    },
    goal: {
      en: "Turning the knob changes the number in the Serial Monitor from 0 to 1023.",
      kk: "Тұтқаны бұрағанда Serial Monitor-дағы сан 0-ден 1023-ке дейін өзгереді.",
      ru: "При повороте ручки число в Serial Monitor меняется от 0 до 1023.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `void setup() {
}

void loop() {
  int value = analogRead(A0);
  Serial.println(value);
  delay(200);
}`,
    symptom: {
      en: "The Serial Monitor stays completely empty: not a single character appears.",
      kk: "Serial Monitor мүлдем бос тұрады: бірде-бір таңба шықпайды.",
      ru: "Serial Monitor остаётся совершенно пустым: не появляется ни одного символа.",
    },
    options: [
      {
        en: "The potentiometer is not connected to 5V",
        kk: "Потенциометр 5V-қа қосылмаған",
        ru: "Потенциометр не подключён к 5V",
      },
      {
        en: "The sketch and the Serial Monitor use different baud rates",
        kk: "Скетч пен Serial Monitor әртүрлі бод жылдамдығын қолданады",
        ru: "В скетче и в Serial Monitor выбрана разная скорость",
      },
      {
        en: "Serial.begin() is missing from setup()",
        kk: "setup() ішінде Serial.begin() жоқ",
        ru: "В setup() нет Serial.begin()",
      },
      { en: "delay(200) is too long", kk: "delay(200) тым ұзақ", ru: "delay(200) слишком длинная" },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "setup() is empty, so the serial port was never started and Serial.println() sends nothing. Add Serial.begin(9600); to setup() and set the monitor to the same speed. A wrong speed would show garbage, not an empty window; a missing 5V wire would still print zeros.",
      kk: "setup() бос, сондықтан тізбекті порт іске қосылмаған және Serial.println() ештеңе жібермейді. setup() ішіне Serial.begin(9600); қосып, мониторда да дәл сол жылдамдықты қой. Жылдамдық қате болса, бос терезе емес, түсініксіз таңбалар шығар еді; ал 5V сымы болмаса, бәрібір нөлдер шығар еді.",
      ru: "Функция setup() пустая, поэтому последовательный порт не запущен и Serial.println() ничего не отправляет. Добавь Serial.begin(9600); в setup() и поставь в мониторе ту же скорость. При неверной скорости были бы непонятные символы, а не пустое окно; а без провода 5V всё равно печатались бы нули.",
    },
  },
  {
    id: "print-no-newline",
    lesson: "serial",
    title: { en: "One endless number", kk: "Бір шексіз сан", ru: "Одно бесконечное число" },
    primer: {
      en: "Serial.print() writes text and stays on the same line. Serial.println() writes text and then starts a new line. To see separate values, each one needs its own line or at least a space after it.",
      kk: "Serial.print() мәтінді жазып, сол жолда қалады. Serial.println() мәтінді жазып, сосын жаңа жолға көшеді. Мәндерді бөлек көру үшін әрқайсысына жеке жол немесе кем дегенде артынан бос орын керек.",
      ru: "Serial.print() выводит текст и остаётся на той же строке. Serial.println() выводит текст и переходит на новую строку. Чтобы видеть значения по отдельности, каждому нужна своя строка или хотя бы пробел после него.",
    },
    goal: {
      en: "The Serial Monitor shows the potentiometer reading as a number, five times a second.",
      kk: "Serial Monitor потенциометр мәнін секундына бес рет сан түрінде көрсетеді.",
      ru: "Serial Monitor показывает значение потенциометра числом, пять раз в секунду.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0);
  Serial.print(value);
  delay(200);
}`,
    symptom: {
      en: "The Serial Monitor fills with one unbroken row of digits, such as 512512513511512.",
      kk: "Serial Monitor 512512513511512 сияқты үзіліссіз бір қатар цифрға толады.",
      ru: "Serial Monitor заполняется одной сплошной строкой цифр вроде 512512513511512.",
    },
    options: [
      { en: "The baud rate is wrong", kk: "Бод жылдамдығы қате", ru: "Неверная скорость в бодах" },
      {
        en: "analogRead returns numbers that are too long",
        kk: "analogRead тым ұзын сандар қайтарады",
        ru: "analogRead возвращает слишком длинные числа",
      },
      {
        en: "The potentiometer is noisy",
        kk: "Потенциометр шу береді",
        ru: "Потенциометр даёт помехи",
      },
      {
        en: "The readings are printed with print(), so they all land on one line",
        kk: "Мәндер print() арқылы шығарылады, сондықтан бәрі бір жолға түседі",
        ru: "Показания выводятся через print(), поэтому все попадают в одну строку",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The digits are correct readings (512, 512, 513…) written one after another with nothing between them. Change Serial.print(value) to Serial.println(value). A wrong baud rate would give random symbols, not clean digits.",
      kk: "Бұл цифрлар — араларында ештеңесіз бірінен соң бірі жазылған дұрыс көрсеткіштер (512, 512, 513…). Serial.print(value) дегенді Serial.println(value) деп өзгерт. Бод жылдамдығы қате болса, таза цифрлар емес, кездейсоқ таңбалар шығар еді.",
      ru: "Эти цифры — правильные показания (512, 512, 513…), записанные подряд без разделителей. Замени Serial.print(value) на Serial.println(value). При неверной скорости были бы случайные символы, а не чистые цифры.",
    },
  },
  {
    id: "pot-wrong-pin",
    lesson: "sensors",
    title: {
      en: "The reading with a life of its own",
      kk: "Өз бетімен өзгеретін көрсеткіш",
      ru: "Показание, которое живёт своей жизнью",
    },
    primer: {
      en: "analogRead() measures whatever pin you name. If the sensor is on a different pin, the code reads a pin with nothing connected, and an unconnected analog pin drifts: it returns values that wander and have nothing to do with the sensor.",
      kk: "analogRead() сен атаған пинді өлшейді. Датчик басқа пинде тұрса, код ештеңе қосылмаған пинді оқиды, ал қосылмаған аналогтық пин «қалқып» жүреді: датчикке еш қатысы жоқ, өзгеріп тұратын мәндер қайтарады.",
      ru: "analogRead() измеряет тот пин, который ты назвал. Если датчик стоит на другом пине, код читает пин, к которому ничего не подключено, а неподключённый аналоговый пин «плавает»: он выдаёт блуждающие значения, никак не связанные с датчиком.",
    },
    goal: {
      en: "Turning the knob changes the number in the Serial Monitor from 0 to 1023.",
      kk: "Тұтқаны бұрағанда Serial Monitor-дағы сан 0-ден 1023-ке дейін өзгереді.",
      ru: "При повороте ручки число в Serial Monitor меняется от 0 до 1023.",
    },
    diagram: {
      pins: ["5V", "A1", "GND"],
      parts: [{ id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] }],
      wires: [
        ["uno.5V", "5V"],
        ["pot.1", "5V"],
        ["uno.A1", "pot.2"],
        ["pot.3", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: potLeg1, to: same("5V") },
      { from: potLeg2, to: same("A1") },
      { from: potLeg3, to: same("GND") },
    ],
    code: potReadCode,
    symptom: {
      en: "The numbers in the Serial Monitor drift up and down by themselves and do not follow the knob.",
      kk: "Serial Monitor-дағы сандар өздігінен жоғары-төмен өзгеріп тұрады және тұтқаға бағынбайды.",
      ru: "Числа в Serial Monitor сами по себе плавают вверх-вниз и не зависят от ручки.",
    },
    options: [
      { en: "The potentiometer is worn out", kk: "Потенциометр тозған", ru: "Потенциометр износился" },
      {
        en: "The potentiometer is on A1, but the code reads A0",
        kk: "Потенциометр A1-ге қосылған, ал код A0-ді оқиды",
        ru: "Потенциометр подключён к A1, а код читает A0",
      },
      {
        en: "9600 baud is too slow for analog values",
        kk: "9600 бод аналогтық мәндер үшін тым баяу",
        ru: "9600 бод — слишком медленно для аналоговых значений",
      },
      {
        en: "The outer legs are swapped",
        kk: "Шеткі аяқтардың орны ауысқан",
        ru: "Крайние ножки перепутаны",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "The wiper goes to A1, while the code calls analogRead(A0). A0 has nothing on it, so it floats and returns wandering values. Change the code to A1 or move the wire to A0. Swapped outer legs would only reverse the direction of the knob.",
      kk: "Ортаңғы аяқ A1-ге қосылған, ал код analogRead(A0) деп шақырады. A0-ге ештеңе қосылмаған, сондықтан ол «қалқып», өзгеріп тұратын мәндер қайтарады. Кодты A1 деп өзгерт немесе сымды A0-ге ауыстыр. Шеткі аяқтардың орны ауысса, тек тұтқаның бағыты кері болар еді.",
      ru: "Средняя ножка идёт на A1, а код вызывает analogRead(A0). К A0 ничего не подключено, поэтому он «плавает» и выдаёт блуждающие значения. Поменяй в коде пин на A1 или переставь провод на A0. Перепутанные крайние ножки лишь изменили бы направление ручки.",
    },
  },
  {
    id: "sonar-no-gnd",
    lesson: "reading-diagrams",
    title: {
      en: "The sensor with one wire missing",
      kk: "Бір сымы жетпейтін датчик",
      ru: "Датчик, которому не хватает одного провода",
    },
    primer: {
      en: "A sensor module is a small circuit of its own, and the closed-loop rule applies to it too: power comes in through VCC and must return through GND. On the diagram a contact with nothing connected is drawn as a hollow dot.",
      kk: "Датчик модулі — өз алдына шағын тізбек, және тұйық тізбек ережесі оған да қатысты: қорек VCC арқылы кіріп, GND арқылы қайтуы керек. Сызбада ештеңе қосылмаған контакт іші бос нүктемен белгіленеді.",
      ru: "Модуль датчика — это отдельная маленькая схема, и правило замкнутой цепи действует и для него: питание приходит через VCC и должно вернуться через GND. На схеме контакт, к которому ничего не подключено, нарисован пустой точкой.",
    },
    goal: {
      en: "The Serial Monitor shows the distance to the nearest obstacle in centimetres.",
      kk: "Serial Monitor ең жақын кедергіге дейінгі қашықтықты сантиметрмен көрсетеді.",
      ru: "Serial Monitor показывает расстояние до ближайшего препятствия в сантиметрах.",
    },
    diagram: {
      pins: ["5V", "9", "10", "GND"],
      parts: [
        {
          id: "hc",
          kind: "chip",
          title: same("HC-SR04"),
          x: 330,
          y: 102,
          left: ["VCC", "Trig", "Echo", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["hc.VCC", "5V"],
        ["uno.9", "hc.Trig"],
        ["uno.10", "hc.Echo"],
      ],
    },
    wiring: [
      { from: same("HC-SR04 VCC"), to: same("5V") },
      { from: same("HC-SR04 Trig"), to: pin("9") },
      { from: same("HC-SR04 Echo"), to: pin("10") },
    ],
    code: `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long cm = duration / 58;
  Serial.println(cm);
  delay(200);
}`,
    symptom: {
      en: "The Serial Monitor prints 0 about once a second, wherever the obstacle is.",
      kk: "Кедергі қай жерде тұрса да, Serial Monitor шамамен секундына бір рет 0 шығарады.",
      ru: "Serial Monitor примерно раз в секунду печатает 0, где бы ни стояло препятствие.",
    },
    options: [
      {
        en: "Trig and Echo are swapped between the wiring and the code",
        kk: "Сызба мен кодта Trig пен Echo орындары ауысып кеткен",
        ru: "Trig и Echo перепутаны между схемой и кодом",
      },
      { en: "The division by 58 is wrong", kk: "58-ге бөлу қате", ru: "Деление на 58 неверное" },
      {
        en: "The sensor's GND is not connected, so the sensor has no power",
        kk: "Датчиктің GND контактісі қосылмаған, сондықтан датчикте қорек жоқ",
        ru: "GND датчика не подключён, поэтому у датчика нет питания",
      },
      {
        en: "delay(200) is too short for sound to return",
        kk: "delay(200) дыбыс қайтып үлгеруі үшін тым қысқа",
        ru: "delay(200) слишком короткая, звук не успевает вернуться",
      },
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "This time the pin numbers in the code match the wiring. But the sensor's GND contact is a hollow dot: without a return path the sensor is not powered, sends no sound, and pulseIn() times out with 0. Connect the sensor's GND to the Arduino's GND.",
      kk: "Бұл жолы кодтағы пин нөмірлері сызбаға сәйкес келеді. Бірақ датчиктің GND контактісі — іші бос нүкте: қайтар жол болмағандықтан датчик қоректенбейді, дыбыс жібермейді, ал pulseIn() күту уақыты біткенде 0 қайтарады. Датчиктің GND контактісін Arduino-ның GND пиніне қос.",
      ru: "В этот раз номера пинов в коде совпадают со схемой. Но контакт GND датчика — пустая точка: без обратного пути датчик не получает питания, не посылает звук, и pulseIn() по тайм-ауту возвращает 0. Соедини GND датчика с GND Arduino.",
    },
  },
  {
    id: "servo-wrong-pin",
    lesson: "debugging",
    title: {
      en: "The servo that stands still",
      kk: "Қозғалмай тұрған серво",
      ru: "Серво, который стоит на месте",
    },
    primer: {
      en: "A servo takes its orders from one signal wire. arm.attach(pin) tells the library which pin that wire is on. If the number does not match the real wire, the orders go out on a pin nobody is listening to.",
      kk: "Серво бұйрықты бір сигнал сымы арқылы алады. arm.attach(pin) кітапханаға сол сымның қай пинде тұрғанын айтады. Нөмір нақты сымға сәйкес келмесе, бұйрықтар ешкім тыңдамайтын пинге кетеді.",
      ru: "Серво получает команды по одному сигнальному проводу. arm.attach(pin) сообщает библиотеке, на каком пине этот провод. Если номер не совпадает с настоящим проводом, команды уходят на пин, который никто не слушает.",
    },
    goal: sweepGoal,
    diagram: {
      pins: ["5V", "6", "GND"],
      parts: [
        {
          id: "servo",
          kind: "chip",
          title: smallServoTitle,
          x: 330,
          y: 76,
          left: ["V+", "Signal", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["servo.V+", "5V"],
        ["uno.6", "servo.Signal"],
        ["servo.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: servoV, to: same("5V") },
      { from: servoSignal, to: pin("6") },
      { from: servoGnd, to: same("GND") },
    ],
    code: sweepCode,
    symptom: {
      en: "The servo has power but does not move at all. The board does not restart.",
      kk: "Сервода қорек бар, бірақ ол мүлдем қозғалмайды. Плата қайта іске қосылмайды.",
      ru: "У серво есть питание, но он совсем не двигается. Плата не перезагружается.",
    },
    options: [
      {
        en: "The servo takes more current than the 5V pin can give",
        kk: "Серво 5V пині бере алатыннан көп ток тартады",
        ru: "Серво потребляет больше тока, чем может дать пин 5V",
      },
      {
        en: "delay(1000) is too short for a servo",
        kk: "delay(1000) серво үшін тым қысқа",
        ru: "delay(1000) слишком короткая для серво",
      },
      {
        en: "Pin 6 cannot send a servo signal",
        kk: "6-пин серво сигналын жібере алмайды",
        ru: "Пин 6 не может передавать сигнал серво",
      },
      {
        en: "The signal wire is on pin 6, but the code attaches the servo to pin 9",
        kk: "Сигнал сымы 6-пинде тұр, ал код сервоны 9-пинге тіркейді",
        ru: "Сигнальный провод стоит на пине 6, а код привязывает серво к пину 9",
      },
    ],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "The code sends the signal to pin 9, but the servo's signal wire is on pin 6, so the servo gets power and no orders. Change the code to arm.attach(6) or move the wire to pin 9. A power problem would make the board restart, and any digital pin can drive a servo.",
      kk: "Код сигналды 9-пинге жібереді, ал сервоның сигнал сымы 6-пинде тұр, сондықтан сервода қорек бар, бірақ бұйрық жоқ. Кодты arm.attach(6) деп өзгерт немесе сымды 9-пинге ауыстыр. Қорек мәселесі болса, плата қайта іске қосылар еді, ал сервоны кез келген сандық пин басқара алады.",
      ru: "Код отправляет сигнал на пин 9, а сигнальный провод серво стоит на пине 6, поэтому у серво есть питание, но нет команд. Поменяй в коде на arm.attach(6) или переставь провод на пин 9. При проблеме с питанием плата перезагружалась бы, а управлять серво может любой цифровой пин.",
    },
  },
  {
    id: "battery-on-5v-pin",
    lesson: "power",
    title: {
      en: "Nine volts in the wrong door",
      kk: "Қате есіктен кірген тоғыз вольт",
      ru: "Девять вольт не в ту дверь",
    },
    primer: {
      en: "The Uno runs on 5 V. A higher voltage, such as a 9 V battery, must enter through the Vin pin or the round power jack, where a regulator lowers it to 5 V. The 5V pin is after the regulator: whatever is connected there goes straight to the chip.",
      kk: "Uno 5 В-пен жұмыс істейді. 9 В батарея сияқты жоғарырақ кернеу Vin пині немесе дөңгелек қорек ұясы арқылы кіруі керек — сонда тұрақтандырғыш оны 5 В-қа дейін төмендетеді. 5V пині тұрақтандырғыштан кейін орналасқан: оған қосылған нәрсе тікелей микросхемаға барады.",
      ru: "Uno работает от 5 В. Более высокое напряжение, например от батарейки 9 В, должно входить через пин Vin или круглый разъём питания — там стабилизатор понижает его до 5 В. Пин 5V находится после стабилизатора: всё, что к нему подключено, идёт прямо на микросхему.",
    },
    goal: {
      en: "The board runs from a battery, without the USB cable.",
      kk: "Плата USB кабелінсіз, батареядан жұмыс істейді.",
      ru: "Плата работает от батарейки, без USB-кабеля.",
    },
    diagram: {
      pins: ["Vin", "5V", "GND"],
      parts: [
        {
          id: "bat",
          kind: "chip",
          title: { en: "Battery 9 V", kk: "Батарея 9 В", ru: "Батарея 9 В" },
          x: 330,
          y: 102,
          left: ["+", "−"],
        },
      ],
      wires: [
        ["uno.5V", "bat.+"],
        ["uno.GND", "bat.−"],
      ],
    },
    wiring: [
      { from: batteryPlus, to: same("5V") },
      { from: batteryMinus, to: same("GND") },
    ],
    code: "",
    symptom: {
      en: "The board switches on for a moment, then the chip becomes too hot to touch and the board stops working.",
      kk: "Плата бір сәтке қосылады, сосын микросхема ұстауға келмейтіндей қызып, плата жұмысын тоқтатады.",
      ru: "Плата на мгновение включается, затем микросхема нагревается так, что к ней не прикоснуться, и плата перестаёт работать.",
    },
    options: [
      {
        en: "A 9 V battery is too weak for the board",
        kk: "9 В батарея плата үшін тым әлсіз",
        ru: "Батарейка 9 В слишком слабая для платы",
      },
      {
        en: "9 V went into the 5V pin, past the regulator",
        kk: "9 В тұрақтандырғышты айналып өтіп, 5V пиніне берілген",
        ru: "9 В подали на пин 5V в обход стабилизатора",
      },
      {
        en: "The battery is connected backwards",
        kk: "Батарея теріс қосылған",
        ru: "Батарейка подключена наоборот",
      },
      {
        en: "The board cannot work without USB",
        kk: "Плата USB-сіз жұмыс істей алмайды",
        ru: "Плата не может работать без USB",
      },
    ],
    answer: 1,
    faultType: "power",
    explanation: {
      en: "The battery's plus is on the 5V pin, so the chip gets 9 V instead of 5 V and is damaged. Connect the plus to Vin (or use the power jack): there the regulator turns 9 V into a safe 5 V. The polarity here is right: plus to the board, minus to GND.",
      kk: "Батареяның плюсі 5V пиніне қосылған, сондықтан микросхемаға 5 В орнына 9 В түсіп, ол зақымданады. Плюсті Vin пиніне қос (немесе қорек ұясын қолдан): сонда тұрақтандырғыш 9 В-ты қауіпсіз 5 В-қа айналдырады. Мұнда полярлық дұрыс: плюс платаға, минус GND-ға қосылған.",
      ru: "Плюс батарейки стоит на пине 5V, поэтому на микросхему попадает 9 В вместо 5 В, и она выходит из строя. Подключи плюс к Vin (или используй разъём питания): там стабилизатор превращает 9 В в безопасные 5 В. Полярность здесь верная: плюс к плате, минус к GND.",
    },
  },
  {
    id: "toggle-held",
    lesson: "buttons",
    title: {
      en: "The switch that flips a coin",
      kk: "Тиын лақтыратын ажыратқыш",
      ru: "Выключатель, который бросает монетку",
    },
    primer: {
      en: "loop() repeats thousands of times a second. A command placed inside \"if the button is pressed\" therefore runs thousands of times during one press. To act once per press, the code must notice the moment the button goes from released to pressed.",
      kk: "loop() секундына мыңдаған рет қайталанады. Сондықтан «батырма басылған болса» шартының ішіндегі команда бір басу кезінде мыңдаған рет орындалады. Әр басуға бір рет әрекет ету үшін код батырманың жіберулі күйден басылған күйге өткен сәтін байқауы керек.",
      ru: "loop() повторяется тысячи раз в секунду. Поэтому команда внутри условия «если кнопка нажата» за одно нажатие выполняется тысячи раз. Чтобы действовать один раз на нажатие, код должен заметить момент, когда кнопка переходит из отпущенного состояния в нажатое.",
    },
    goal: {
      en: "Each press of the button switches the LED: on, off, on, off.",
      kk: "Батырманың әр басылуы жарықдиодты ауыстырады: қосулы, өшірулі, қосулы, өшірулі.",
      ru: "Каждое нажатие кнопки переключает светодиод: включён, выключен, включён, выключен.",
    },
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `bool on = false;

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    on = !on;
    digitalWrite(8, on);
  }
}`,
    symptom: {
      en: "While the button is held the LED glows at half brightness. After release it ends up on or off at random.",
      kk: "Батырма басулы тұрғанда жарықдиод жарты жарықпен жанады. Жібергеннен кейін ол кездейсоқ түрде қосулы немесе өшірулі күйде қалады.",
      ru: "Пока кнопка нажата, светодиод светится вполсилы. После отпускания он случайным образом остаётся включённым или выключенным.",
    },
    options: [
      {
        en: "The button needs an external resistor",
        kk: "Батырмаға сыртқы резистор керек",
        ru: "Кнопке нужен внешний резистор",
      },
      {
        en: "A bool cannot be passed to digitalWrite",
        kk: "digitalWrite-қа bool беруге болмайды",
        ru: "В digitalWrite нельзя передавать bool",
      },
      {
        en: "The LED flips on every pass of loop() while the button is held",
        kk: "Батырма басулы тұрғанда жарықдиод loop()-тың әр айналымында ауысады",
        ru: "Пока кнопка нажата, светодиод переключается на каждом проходе loop()",
      },
      {
        en: "The internal pull-up is too weak",
        kk: "Ішкі pull-up резисторы тым әлсіз",
        ru: "Внутренняя подтяжка слишком слабая",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "While the button is down, the condition is true on every pass, so the LED is flipped thousands of times a second: it looks half-bright, and where it stops is luck. Remember the previous state of the button and flip the LED only when it changes from released to pressed.",
      kk: "Батырма басулы кезде шарт әр айналымда ақиқат болады, сондықтан жарықдиод секундына мыңдаған рет ауысады: ол жарты жарықпен жанып тұрғандай көрінеді, ал қай күйде тоқтайтыны — кездейсоқтық. Батырманың алдыңғы күйін есте сақтап, жарықдиодты тек батырма жіберулі күйден басылған күйге өткенде ғана ауыстыр.",
      ru: "Пока кнопка нажата, условие истинно на каждом проходе, поэтому светодиод переключается тысячи раз в секунду: он выглядит полуярким, а в каком состоянии остановится — дело случая. Запоминай предыдущее состояние кнопки и переключай светодиод только при переходе из отпущенного в нажатое.",
    },
  },
  {
    id: "millis-no-update",
    lesson: "timing",
    title: {
      en: "The timer that never resets",
      kk: "Ешқашан қайта қосылмайтын таймер",
      ru: "Таймер, который не сбрасывается",
    },
    primer: {
      en: "Timing with millis() has two halves. First check whether enough time has passed since the remembered moment. Then, when you act, remember the new moment. Without the second half, the check stays true forever after the first time.",
      kk: "millis() арқылы уақыт өлшеу екі бөліктен тұрады. Алдымен есте сақталған сәттен бері жеткілікті уақыт өткенін тексер. Сосын әрекет еткен кезде жаңа сәтті есте сақта. Екінші бөлік болмаса, тексеру бірінші реттен кейін мәңгі ақиқат болып қалады.",
      ru: "Отсчёт времени через millis() состоит из двух частей. Сначала проверь, прошло ли достаточно времени с запомненного момента. Затем, выполняя действие, запомни новый момент. Без второй части проверка после первого раза остаётся истинной навсегда.",
    },
    goal: {
      en: "The LED switches on and off every second, without using delay().",
      kk: "Жарықдиод delay() қолданбай, әр секунд сайын жанып-сөнеді.",
      ru: "Светодиод каждую секунду переключается, без использования delay().",
    },
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `unsigned long lastChange = 0;
bool on = false;

void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  if (millis() - lastChange >= 1000) {
    on = !on;
    digitalWrite(8, on);
  }
}`,
    symptom: {
      en: "The LED stays off for the first second after a reset, then glows steadily at about half brightness and never blinks.",
      kk: "Қайта іске қосқаннан кейінгі алғашқы секундта жарықдиод сөніп тұрады, сосын шамамен жарты жарықпен тұрақты жанып, мүлдем жыпылықтамайды.",
      ru: "Первую секунду после перезапуска светодиод не горит, затем ровно светится примерно вполсилы и совсем не мигает.",
    },
    options: [
      {
        en: "unsigned long is the wrong type for time",
        kk: "unsigned long уақыт үшін жарамсыз түр",
        ru: "unsigned long — неподходящий тип для времени",
      },
      {
        en: "1000 is too small a number for millis()",
        kk: "1000 — millis() үшін тым кіші сан",
        ru: "1000 — слишком маленькое число для millis()",
      },
      {
        en: "pinMode must be inside loop()",
        kk: "pinMode loop() ішінде тұруы керек",
        ru: "pinMode должен стоять внутри loop()",
      },
      {
        en: "lastChange is never updated, so after one second the condition is always true",
        kk: "lastChange ешқашан жаңартылмайды, сондықтан бір секундтан кейін шарт әрдайым ақиқат",
        ru: "lastChange не обновляется, поэтому через секунду условие истинно всегда",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The check is right, but nothing ever writes a new value into lastChange. Once a second has passed, millis() - lastChange stays above 1000, the LED is flipped on every pass and looks half-bright. Add lastChange = millis(); inside the if.",
      kk: "Тексеру дұрыс, бірақ lastChange-ке ешқашан жаңа мән жазылмайды. Бір секунд өткен соң millis() - lastChange 1000-нан жоғары күйінде қалады, жарықдиод әр айналымда ауысады да, жарты жарықпен жанып тұрғандай көрінеді. if ішіне lastChange = millis(); қос.",
      ru: "Проверка написана верно, но в lastChange никогда не записывается новое значение. Когда секунда прошла, millis() - lastChange остаётся больше 1000, светодиод переключается на каждом проходе и выглядит полуярким. Добавь lastChange = millis(); внутрь if.",
    },
  },
  {
    id: "semicolon-after-if",
    lesson: "code-traps",
    title: {
      en: "The condition that decides nothing",
      kk: "Ештеңе шешпейтін шарт",
      ru: "Условие, которое ничего не решает",
    },
    primer: {
      en: "An if controls the single command or the block in braces that comes right after it. A semicolon is a complete, empty command. So if (…); means \"if true, do nothing\", and the block after it runs every time, as if there were no if at all.",
      kk: "if өзінен кейін бірден тұрған жалғыз команданы немесе жүйелі жақшадағы блокты басқарады. Нүктелі үтір — толыққанды, бос команда. Сондықтан if (…); дегеніміз «ақиқат болса, ештеңе істеме» дегенді білдіреді, ал одан кейінгі блок if мүлдем жоқ сияқты әр жолы орындалады.",
      ru: "if управляет одной командой или блоком в фигурных скобках, который стоит сразу за ним. Точка с запятой — это полноценная пустая команда. Поэтому if (…); означает «если истина, ничего не делай», а блок после него выполняется каждый раз, как будто if нет вообще.",
    },
    goal: {
      en: "The LED lights only while the button is held.",
      kk: "Жарықдиод тек батырма басулы тұрғанда ғана жанады.",
      ru: "Светодиод горит, только пока кнопка нажата.",
    },
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, LOW);
  if (digitalRead(2) == LOW);
  {
    digitalWrite(8, HIGH);
  }
}`,
    symptom: {
      en: "The LED is on all the time, whether the button is pressed or not.",
      kk: "Батырма басылса да, басылмаса да жарықдиод үнемі жанып тұрады.",
      ru: "Светодиод горит постоянно, нажата кнопка или нет.",
    },
    options: [
      {
        en: "With INPUT_PULLUP a pressed button reads HIGH",
        kk: "INPUT_PULLUP кезінде басылған батырма HIGH болып оқылады",
        ru: "С INPUT_PULLUP нажатая кнопка читается как HIGH",
      },
      {
        en: "The semicolon after the if ends it, so the block below always runs",
        kk: "if-тен кейінгі нүктелі үтір оны аяқтайды, сондықтан төмендегі блок әрдайым орындалады",
        ru: "Точка с запятой после if завершает его, и блок ниже выполняется всегда",
      },
      optLedBackwards,
      { en: "The button is shorted", kk: "Батырма тұйықталған", ru: "Кнопка закорочена" },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "There is a semicolon straight after the condition. It is an empty command, and it is the only thing the if controls. The braces below are just an ordinary block, so digitalWrite(8, HIGH) runs on every pass. Delete that semicolon. The compiler accepts this code without complaint, which is what makes it a trap.",
      kk: "Шарттан кейін бірден нүктелі үтір тұр. Бұл — бос команда, және if тек соны ғана басқарады. Төмендегі жүйелі жақшалар — жай кәдімгі блок, сондықтан digitalWrite(8, HIGH) әр айналымда орындалады. Сол нүктелі үтірді өшір. Компилятор бұл кодты еш ескертусіз қабылдайды — тұзақ болатыны да содан.",
      ru: "Сразу после условия стоит точка с запятой. Это пустая команда, и только ею if и управляет. Фигурные скобки ниже — обычный блок, поэтому digitalWrite(8, HIGH) выполняется на каждом проходе. Удали эту точку с запятой. Компилятор принимает такой код без замечаний — поэтому это и ловушка.",
    },
  },
  {
    id: "servo-kills-pwm",
    lesson: "special-pins",
    title: {
      en: "The LED that forgot how to fade",
      kk: "Біртіндеп жануды ұмытқан жарықдиод",
      ru: "Светодиод, который разучился плавно гореть",
    },
    primer: {
      en: "PWM on pins 9 and 10 is produced by one internal timer of the Uno. The Servo library takes that same timer for itself. As soon as a sketch uses a servo, analogWrite() stops working on pins 9 and 10, even if the servo is on another pin.",
      kk: "9 және 10-пиндердегі ШИМ-ді Uno-ның бір ішкі таймері жасайды. Servo кітапханасы дәл сол таймерді өзіне алады. Скетч сервоны қолдана бастаған бойда, серво басқа пинде тұрса да, 9 және 10-пиндерде analogWrite() жұмыс істемей қалады.",
      ru: "ШИМ на пинах 9 и 10 создаёт один внутренний таймер Uno. Библиотека Servo забирает этот же таймер себе. Как только скетч использует серво, analogWrite() перестаёт работать на пинах 9 и 10, даже если серво стоит на другом пине.",
    },
    goal: {
      en: "The servo holds its position while the LED fades smoothly up.",
      kk: "Серво өз күйін ұстап тұрады, ал жарықдиод біртіндеп жанады.",
      ru: "Серво удерживает положение, а светодиод плавно разгорается.",
    },
    diagram: {
      pins: ["5V", "6", "10", "GND"],
      parts: [
        {
          id: "servo",
          kind: "chip",
          title: smallServoTitle,
          x: 520,
          y: 50,
          left: ["V+", "Signal", "GND"],
        },
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 194 },
        { id: "d1", kind: "led", x: 370, y: 194 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["servo.V+", "5V"],
        ["uno.6", "servo.Signal"],
        ["servo.GND", "GND"],
        ["uno.10", "r1.a"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: servoV, to: same("5V") },
      { from: servoSignal, to: pin("6") },
      { from: servoGnd, to: same("GND") },
      { from: pin("10"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: `#include <Servo.h>

Servo arm;

void setup() {
  arm.attach(6);
  arm.write(90);
  pinMode(10, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b++) {
    analogWrite(10, b);
    delay(10);
  }
}`,
    symptom: {
      en: "The servo works. The LED on pin 10 does not fade: it only switches abruptly or flickers. Without the servo lines the same LED fades perfectly.",
      kk: "Серво жұмыс істейді. Ал 10-пиндегі жарықдиод біртіндеп жанбайды: ол тек кенет ауысады немесе жыпылықтайды. Сервоға қатысты жолдарды алып тастаса, сол жарықдиод мінсіз біртіндеп жанады.",
      ru: "Серво работает. Светодиод на пине 10 не разгорается плавно: он только резко переключается или мерцает. Если убрать строки про серво, тот же светодиод разгорается идеально.",
    },
    options: [
      {
        en: "The Servo library uses the timer that drives PWM on pins 9 and 10",
        kk: "Servo кітапханасы 9 және 10-пиндердегі ШИМ-ді басқаратын таймерді қолданады",
        ru: "Библиотека Servo занимает таймер, который управляет ШИМ на пинах 9 и 10",
      },
      { en: "Pin 10 has no PWM", kk: "10-пинде ШИМ жоқ", ru: "У пина 10 нет ШИМ" },
      {
        en: "The servo takes too much current, so the LED gets none",
        kk: "Серво тым көп ток тартады, сондықтан жарықдиодқа ток жетпейді",
        ru: "Серво берёт слишком большой ток, и светодиоду не хватает",
      },
      {
        en: "delay(10) is too short for a smooth fade",
        kk: "delay(10) біртіндеп жану үшін тым қысқа",
        ru: "delay(10) слишком короткая для плавного перехода",
      },
    ],
    answer: 0,
    faultType: "limits",
    explanation: {
      en: "Pin 10 normally has PWM, and it works until the Servo library is used. The library takes over the timer behind pins 9 and 10, so analogWrite() there stops giving a smooth signal. Move the LED to another ~ pin, such as 3, 5 or 11, and change the number in the code.",
      kk: "Әдетте 10-пинде ШИМ бар, және ол Servo кітапханасы қолданылғанға дейін жұмыс істейді. Кітапхана 9 және 10-пиндердің артындағы таймерді өзіне алады, сондықтан ол пиндерде analogWrite() біркелкі сигнал бермей қалады. Жарықдиодты ~ белгісі бар басқа пинге, мысалы 3, 5 немесе 11-ге ауыстырып, кодтағы нөмірді өзгерт.",
      ru: "Обычно у пина 10 есть ШИМ, и он работает, пока не используется библиотека Servo. Библиотека занимает таймер, стоящий за пинами 9 и 10, поэтому analogWrite() на них перестаёт давать плавный сигнал. Переставь светодиод на другой пин со значком ~, например 3, 5 или 11, и поменяй номер в коде.",
    },
  },

  // Breadboard missions: the plan and the code are right, the build is not.
  {
    id: "bb-same-row",
    lesson: "breadboard",
    title: { en: "Two legs, one row", kk: "Екі аяқ, бір қатар", ru: "Две ножки в одном ряду" },
    primer: {
      en: "On a breadboard every numbered row of five holes is one piece of metal: everything pushed into that row is joined. A part only does its job when its two legs sit in two different rows. With both legs in one row, the current simply passes through the metal strip and ignores the part.",
      kk: "Макет тақтасында бес тесіктен тұратын әр нөмірленген қатар — бір металл жолақ: сол қатарға кіргізілген нәрсенің бәрі өзара қосылады. Бөлшек екі аяғы екі түрлі қатарда тұрғанда ғана жұмыс істейді. Екі аяғы да бір қатарда болса, ток жай металл жолақ арқылы өтіп, бөлшекті елемейді.",
      ru: "На макетной плате каждый пронумерованный ряд из пяти отверстий — это одна металлическая полоска: всё, что вставлено в этот ряд, соединено. Деталь работает, только когда её ножки стоят в двух разных рядах. Если обе ножки в одном ряду, ток просто идёт по металлической полоске и не замечает деталь.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    board: {
      rows: 14,
      items: [
        { kind: "lead", at: "3a", label: "Pin 8" },
        { kind: "resistor", from: "3c", to: "7c", label: "220 Ω" },
        { kind: "led", long: "7d", short: "7e" },
        { kind: "lead", at: "7a", label: "GND" },
      ],
    },
    wiring: ledWiring("8"),
    code: blinkCode,
    symptom: neverLights,
    options: [optOneOff, optSameRow, optLedBackwards, optSplitRail],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "The plan is right, and so is the code. On the board, though, both legs of the LED are in row 7, together with the resistor and the GND wire. Row 7 is one strip of metal, so the current goes from the resistor straight to GND. Move the LED's short leg to row 9 and the GND wire with it.",
      kk: "Сызба да, код та дұрыс. Бірақ тақтада жарықдиодтың екі аяғы да резистормен және GND сымымен бірге 7-қатарда тұр. 7-қатар — бір металл жолақ, сондықтан ток резистордан тікелей GND-ға кетеді. Жарықдиодтың қысқа аяғын 9-қатарға ауыстырып, GND сымын да сонда қой.",
      ru: "И схема, и код верны. Но на плате обе ножки светодиода стоят в ряду 7, вместе с резистором и проводом GND. Ряд 7 — одна металлическая полоска, поэтому ток идёт от резистора прямо в GND. Переставь короткую ножку светодиода в ряд 9 и туда же перенеси провод GND.",
    },
  },
  {
    id: "bb-one-off",
    lesson: "breadboard",
    title: { en: "One row to the side", kk: "Бір қатар шетте", ru: "На один ряд в стороне" },
    primer: {
      en: "Two parts are connected on a breadboard only if a leg of each sits in the same row of five holes. One row to the side looks almost the same, but those rows are separate strips of metal with nothing between them.",
      kk: "Макет тақтасында екі бөлшек әрқайсысының бір аяғы бес тесіктен тұратын бір қатарда тұрғанда ғана қосылады. Бір қатар шетте тұру сырттай бірдей көрінеді, бірақ ол қатарлар — араларында ештеңесі жоқ бөлек металл жолақтар.",
      ru: "Две детали на макетной плате соединены, только если по одной ножке каждой стоит в одном ряду из пяти отверстий. Сдвиг на один ряд выглядит почти так же, но эти ряды — отдельные металлические полоски, между которыми ничего нет.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    board: {
      rows: 14,
      items: [
        { kind: "lead", at: "3a", label: "Pin 8" },
        { kind: "resistor", from: "3c", to: "7c", label: "220 Ω" },
        { kind: "led", long: "8e", short: "10e" },
        { kind: "lead", at: "10a", label: "GND" },
      ],
    },
    wiring: ledWiring("8"),
    code: blinkCode,
    symptom: neverLights,
    options: [optSplitRail, optLedBackwards, optSameRow, optOneOff],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "The resistor ends in row 7, and the LED's long leg is in row 8. Nothing joins the two rows, so the loop is open at that point. Move the LED's long leg into row 7.",
      kk: "Резистор 7-қатарда аяқталады, ал жарықдиодтың ұзын аяғы 8-қатарда тұр. Бұл екі қатарды ештеңе қоспайды, сондықтан тізбек сол жерде үзілген. Жарықдиодтың ұзын аяғын 7-қатарға ауыстыр.",
      ru: "Резистор заканчивается в ряду 7, а длинная ножка светодиода стоит в ряду 8. Эти два ряда ничем не соединены, поэтому цепь разорвана в этом месте. Переставь длинную ножку светодиода в ряд 7.",
    },
  },
  {
    id: "bb-split-rail",
    lesson: "breadboard",
    title: { en: "The rail with a gap", kk: "Үзігі бар шина", ru: "Шина с разрывом" },
    primer: {
      en: "The long rails along the edge carry plus and minus to the whole board. On many breadboards each rail is cut in the middle: the left half and the right half are two separate strips. The printed line along the rail shows it; where the line breaks, so does the metal.",
      kk: "Шеттегі ұзын шиналар плюс пен минусты бүкіл тақтаға жеткізеді. Көптеген макет тақталарында әр шина ортасынан үзілген: сол жақ жартысы мен оң жақ жартысы — екі бөлек жолақ. Мұны шина бойындағы басылған сызық көрсетеді: сызық үзілген жерде металл да үзіледі.",
      ru: "Длинные шины вдоль края разводят плюс и минус по всей плате. На многих макетных платах каждая шина разрезана посередине: левая и правая половины — две отдельные полоски. Это показывает линия, напечатанная вдоль шины: где линия прерывается, там прерывается и металл.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    board: {
      rows: 14,
      railSplitAfter: 7,
      items: [
        { kind: "lead", at: "-2", label: "GND" },
        { kind: "lead", at: "9a", label: "Pin 8" },
        { kind: "resistor", from: "9c", to: "12c", label: "220 Ω" },
        { kind: "led", long: "12e", short: "14e" },
        { kind: "wire", from: "14a", to: "-14" },
      ],
    },
    wiring: ledWiring("8"),
    code: blinkCode,
    symptom: neverLights,
    options: [optSplitRail, optSameRow, optOneOff, optLedBackwards],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "The GND wire from the Arduino goes into the left half of the minus rail, and the LED's return wire into the right half. The rail is split between rows 7 and 8, so the two halves are not connected and the loop is open. Put a short wire across the gap, or move the GND wire to the right half.",
      kk: "Arduino-дан келетін GND сымы минус шинасының сол жақ жартысына, ал жарықдиодтың қайтар сымы оң жақ жартысына қосылған. Шина 7 мен 8-қатардың арасында үзілген, сондықтан екі жартысы өзара қосылмаған және тізбек ашық. Үзіктің үстінен қысқа сым сал немесе GND сымын оң жақ жартысына ауыстыр.",
      ru: "Провод GND от Arduino вставлен в левую половину шины минуса, а обратный провод светодиода — в правую. Шина разорвана между рядами 7 и 8, поэтому половины не соединены и цепь разомкнута. Поставь короткую перемычку через разрыв или перенеси провод GND в правую половину.",
    },
  },

  // More practice in reading a diagram and in checking wiring against code.
  {
    id: "both-ends-gnd",
    lesson: "reading-diagrams",
    title: {
      en: "Both ends in the same place",
      kk: "Екі ұшы да бір жерде",
      ru: "Оба конца в одном месте",
    },
    primer: {
      en: "To read a diagram, follow the circuit from one end to the other. A working LED circuit starts at a pin and ends at GND. If both ends land on the same line, there is no voltage across the parts, whatever the code does.",
      kk: "Сызбаны оқу үшін тізбекті бір ұшынан екінші ұшына дейін қадағала. Жұмыс істейтін жарықдиод тізбегі пиннен басталып, GND-да аяқталады. Екі ұшы да бір сызыққа түссе, код не істесе де, бөлшектерде кернеу болмайды.",
      ru: "Чтобы прочитать схему, проследи цепь от одного конца до другого. Рабочая цепь со светодиодом начинается на пине и заканчивается на GND. Если оба конца попадают на одну и ту же линию, на деталях нет напряжения, что бы ни делал код.",
    },
    goal: blinkGoal,
    diagram: {
      pins: ["8", "GND"],
      parts: [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 90 },
        { id: "d1", kind: "led", x: 370, y: 90 },
      ],
      wires: [
        ["r1.a", "GND"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: same("GND"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: blinkCode,
    symptom: neverLights,
    options: [
      {
        en: "Pin 8 is never set as OUTPUT",
        kk: "8-пин OUTPUT режиміне қойылмаған",
        ru: "Пин 8 не настроен как OUTPUT",
      },
      optLedBackwards,
      {
        en: "Both ends of the circuit are on GND, and nothing is connected to pin 8",
        kk: "Тізбектің екі ұшы да GND-да тұр, ал 8-пинге ештеңе қосылмаған",
        ru: "Оба конца цепи стоят на GND, а к пину 8 ничего не подключено",
      },
      {
        en: "The 220 Ω resistor is too large",
        kk: "220 Ом резистор тым үлкен",
        ru: "Резистор 220 Ом слишком большой",
      },
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "Follow the wires: the resistor starts on the GND line and the LED ends on the GND line, while pin 8 is a hollow dot. Both ends are at 0 V, so no current can flow. Move the resistor's first end from GND to pin 8.",
      kk: "Сымдарды қадағала: резистор GND сызығынан басталады, жарықдиод та GND сызығында аяқталады, ал 8-пин — іші бос нүкте. Екі ұшында да 0 В, сондықтан ток аға алмайды. Резистордың бірінші ұшын GND-дан 8-пинге ауыстыр.",
      ru: "Проследи провода: резистор начинается на линии GND, светодиод заканчивается тоже на линии GND, а пин 8 — пустая точка. На обоих концах 0 В, поэтому ток течь не может. Переставь первый конец резистора с GND на пин 8.",
    },
  },
  {
    id: "pot-both-5v",
    lesson: "reading-diagrams",
    title: {
      en: "The knob stuck at the top",
      kk: "Ең жоғарғы мәнде тұрып қалған тұтқа",
      ru: "Ручка, застрявшая на максимуме",
    },
    primer: {
      en: "A potentiometer divides the voltage between its two outer legs. That only works when the outer legs are at different voltages: one at 5V, the other at GND. On a diagram, check where each of the three legs ends up.",
      kk: "Потенциометр екі шеткі аяғының арасындағы кернеуді бөледі. Бұл тек шеткі аяқтарда әртүрлі кернеу болғанда ғана жұмыс істейді: бірінде 5V, екіншісінде GND. Сызбада үш аяқтың әрқайсысы қайда баратынын тексер.",
      ru: "Потенциометр делит напряжение между двумя крайними ножками. Это работает, только когда на крайних ножках разное напряжение: на одной 5V, на другой GND. На схеме проверь, куда приходит каждая из трёх ножек.",
    },
    goal: {
      en: "Turning the knob changes the number in the Serial Monitor from 0 to 1023.",
      kk: "Тұтқаны бұрағанда Serial Monitor-дағы сан 0-ден 1023-ке дейін өзгереді.",
      ru: "При повороте ручки число в Serial Monitor меняется от 0 до 1023.",
    },
    diagram: {
      pins: ["5V", "A0", "GND"],
      parts: [{ id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] }],
      wires: [
        ["uno.5V", "5V"],
        ["pot.1", "5V"],
        ["uno.A0", "pot.2"],
        ["pot.3", "5V"],
      ],
    },
    wiring: [
      { from: potLeg1, to: same("5V") },
      { from: potLeg2, to: same("A0") },
      { from: potLeg3, to: same("5V") },
    ],
    code: potReadCode,
    symptom: {
      en: "The Serial Monitor prints 1023 (sometimes 1022) no matter how the knob is turned.",
      kk: "Тұтқаны қалай бұрасаң да, Serial Monitor 1023 (кейде 1022) шығарады.",
      ru: "Serial Monitor печатает 1023 (иногда 1022), как бы ни крутили ручку.",
    },
    options: [
      {
        en: "The potentiometer is burned out",
        kk: "Потенциометр күйіп кеткен",
        ru: "Потенциометр сгорел",
      },
      {
        en: "Both outer legs are on 5V and nothing goes to GND",
        kk: "Шеткі екі аяғы да 5V-қа қосылған, ал GND-ға ештеңе бармайды",
        ru: "Обе крайние ножки подключены к 5V, а к GND не идёт ничего",
      },
      {
        en: "The code should use digitalRead",
        kk: "Кодта digitalRead қолдану керек",
        ru: "В коде нужно использовать digitalRead",
      },
      {
        en: "The sketch and the Serial Monitor use different baud rates",
        kk: "Скетч пен Serial Monitor әртүрлі бод жылдамдығын қолданады",
        ru: "В скетче и в Serial Monitor выбрана разная скорость",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "Legs 1 and 3 both end on the red 5V line, and the GND pin is a hollow dot. With 5 V at both ends there is nothing to divide: the middle leg is at 5 V in every position. Move leg 3 to GND.",
      kk: "1-аяқ та, 3-аяқ та қызыл 5V сызығында аяқталады, ал GND пині — іші бос нүкте. Екі ұшында да 5 В болғандықтан бөлетін ештеңе жоқ: ортаңғы аяқта кез келген күйде 5 В тұрады. 3-аяқты GND-ға ауыстыр.",
      ru: "Ножки 1 и 3 обе приходят на красную линию 5V, а пин GND — пустая точка. При 5 В на обоих концах делить нечего: на средней ножке в любом положении 5 В. Переставь ножку 3 на GND.",
    },
  },
  {
    id: "button-wrong-pin",
    lesson: "debugging",
    title: {
      en: "The button on the wrong line",
      kk: "Қате желідегі батырма",
      ru: "Кнопка не на той линии",
    },
    primer: {
      en: "When a project does nothing, compare the wiring with the code number by number. Each pin number in the code must be a pin that the diagram shows something connected to. An input with INPUT_PULLUP and nothing attached quietly reads HIGH forever.",
      kk: "Жоба ештеңе істемесе, сызбаны кодпен нөмірлеп салыстыр. Кодтағы әр пин нөмірі сызбада бір нәрсе қосылған пинге сәйкес келуі керек. INPUT_PULLUP режиміндегі, ештеңе қосылмаған кіріс үндемей мәңгі HIGH оқи береді.",
      ru: "Когда проект ничего не делает, сверь схему с кодом номер за номером. Каждый номер пина в коде должен быть пином, к которому на схеме что-то подключено. Вход с INPUT_PULLUP, к которому ничего не подключено, молча читает HIGH бесконечно.",
    },
    goal: buttonGoal,
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `void setup() {
  pinMode(3, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(3) == LOW) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
}`,
    symptom: {
      en: "The LED never lights, however long the button is held.",
      kk: "Батырманы қанша уақыт басып тұрсаң да, жарықдиод жанбайды.",
      ru: "Светодиод не загорается, сколько бы ни держали кнопку.",
    },
    options: [
      {
        en: "The button must be wired to 5V, not GND",
        kk: "Батырма GND-ға емес, 5V-қа қосылуы керек",
        ru: "Кнопку нужно подключить к 5V, а не к GND",
      },
      {
        en: "The code should check for HIGH instead of LOW",
        kk: "Код LOW орнына HIGH мәнін тексеруі керек",
        ru: "Код должен проверять HIGH вместо LOW",
      },
      {
        en: "The code reads pin 3, but the button is wired to pin 2",
        kk: "Код 3-пинді оқиды, ал батырма 2-пинге қосылған",
        ru: "Код читает пин 3, а кнопка подключена к пину 2",
      },
      optLedBackwards,
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "The button is on pin 2, but the code sets up and reads pin 3. Pin 3 has nothing on it; its internal pull-up keeps it at HIGH, so the condition is never true. Change both 3s in the code to 2, or move the wire to pin 3.",
      kk: "Батырма 2-пинде тұр, ал код 3-пинді баптап, соны оқиды. 3-пинге ештеңе қосылмаған; ішкі pull-up резисторы оны HIGH күйінде ұстайды, сондықтан шарт ешқашан орындалмайды. Кодтағы екі 3-ті де 2-ге өзгерт немесе сымды 3-пинге ауыстыр.",
      ru: "Кнопка стоит на пине 2, а код настраивает и читает пин 3. К пину 3 ничего не подключено; внутренняя подтяжка держит его в HIGH, поэтому условие никогда не выполняется. Замени в коде обе тройки на 2 или переставь провод на пин 3.",
    },
  },

  // Fourth and fifth missions for every topic.
  {
    id: "gap-in-the-middle",
    lesson: "circuit",
    title: { en: "The missing link", kk: "Жетіспейтін буын", ru: "Недостающее звено" },
    primer: {
      en: "A loop is only as good as its weakest joint. Every part must be joined to the next one: a single missing wire anywhere stops the current everywhere.",
      kk: "Тізбек ең әлсіз буынынан мықты бола алмайды. Әр бөлшек келесісіне қосылуы керек: кез келген жердегі бір ғана жетіспейтін сым бүкіл тізбектегі токты тоқтатады.",
      ru: "Цепь не сильнее своего самого слабого соединения. Каждая деталь должна быть соединена со следующей: один недостающий провод в любом месте останавливает ток везде.",
    },
    goal: lightGoal,
    diagram: batteryCircuit(
      "4.5",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100 },
      ],
      [
        ["r1.a", "5V"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: [
      { from: batteryPlus, to: resistor },
      { from: ledShort, to: batteryMinus },
    ],
    code: "",
    symptom: {
      en: "The LED does not light up.",
      kk: "Жарықдиод жанбайды.",
      ru: "Светодиод не горит.",
    },
    options: [
      optLedBackwards,
      {
        en: "The resistor and the LED are not connected to each other",
        kk: "Резистор мен жарықдиод бір-біріне қосылмаған",
        ru: "Резистор и светодиод не соединены друг с другом",
      },
      {
        en: "The battery is too strong for one LED",
        kk: "Батарея бір жарықдиод үшін тым күшті",
        ru: "Батарейка слишком мощная для одного светодиода",
      },
      {
        en: "A plain wire shorts the battery",
        kk: "Жай сым батареяны тұйықтап тұр",
        ru: "Обычный провод закорачивает батарейку",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "Both ends of the loop reach the battery, but in the middle the resistor's second end and the LED's long leg are hollow dots: nothing joins them. Add a wire between the resistor and the LED.",
      kk: "Тізбектің екі ұшы да батареяға жетеді, бірақ ортасында резистордың екінші ұшы мен жарықдиодтың ұзын аяғы — іші бос нүктелер: оларды ештеңе қоспайды. Резистор мен жарықдиодтың арасына сым қос.",
      ru: "Оба конца цепи доходят до батарейки, но в середине второй конец резистора и длинная ножка светодиода — пустые точки: их ничто не соединяет. Добавь провод между резистором и светодиодом.",
    },
  },
  {
    id: "led-backwards-battery",
    lesson: "led-resistor",
    title: { en: "Facing the wrong way", kk: "Теріс қарап тұр", ru: "Не той стороной" },
    primer: {
      en: "An LED is a one-way street for current. The long leg must point toward the battery's plus and the short leg toward the minus. Turned around, it blocks the current completely and stays dark, without any damage.",
      kk: "Жарықдиод — ток үшін бір бағытты жол. Ұзын аяғы батареяның плюсіне, қысқа аяғы минусына қарауы керек. Теріс қойылса, ол токты толық бөгеп, жанбай тұрады, бірақ зақымданбайды.",
      ru: "Светодиод для тока — улица с односторонним движением. Длинная ножка должна смотреть на плюс батарейки, короткая — на минус. Если его перевернуть, он полностью перекрывает ток и не горит, но и не портится.",
    },
    goal: lightGoal,
    diagram: batteryCircuit(
      "4.5",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100, flip: true },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: [
      { from: batteryPlus, to: resistor },
      { from: resistorOut, to: ledShort },
      { from: ledLong, to: batteryMinus },
    ],
    code: "",
    symptom: {
      en: "The loop is closed, but the LED does not light up.",
      kk: "Тізбек тұйық, бірақ жарықдиод жанбайды.",
      ru: "Цепь замкнута, но светодиод не горит.",
    },
    options: [
      oLoopOpen,
      oRes220Large,
      optLedBackwards,
      {
        en: "4.5 V is too little for an LED",
        kk: "4,5 В жарықдиод үшін тым аз",
        ru: "4,5 В слишком мало для светодиода",
      },
    ],
    answer: 2,
    faultType: "component",
    explanation: {
      en: "Follow the labels: the resistor leads to the LED's short leg, and the long leg goes to the minus. The LED is reversed and blocks the current. Turn it around.",
      kk: "Жазуларға қара: резистор жарықдиодтың қысқа аяғына барады, ал ұзын аяғы минусқа қосылған. Жарықдиод теріс тұр және токты бөгейді. Оны аударып қой.",
      ru: "Посмотри на подписи: резистор идёт к короткой ножке светодиода, а длинная подключена к минусу. Светодиод перевёрнут и не пропускает ток. Разверни его.",
    },
  },
  {
    id: "blue-on-3v",
    lesson: "electricity",
    title: {
      en: "Red works, blue does not",
      kk: "Қызыл жанады, көк жанбайды",
      ru: "Красный горит, синий нет",
    },
    primer: {
      en: "Different LEDs need a different push to open. Red opens at about 2 V, blue and white at about 3 V. The battery must give more than that, because some voltage also has to be left over to drive the current through the resistor.",
      kk: "Әртүрлі жарықдиодтардың «ашылуы» үшін әртүрлі кернеу керек. Қызыл шамамен 2 В-та, көк пен ақ шамамен 3 В-та ашылады. Батарея одан көбірек беруі керек, өйткені токты резистор арқылы өткізуге де біраз кернеу қалуы тиіс.",
      ru: "Разным светодиодам нужно разное напряжение, чтобы «открыться». Красный открывается примерно при 2 В, синий и белый — примерно при 3 В. Батарейка должна давать больше, потому что часть напряжения должна остаться на то, чтобы прогнать ток через резистор.",
    },
    goal: {
      en: "The blue LED shines brightly.",
      kk: "Көк жарықдиод жарық жанады.",
      ru: "Синий светодиод ярко горит.",
    },
    diagram: batteryCircuit(
      "3",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100, tint: "blue" },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: batteryLedWiring,
    code: "",
    symptom: {
      en: "A red LED lights fine in this circuit. The blue one put in its place stays almost dark.",
      kk: "Бұл тізбекте қызыл жарықдиод жақсы жанады. Оның орнына қойылған көк жарықдиод жанбайды десе де болады.",
      ru: "Красный светодиод в этой цепи горит нормально. Синий, поставленный на его место, почти не светится.",
    },
    options: [
      {
        en: "The blue LED is plugged in backwards",
        kk: "Көк жарықдиод теріс қосылған",
        ru: "Синий светодиод вставлен наоборот",
      },
      {
        en: "A blue LED needs about 3 V, so a 3 V battery has nothing left to drive the current",
        kk: "Көк жарықдиодқа шамамен 3 В керек, сондықтан 3 В батареяда токты өткізетін кернеу қалмайды",
        ru: "Синему светодиоду нужно около 3 В, и у батарейки на 3 В не остаётся напряжения, чтобы прогнать ток",
      },
      { en: "The resistor is too small", kk: "Резистор тым кіші", ru: "Резистор слишком маленький" },
      oLoopOpen,
    ],
    answer: 1,
    faultType: "power",
    explanation: {
      en: "The red LED needs 2 V and leaves 1 V for the resistor, so current flows. The blue one needs the whole 3 V, nothing is left, and almost no current flows. Use three AA batteries (4.5 V).",
      kk: "Қызыл жарықдиодқа 2 В керек, резисторға 1 В қалады, сондықтан ток өтеді. Көкке бүкіл 3 В керек, ештеңе қалмайды, ток өтпейді десе де болады. Үш AA батарея (4,5 В) қолдан.",
      ru: "Красному светодиоду нужно 2 В, и 1 В остаётся резистору, поэтому ток идёт. Синему нужны все 3 В, ничего не остаётся, и ток почти не течёт. Возьми три батарейки AA (4,5 В).",
    },
  },
  {
    id: "too-bright-9v",
    lesson: "electricity",
    title: { en: "Too much of a good thing", kk: "Артық жарық", ru: "Слишком ярко" },
    primer: {
      en: "A resistor chosen for one voltage is wrong for another. With more volts pushing, the same resistor lets more current through. A small LED is happy with about 15 mA and wears out quickly above 20 mA.",
      kk: "Бір кернеуге таңдалған резистор басқа кернеуге жарамайды. Кернеу көбейсе, дәл сол резистор көбірек ток өткізеді. Кішкентай жарықдиодқа шамамен 15 мА жеткілікті, ал 20 мА-ден асса, ол тез тозады.",
      ru: "Резистор, подобранный под одно напряжение, не подходит для другого. Если вольт больше, тот же резистор пропускает больший ток. Маленькому светодиоду хватает примерно 15 мА, а выше 20 мА он быстро изнашивается.",
    },
    goal: {
      en: "The LED shines at normal brightness for a long time.",
      kk: "Жарықдиод қалыпты жарықпен ұзақ уақыт жанады.",
      ru: "Светодиод долго горит с нормальной яркостью.",
    },
    diagram: batteryCircuit(
      "9",
      [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
        { id: "d1", kind: "led", x: 350, y: 100 },
      ],
      [
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
      ],
    ),
    wiring: batteryLedWiring,
    code: "",
    symptom: {
      en: "The LED is much brighter than usual and gets warm. After some days it has become noticeably dimmer.",
      kk: "Жарықдиод әдеттегіден әлдеқайда жарық жанады және жылиды. Бірнеше күннен кейін ол айтарлықтай күңгірттенген.",
      ru: "Светодиод горит намного ярче обычного и нагревается. Через несколько дней он стал заметно тусклее.",
    },
    options: [
      {
        en: "220 Ω is too small for 9 V: the current is about twice what the LED should get",
        kk: "220 Ом 9 В үшін тым аз: ток жарықдиодқа қажеттіден шамамен екі есе көп",
        ru: "220 Ом слишком мало для 9 В: ток примерно вдвое больше, чем положено светодиоду",
      },
      optLedBackwards,
      { en: "The battery is running flat", kk: "Батарея таусылып барады", ru: "Батарейка садится" },
      { en: "The wires are too thin", kk: "Сымдар тым жіңішке", ru: "Провода слишком тонкие" },
    ],
    answer: 0,
    faultType: "component",
    explanation: {
      en: "(9 − 2) V ÷ 220 Ω ≈ 32 mA, about twice the safe current, so the LED overheats and ages fast. For 9 V use about 470 Ω: 7 V ÷ 470 Ω ≈ 15 mA.",
      kk: "(9 − 2) В ÷ 220 Ом ≈ 32 мА — қауіпсіз токтан шамамен екі есе көп, сондықтан жарықдиод қызып, тез тозады. 9 В үшін шамамен 470 Ом ал: 7 В ÷ 470 Ом ≈ 15 мА.",
      ru: "(9 − 2) В ÷ 220 Ом ≈ 32 мА — примерно вдвое больше безопасного тока, поэтому светодиод перегревается и быстро стареет. Для 9 В возьми около 470 Ом: 7 В ÷ 470 Ом ≈ 15 мА.",
    },
  },
  {
    id: "led-on-5v",
    lesson: "what-is-arduino",
    title: {
      en: "The LED that never blinks",
      kk: "Ешқашан жыпылықтамайтын жарықдиод",
      ru: "Светодиод, который не мигает",
    },
    primer: {
      en: "The 5V pin is always on: the sketch cannot switch it. Only the numbered pins can be turned on and off by code. Something that should blink must be connected to a numbered pin, not to 5V.",
      kk: "5V пині әрдайым қосулы: скетч оны өшіре алмайды. Кодпен тек нөмірленген пиндерді ғана қосып-өшіруге болады. Жыпылықтауы керек нәрсе 5V-қа емес, нөмірленген пинге қосылуы тиіс.",
      ru: "Пин 5V включён всегда: скетч не может им управлять. Включать и выключать из кода можно только пронумерованные пины. То, что должно мигать, подключают к пронумерованному пину, а не к 5V.",
    },
    goal: blinkGoal,
    diagram: {
      pins: ["5V", "8", "GND"],
      parts: [
        { id: "r1", kind: "resistor", label: "220 Ω", x: 250, y: 142 },
        { id: "d1", kind: "led", x: 370, y: 142 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["r1.a", "5V"],
        ["r1.b", "d1.a"],
        ["d1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: same("5V"), to: resistor },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: blinkCode,
    symptom: {
      en: "The LED is on all the time and never blinks.",
      kk: "Жарықдиод үнемі жанып тұрады және мүлдем жыпылықтамайды.",
      ru: "Светодиод горит постоянно и совсем не мигает.",
    },
    options: [
      {
        en: "The LED is wired to 5V instead of pin 8",
        kk: "Жарықдиод 8-пиннің орнына 5V-қа қосылған",
        ru: "Светодиод подключён к 5V вместо пина 8",
      },
      {
        en: "delay(500) is too short for the eye to notice",
        kk: "delay(500) тым қысқа, көз байқап үлгермейді",
        ru: "delay(500) слишком короткая, глаз не успевает заметить",
      },
      oNotOutput,
      {
        en: "The LED is too bright to see it blink",
        kk: "Жарықдиод тым жарық, сондықтан жыпылықтауы көрінбейді",
        ru: "Светодиод слишком яркий, чтобы заметить мигание",
      },
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "The resistor starts on the 5V line, which is always on, and pin 8 is a hollow dot. The code blinks pin 8 correctly, but nothing is connected to it. Move the resistor's first end from 5V to pin 8.",
      kk: "Резистор әрдайым қосулы тұратын 5V сызығынан басталады, ал 8-пин — іші бос нүкте. Код 8-пинді дұрыс жыпылықтатады, бірақ оған ештеңе қосылмаған. Резистордың бірінші ұшын 5V-тан 8-пинге ауыстыр.",
      ru: "Резистор начинается на линии 5V, которая включена всегда, а пин 8 — пустая точка. Код правильно мигает пином 8, но к нему ничего не подключено. Переставь первый конец резистора с 5V на пин 8.",
    },
  },
  {
    id: "second-led-forgotten",
    lesson: "what-is-arduino",
    title: { en: "One of two", kk: "Екеудің біреуі", ru: "Один из двух" },
    primer: {
      en: "The board does only what the sketch says, pin by pin. Wiring a second LED is half the job: the code must also set its pin as an output and switch it. A pin the code never mentions does nothing.",
      kk: "Плата тек скетчте жазылғанды ғана, әр пин бойынша жеке орындайды. Екінші жарықдиодты қосу — жұмыстың жартысы ғана: код оның пинін де шығыс етіп баптап, қосып-өшіруі керек. Кодта аталмаған пин ештеңе істемейді.",
      ru: "Плата делает только то, что написано в скетче, для каждого пина отдельно. Подключить второй светодиод — половина дела: код должен ещё настроить его пин как выход и переключать его. Пин, который в коде не упомянут, ничего не делает.",
    },
    goal: {
      en: "Both LEDs blink together.",
      kk: "Екі жарықдиод бірге жыпылықтайды.",
      ru: "Оба светодиода мигают вместе.",
    },
    diagram: twoLedCircuit,
    wiring: twoLedWiring,
    code: blinkCode,
    symptom: {
      en: "The LED on pin 8 blinks. The LED on pin 9 stays dark.",
      kk: "8-пиндегі жарықдиод жыпылықтайды. 9-пиндегі жарықдиод жанбайды.",
      ru: "Светодиод на пине 8 мигает. Светодиод на пине 9 не горит.",
    },
    options: [
      {
        en: "The second LED is plugged in backwards",
        kk: "Екінші жарықдиод теріс қосылған",
        ru: "Второй светодиод вставлен наоборот",
      },
      {
        en: "Two LEDs cannot share one GND",
        kk: "Екі жарықдиод бір GND-ны бөлісе алмайды",
        ru: "Два светодиода не могут делить один GND",
      },
      {
        en: "The code never sets up or switches pin 9",
        kk: "Код 9-пинді баптамайды да, қосып-өшірмейді де",
        ru: "Код не настраивает и не переключает пин 9",
      },
      {
        en: "The board cannot power two LEDs",
        kk: "Плата екі жарықдиодты қоректендіре алмайды",
        ru: "Плата не может питать два светодиода",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "Both LEDs are wired the same way and both are the right way round. The difference is in the code: every line mentions pin 8 and none mentions pin 9. Add pinMode(9, OUTPUT) and a digitalWrite(9, …) next to each one for pin 8.",
      kk: "Екі жарықдиод та бірдей және дұрыс бағытта қосылған. Айырмашылық кодта: әр жолда 8-пин аталады, ал 9-пин еш жерде аталмайды. pinMode(9, OUTPUT) қосып, 8-пинге арналған әр digitalWrite-тың жанына digitalWrite(9, …) жаз.",
      ru: "Оба светодиода подключены одинаково и стоят правильно. Разница в коде: в каждой строке упоминается пин 8 и ни в одной — пин 9. Добавь pinMode(9, OUTPUT) и рядом с каждым digitalWrite для пина 8 такой же для пина 9.",
    },
  },
  {
    id: "missing-brace",
    lesson: "sketch-structure",
    title: {
      en: "The block that never ends",
      kk: "Аяқталмайтын блок",
      ru: "Блок, который не заканчивается",
    },
    primer: {
      en: "Curly braces mark where a block starts and ends. setup() and loop() each need an opening { and a closing }. If one closing brace is missing, the computer thinks the first block is still going on and complains about whatever comes next.",
      kk: "Жүйелі жақшалар блоктың қай жерде басталып, қай жерде аяқталатынын белгілейді. setup() пен loop()-тың әрқайсысына ашылатын { және жабылатын } керек. Жабылатын бір жақша жетіспесе, компьютер бірінші блок әлі жалғасып жатыр деп ойлап, одан кейін келген нәрсеге шағымданады.",
      ru: "Фигурные скобки отмечают, где блок начинается и где заканчивается. И setup(), и loop() нужны открывающая { и закрывающая }. Если одной закрывающей скобки не хватает, компьютер считает, что первый блок ещё продолжается, и ругается на то, что идёт дальше.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);

void loop() {
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`,
    symptom: {
      en: "The sketch does not upload. The editor shows: error: a function-definition is not allowed here before '{' token.",
      kk: "Скетч жүктелмейді. Редактор мынаны көрсетеді: error: a function-definition is not allowed here before '{' token.",
      ru: "Скетч не загружается. Редактор показывает: error: a function-definition is not allowed here before '{' token.",
    },
    options: [
      {
        en: "loop() must be written before setup()",
        kk: "loop() setup()-тан бұрын жазылуы керек",
        ru: "loop() нужно писать перед setup()",
      },
      {
        en: "The closing brace of setup() is missing",
        kk: "setup()-тың жабылатын жақшасы жоқ",
        ru: "У setup() нет закрывающей скобки",
      },
      {
        en: "A semicolon is missing after pinMode",
        kk: "pinMode-тан кейін нүктелі үтір жоқ",
        ru: "После pinMode нет точки с запятой",
      },
      {
        en: "The board is not connected to the computer",
        kk: "Плата компьютерге қосылмаған",
        ru: "Плата не подключена к компьютеру",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "setup() opens with { but is never closed, so the computer sees void loop() as something written inside setup() and refuses it. Add a } on its own line after pinMode(8, OUTPUT);. Counting braces in pairs finds this kind of error fast.",
      kk: "setup() { белгісімен ашылады, бірақ жабылмайды, сондықтан компьютер void loop() жолын setup() ішінде жазылған нәрсе деп қабылдап, оны қабылдамайды. pinMode(8, OUTPUT); жолынан кейін жеке жолға } қос. Жақшаларды жұптап санау мұндай қатені тез табады.",
      ru: "setup() открывается скобкой {, но не закрывается, поэтому компьютер считает void loop() чем-то написанным внутри setup() и отказывается это принимать. Добавь } отдельной строкой после pinMode(8, OUTPUT);. Такую ошибку быстро находит подсчёт скобок по парам.",
    },
  },
  {
    id: "wrong-capital",
    lesson: "sketch-structure",
    title: {
      en: "A small letter, a big problem",
      kk: "Кіші әріп, үлкен мәселе",
      ru: "Маленькая буква, большая проблема",
    },
    primer: {
      en: "In Arduino code, capital and small letters are different letters. digitalWrite, pinMode, HIGH and OUTPUT must be spelled exactly like that. A name with the wrong letter case is, to the computer, a name it has never heard of.",
      kk: "Arduino кодында бас әріп пен кіші әріп — әртүрлі әріптер. digitalWrite, pinMode, HIGH және OUTPUT дәл осылай жазылуы керек. Әріп регистрі қате жазылған атау компьютер үшін — бұрын-соңды естімеген атау.",
      ru: "В коде Arduino заглавные и строчные буквы — разные буквы. digitalWrite, pinMode, HIGH и OUTPUT нужно писать в точности так. Имя с неверным регистром для компьютера — имя, которого он никогда не слышал.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalwrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`,
    symptom: {
      en: "The sketch does not upload. The editor shows: error: 'digitalwrite' was not declared in this scope.",
      kk: "Скетч жүктелмейді. Редактор мынаны көрсетеді: error: 'digitalwrite' was not declared in this scope.",
      ru: "Скетч не загружается. Редактор показывает: error: 'digitalwrite' was not declared in this scope.",
    },
    options: [
      {
        en: "The Arduino has no command for switching a pin on",
        kk: "Arduino-да пинді қосатын команда жоқ",
        ru: "У Arduino нет команды для включения пина",
      },
      {
        en: "HIGH must be written in small letters",
        kk: "HIGH кіші әріптермен жазылуы керек",
        ru: "HIGH нужно писать строчными буквами",
      },
      { en: "A library is missing", kk: "Кітапхана жетіспейді", ru: "Не хватает библиотеки" },
      {
        en: "The first digitalWrite is spelled with a small w",
        kk: "Бірінші digitalWrite кіші w әрпімен жазылған",
        ru: "Первый digitalWrite написан с маленькой w",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "Line 6 says digitalwrite with a small w. The command is digitalWrite, with a capital W, exactly as on line 8. Fix that one letter. \"Was not declared\" almost always means a misspelled name.",
      kk: "6-жолда digitalwrite кіші w әрпімен жазылған. Команда — digitalWrite, бас W әрпімен, дәл 8-жолдағыдай. Сол бір әріпті түзет. «Was not declared» деген хабар әрдайым дерлік атаудың қате жазылғанын білдіреді.",
      ru: "В строке 6 написано digitalwrite с маленькой w. Команда называется digitalWrite, с заглавной W, как в строке 8. Исправь эту одну букву. Сообщение «was not declared» почти всегда означает опечатку в имени.",
    },
  },
  {
    id: "delay-units",
    lesson: "timing",
    title: {
      en: "A second that lasts a millisecond",
      kk: "Миллисекундқа созылған секунд",
      ru: "Секунда длиной в миллисекунду",
    },
    primer: {
      en: "delay() counts in milliseconds, thousandths of a second. delay(1000) waits one second; delay(1) waits so briefly that no eye can follow it. An LED switched that fast looks dim instead of blinking.",
      kk: "delay() миллисекундпен, яғни секундтың мыңнан бір бөлігімен санайды. delay(1000) бір секунд күтеді; delay(1) соншалықты қысқа күтеді, көз ілесе алмайды. Осыншалық жылдам қосылып-өшетін жарықдиод жыпылықтамай, күңгірт жанып тұрғандай көрінеді.",
      ru: "delay() считает в миллисекундах, тысячных долях секунды. delay(1000) ждёт одну секунду; delay(1) ждёт так недолго, что глаз не успевает. Светодиод, который переключается так быстро, выглядит тусклым, а не мигающим.",
    },
    goal: {
      en: "The LED is on for one second, then off for one second.",
      kk: "Жарықдиод бір секунд жанады, сосын бір секунд сөнеді.",
      ru: "Светодиод секунду горит, затем секунду не горит.",
    },
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(1);
  digitalWrite(8, LOW);
  delay(1);
}`,
    symptom: halfBright,
    options: [
      oNotOutput,
      oRes220Large,
      {
        en: "delay(1) waits one millisecond, not one second",
        kk: "delay(1) бір секунд емес, бір миллисекунд күтеді",
        ru: "delay(1) ждёт одну миллисекунду, а не секунду",
      },
      optLedBackwards,
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "delay(1) is a thousandth of a second, so the LED is switched five hundred times a second and the eye sees an average: half brightness. Write delay(1000) for one second.",
      kk: "delay(1) — секундтың мыңнан бір бөлігі, сондықтан жарықдиод секундына бес жүз рет қосылып-өшеді де, көз орташа мәнді көреді: жарты жарық. Бір секунд үшін delay(1000) деп жаз.",
      ru: "delay(1) — это тысячная доля секунды, поэтому светодиод переключается пятьсот раз в секунду, и глаз видит среднее: половину яркости. Для одной секунды напиши delay(1000).",
    },
  },
  {
    id: "pinmode-other-pin",
    lesson: "digital-pins",
    title: {
      en: "The right command for the wrong pin",
      kk: "Қате пинге берілген дұрыс команда",
      ru: "Правильная команда не тому пину",
    },
    primer: {
      en: "pinMode() and digitalWrite() must name the same pin. If the code makes one pin an output and then writes to another, the second pin is still an input, and writing HIGH to an input only switches on a weak internal resistor.",
      kk: "pinMode() мен digitalWrite() бір пинді атауы керек. Код бір пинді шығыс етіп, сосын басқасына жазса, екінші пин әлі де кіріс күйінде қалады, ал кіріске HIGH жазу тек әлсіз ішкі резисторды қосады.",
      ru: "pinMode() и digitalWrite() должны называть один и тот же пин. Если код делает выходом один пин, а потом пишет в другой, второй остаётся входом, а запись HIGH во вход включает лишь слабый внутренний резистор.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("9"),
    wiring: ledWiring("9"),
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(9, HIGH);
  delay(500);
  digitalWrite(9, LOW);
  delay(500);
}`,
    symptom: dimSymptom,
    options: [
      {
        en: "pinMode sets pin 8, but the LED and digitalWrite use pin 9",
        kk: "pinMode 8-пинді баптайды, ал жарықдиод пен digitalWrite 9-пинді қолданады",
        ru: "pinMode настраивает пин 8, а светодиод и digitalWrite используют пин 9",
      },
      oRes220Large,
      optLedBackwards,
      { en: "Pin 9 can only do PWM", kk: "9-пин тек ШИМ жасай алады", ru: "Пин 9 умеет только ШИМ" },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "The LED is on pin 9 and the code writes to pin 9, but pinMode names pin 8. Pin 9 stays an input, so HIGH gives only a trickle of current and the LED barely glows. Change pinMode(8, OUTPUT) to pinMode(9, OUTPUT).",
      kk: "Жарықдиод 9-пинде тұр және код 9-пинге жазады, бірақ pinMode 8-пинді атайды. 9-пин кіріс күйінде қалады, сондықтан HIGH өте аз ток береді де, жарықдиод әрең жанады. pinMode(8, OUTPUT) дегенді pinMode(9, OUTPUT) деп өзгерт.",
      ru: "Светодиод стоит на пине 9, и код пишет в пин 9, но pinMode называет пин 8. Пин 9 остаётся входом, поэтому HIGH даёт лишь крошечный ток и светодиод еле светится. Замени pinMode(8, OUTPUT) на pinMode(9, OUTPUT).",
    },
  },
  {
    id: "resistor-too-small",
    lesson: "led-resistor",
    title: { en: "Ten ohms of protection", kk: "Он омдық қорғаныс", ru: "Защита в десять ом" },
    primer: {
      en: "The resistor decides how much current the LED gets. Too large, and the LED is dim. Too small, and the current is far above what the LED and the pin can stand: an Arduino pin should give about 20 mA and must never be asked for more than 40 mA.",
      kk: "Жарықдиод қанша ток алатынын резистор шешеді. Тым үлкен болса, жарықдиод күңгірт жанады. Тым кіші болса, ток жарықдиод пен пин шыдай алатын мөлшерден әлдеқайда асып кетеді: Arduino пині шамамен 20 мА беруі керек және одан ешқашан 40 мА-ден артық сұрауға болмайды.",
      ru: "Резистор решает, какой ток получит светодиод. Слишком большой — светодиод тусклый. Слишком маленький — ток намного выше того, что выдерживают светодиод и пин: пин Arduino должен отдавать около 20 мА, и требовать от него больше 40 мА нельзя.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8", { label: "10 Ω" }),
    wiring: [
      { from: pin("8"), to: { en: "10 Ω resistor", kk: "10 Ом резистор", ru: "Резистор 10 Ом" } },
      { from: resistorOut, to: ledLong },
      { from: ledShort, to: same("GND") },
    ],
    code: blinkCode,
    symptom: {
      en: "The LED blinks, but far too brightly, and it gets hot. After a while pin 8 stops working altogether.",
      kk: "Жарықдиод жыпылықтайды, бірақ тым жарық жанып, қызады. Біраз уақыттан кейін 8-пин мүлдем істемей қалады.",
      ru: "Светодиод мигает, но слишком ярко, и нагревается. Через некоторое время пин 8 совсем перестаёт работать.",
    },
    options: [
      optLedBackwards,
      {
        en: "The resistor is far too small, so the current overloads the LED and the pin",
        kk: "Резистор тым кіші, сондықтан ток жарықдиод пен пинге артық жүктеме түсіреді",
        ru: "Резистор слишком маленький, и ток перегружает светодиод и пин",
      },
      { en: "delay(500) is too long", kk: "delay(500) тым ұзақ", ru: "delay(500) слишком длинная" },
      oNotOutput,
    ],
    answer: 1,
    faultType: "component",
    explanation: {
      en: "The resistor is 10 Ω instead of 220 Ω. The current tries to reach (5 − 2) V ÷ 10 Ω = 300 mA, many times more than the pin may give, and the pin burns out. Use 220 Ω.",
      kk: "Резистор 220 Ом емес, 10 Ом. Ток (5 − 2) В ÷ 10 Ом = 300 мА-ге жетуге тырысады — бұл пин бере алатыннан бірнеше есе көп, сөйтіп пин күйіп кетеді. 220 Ом қой.",
      ru: "Резистор 10 Ом вместо 220 Ом. Ток стремится к (5 − 2) В ÷ 10 Ом = 300 мА — во много раз больше, чем может отдать пин, и пин сгорает. Поставь 220 Ом.",
    },
  },
  {
    id: "active-low-led",
    lesson: "digital-pins",
    title: {
      en: "The LED that does the opposite",
      kk: "Керісінше істейтін жарықдиод",
      ru: "Светодиод, который делает наоборот",
    },
    primer: {
      en: "An LED lights when its long leg is at a higher voltage than its short leg. If the long leg is tied to 5V and the short leg goes to a pin, the LED lights when the pin is LOW and goes out when the pin is HIGH. The wiring decides which level means \"on\".",
      kk: "Жарықдиод ұзын аяғындағы кернеу қысқа аяғындағыдан жоғары болғанда жанады. Ұзын аяғы 5V-қа, ал қысқа аяғы пинге қосылса, жарықдиод пин LOW болғанда жанып, HIGH болғанда сөнеді. Қай деңгей «қосулы» дегенді білдіретінін сызба шешеді.",
      ru: "Светодиод горит, когда на длинной ножке напряжение выше, чем на короткой. Если длинная ножка подключена к 5V, а короткая идёт к пину, светодиод горит при LOW на пине и гаснет при HIGH. Какой уровень означает «включено», решает схема.",
    },
    goal: {
      en: "The LED is on for one second, then off for three seconds.",
      kk: "Жарықдиод бір секунд жанады, сосын үш секунд сөнеді.",
      ru: "Светодиод секунду горит, затем три секунды не горит.",
    },
    diagram: {
      pins: ["5V", "8"],
      parts: [
        { id: "d1", kind: "led", x: 250, y: 142, flip: true },
        { id: "r1", kind: "resistor", label: "220 Ω", x: 370, y: 142 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["uno.8", "d1.a"],
        ["d1.b", "r1.a"],
        ["r1.b", "5V"],
      ],
    },
    wiring: [
      { from: pin("8"), to: ledShort },
      { from: ledLong, to: resistor },
      { from: resistorOut, to: same("5V") },
    ],
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(3000);
}`,
    symptom: {
      en: "It is the other way round: the LED is off for one second and on for three.",
      kk: "Бәрі керісінше: жарықдиод бір секунд сөніп, үш секунд жанады.",
      ru: "Всё наоборот: светодиод секунду не горит и три секунды горит.",
    },
    options: [
      {
        en: "The two delays are swapped",
        kk: "Екі delay-дің орны ауысқан",
        ru: "Две задержки перепутаны местами",
      },
      optLedBackwards,
      {
        en: "The LED sits between 5V and the pin, so LOW switches it on",
        kk: "Жарықдиод 5V мен пиннің арасында тұр, сондықтан оны LOW қосады",
        ru: "Светодиод стоит между 5V и пином, поэтому его включает LOW",
      },
      oNotOutput,
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "The LED's long leg is on 5V and its short leg on pin 8. Current flows when pin 8 is LOW, so every HIGH and LOW has the opposite effect. Swap HIGH and LOW in the code, or rewire the LED from pin 8 to GND.",
      kk: "Жарықдиодтың ұзын аяғы 5V-та, ал қысқа аяғы 8-пинде. Ток 8-пин LOW болғанда өтеді, сондықтан әр HIGH мен LOW керісінше әсер етеді. Кодтағы HIGH мен LOW-тың орнын ауыстыр немесе жарықдиодты 8-пин мен GND арасына қайта қос.",
      ru: "Длинная ножка светодиода стоит на 5V, а короткая — на пине 8. Ток течёт, когда пин 8 в LOW, поэтому каждый HIGH и LOW действует наоборот. Поменяй HIGH и LOW в коде местами или переподключи светодиод между пином 8 и GND.",
    },
  },
  {
    id: "button-no-pullup",
    lesson: "buttons",
    title: { en: "Half of a pull-up", kk: "Жарты pull-up", ru: "Половина подтяжки" },
    primer: {
      en: "A button wired between a pin and GND gives the pin a level only while pressed. When released, something must pull the pin up to HIGH. INPUT_PULLUP does that; plain INPUT does not, and leaves the pin floating.",
      kk: "Пин мен GND арасына қосылған батырма пинге тек басылған кезде ғана деңгей береді. Жіберілген кезде пинді бір нәрсе HIGH деңгейіне көтеріп тұруы керек. INPUT_PULLUP мұны істейді; жай INPUT істемейді де, пинді іліп қояды.",
      ru: "Кнопка между пином и GND задаёт пину уровень, только пока нажата. Когда она отпущена, что-то должно подтягивать пин к HIGH. INPUT_PULLUP это делает; простой INPUT — нет, и пин остаётся висеть в воздухе.",
    },
    goal: buttonGoal,
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `void setup() {
  pinMode(2, INPUT);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
}`,
    symptom: {
      en: "The LED lights when the button is pressed. With the button released it flickers on and off by itself.",
      kk: "Батырманы басқанда жарықдиод жанады. Батырма жіберулі кезде ол өздігінен жанып-сөніп тұрады.",
      ru: "При нажатии кнопки светодиод горит. Когда кнопка отпущена, он сам по себе мигает.",
    },
    options: [
      {
        en: "The button is worn out and needs replacing",
        kk: "Батырма тозған, ауыстыру керек",
        ru: "Кнопка износилась, её нужно заменить",
      },
      optLedBackwards,
      oCheckHigh,
      {
        en: "The mode is INPUT, so nothing holds pin 2 HIGH when the button is released",
        kk: "Режим INPUT, сондықтан батырма жіберулі кезде 2-пинді HIGH күйінде ештеңе ұстамайды",
        ru: "Режим INPUT, поэтому при отпущенной кнопке ничто не держит пин 2 в HIGH",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The button is wired correctly for a pull-up, but the code says pinMode(2, INPUT). Without the internal pull-up the released pin floats and reads noise. Change it to pinMode(2, INPUT_PULLUP).",
      kk: "Батырма pull-up үшін дұрыс қосылған, бірақ кодта pinMode(2, INPUT) деп жазылған. Ішкі pull-up резисторынсыз жіберулі пин ілініп тұрады да, шуды оқиды. Оны pinMode(2, INPUT_PULLUP) деп өзгерт.",
      ru: "Кнопка подключена правильно для подтяжки, но в коде написано pinMode(2, INPUT). Без внутренней подтяжки отпущенный пин висит в воздухе и читает помехи. Замени на pinMode(2, INPUT_PULLUP).",
    },
  },
  {
    id: "button-read-once",
    lesson: "buttons",
    title: {
      en: "The button that is asked only once",
      kk: "Бір-ақ рет сұралатын батырма",
      ru: "Кнопка, которую спрашивают один раз",
    },
    primer: {
      en: "digitalRead() takes one snapshot of the pin at the moment it runs. To follow a button, the snapshot must be taken again and again, inside loop(). A reading taken in setup() is a photograph of the first instant and never changes.",
      kk: "digitalRead() орындалған сәтте пиннің бір «суретін» алады. Батырманы бақылау үшін сурет loop() ішінде қайта-қайта алынуы керек. setup() ішінде алынған көрсеткіш — алғашқы сәттің фотосуреті, ол ешқашан өзгермейді.",
      ru: "digitalRead() делает один «снимок» пина в момент выполнения. Чтобы следить за кнопкой, снимок нужно делать снова и снова, внутри loop(). Показание, снятое в setup(), — фотография первого мгновения, и оно никогда не меняется.",
    },
    goal: buttonGoal,
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `bool pressed = false;

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
  pressed = digitalRead(2) == LOW;
}

void loop() {
  digitalWrite(8, pressed);
}`,
    symptom: {
      en: "The LED ignores the button. Only if the button is held down while the board starts does the LED come on, and then it stays on forever.",
      kk: "Жарықдиод батырмаға мән бермейді. Тек плата іске қосылған кезде батырма басулы тұрса ғана жарықдиод жанады, сосын мәңгі жанып тұрады.",
      ru: "Светодиод не реагирует на кнопку. Только если держать кнопку нажатой в момент запуска платы, светодиод загорается — и остаётся гореть навсегда.",
    },
    options: [
      {
        en: "INPUT_PULLUP inverts the LED",
        kk: "INPUT_PULLUP жарықдиодты кері айналдырады",
        ru: "INPUT_PULLUP переворачивает работу светодиода",
      },
      {
        en: "The button is read once in setup() and never again",
        kk: "Батырма setup() ішінде бір рет оқылады да, қайта оқылмайды",
        ru: "Кнопка читается один раз в setup() и больше никогда",
      },
      oButtonResistor,
      {
        en: "A bool cannot be passed to digitalWrite",
        kk: "digitalWrite-қа bool беруге болмайды",
        ru: "В digitalWrite нельзя передавать bool",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The line that reads the button is in setup(), so it runs a single time at start-up. loop() keeps writing that old value. Move pressed = digitalRead(2) == LOW; into loop(), before digitalWrite.",
      kk: "Батырманы оқитын жол setup() ішінде тұр, сондықтан ол іске қосылғанда бір-ақ рет орындалады. loop() сол ескі мәнді жаза береді. pressed = digitalRead(2) == LOW; жолын loop() ішіне, digitalWrite-тың алдына көшір.",
      ru: "Строка, которая читает кнопку, стоит в setup(), поэтому выполняется один раз при запуске. loop() продолжает записывать это старое значение. Перенеси pressed = digitalRead(2) == LOW; в loop(), перед digitalWrite.",
    },
  },
  {
    id: "bb-resistor-bypassed",
    lesson: "breadboard",
    title: {
      en: "The resistor that resists nothing",
      kk: "Ештеңені шектемейтін резистор",
      ru: "Резистор, который ничего не ограничивает",
    },
    primer: {
      en: "A part with both legs in the same row of five holes is bridged by the metal strip under it. For a resistor that means the current takes the strip and the resistor limits nothing, as if it were not there.",
      kk: "Екі аяғы да бес тесіктен тұратын бір қатарда тұрған бөлшекті оның астындағы металл жолақ тұйықтайды. Резистор үшін бұл токтың жолақ арқылы өтетінін, ал резистордың ештеңені шектемейтінін білдіреді — ол жоқ сияқты.",
      ru: "Деталь, у которой обе ножки стоят в одном ряду из пяти отверстий, замкнута металлической полоской под ней. Для резистора это значит, что ток идёт по полоске, а резистор ничего не ограничивает, как будто его нет.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    board: {
      rows: 14,
      items: [
        { kind: "lead", at: "3a", label: "Pin 8" },
        { kind: "resistor", from: "3c", to: "3d", label: "220 Ω" },
        { kind: "led", long: "3e", short: "5e" },
        { kind: "lead", at: "5a", label: "GND" },
      ],
    },
    wiring: ledWiring("8"),
    code: blinkCode,
    symptom: tooBright,
    options: [
      optLedBackwards,
      optSplitRail,
      {
        en: "Both legs of the resistor are in the same row, so the current goes around it",
        kk: "Резистордың екі аяғы да бір қатарда тұр, сондықтан ток оны айналып өтеді",
        ru: "Обе ножки резистора стоят в одном ряду, и ток идёт в обход него",
      },
      {
        en: "220 Ω is too small for a 5 V pin",
        kk: "220 Ом 5 В пин үшін тым аз",
        ru: "220 Ом слишком мало для пина на 5 В",
      },
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "The plan has a resistor between pin 8 and the LED. On the board both of its legs are in row 3, so the strip of row 3 carries the current straight to the LED with nothing limiting it. Move one leg of the resistor to another row and connect the LED there.",
      kk: "Сызба бойынша 8-пин мен жарықдиодтың арасында резистор тұр. Тақтада оның екі аяғы да 3-қатарда, сондықтан 3-қатардың жолағы токты ештеңе шектемей тікелей жарықдиодқа жеткізеді. Резистордың бір аяғын басқа қатарға ауыстырып, жарықдиодты сонда қос.",
      ru: "По плану между пином 8 и светодиодом стоит резистор. На плате обе его ножки в ряду 3, поэтому полоска ряда 3 проводит ток прямо к светодиоду без всякого ограничения. Переставь одну ножку резистора в другой ряд и подключи светодиод там.",
    },
  },
  {
    id: "bb-across-gap",
    lesson: "breadboard",
    title: {
      en: "Two halves of one row",
      kk: "Бір қатардың екі жартысы",
      ru: "Две половины одного ряда",
    },
    primer: {
      en: "The groove down the middle of a breadboard cuts every row in two. Holes a to e are one strip and holes f to j are another, even though they share a row number. To connect the two halves you need a wire across the groove.",
      kk: "Макет тақтасының ортасындағы ойық әр қатарды екіге бөледі. a–e тесіктері — бір жолақ, f–j тесіктері — басқа жолақ, олардың қатар нөмірі бірдей болса да. Екі жартыны қосу үшін ойықтың үстінен сым салу керек.",
      ru: "Канавка посередине макетной платы разрезает каждый ряд на две части. Отверстия a–e — одна полоска, отверстия f–j — другая, хотя номер ряда у них общий. Чтобы соединить две половины, нужен провод через канавку.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    board: {
      rows: 14,
      items: [
        { kind: "lead", at: "3a", label: "Pin 8" },
        { kind: "resistor", from: "3c", to: "7c", label: "220 Ω" },
        { kind: "led", long: "7g", short: "9g" },
        { kind: "wire", from: "9f", to: "9e" },
        { kind: "lead", at: "9a", label: "GND" },
      ],
    },
    wiring: ledWiring("8"),
    code: blinkCode,
    symptom: neverLights,
    options: [
      optSameRow,
      optLedBackwards,
      optSplitRail,
      {
        en: "Row 7 is cut by the middle groove: the resistor is above it and the LED below",
        kk: "7-қатарды ортадағы ойық бөліп тұр: резистор оның үстінде, жарықдиод астында",
        ru: "Ряд 7 разрезан канавкой: резистор стоит выше неё, а светодиод ниже",
      },
    ],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "The resistor ends at 7c, above the groove, and the LED's long leg is at 7g, below it. Same row number, two separate strips. Row 9 shows how to do it right: a short wire joins 9e and 9f. Add the same kind of wire from 7e to 7f.",
      kk: "Резистор ойықтың үстіндегі 7c тесігінде аяқталады, ал жарықдиодтың ұзын аяғы ойықтың астындағы 7g тесігінде тұр. Қатар нөмірі бірдей, бірақ жолақтары бөлек. Қалай дұрыс істеу керегін 9-қатар көрсетеді: қысқа сым 9e мен 9f-ті қосып тұр. 7e-ден 7f-ке дәл сондай сым қос.",
      ru: "Резистор заканчивается в 7c, выше канавки, а длинная ножка светодиода стоит в 7g, ниже неё. Номер ряда один, а полоски две. Ряд 9 показывает, как сделать правильно: короткий провод соединяет 9e и 9f. Добавь такой же провод от 7e к 7f.",
    },
  },
  {
    id: "pwm-percent",
    lesson: "analog-pwm",
    title: { en: "Fifty is not half", kk: "Елу — жарты емес", ru: "Пятьдесят — это не половина" },
    primer: {
      en: "analogWrite() does not take a percentage. Its scale runs from 0 (always off) to 255 (always on). Half brightness is about 127, and 50 is only about a fifth of the way.",
      kk: "analogWrite() пайызды қабылдамайды. Оның шкаласы 0-ден (үнемі өшірулі) 255-ке дейін (үнемі қосулы). Жарты жарық — шамамен 127, ал 50 — жолдың бестен бір бөлігі ғана.",
      ru: "analogWrite() принимает не проценты. Его шкала идёт от 0 (всегда выключено) до 255 (всегда включено). Половина яркости — это около 127, а 50 — только пятая часть пути.",
    },
    goal: {
      en: "The LED glows at half brightness.",
      kk: "Жарықдиод жарты жарықпен жанады.",
      ru: "Светодиод горит вполсилы.",
    },
    diagram: ledCircuit("9"),
    wiring: ledWiring("9"),
    code: `void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, 50);
}`,
    symptom: {
      en: "The LED glows, but much more dimly than half brightness.",
      kk: "Жарықдиод жанады, бірақ жарты жарықтан әлдеқайда күңгірт.",
      ru: "Светодиод горит, но намного тусклее, чем вполсилы.",
    },
    options: [
      oNoPwm9,
      oRes220Large,
      {
        en: "50 is out of 255, about 20 %, not 50 %",
        kk: "50 — 255-тен алынған мән, яғни 50 % емес, шамамен 20 %",
        ru: "50 — это из 255, то есть около 20 %, а не 50 %",
      },
      {
        en: "analogWrite needs a delay after it",
        kk: "analogWrite-тан кейін delay керек",
        ru: "После analogWrite нужна задержка",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "analogWrite(9, 50) keeps the pin on for 50 ÷ 255 ≈ 20 % of the time. For half brightness write analogWrite(9, 127).",
      kk: "analogWrite(9, 50) пинді уақыттың 50 ÷ 255 ≈ 20 %-ында ғана қосулы ұстайды. Жарты жарық үшін analogWrite(9, 127) деп жаз.",
      ru: "analogWrite(9, 50) держит пин включённым 50 ÷ 255 ≈ 20 % времени. Для половины яркости напиши analogWrite(9, 127).",
    },
  },
  {
    id: "fade-no-delay",
    lesson: "analog-pwm",
    title: {
      en: "The fade that is over too soon",
      kk: "Тым тез бітетін жану",
      ru: "Плавность, которая заканчивается слишком быстро",
    },
    primer: {
      en: "A fade is 256 small steps of brightness. Without a pause between the steps the board runs through all of them in a few thousandths of a second, again and again. The eye cannot follow and sees only the average.",
      kk: "Біртіндеп жану — жарықтың 256 кішкентай қадамы. Қадамдардың арасында үзіліс болмаса, плата олардың бәрін секундтың бірнеше мыңнан бір бөлігінде қайта-қайта өтіп шығады. Көз ілесе алмай, тек орташа мәнді көреді.",
      ru: "Плавное разгорание — это 256 маленьких шагов яркости. Без паузы между шагами плата пробегает их все за несколько тысячных долей секунды, снова и снова. Глаз не успевает и видит только среднее.",
    },
    goal: fadeGoal,
    diagram: ledCircuit("9"),
    wiring: ledWiring("9"),
    code: `void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b++) {
    analogWrite(9, b);
  }
}`,
    symptom: {
      en: "The LED glows steadily at medium brightness. No fading can be seen.",
      kk: "Жарықдиод орташа жарықпен тұрақты жанып тұрады. Біртіндеп жану байқалмайды.",
      ru: "Светодиод ровно светится со средней яркостью. Плавного разгорания не видно.",
    },
    options: [
      oNoPwm9,
      {
        en: "There is no delay inside the for loop, so the whole fade takes a few milliseconds",
        kk: "for циклінің ішінде delay жоқ, сондықтан бүкіл жану бірнеше миллисекундқа ғана созылады",
        ru: "Внутри цикла for нет задержки, и всё разгорание занимает несколько миллисекунд",
      },
      {
        en: "The variable should be float, not int",
        kk: "Айнымалы int емес, float болуы керек",
        ru: "Переменная должна быть float, а не int",
      },
      {
        en: "An ordinary LED cannot be dimmed",
        kk: "Қарапайым жарықдиодтың жарығын реттеуге болмайды",
        ru: "Яркость обычного светодиода нельзя менять",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The loop from 0 to 255 has no pause, so each full fade is over almost instantly and repeats hundreds of times a second. The eye averages it to medium brightness. Add delay(10); after analogWrite(9, b);.",
      kk: "0-ден 255-ке дейінгі циклде үзіліс жоқ, сондықтан әр толық жану лезде аяқталып, секундына жүздеген рет қайталанады. Көз мұны орташа жарық ретінде қабылдайды. analogWrite(9, b); жолынан кейін delay(10); қос.",
      ru: "В цикле от 0 до 255 нет паузы, поэтому каждое полное разгорание заканчивается почти мгновенно и повторяется сотни раз в секунду. Глаз усредняет это до средней яркости. Добавь delay(10); после analogWrite(9, b);.",
    },
  },
  {
    id: "threshold-reversed",
    lesson: "sensors",
    title: {
      en: "Day and night swapped",
      kk: "Күн мен түн ауысып кеткен",
      ru: "День и ночь поменялись местами",
    },
    primer: {
      en: "A sensor gives a number; what the number means depends on the wiring. With the photoresistor between 5V and the analog pin and a fixed resistor to GND, more light gives a larger number. A comparison in the code has to match that direction.",
      kk: "Датчик сан береді; ол санның нені білдіретіні сызбаға байланысты. Фоторезистор 5V мен аналогтық пиннің арасында, ал тұрақты резистор GND-ға қосылса, жарық көбейген сайын сан өседі. Кодтағы салыстыру осы бағытқа сәйкес келуі керек.",
      ru: "Датчик выдаёт число; что это число означает, зависит от схемы. Если фоторезистор стоит между 5V и аналоговым пином, а постоянный резистор идёт к GND, то чем больше света, тем больше число. Сравнение в коде должно соответствовать этому направлению.",
    },
    goal: {
      en: "The Serial Monitor prints \"dark\" when the sensor is covered and \"light\" otherwise.",
      kk: "Датчик жабылғанда Serial Monitor «dark», ал қалған уақытта «light» деп шығарады.",
      ru: "Serial Monitor печатает «dark», когда датчик закрыт, и «light» в остальное время.",
    },
    diagram: {
      pins: ["5V", "A0", "GND"],
      parts: [
        { id: "ldr", kind: "resistor", label: "LDR", x: 250, y: 142 },
        { id: "r2", kind: "resistor", label: "10 kΩ", x: 250, y: 230 },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["uno.A0", "ldr.a"],
        ["ldr.b", "5V"],
        ["uno.A0", "r2.a"],
        ["r2.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      {
        from: same("A0"),
        to: {
          en: "Photoresistor, leg 1",
          kk: "Фоторезистордың 1-аяғы",
          ru: "Фоторезистор, ножка 1",
        },
      },
      {
        from: {
          en: "Photoresistor, leg 2",
          kk: "Фоторезистордың 2-аяғы",
          ru: "Фоторезистор, ножка 2",
        },
        to: same("5V"),
      },
      {
        from: same("A0"),
        to: { en: "10 kΩ resistor", kk: "10 кОм резистор", ru: "Резистор 10 кОм" },
      },
      { from: resistorOut, to: same("GND") },
    ],
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(A0);
  if (light > 500) {
    Serial.println("dark");
  } else {
    Serial.println("light");
  }
  delay(500);
}`,
    symptom: {
      en: "It prints \"dark\" in bright light and \"light\" when the sensor is covered.",
      kk: "Жарық көп болғанда «dark», ал датчик жабылғанда «light» деп шығарады.",
      ru: "На ярком свету печатает «dark», а когда датчик закрыт — «light».",
    },
    options: [
      {
        en: "The photoresistor is plugged in backwards",
        kk: "Фоторезистор теріс қосылған",
        ru: "Фоторезистор вставлен наоборот",
      },
      {
        en: "The comparison is the wrong way round: with this wiring a large number means bright",
        kk: "Салыстыру кері жазылған: бұл сызбада үлкен сан жарық көп дегенді білдіреді",
        ru: "Сравнение написано наоборот: в этой схеме большое число означает яркий свет",
      },
      {
        en: "The 10 kΩ resistor is missing",
        kk: "10 кОм резистор жоқ",
        ru: "Нет резистора 10 кОм",
      },
      oBaud,
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The divider is wired correctly: more light, higher reading. The code calls a high reading \"dark\", which is backwards. Change the condition to light < 500.",
      kk: "Бөлгіш дұрыс жиналған: жарық көп болса, көрсеткіш жоғары. Ал код жоғары көрсеткішті «dark» деп атайды — бұл кері. Шартты light < 500 деп өзгерт.",
      ru: "Делитель собран правильно: больше света — выше показание. А код называет высокое показание «dark», то есть наоборот. Поменяй условие на light < 500.",
    },
  },
  {
    id: "pot-on-3v3",
    lesson: "sensors",
    title: {
      en: "The knob that stops at two thirds",
      kk: "Үштен екісінде тоқтайтын тұтқа",
      ru: "Ручка, которая останавливается на двух третях",
    },
    primer: {
      en: "analogRead() compares the pin's voltage with 5 V: 5 V reads 1023, 2.5 V reads about 512. A sensor fed from the 3.3V pin can never output more than 3.3 V, so its readings stop at about 675.",
      kk: "analogRead() пиндегі кернеуді 5 В-пен салыстырады: 5 В — 1023, 2,5 В — шамамен 512 болып оқылады. 3.3V пинінен қоректенетін датчик 3,3 В-тан артық кернеу шығара алмайды, сондықтан оның көрсеткіші шамамен 675-те тоқтайды.",
      ru: "analogRead() сравнивает напряжение на пине с 5 В: 5 В читается как 1023, 2,5 В — примерно как 512. Датчик, запитанный от пина 3.3V, не может выдать больше 3,3 В, поэтому его показания останавливаются примерно на 675.",
    },
    goal: potGoal,
    diagram: {
      pins: ["3.3V", "A0", "GND"],
      parts: [{ id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] }],
      wires: [
        ["uno.3.3V", "pot.1"],
        ["uno.A0", "pot.2"],
        ["pot.3", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: potLeg1, to: same("3.3V") },
      { from: potLeg2, to: same("A0") },
      { from: potLeg3, to: same("GND") },
    ],
    code: potReadCode,
    symptom: {
      en: "The numbers follow the knob, but at the end of the turn they stop at about 675 and never reach 1023.",
      kk: "Сандар тұтқаға сәйкес өзгереді, бірақ бұрылыстың соңында шамамен 675-те тоқтап, 1023-ке жетпейді.",
      ru: "Числа следуют за ручкой, но в конце поворота останавливаются примерно на 675 и не доходят до 1023.",
    },
    options: [
      oPotWorn,
      {
        en: "analogRead can only count to 675",
        kk: "analogRead тек 675-ке дейін санай алады",
        ru: "analogRead умеет считать только до 675",
      },
      { en: "delay(200) is too long", kk: "delay(200) тым ұзақ", ru: "delay(200) слишком длинная" },
      {
        en: "The potentiometer's top leg is on 3.3V instead of 5V",
        kk: "Потенциометрдің жоғарғы аяғы 5V орнына 3.3V-қа қосылған",
        ru: "Верхняя ножка потенциометра подключена к 3.3V вместо 5V",
      },
    ],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "Leg 1 is on the 3.3V pin, so the highest voltage the knob can give is 3.3 V, and 3.3 ÷ 5 × 1023 ≈ 675. Move leg 1 to the 5V pin to use the full range.",
      kk: "1-аяқ 3.3V пиніне қосылған, сондықтан тұтқа бере алатын ең жоғары кернеу — 3,3 В, ал 3,3 ÷ 5 × 1023 ≈ 675. Толық ауқымды пайдалану үшін 1-аяқты 5V пиніне ауыстыр.",
      ru: "Ножка 1 стоит на пине 3.3V, поэтому наибольшее напряжение, которое может дать ручка, — 3,3 В, а 3,3 ÷ 5 × 1023 ≈ 675. Переставь ножку 1 на пин 5V, чтобы использовать весь диапазон.",
    },
  },
  {
    id: "serial-write",
    lesson: "serial",
    title: {
      en: "Letters instead of numbers",
      kk: "Сандардың орнына әріптер",
      ru: "Буквы вместо чисел",
    },
    primer: {
      en: "Serial.print() turns a number into readable digits: 65 is sent as \"6\" and \"5\". Serial.write() sends the number as one raw byte, and the monitor shows the character with that code: 65 appears as the letter A.",
      kk: "Serial.print() санды оқуға болатын цифрларға айналдырады: 65 «6» және «5» болып жіберіледі. Serial.write() санды бір «шикі» байт ретінде жібереді, ал монитор сол кодқа сәйкес таңбаны көрсетеді: 65 A әрпі болып шығады.",
      ru: "Serial.print() превращает число в читаемые цифры: 65 отправляется как «6» и «5». Serial.write() отправляет число одним «сырым» байтом, и монитор показывает символ с таким кодом: 65 выглядит как буква A.",
    },
    goal: {
      en: "The Serial Monitor shows the knob position as a number from 0 to 255.",
      kk: "Serial Monitor тұтқаның күйін 0-ден 255-ке дейінгі сан түрінде көрсетеді.",
      ru: "Serial Monitor показывает положение ручки числом от 0 до 255.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0) / 4;
  Serial.write(value);
  delay(200);
}`,
    symptom: {
      en: "The monitor is set to 9600 baud, yet it shows single letters and symbols that change as the knob turns: A, B, C, z, ~.",
      kk: "Монитор 9600 бодқа қойылған, бірақ ол тұтқаны бұрағанда өзгеретін жеке әріптер мен таңбаларды көрсетеді: A, B, C, z, ~.",
      ru: "Монитор настроен на 9600 бод, но показывает отдельные буквы и символы, которые меняются при повороте ручки: A, B, C, z, ~.",
    },
    options: [
      oBaud,
      {
        en: "Dividing by 4 turns numbers into letters",
        kk: "4-ке бөлу сандарды әріптерге айналдырады",
        ru: "Деление на 4 превращает числа в буквы",
      },
      {
        en: "Serial.write() sends a raw byte, which the monitor shows as a character",
        kk: "Serial.write() «шикі» байт жібереді, ал монитор оны таңба ретінде көрсетеді",
        ru: "Serial.write() отправляет «сырой» байт, а монитор показывает его как символ",
      },
      {
        en: "The potentiometer is noisy",
        kk: "Потенциометр шу береді",
        ru: "Потенциометр даёт помехи",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The speed matches, so this is not garbage: each symbol is the character whose code equals the reading. Use Serial.println(value) to send the number as digits.",
      kk: "Жылдамдық сәйкес келеді, демек бұл кездейсоқ таңбалар емес: әр таңба — коды көрсеткішке тең символ. Санды цифрлармен жіберу үшін Serial.println(value) қолдан.",
      ru: "Скорость совпадает, так что это не мусор: каждый символ — это знак, код которого равен показанию. Чтобы отправить число цифрами, используй Serial.println(value).",
    },
  },
  {
    id: "serial-quotes",
    lesson: "serial",
    title: {
      en: "The word instead of the value",
      kk: "Мәннің орнына сөз",
      ru: "Слово вместо значения",
    },
    primer: {
      en: "Quotation marks make text. Serial.println(\"value\") prints the five letters v-a-l-u-e. Without the quotation marks, Serial.println(value) prints the number stored in the variable called value.",
      kk: "Тырнақша мәтін жасайды. Serial.println(\"value\") v-a-l-u-e деген бес әріпті шығарады. Тырнақшасыз Serial.println(value) value деп аталатын айнымалыда сақталған санды шығарады.",
      ru: "Кавычки делают текст. Serial.println(\"value\") печатает пять букв v-a-l-u-e. Без кавычек Serial.println(value) печатает число, которое хранится в переменной с именем value.",
    },
    goal: potGoal,
    diagram: potCircuit,
    wiring: potWiring,
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0);
  Serial.println("value");
  delay(200);
}`,
    symptom: {
      en: "The Serial Monitor prints the word value over and over, and never a number.",
      kk: "Serial Monitor санды емес, value деген сөзді қайта-қайта шығарады.",
      ru: "Serial Monitor снова и снова печатает слово value и ни разу — число.",
    },
    options: [
      {
        en: "The potentiometer is not connected to 5V",
        kk: "Потенциометр 5V-қа қосылмаған",
        ru: "Потенциометр не подключён к 5V",
      },
      oBaud,
      { en: "analogRead returns text", kk: "analogRead мәтін қайтарады", ru: "analogRead возвращает текст" },
      {
        en: "The variable is in quotation marks, so its name is printed as text",
        kk: "Айнымалы тырнақшаға алынған, сондықтан оның атауы мәтін ретінде шығады",
        ru: "Переменная взята в кавычки, поэтому её имя печатается как текст",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "Serial.println(\"value\") sends the text between the quotation marks. Remove them: Serial.println(value) sends the number the variable holds.",
      kk: "Serial.println(\"value\") тырнақшаның ішіндегі мәтінді жібереді. Тырнақшаларды алып таста: Serial.println(value) айнымалыда сақталған санды жібереді.",
      ru: "Serial.println(\"value\") отправляет текст между кавычками. Убери их: Serial.println(value) отправит число, которое хранится в переменной.",
    },
  },
  {
    id: "sonar-no-trig",
    lesson: "reading-diagrams",
    title: { en: "Nobody says go", kk: "Ешкім «баста» демейді", ru: "Никто не даёт старт" },
    primer: {
      en: "The HC-SR04 does nothing on its own. It measures only after it gets a start pulse on its Trig pin. On a diagram, check that each of its four contacts has a wire: two for power and two for signals.",
      kk: "HC-SR04 өздігінен ештеңе істемейді. Ол Trig пиніне бастау импульсі келгеннен кейін ғана өлшейді. Сызбада оның төрт контактісінің әрқайсысында сым бар-жоғын тексер: екеуі қорекке, екеуі сигналға арналған.",
      ru: "HC-SR04 сам ничего не делает. Он измеряет только после того, как получит стартовый импульс на пин Trig. На схеме проверь, что у каждого из четырёх его контактов есть провод: два для питания и два для сигналов.",
    },
    goal: sonarGoal,
    diagram: {
      pins: ["5V", "9", "10", "GND"],
      parts: [
        {
          id: "hc",
          kind: "chip",
          title: same("HC-SR04"),
          x: 330,
          y: 102,
          left: ["VCC", "Trig", "Echo", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["hc.VCC", "5V"],
        ["uno.10", "hc.Echo"],
        ["hc.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: same("HC-SR04 VCC"), to: same("5V") },
      { from: same("HC-SR04 Echo"), to: pin("10") },
      { from: same("HC-SR04 GND"), to: same("GND") },
    ],
    code: sonarCode,
    symptom: sonarZero,
    options: [
      {
        en: "The Trig contact has no wire, so the sensor never gets a start pulse",
        kk: "Trig контактісінде сым жоқ, сондықтан датчикке бастау импульсі келмейді",
        ru: "У контакта Trig нет провода, и датчик не получает стартовый импульс",
      },
      {
        en: "The sensor's GND is not connected, so the sensor has no power",
        kk: "Датчиктің GND контактісі қосылмаған, сондықтан датчикте қорек жоқ",
        ru: "GND датчика не подключён, поэтому у датчика нет питания",
      },
      {
        en: "Trig and Echo are swapped between the wiring and the code",
        kk: "Сызба мен кодта Trig пен Echo орындары ауысып кеткен",
        ru: "Trig и Echo перепутаны между схемой и кодом",
      },
      { en: "The division by 58 is wrong", kk: "58-ге бөлу қате", ru: "Деление на 58 неверное" },
    ],
    answer: 0,
    faultType: "wiring",
    explanation: {
      en: "Power and Echo are wired, and the pin numbers in the code are right. But Trig and pin 9 are both hollow dots: the start pulse never arrives, the sensor never sends sound, and pulseIn() times out with 0. Connect Trig to pin 9.",
      kk: "Қорек пен Echo қосылған, кодтағы пин нөмірлері де дұрыс. Бірақ Trig те, 9-пин де — іші бос нүктелер: бастау импульсі жетпейді, датчик дыбыс жібермейді, ал pulseIn() күту уақыты біткенде 0 қайтарады. Trig-ті 9-пинге қос.",
      ru: "Питание и Echo подключены, номера пинов в коде верные. Но Trig и пин 9 — пустые точки: стартовый импульс не приходит, датчик не посылает звук, и pulseIn() по тайм-ауту возвращает 0. Соедини Trig с пином 9.",
    },
  },
  {
    id: "servo-no-signal",
    lesson: "reading-diagrams",
    title: {
      en: "Powered, but not told what to do",
      kk: "Қорегі бар, бірақ бұйрығы жоқ",
      ru: "Питание есть, а команд нет",
    },
    primer: {
      en: "A servo has three wires: plus, minus and signal. Power alone does not move it; the position comes over the signal wire. Read the diagram contact by contact and make sure none of the three is left empty.",
      kk: "Сервода үш сым бар: плюс, минус және сигнал. Қорек қана оны қозғалтпайды; күйі сигнал сымы арқылы беріледі. Сызбаны контакт бойынша оқып, үшеуінің ешқайсысы бос қалмағанына көз жеткіз.",
      ru: "У серво три провода: плюс, минус и сигнал. Одно питание его не двигает; положение передаётся по сигнальному проводу. Читай схему контакт за контактом и убедись, что ни один из трёх не остался пустым.",
    },
    goal: sweepGoal,
    diagram: {
      pins: ["5V", "9", "GND"],
      parts: [
        {
          id: "servo",
          kind: "chip",
          title: smallServoTitle,
          x: 330,
          y: 76,
          left: ["V+", "Signal", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["servo.V+", "5V"],
        ["servo.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: servoV, to: same("5V") },
      { from: servoGnd, to: same("GND") },
    ],
    code: sweepCode,
    symptom: servoStill,
    options: [
      {
        en: "The servo takes more current than the 5V pin can give",
        kk: "Серво 5V пині бере алатыннан көп ток тартады",
        ru: "Серво потребляет больше тока, чем может дать пин 5V",
      },
      {
        en: "The signal contact of the servo is not connected to anything",
        kk: "Сервоның сигнал контактісі ештеңеге қосылмаған",
        ru: "Сигнальный контакт серво ни к чему не подключён",
      },
      {
        en: "The code attaches the servo to the wrong pin",
        kk: "Код сервоны қате пинге тіркейді",
        ru: "Код привязывает серво не к тому пину",
      },
      {
        en: "delay(1000) is too short for a servo",
        kk: "delay(1000) серво үшін тым қысқа",
        ru: "delay(1000) слишком короткая для серво",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "The servo's Signal contact and pin 9 are hollow dots. The code is correct and sends the signal out on pin 9, but no wire carries it to the servo. Connect Signal to pin 9.",
      kk: "Сервоның Signal контактісі мен 9-пин — іші бос нүктелер. Код дұрыс және сигналды 9-пинге шығарады, бірақ оны сервоға жеткізетін сым жоқ. Signal-ды 9-пинге қос.",
      ru: "Контакт Signal у серво и пин 9 — пустые точки. Код верный и выдаёт сигнал на пин 9, но ни один провод не несёт его к серво. Соедини Signal с пином 9.",
    },
  },
  {
    id: "led-on-tx",
    lesson: "special-pins",
    title: {
      en: "The LED that listens to the conversation",
      kk: "Әңгімені тыңдап тұратын жарықдиод",
      ru: "Светодиод, который подслушивает разговор",
    },
    primer: {
      en: "Pin 1 is TX, the line on which the board sends text to the computer. Once Serial.begin() has run, that line belongs to the serial port: digitalWrite() on pin 1 no longer has any effect, and the pin simply shows what is being sent.",
      kk: "1-пин — TX, плата компьютерге мәтін жіберетін желі. Serial.begin() орындалғаннан кейін бұл желі тізбекті портқа тиесілі болады: 1-пинге digitalWrite() жасаудың әсері болмайды, ал пин жай не жіберіліп жатқанын көрсетеді.",
      ru: "Пин 1 — это TX, линия, по которой плата отправляет текст на компьютер. После Serial.begin() эта линия принадлежит последовательному порту: digitalWrite() на пине 1 больше не действует, и пин просто показывает, что передаётся.",
    },
    goal: {
      en: "The LED blinks once a second, and the Serial Monitor prints \"on\" and \"off\" in step with it.",
      kk: "Жарықдиод секундына бір рет жыпылықтайды, ал Serial Monitor соған сәйкес «on» және «off» деп шығарады.",
      ru: "Светодиод мигает раз в секунду, а Serial Monitor в такт печатает «on» и «off».",
    },
    diagram: ledCircuit("1"),
    wiring: ledWiring("1"),
    code: `void setup() {
  Serial.begin(9600);
  pinMode(1, OUTPUT);
}

void loop() {
  digitalWrite(1, HIGH);
  Serial.println("on");
  delay(500);
  digitalWrite(1, LOW);
  Serial.println("off");
  delay(500);
}`,
    symptom: {
      en: "The text in the monitor is correct. The LED, though, is on almost all the time and only flickers for an instant when a line is printed.",
      kk: "Монитордағы мәтін дұрыс. Ал жарықдиод үнемі дерлік жанып тұрады және жол шығарылған сәтте ғана бір мезет жыпылық етеді.",
      ru: "Текст в мониторе правильный. А светодиод горит почти всё время и лишь на мгновение мерцает, когда печатается строка.",
    },
    options: [
      oRes220Large,
      {
        en: "Serial.println is too slow for blinking",
        kk: "Serial.println жыпылықтау үшін тым баяу",
        ru: "Serial.println слишком медленный для мигания",
      },
      {
        en: "Pin 1 is the serial TX line, so the port controls it, not digitalWrite",
        kk: "1-пин — тізбекті порттың TX желісі, сондықтан оны digitalWrite емес, порт басқарады",
        ru: "Пин 1 — линия TX последовательного порта, и управляет им порт, а не digitalWrite",
      },
      optLedBackwards,
    ],
    answer: 2,
    faultType: "limits",
    explanation: {
      en: "With the serial port running, pin 1 rests at HIGH and dips only while characters are sent, so the LED shows the data instead of blinking. Move the LED to a free pin such as 8 and change the code to match.",
      kk: "Тізбекті порт жұмыс істеп тұрғанда 1-пин HIGH күйінде тұрады және тек таңбалар жіберілген кезде ғана төмендейді, сондықтан жарықдиод жыпылықтаудың орнына деректерді көрсетеді. Жарықдиодты 8 сияқты бос пинге ауыстырып, кодты соған сәйкес өзгерт.",
      ru: "Когда последовательный порт работает, пин 1 находится в HIGH и опускается только во время передачи символов, поэтому светодиод показывает данные, а не мигает. Переставь светодиод на свободный пин, например 8, и поправь код.",
    },
  },
  {
    id: "analog-read-digital-pin",
    lesson: "special-pins",
    title: {
      en: "Pin 3 and A3 are not the same",
      kk: "3-пин мен A3 — бір нәрсе емес",
      ru: "Пин 3 и A3 — не одно и то же",
    },
    primer: {
      en: "Only the pins labelled A0 to A5 can measure a voltage. analogRead(3) does not mean digital pin 3: it means analog pin A3. A sensor wired to digital pin 3 cannot be measured at all.",
      kk: "Кернеуді тек A0–A5 деп белгіленген пиндер ғана өлшей алады. analogRead(3) 3-сандық пинді білдірмейді: ол A3 аналогтық пинін білдіреді. 3-сандық пинге қосылған датчикті мүлдем өлшеу мүмкін емес.",
      ru: "Измерять напряжение умеют только пины с надписями A0–A5. analogRead(3) означает не цифровой пин 3, а аналоговый пин A3. Датчик, подключённый к цифровому пину 3, измерить вообще нельзя.",
    },
    goal: potGoal,
    diagram: {
      pins: ["5V", "3", "GND"],
      parts: [{ id: "pot", kind: "chip", title: potTitle, x: 330, y: 76, left: ["1", "2", "3"] }],
      wires: [
        ["uno.5V", "5V"],
        ["pot.1", "5V"],
        ["uno.3", "pot.2"],
        ["pot.3", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: potLeg1, to: same("5V") },
      { from: potLeg2, to: pin("3") },
      { from: potLeg3, to: same("GND") },
    ],
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(3);
  Serial.println(value);
  delay(200);
}`,
    symptom: driftSymptom,
    options: [
      oPotWorn,
      oBaud,
      {
        en: "The outer legs are swapped",
        kk: "Шеткі аяқтардың орны ауысқан",
        ru: "Крайние ножки перепутаны",
      },
      {
        en: "The knob is on digital pin 3, but analogRead(3) reads the unconnected pin A3",
        kk: "Тұтқа 3-сандық пинде тұр, ал analogRead(3) ештеңе қосылмаған A3 пинін оқиды",
        ru: "Ручка стоит на цифровом пине 3, а analogRead(3) читает неподключённый пин A3",
      },
    ],
    answer: 3,
    faultType: "limits",
    explanation: {
      en: "The wiper goes to digital pin 3, which cannot measure voltage. analogRead(3) reads A3 instead, and A3 has nothing on it, so the values wander. Move the wire to A3 (or to A0 and write analogRead(A0)).",
      kk: "Ортаңғы аяқ кернеуді өлшей алмайтын 3-сандық пинге қосылған. analogRead(3) оның орнына A3-ті оқиды, ал A3-ке ештеңе қосылмаған, сондықтан мәндер өзгеріп тұрады. Сымды A3-ке ауыстыр (немесе A0-ге қосып, analogRead(A0) деп жаз).",
      ru: "Средняя ножка идёт на цифровой пин 3, который не умеет измерять напряжение. analogRead(3) вместо этого читает A3, а к A3 ничего не подключено, поэтому значения блуждают. Переставь провод на A3 (или на A0 и напиши analogRead(A0)).",
    },
  },
  {
    id: "battery-reversed",
    lesson: "power",
    title: {
      en: "Plus where minus should be",
      kk: "Минустың орнындағы плюс",
      ru: "Плюс на месте минуса",
    },
    primer: {
      en: "A battery has a direction. Its plus must go to the board's Vin and its minus to GND. The round power jack is protected against a reversed battery; the Vin pin is not, so a mistake there reaches the board's electronics directly.",
      kk: "Батареяның бағыты бар. Оның плюсі платаның Vin пиніне, минусы GND-ға қосылуы керек. Дөңгелек қорек ұясы теріс қосылған батареядан қорғалған; Vin пині қорғалмаған, сондықтан ондағы қате тікелей платаның электроникасына жетеді.",
      ru: "У батарейки есть направление. Её плюс должен идти на Vin платы, а минус — на GND. Круглый разъём питания защищён от перевёрнутой батарейки; пин Vin — нет, поэтому ошибка там доходит прямо до электроники платы.",
    },
    goal: batteryGoal,
    diagram: {
      pins: ["Vin", "GND"],
      parts: [
        {
          id: "bat",
          kind: "chip",
          title: { en: "Battery 9 V", kk: "Батарея 9 В", ru: "Батарея 9 В" },
          x: 330,
          y: 102,
          left: ["+", "−"],
        },
      ],
      wires: [
        ["uno.Vin", "bat.−"],
        ["uno.GND", "bat.+"],
      ],
    },
    wiring: [
      { from: batteryMinus, to: same("Vin") },
      { from: batteryPlus, to: same("GND") },
    ],
    code: "",
    symptom: {
      en: "The board does not switch on, and a part near the power pins becomes very hot.",
      kk: "Плата қосылмайды, ал қорек пиндерінің жанындағы бір бөлшек қатты қызады.",
      ru: "Плата не включается, а деталь рядом с пинами питания сильно нагревается.",
    },
    options: [
      { en: "9 V is too much for Vin", kk: "9 В Vin үшін тым көп", ru: "9 В — слишком много для Vin" },
      {
        en: "The battery is connected backwards: minus on Vin and plus on GND",
        kk: "Батарея теріс қосылған: минусы Vin-де, плюсі GND-да",
        ru: "Батарейка подключена наоборот: минус на Vin, плюс на GND",
      },
      {
        en: "The board cannot work without USB",
        kk: "Плата USB-сіз жұмыс істей алмайды",
        ru: "Плата не может работать без USB",
      },
      {
        en: "A 9 V battery is too weak for the board",
        kk: "9 В батарея плата үшін тым әлсіз",
        ru: "Батарейка 9 В слишком слабая для платы",
      },
    ],
    answer: 1,
    faultType: "power",
    explanation: {
      en: "Follow the two wires: Vin goes to the battery's minus and GND to its plus. The voltage is the right size but the wrong direction, and the Vin pin has no protection against that. Swap the two wires. 9 V on Vin is fine: the regulator is made for 7 to 12 V.",
      kk: "Екі сымды қадағала: Vin батареяның минусына, ал GND плюсіне барады. Кернеудің шамасы дұрыс, бірақ бағыты қате, ал Vin пинінде бұдан қорғаныс жоқ. Екі сымның орнын ауыстыр. Vin-дегі 9 В қалыпты: тұрақтандырғыш 7–12 В-қа есептелген.",
      ru: "Проследи два провода: Vin идёт к минусу батарейки, а GND — к плюсу. Величина напряжения правильная, а направление нет, и у пина Vin нет от этого защиты. Поменяй два провода местами. 9 В на Vin — это нормально: стабилизатор рассчитан на 7–12 В.",
    },
  },
  {
    id: "servo-on-3v3",
    lesson: "power",
    title: { en: "The weak outlet", kk: "Әлсіз розетка", ru: "Слабая розетка" },
    primer: {
      en: "The Uno has two power outputs. The 5V pin can give about half an amp. The 3.3V pin is meant for small sensors and gives only about 50 mA at a lower voltage. A motor of any kind needs far more than that.",
      kk: "Uno-да екі қорек шығысы бар. 5V пині шамамен жарты ампер бере алады. 3.3V пині кішкентай датчиктерге арналған және төменірек кернеуде бар болғаны шамамен 50 мА береді. Кез келген моторға бұдан әлдеқайда көп керек.",
      ru: "У Uno два выхода питания. Пин 5V может отдать примерно пол-ампера. Пин 3.3V предназначен для маленьких датчиков и даёт всего около 50 мА при меньшем напряжении. Любому мотору нужно намного больше.",
    },
    goal: sweepGoal,
    diagram: {
      pins: ["3.3V", "9", "GND"],
      parts: [
        {
          id: "servo",
          kind: "chip",
          title: smallServoTitle,
          x: 330,
          y: 76,
          left: ["V+", "Signal", "GND"],
        },
      ],
      wires: [
        ["uno.3.3V", "servo.V+"],
        ["uno.9", "servo.Signal"],
        ["servo.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: servoV, to: same("3.3V") },
      { from: servoSignal, to: pin("9") },
      { from: servoGnd, to: same("GND") },
    ],
    code: sweepCode,
    symptom: {
      en: "The servo twitches weakly and never completes a turn.",
      kk: "Серво әлсіз дірілдейді және бұрылысты аяғына дейін жеткізбейді.",
      ru: "Серво слабо подёргивается и не доводит поворот до конца.",
    },
    options: [
      {
        en: "Pin 9 is the wrong pin for a servo signal",
        kk: "9-пин серво сигналына жарамайды",
        ru: "Пин 9 не подходит для сигнала серво",
      },
      {
        en: "The servo's plus is on the 3.3V pin, which is too weak for a motor",
        kk: "Сервоның плюсі мотор үшін тым әлсіз 3.3V пиніне қосылған",
        ru: "Плюс серво подключён к пину 3.3V, который слишком слаб для мотора",
      },
      {
        en: "delay(1000) is too short for a servo",
        kk: "delay(1000) серво үшін тым қысқа",
        ru: "delay(1000) слишком короткая для серво",
      },
      {
        en: "A servo cannot turn to 180°",
        kk: "Серво 180°-қа бұрыла алмайды",
        ru: "Серво не может повернуться на 180°",
      },
    ],
    answer: 1,
    faultType: "power",
    explanation: {
      en: "The servo's V+ is on the 3.3V pin: too little voltage and about a tenth of the current a small servo needs. Move V+ to the 5V pin for a small servo, or to a separate 5–6 V supply for a large one.",
      kk: "Сервоның V+ контактісі 3.3V пиніне қосылған: кернеу тым аз, ал ток кішкентай сервоға қажеттінің шамамен оннан бір бөлігі ғана. Кішкентай серво үшін V+ контактісін 5V пиніне, үлкен серво үшін бөлек 5–6 В қорек көзіне ауыстыр.",
      ru: "Контакт V+ серво стоит на пине 3.3V: напряжения слишком мало, а тока — примерно десятая часть того, что нужно маленькому серво. Переставь V+ на пин 5V для маленького серво или на отдельный источник 5–6 В для большого.",
    },
  },
  {
    id: "two-rates",
    lesson: "timing",
    title: {
      en: "Two LEDs taking turns",
      kk: "Кезектесіп жанатын екі жарықдиод",
      ru: "Два светодиода по очереди",
    },
    primer: {
      en: "Commands with delay() run strictly one after another. While the board waits for one LED, it cannot switch the other. Two things with different rhythms cannot both be written with delay(); each needs its own clock check with millis().",
      kk: "delay() бар командалар қатаң түрде бірінен соң бірі орындалады. Плата бір жарықдиодты күтіп тұрғанда, екіншісін қосып-өшіре алмайды. Ырғағы әртүрлі екі нәрсені delay() арқылы қатар жазу мүмкін емес; әрқайсысына millis() арқылы өз уақыт тексерісі керек.",
      ru: "Команды с delay() выполняются строго одна за другой. Пока плата ждёт из-за одного светодиода, она не может переключить другой. Две вещи с разным ритмом нельзя обе написать через delay(); каждой нужна своя проверка времени через millis().",
    },
    goal: {
      en: "One LED blinks fast, five times a second, while the other blinks slowly, once every two seconds, both at the same time.",
      kk: "Бір жарықдиод жылдам, секундына бес рет, ал екіншісі баяу, екі секундта бір рет жыпылықтайды — екеуі бір уақытта.",
      ru: "Один светодиод мигает быстро, пять раз в секунду, а другой медленно, раз в две секунды, — оба одновременно.",
    },
    diagram: twoLedCircuit,
    wiring: twoLedWiring,
    code: `void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(100);
  digitalWrite(8, LOW);
  delay(100);

  digitalWrite(9, HIGH);
  delay(1000);
  digitalWrite(9, LOW);
  delay(1000);
}`,
    symptom: {
      en: "The fast LED flashes once, then stays dark for two seconds while the slow one takes its turn. They never blink at the same time.",
      kk: "Жылдам жарықдиод бір рет жарқ етеді, сосын баяуы өз кезегін атқарғанша екі секунд сөніп тұрады. Олар ешқашан бір уақытта жыпылықтамайды.",
      ru: "Быстрый светодиод вспыхивает один раз, затем две секунды не горит, пока свою очередь отрабатывает медленный. Одновременно они не мигают никогда.",
    },
    options: [
      {
        en: "The board can only drive one LED at a time",
        kk: "Плата бір уақытта тек бір жарықдиодты басқара алады",
        ru: "Плата может управлять только одним светодиодом одновременно",
      },
      {
        en: "Pins 8 and 9 share a timer",
        kk: "8 және 9-пиндер бір таймерді бөліседі",
        ru: "Пины 8 и 9 делят один таймер",
      },
      {
        en: "The delays run one after another, so each LED waits for the other",
        kk: "delay-лер бірінен соң бірі орындалады, сондықтан әр жарықдиод екіншісін күтеді",
        ru: "Задержки выполняются одна за другой, и каждый светодиод ждёт другого",
      },
      {
        en: "The fast delays are too short to see",
        kk: "Жылдам delay-лер көруге тым қысқа",
        ru: "Быстрые задержки слишком короткие, чтобы их увидеть",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "One pass of loop() takes 2.2 seconds, and the fast LED gets only the first 0.2 of them. For two independent rhythms, remove the delays and give each LED its own \"last changed\" time checked with millis().",
      kk: "loop()-тың бір айналымы 2,2 секундқа созылады, ал жылдам жарықдиодқа соның алғашқы 0,2 секунды ғана тиеді. Екі тәуелсіз ырғақ үшін delay-лерді алып тастап, әр жарықдиодқа millis() арқылы тексерілетін өз «соңғы ауысу» уақытын бер.",
      ru: "Один проход loop() длится 2,2 секунды, и быстрому светодиоду достаются только первые 0,2 из них. Для двух независимых ритмов убери задержки и заведи каждому светодиоду своё время «последнего переключения», которое проверяется через millis().",
    },
  },
  {
    id: "minute-overflow",
    lesson: "code-traps",
    title: {
      en: "The minute that lasts for weeks",
      kk: "Апталарға созылған минут",
      ru: "Минута длиной в недели",
    },
    primer: {
      en: "On the Uno, arithmetic with plain whole numbers is done in int, which holds at most 32 767. 60 * 1000 is 60 000: it does not fit, wraps around and becomes a negative number. Writing 60 * 1000L, or 60000L, tells the computer to calculate in long instead.",
      kk: "Uno-да жай бүтін сандармен есептеу int түрінде орындалады, ал ол ең көп дегенде 32 767 сақтай алады. 60 * 1000 — 60 000: ол сыймайды, «аударылып», теріс санға айналады. 60 * 1000L немесе 60000L деп жазу компьютерге есептеуді long түрінде жүргізуді айтады.",
      ru: "На Uno арифметика с обычными целыми числами выполняется в типе int, который вмещает максимум 32 767. 60 * 1000 — это 60 000: число не помещается, «переворачивается» и становится отрицательным. Запись 60 * 1000L или 60000L велит компьютеру считать в long.",
    },
    goal: {
      en: "The LED switches on for a minute, then off for a minute.",
      kk: "Жарықдиод бір минут жанады, сосын бір минут сөнеді.",
      ru: "Светодиод на минуту включается, затем на минуту выключается.",
    },
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(60 * 1000);
  digitalWrite(8, LOW);
  delay(60 * 1000);
}`,
    symptom: {
      en: "The LED switches on and then stays on for hours. It never goes off.",
      kk: "Жарықдиод қосылады да, сағаттар бойы жанып тұрады. Ол мүлдем сөнбейді.",
      ru: "Светодиод включается и горит часами. Он не выключается.",
    },
    options: [
      {
        en: "60 * 1000 does not fit in an int and turns into a huge wrong number",
        kk: "60 * 1000 int-ке сыймайды да, орасан үлкен қате санға айналады",
        ru: "60 * 1000 не помещается в int и превращается в огромное неверное число",
      },
      {
        en: "delay() cannot wait longer than 30 seconds",
        kk: "delay() 30 секундтан ұзақ күте алмайды",
        ru: "delay() не может ждать дольше 30 секунд",
      },
      {
        en: "The LED overheats and sticks on",
        kk: "Жарықдиод қызып, қосулы күйде қалып қояды",
        ru: "Светодиод перегревается и остаётся включённым",
      },
      oNotOutput,
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "60 * 1000 overflows int and becomes −5536. delay() reads that as an enormous positive number and waits about seven weeks. Write delay(60000L) or delay(60 * 1000L).",
      kk: "60 * 1000 int-ке сыймай, −5536-ға айналады. delay() оны орасан үлкен оң сан ретінде оқып, шамамен жеті апта күтеді. delay(60000L) немесе delay(60 * 1000L) деп жаз.",
      ru: "60 * 1000 переполняет int и превращается в −5536. delay() читает это как огромное положительное число и ждёт около семи недель. Напиши delay(60000L) или delay(60 * 1000L).",
    },
  },
  {
    id: "count-resets",
    lesson: "code-traps",
    title: { en: "The counter that forgets", kk: "Ұмытшақ санауыш", ru: "Счётчик, который всё забывает" },
    primer: {
      en: "A variable declared inside loop() is created anew on every pass and thrown away at the end of it. To keep a value from one pass to the next, declare the variable outside, above setup().",
      kk: "loop() ішінде жарияланған айнымалы әр айналымда жаңадан жасалып, айналымның соңында жойылады. Мәнді бір айналымнан келесісіне сақтау үшін айнымалыны сыртта, setup()-тың үстінде жарияла.",
      ru: "Переменная, объявленная внутри loop(), создаётся заново на каждом проходе и уничтожается в его конце. Чтобы значение сохранялось от прохода к проходу, объяви переменную снаружи, над setup().",
    },
    goal: {
      en: "Every press of the button adds 1 to the count in the Serial Monitor.",
      kk: "Батырманың әр басылуы Serial Monitor-дағы санға 1 қосады.",
      ru: "Каждое нажатие кнопки прибавляет 1 к счёту в Serial Monitor.",
    },
    diagram: buttonOnlyCircuit,
    wiring: buttonOnlyWiring,
    code: `void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  int count = 0;
  if (digitalRead(2) == LOW) {
    count++;
    Serial.println(count);
    delay(300);
  }
}`,
    symptom: {
      en: "Every press prints 1. The count never reaches 2.",
      kk: "Әр басу 1 деп шығарады. Санақ ешқашан 2-ге жетпейді.",
      ru: "Каждое нажатие печатает 1. Счёт никогда не доходит до 2.",
    },
    options: [
      { en: "The contacts bounce", kk: "Контактілер ыршиды", ru: "Контакты дребезжат" },
      {
        en: "count is declared inside loop(), so it starts from 0 on every pass",
        kk: "count loop() ішінде жарияланған, сондықтан әр айналымда 0-ден басталады",
        ru: "count объявлена внутри loop(), поэтому на каждом проходе начинается с 0",
      },
      {
        en: "count++ adds nothing to an int",
        kk: "count++ int-ке ештеңе қоспайды",
        ru: "count++ ничего не прибавляет к int",
      },
      {
        en: "delay(300) erases the variable",
        kk: "delay(300) айнымалыны өшіреді",
        ru: "delay(300) стирает переменную",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "int count = 0; is the first line of loop(), so the counter is reset to 0 on every pass and can only ever become 1. Move that line above setup().",
      kk: "int count = 0; — loop()-тың бірінші жолы, сондықтан санауыш әр айналымда 0-ге қайтарылады да, тек 1 ғана бола алады. Сол жолды setup()-тың үстіне көшір.",
      ru: "int count = 0; — первая строка loop(), поэтому счётчик на каждом проходе сбрасывается в 0 и может стать только 1. Перенеси эту строку выше setup().",
    },
  },
  {
    id: "pins-swapped-in-code",
    lesson: "debugging",
    title: {
      en: "Right numbers, wrong names",
      kk: "Сандар дұрыс, атаулар қате",
      ru: "Числа верные, имена перепутаны",
    },
    primer: {
      en: "Named constants such as buttonPin and ledPin make code easier to read, but they are only as true as the numbers given to them. Check each name against the diagram: which part is really on that pin?",
      kk: "buttonPin және ledPin сияқты атаулы тұрақтылар кодты оқуды жеңілдетеді, бірақ олар өздеріне берілген сандар қаншалықты дұрыс болса, соншалықты ғана дұрыс. Әр атауды сызбамен салыстыр: сол пинде шын мәнінде қай бөлшек тұр?",
      ru: "Именованные константы вроде buttonPin и ledPin делают код понятнее, но они верны ровно настолько, насколько верны присвоенные им числа. Сверь каждое имя со схемой: какая деталь на самом деле стоит на этом пине?",
    },
    goal: buttonGoal,
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `const int buttonPin = 8;
const int ledPin = 2;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (digitalRead(buttonPin) == LOW) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`,
    symptom: {
      en: "The LED glows very faintly all the time and does not react to the button.",
      kk: "Жарықдиод үнемі өте әлсіз жанып тұрады және батырмаға жауап бермейді.",
      ru: "Светодиод всё время еле заметно светится и не реагирует на кнопку.",
    },
    options: [
      optLedBackwards,
      {
        en: "The numbers for buttonPin and ledPin are swapped: the button is on 2 and the LED on 8",
        kk: "buttonPin мен ledPin сандарының орны ауысқан: батырма 2-пинде, жарықдиод 8-пинде тұр",
        ru: "Числа у buttonPin и ledPin перепутаны: кнопка стоит на 2, а светодиод на 8",
      },
      oButtonResistor,
      {
        en: "INPUT_PULLUP does not work with constants",
        kk: "INPUT_PULLUP тұрақтылармен жұмыс істемейді",
        ru: "INPUT_PULLUP не работает с константами",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "On the diagram the button is on pin 2 and the LED on pin 8, but the code says buttonPin = 8 and ledPin = 2. So the LED's pin is treated as an input, whose weak pull-up makes it glow faintly, and the button is never read. Swap the two numbers.",
      kk: "Сызбада батырма 2-пинде, жарықдиод 8-пинде тұр, ал кодта buttonPin = 8 және ledPin = 2 деп жазылған. Сондықтан жарықдиодтың пині кіріс ретінде қолданылады — оның әлсіз pull-up резисторы жарықдиодты әрең жандырады, ал батырма мүлдем оқылмайды. Екі санның орнын ауыстыр.",
      ru: "На схеме кнопка стоит на пине 2, а светодиод на пине 8, но в коде написано buttonPin = 8 и ledPin = 2. Поэтому пин светодиода используется как вход — его слабая подтяжка заставляет светодиод еле светиться, — а кнопка вообще не читается. Поменяй два числа местами.",
    },
  },
  {
    id: "copy-paste-else",
    lesson: "debugging",
    title: {
      en: "Copied, pasted, forgotten",
      kk: "Көшірілді, қойылды, ұмытылды",
      ru: "Скопировано, вставлено, забыто",
    },
    primer: {
      en: "When two branches of an if look almost alike, it is tempting to copy one and change a word. If the word is not changed, both branches do the same thing and the condition no longer matters. Read both branches and ask what is different between them.",
      kk: "if-тің екі тармағы бір-біріне өте ұқсас болса, біреуін көшіріп, бір сөзін өзгерту оңай көрінеді. Сол сөз өзгертілмесе, екі тармақ та бірдей нәрсе істейді де, шарттың мәні қалмайды. Екі тармақты да оқып, араларындағы айырмашылық неде екенін сұра.",
      ru: "Когда две ветки if почти одинаковы, хочется скопировать одну и поменять слово. Если слово не поменять, обе ветки делают одно и то же, и условие перестаёт что-либо значить. Прочитай обе ветки и спроси себя, чем они различаются.",
    },
    goal: buttonGoal,
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  if (digitalRead(2) == LOW) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, HIGH);
  }
}`,
    symptom: alwaysOn,
    options: [
      {
        en: "With INPUT_PULLUP a pressed button reads HIGH",
        kk: "INPUT_PULLUP кезінде басылған батырма HIGH болып оқылады",
        ru: "С INPUT_PULLUP нажатая кнопка читается как HIGH",
      },
      { en: "The button is shorted", kk: "Батырма тұйықталған", ru: "Кнопка закорочена" },
      optLedBackwards,
      {
        en: "Both branches write HIGH, so the LED can never be switched off",
        kk: "Екі тармақ та HIGH жазады, сондықтан жарықдиод ешқашан өшпейді",
        ru: "Обе ветки записывают HIGH, поэтому светодиод никогда не выключается",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The if branch and the else branch both say digitalWrite(8, HIGH). Whatever the button does, the LED is switched on. Change the second one to digitalWrite(8, LOW).",
      kk: "if тармағында да, else тармағында да digitalWrite(8, HIGH) деп жазылған. Батырма не істесе де, жарықдиод қосылады. Екіншісін digitalWrite(8, LOW) деп өзгерт.",
      ru: "И в ветке if, и в ветке else написано digitalWrite(8, HIGH). Что бы ни делала кнопка, светодиод включается. Замени второй вызов на digitalWrite(8, LOW).",
    },
  },
  {
    id: "rgb-pins-swapped",
    lesson: "rgb",
    title: {
      en: "Red that comes out blue",
      kk: "Көк болып шығатын қызыл",
      ru: "Красный, который выходит синим",
    },
    primer: {
      en: "An RGB LED is three LEDs in one case: red, green and blue. It has four legs: one for each colour and one common leg, the longest. In a common-cathode LED the common leg goes to GND, and a colour lights up when its pin is HIGH. Each colour leg has its own resistor.",
      kk: "RGB жарықдиоды — бір корпустағы үш жарықдиод: қызыл, жасыл және көк. Оның төрт аяғы бар: әр түске бір-бірден және ең ұзыны — ортақ аяқ. Ортақ катодты жарықдиодта ортақ аяқ GND-ға қосылады, ал түс өз пині HIGH болғанда жанады. Әр түстің аяғына жеке резистор қойылады.",
      ru: "RGB-светодиод — это три светодиода в одном корпусе: красный, зелёный и синий. У него четыре ножки: по одной на каждый цвет и одна общая, самая длинная. У светодиода с общим катодом общая ножка идёт к GND, а цвет загорается, когда на его пине HIGH. На ножке каждого цвета стоит свой резистор.",
    },
    goal: {
      en: "The LED shines red for a second, then green for a second, then goes dark for a second.",
      kk: "Жарықдиод бір секунд қызыл, бір секунд жасыл жанады, сосын бір секундқа сөнеді.",
      ru: "Светодиод секунду горит красным, секунду зелёным, затем на секунду гаснет.",
    },
    diagram: rgbCircuit(),
    wiring: rgbWiring("GND"),
    code: `const int redPin = 11;
const int greenPin = 10;
const int bluePin = 9;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  analogWrite(redPin, 255);
  delay(1000);
  analogWrite(redPin, 0);
  analogWrite(greenPin, 255);
  delay(1000);
  analogWrite(greenPin, 0);
  delay(1000);
}`,
    symptom: {
      en: "The LED shines blue for a second, then green, then goes dark. Red never appears.",
      kk: "Жарықдиод бір секунд көк, сосын жасыл жанады, сосын сөнеді. Қызыл түс мүлдем шықпайды.",
      ru: "Светодиод секунду горит синим, затем зелёным, затем гаснет. Красный не появляется ни разу.",
    },
    options: [
      oCommonAnode,
      {
        en: "The red part of the LED has burnt out",
        kk: "Жарықдиодтың қызыл бөлігі күйіп кеткен",
        ru: "Красная часть светодиода сгорела",
      },
      oRgbSwapped,
      {
        en: "Pin 11 cannot produce PWM",
        kk: "11-пин ШИМ (PWM) шығара алмайды",
        ru: "Пин 11 не умеет выдавать ШИМ",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "In the circuit the red leg is on pin 9 and the blue leg on pin 11, but the code says redPin = 11 and bluePin = 9. So every command meant for red goes to the blue leg. Swap the two numbers. A burnt-out red part would give darkness instead of blue, and a common-anode LED would turn every colour into its opposite.",
      kk: "Сызбада қызыл аяқ 9-пинде, көк аяқ 11-пинде тұр, ал кодта redPin = 11 және bluePin = 9 деп жазылған. Сондықтан қызылға арналған әр бұйрық көк аяққа барады. Екі санды ауыстыр. Қызыл бөлігі күйген болса, көк түстің орнына қараңғылық болар еді, ал ортақ анодты жарықдиод әр түсті қарама-қарсысына айналдырар еді.",
      ru: "На схеме красная ножка стоит на пине 9, а синяя — на пине 11, но в коде написано redPin = 11 и bluePin = 9. Поэтому каждая команда для красного уходит на синюю ножку. Поменяй два числа местами. Сгоревшая красная часть дала бы темноту вместо синего, а светодиод с общим анодом превратил бы каждый цвет в противоположный.",
    },
  },
  {
    id: "rgb-digital-write",
    lesson: "rgb",
    title: {
      en: "Orange that turns yellow",
      kk: "Сарыға айналатын қызғылт сары",
      ru: "Оранжевый, который становится жёлтым",
    },
    primer: {
      en: "Colours are mixed from red, green and blue: red and green give yellow, red and blue give purple, green and blue give turquoise, all three give white. Shades in between need a colour at part strength: orange is full red with a little green. analogWrite(pin, 0–255) sets that strength on PWM pins. digitalWrite knows only two states: off for 0 and fully on for any other number.",
      kk: "Түстер қызыл, жасыл және көктен араластырылады: қызыл мен жасыл сары береді, қызыл мен көк — күлгін, жасыл мен көк — көгілдір, үшеуі бірге — ақ. Аралық реңктер үшін түстің жартылай күші керек: қызғылт сары — толық қызыл және аздаған жасыл. Бұл күшті ШИМ пиндерінде analogWrite(pin, 0–255) береді. Ал digitalWrite тек екі күйді біледі: 0 болса — өшірулі, кез келген басқа сан болса — толық қосулы.",
      ru: "Цвета смешиваются из красного, зелёного и синего: красный с зелёным дают жёлтый, красный с синим — фиолетовый, зелёный с синим — бирюзовый, все три — белый. Для промежуточных оттенков нужен цвет вполсилы: оранжевый — это полный красный и немного зелёного. Такую силу на ШИМ-пинах задаёт analogWrite(pin, 0–255). А digitalWrite знает только два состояния: выключено при 0 и полностью включено при любом другом числе.",
    },
    goal: {
      en: "The LED shines orange: full red and a little green.",
      kk: "Жарықдиод қызғылт сары жанады: толық қызыл және аздаған жасыл.",
      ru: "Светодиод горит оранжевым: полный красный и немного зелёного.",
    },
    diagram: rgbCircuit(),
    wiring: rgbWiring("GND"),
    code: rgbSketch(`  digitalWrite(redPin, 255);
  digitalWrite(greenPin, 60);
  digitalWrite(bluePin, 0);`),
    symptom: {
      en: "The LED is yellow, not orange. Whatever number is written for green, 1 or 250, the colour stays the same yellow.",
      kk: "Жарықдиод қызғылт сары емес, сары жанады. Жасылға қандай сан жазылса да — 1 немесе 250 — түс сол сары күйінде қалады.",
      ru: "Светодиод жёлтый, а не оранжевый. Какое бы число ни стояло для зелёного, 1 или 250, цвет остаётся тем же жёлтым.",
    },
    options: [
      {
        en: "60 is too small for the green part to light at all",
        kk: "60 саны жасыл бөліктің жануы үшін тым аз",
        ru: "60 слишком мало, чтобы зелёная часть вообще загорелась",
      },
      {
        en: "digitalWrite can only switch a colour fully on or off; shades need analogWrite",
        kk: "digitalWrite түсті тек толық қосады немесе өшіреді; реңктер үшін analogWrite керек",
        ru: "digitalWrite умеет только полностью включать и выключать цвет; для оттенков нужен analogWrite",
      },
      oNoPwm10,
      oCommonAnode,
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The sketch uses digitalWrite with the numbers 255, 60 and 0. For digitalWrite any number except 0 means HIGH, so green is switched fully on, the same as red, and full red plus full green is yellow. Replace the three calls with analogWrite: pins 9, 10 and 11 all have PWM, and analogWrite(greenPin, 60) gives the weak green that orange needs.",
      kk: "Скетч 255, 60 және 0 сандарымен digitalWrite қолданады. digitalWrite үшін 0-ден басқа кез келген сан HIGH дегенді білдіреді, сондықтан жасыл да қызыл сияқты толық қосылады, ал толық қызыл мен толық жасыл сары береді. Үш шақыруды analogWrite-қа ауыстыр: 9, 10 және 11-пиндердің бәрінде ШИМ бар, ал analogWrite(greenPin, 60) қызғылт сарыға керек әлсіз жасылды береді.",
      ru: "Скетч вызывает digitalWrite с числами 255, 60 и 0. Для digitalWrite любое число, кроме 0, означает HIGH, поэтому зелёный включается полностью, как и красный, а полный красный с полным зелёным дают жёлтый. Замени три вызова на analogWrite: на пинах 9, 10 и 11 есть ШИМ, и analogWrite(greenPin, 60) даст слабый зелёный, который нужен для оранжевого.",
    },
  },
  {
    id: "rgb-colors-pile-up",
    lesson: "rgb",
    title: {
      en: "Red, yellow, white, stuck",
      kk: "Қызыл, сары, ақ — тұрып қалды",
      ru: "Красный, жёлтый, белый — и всё",
    },
    primer: {
      en: "A pin keeps the last value it was given until the sketch gives it a new one. Switching on a second colour does not switch off the first: the two mix. Red with green looks yellow, and red, green and blue together look white. To show one colour at a time, the others must be set to 0.",
      kk: "Пин скетч жаңа мән бергенше соңғы берілген мәнін сақтайды. Екінші түсті қосу біріншісін өшірмейді: екеуі араласады. Қызыл мен жасыл бірге сары болып көрінеді, ал қызыл, жасыл және көк бірге — ақ. Бір уақытта бір ғана түсті көрсету үшін қалғандарына 0 беру керек.",
      ru: "Пин хранит последнее заданное значение, пока скетч не задаст новое. Включение второго цвета не выключает первый: они смешиваются. Красный с зелёным выглядят жёлтым, а красный, зелёный и синий вместе — белым. Чтобы показывать по одному цвету, остальным нужно задать 0.",
    },
    goal: {
      en: "The LED shows red, then green, then blue, one second each, over and over.",
      kk: "Жарықдиод кезекпен қызыл, жасыл, көк түсті бір секундтан көрсетеді, осылай қайталай береді.",
      ru: "Светодиод по очереди показывает красный, зелёный и синий, по секунде каждый, и так по кругу.",
    },
    diagram: rgbCircuit(),
    wiring: rgbWiring("GND"),
    code: rgbSketch(`  analogWrite(redPin, 255);
  delay(1000);
  analogWrite(greenPin, 255);
  delay(1000);
  analogWrite(bluePin, 255);
  delay(1000);`),
    symptom: {
      en: "After switching on, the LED shows red, then yellow, then white, and stays white for good.",
      kk: "Қосылғаннан кейін жарықдиод қызыл, сосын сары, сосын ақ түсті көрсетеді де, біржола ақ күйінде қалады.",
      ru: "После включения светодиод показывает красный, затем жёлтый, затем белый и так и остаётся белым.",
    },
    options: [
      {
        en: "No colour is ever switched off, so the colours add up",
        kk: "Ешбір түс өшірілмейді, сондықтан түстер қосыла береді",
        ru: "Ни один цвет не выключается, поэтому цвета складываются",
      },
      {
        en: "The delays are too short for the LED to change colour",
        kk: "Кідірістер тым қысқа, жарықдиод түсін өзгертіп үлгермейді",
        ru: "Паузы слишком короткие, светодиод не успевает сменить цвет",
      },
      oCommonAnode,
      {
        en: "analogWrite cannot be used on three pins at the same time",
        kk: "analogWrite-ты бір мезгілде үш пинде қолдануға болмайды",
        ru: "analogWrite нельзя использовать на трёх пинах одновременно",
      },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "The sketch only ever writes 255. Red is switched on and stays on; a second later green joins it and the mix is yellow; then blue joins and the mix is white. On the next pass everything is already on, so nothing changes. Before each new colour set the previous one to 0, for example analogWrite(redPin, 0) before switching on green.",
      kk: "Скетч тек 255 мәнін ғана жазады. Қызыл қосылып, жанып тұра береді; бір секундтан кейін оған жасыл қосылып, қоспа сары болады; сосын көк қосылып, қоспа ақ болады. Келесі айналымда бәрі қосулы тұр, сондықтан ештеңе өзгермейді. Әр жаңа түстің алдында алдыңғысына 0 бер, мысалы, жасылды қоспас бұрын analogWrite(redPin, 0) деп жаз.",
      ru: "Скетч всегда записывает только 255. Красный включается и остаётся гореть; через секунду к нему добавляется зелёный, и смесь становится жёлтой; затем добавляется синий, и смесь становится белой. На следующем круге всё уже включено, поэтому ничего не меняется. Перед каждым новым цветом задавай предыдущему 0, например analogWrite(redPin, 0) перед включением зелёного.",
    },
  },
  {
    id: "rgb-common-anode",
    lesson: "rgb",
    title: {
      en: "Every colour inside out",
      kk: "Барлық түс керісінше",
      ru: "Все цвета наизнанку",
    },
    primer: {
      en: "RGB LEDs come in two types that look the same. In a common-cathode LED the common leg goes to GND and a colour lights when its pin is HIGH. In a common-anode LED the common leg goes to 5V and a colour lights when its pin is LOW: current flows from 5V through the LED into the pin. For that type every value is turned around: 0 means full brightness and 255 means off.",
      kk: "RGB жарықдиодтарының сырттай бірдей көрінетін екі түрі бар. Ортақ катодты жарықдиодта ортақ аяқ GND-ға қосылады, түс өз пині HIGH болғанда жанады. Ортақ анодты жарықдиодта ортақ аяқ 5V-қа қосылады, түс өз пині LOW болғанда жанады: ток 5V-тан жарықдиод арқылы пинге ағады. Бұл түр үшін әр мән керісінше болады: 0 — толық жарық, 255 — өшірулі.",
      ru: "RGB-светодиоды бывают двух типов, которые выглядят одинаково. У светодиода с общим катодом общая ножка идёт к GND, и цвет горит, когда на его пине HIGH. У светодиода с общим анодом общая ножка идёт к 5V, и цвет горит, когда на его пине LOW: ток течёт от 5V через светодиод в пин. Для этого типа все значения переворачиваются: 0 — полная яркость, 255 — выключено.",
    },
    goal: { en: "The LED shines red.", kk: "Жарықдиод қызыл жанады.", ru: "Светодиод горит красным." },
    diagram: rgbCircuit(true),
    wiring: rgbWiring("5V"),
    code: rgbSketch(`  analogWrite(redPin, 255);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);`),
    symptom: {
      en: "The LED shines turquoise: green and blue are on, and red is the only colour that is off.",
      kk: "Жарықдиод көгілдір жанады: жасыл мен көк қосулы, ал өшіп тұрған жалғыз түс — қызыл.",
      ru: "Светодиод горит бирюзовым: зелёный и синий включены, а красный — единственный цвет, который не горит.",
    },
    options: [
      oRgbSwapped,
      {
        en: "The common leg of every RGB LED must go to GND",
        kk: "Кез келген RGB жарықдиодының ортақ аяғы GND-ға қосылуы керек",
        ru: "Общая ножка любого RGB-светодиода должна идти к GND",
      },
      {
        en: "The resistors must stand on the common leg, not on the colour legs",
        kk: "Резисторлар түс аяқтарында емес, ортақ аяқта тұруы керек",
        ru: "Резисторы должны стоять на общей ножке, а не на ножках цветов",
      },
      {
        en: "This is a common-anode LED: a colour lights on LOW, so the values in the code must be turned around",
        kk: "Бұл — ортақ анодты жарықдиод: түс LOW кезінде жанады, сондықтан кодтағы мәндерді керісінше жазу керек",
        ru: "Это светодиод с общим анодом: цвет горит при LOW, поэтому значения в коде нужно перевернуть",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The diagram shows a common-anode LED with its common leg on 5V, and that wiring is right for it. But the code is written for the other type. analogWrite(redPin, 255) holds the red pin at 5 V, the same as the common leg, so no current flows through red; the 0 on green and blue pulls their pins to GND and lights them. Write 255 minus the value: analogWrite(redPin, 0) for full red and 255 for the two colours that must stay off. Swapped pins would give blue, not turquoise.",
      kk: "Сызбада ортақ аяғы 5V-қа қосылған ортақ анодты жарықдиод көрсетілген, ол үшін бұл қосылу дұрыс. Бірақ код екінші түрге арналып жазылған. analogWrite(redPin, 255) қызыл пинді ортақ аяқпен бірдей 5 В-та ұстайды, сондықтан қызыл арқылы ток өтпейді; ал жасыл мен көктегі 0 олардың пиндерін GND-ға тартып, оларды жандырады. Мәнді 255-тен азайтып жаз: толық қызыл үшін analogWrite(redPin, 0), ал өшіп тұруы керек екі түске 255. Пиндер ауысып кеткен болса, көгілдір емес, көк жанар еді.",
      ru: "На схеме показан светодиод с общим анодом, его общая ножка стоит на 5V, и для него это правильно. Но код написан для другого типа. analogWrite(redPin, 255) держит красный пин на 5 В, как и общую ножку, поэтому через красный ток не течёт; а 0 на зелёном и синем притягивает их пины к GND и зажигает их. Записывай 255 минус значение: analogWrite(redPin, 0) для полного красного и 255 для двух цветов, которые должны быть выключены. При перепутанных пинах горел бы синий, а не бирюзовый.",
    },
  },
  {
    id: "rgb-one-resistor",
    lesson: "rgb",
    title: {
      en: "Yellow that stays red",
      kk: "Қызыл күйінде қалатын сары",
      ru: "Жёлтый, который остаётся красным",
    },
    primer: {
      en: "Different colours of LED need different voltages to light: red about 2 V, green and blue about 3 V. If all three share one resistor on the common leg, they also share one voltage. As soon as red is on, it holds that voltage near 2 V, which is not enough for green or blue. That is why each colour leg gets its own resistor.",
      kk: "Әртүрлі түсті жарықдиодтардың жануына әртүрлі кернеу керек: қызылға шамамен 2 В, жасыл мен көкке шамамен 3 В. Үшеуі ортақ аяқтағы бір резисторды бөліссе, кернеуі де ортақ болады. Қызыл қосылған бойда ол бұл кернеуді 2 В шамасында ұстап қалады, ал бұл жасыл мен көкке жетпейді. Сондықтан әр түстің аяғына жеке резистор қойылады.",
      ru: "Светодиодам разного цвета нужно разное напряжение, чтобы загореться: красному около 2 В, зелёному и синему около 3 В. Если у всех трёх один общий резистор на общей ножке, то и напряжение у них общее. Как только включается красный, он удерживает это напряжение около 2 В, а зелёному и синему этого мало. Поэтому на ножке каждого цвета ставят свой резистор.",
    },
    goal: {
      en: "The LED shines yellow: red and green together.",
      kk: "Жарықдиод сары жанады: қызыл мен жасыл бірге.",
      ru: "Светодиод горит жёлтым: красный и зелёный вместе.",
    },
    diagram: {
      pins: ["9", "10", "11", "GND"],
      parts: [
        {
          id: "rgb",
          kind: "chip",
          title: { en: "RGB LED, common −", kk: "RGB, ортақ −", ru: "RGB, общий −" },
          x: 250,
          y: 76,
          left: ["R", "G", "B"],
          right: ["COM"],
        },
        { id: "r1", kind: "resistor", label: "220 Ω", x: 400, y: 116 },
      ],
      wires: [
        ["uno.9", "rgb.R"],
        ["uno.10", "rgb.G"],
        ["uno.11", "rgb.B"],
        ["rgb.COM", "r1.a"],
        ["r1.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: pin("9"), to: redLeg },
      { from: pin("10"), to: greenLeg },
      { from: pin("11"), to: blueLeg },
      { from: commonLeg, to: resistor },
      { from: resistorOut, to: same("GND") },
    ],
    code: rgbSketch(`  analogWrite(redPin, 255);
  analogWrite(greenPin, 255);
  analogWrite(bluePin, 0);`),
    symptom: {
      en: "The LED is plain red. Each colour works when it is switched on alone, but next to red the green hardly glows.",
      kk: "Жарықдиод жай қызыл жанады. Әр түс жеке қосылғанда жұмыс істейді, бірақ қызылмен бірге жасыл әрең жылтырайды.",
      ru: "Светодиод просто красный. Каждый цвет работает, если включить его отдельно, но рядом с красным зелёный едва светится.",
    },
    options: [
      oNoPwm10,
      {
        en: "One resistor is shared by all colours, and red takes almost all the current",
        kk: "Барлық түске бір резистор ортақ, ал токтың барлығын дерлік қызыл алады",
        ru: "На все цвета один резистор, и почти весь ток забирает красный",
      },
      oCommonAnode,
      {
        en: "An RGB LED cannot show yellow",
        kk: "RGB жарықдиоды сары түсті көрсете алмайды",
        ru: "RGB-светодиод не может показать жёлтый",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "The pins go straight to the colour legs, and the only resistor stands between the common leg and GND. With red and green both on, red lights at about 2 V and keeps the voltage across both at that level; green needs about 3 V and gets almost no current. Give each colour leg its own 220 Ω resistor and connect the common leg straight to GND.",
      kk: "Пиндер түс аяқтарына тікелей қосылған, ал жалғыз резистор ортақ аяқ пен GND арасында тұр. Қызыл мен жасыл қатар қосылғанда қызыл шамамен 2 В-та жанып, екеуіндегі кернеуді сол деңгейде ұстайды; жасылға шамамен 3 В керек, сондықтан оған ток өтпейді десе де болады. Әр түс аяғына жеке 220 Ом резистор қойып, ортақ аяқты тікелей GND-ға қос.",
      ru: "Пины подключены прямо к ножкам цветов, а единственный резистор стоит между общей ножкой и GND. Когда включены и красный, и зелёный, красный загорается примерно при 2 В и удерживает напряжение на обоих на этом уровне; зелёному нужно около 3 В, и ток через него почти не идёт. Поставь на ножку каждого цвета свой резистор 220 Ом, а общую ножку подключи прямо к GND.",
    },
  },
  {
    id: "buzzer-click",
    lesson: "sound",
    title: {
      en: "A click instead of a beep",
      kk: "Дыбыстың орнына сырт еткен үн",
      ru: "Щелчок вместо писка",
    },
    primer: {
      en: "Sound is vibration. A passive piezo buzzer is a thin plate that bends a little each time the voltage on it changes. One change gives one click; hundreds of changes a second give a tone. tone(pin, frequency) switches the pin on and off that many times a second. An active buzzer has its own generator inside and beeps from a steady HIGH, but this kit has a passive one.",
      kk: "Дыбыс — тербеліс. Пассивті пьезодинамик — кернеуі өзгерген сайын сәл иілетін жұқа пластина. Бір өзгеріс бір сырт еткен үн береді; секундына жүздеген өзгеріс тон береді. tone(pin, жиілік) пинді секундына сонша рет қосып-өшіреді. Активті пьезодинамиктің ішінде өз генераторы бар, ол тұрақты HIGH-дан-ақ дыбыс шығарады, бірақ бұл жинақта пассивті түрі тұр.",
      ru: "Звук — это колебания. Пассивный пьезодинамик — тонкая пластинка, которая слегка изгибается каждый раз, когда на ней меняется напряжение. Одно изменение даёт один щелчок; сотни изменений в секунду дают тон. tone(pin, частота) включает и выключает пин столько раз в секунду. У активного пьезодинамика внутри свой генератор, и он пищит от постоянного HIGH, но в этом наборе динамик пассивный.",
    },
    goal: {
      en: "The buzzer beeps for a second, is silent for a second, and repeats.",
      kk: "Пьезодинамик бір секунд дыбыс шығарады, бір секунд үнсіз тұрады, осылай қайталайды.",
      ru: "Пьезодинамик секунду пищит, секунду молчит и так повторяет.",
    },
    diagram: buzzerCircuit,
    wiring: buzzerWiring,
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
}`,
    symptom: {
      en: "There is no beep. The buzzer only gives a quiet click once a second.",
      kk: "Дыбыс жоқ. Пьезодинамик секундына бір рет ақырын сырт етеді де қояды.",
      ru: "Писка нет. Пьезодинамик только тихо щёлкает раз в секунду.",
    },
    options: [
      {
        en: "The buzzer needs a 220 Ω resistor, like an LED",
        kk: "Пьезодинамикке жарықдиод сияқты 220 Ом резистор керек",
        ru: "Пьезодинамику нужен резистор 220 Ом, как светодиоду",
      },
      {
        en: "Only PWM pins can make sound, and pin 8 is not one",
        kk: "Дыбысты тек ШИМ пиндері шығара алады, ал 8-пин ондай емес",
        ru: "Звук умеют выдавать только ШИМ-пины, а пин 8 к ним не относится",
      },
      {
        en: "A passive buzzer needs a rapidly changing signal: tone(), not a steady HIGH",
        kk: "Пассивті пьезодинамикке тұрақты HIGH емес, жылдам өзгеретін сигнал керек: tone()",
        ru: "Пассивному пьезодинамику нужен быстро меняющийся сигнал: tone(), а не постоянный HIGH",
      },
      {
        en: "delay(1000) is too long for a buzzer",
        kk: "delay(1000) пьезодинамик үшін тым ұзақ",
        ru: "delay(1000) слишком длинная для пьезодинамика",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "digitalWrite(8, HIGH) changes the voltage once and then holds it. The plate bends once, which is the click, and stays bent in silence. Use tone(8, 1000) to start a 1000 Hz sound and noTone(8) to stop it, with the same delays in between. tone() works on any digital pin, and a piezo buzzer works without a resistor.",
      kk: "digitalWrite(8, HIGH) кернеуді бір рет өзгертіп, сол күйінде ұстап тұрады. Пластина бір рет иіледі — бұл сол сырт еткен үн — сосын иілген күйі үнсіз тұрады. 1000 Гц дыбысты бастау үшін tone(8, 1000), тоқтату үшін noTone(8) қолдан, араларындағы кідірістер сол күйі қалсын. tone() кез келген цифрлық пинде жұмыс істейді, ал пьезодинамик резисторсыз да жұмыс істейді.",
      ru: "digitalWrite(8, HIGH) меняет напряжение один раз и дальше держит его. Пластинка изгибается один раз — это и есть щелчок — и молча остаётся изогнутой. Запускай звук 1000 Гц через tone(8, 1000), останавливай через noTone(8), а паузы между ними оставь прежними. tone() работает на любом цифровом пине, а пьезодинамик работает и без резистора.",
    },
  },
  {
    id: "tone-no-delay",
    lesson: "sound",
    title: {
      en: "Three notes, one sound",
      kk: "Үш нота, бір дыбыс",
      ru: "Три ноты, один звук",
    },
    primer: {
      en: "tone(pin, frequency, duration) starts a note that stops by itself after the given number of milliseconds. But tone() does not wait: the sketch goes straight on to the next line while the note is still sounding. A new tone() on the same pin replaces the note at once. To play a melody, put a delay after each note that is at least as long as the note.",
      kk: "tone(pin, жиілік, ұзақтық) берілген миллисекундтан кейін өздігінен тоқтайтын нотаны бастайды. Бірақ tone() күтпейді: нота әлі естіліп тұрғанда скетч бірден келесі жолға өтеді. Сол пиндегі жаңа tone() нотаны дереу алмастырады. Әуен ойнау үшін әр нотадан кейін ұзақтығы нотадан кем емес delay қой.",
      ru: "tone(pin, частота, длительность) запускает ноту, которая сама остановится через заданное число миллисекунд. Но tone() не ждёт: скетч сразу идёт на следующую строку, пока нота ещё звучит. Новый tone() на том же пине тут же заменяет ноту. Чтобы сыграть мелодию, ставь после каждой ноты delay не короче самой ноты.",
    },
    goal: {
      en: "The buzzer plays three notes one after another, do, re, mi, then is silent for two seconds.",
      kk: "Пьезодинамик үш нотаны бірінен соң бірін ойнайды — до, ре, ми — сосын екі секунд үнсіз тұрады.",
      ru: "Пьезодинамик играет три ноты подряд — до, ре, ми — и затем две секунды молчит.",
    },
    diagram: buzzerCircuit,
    wiring: buzzerWiring,
    code: `void setup() {
}

void loop() {
  tone(8, 262, 300);
  tone(8, 294, 300);
  tone(8, 330, 300);
  delay(2000);
}`,
    symptom: {
      en: "Only one short note is heard every two seconds: the last and highest of the three.",
      kk: "Әр екі секунд сайын бір ғана қысқа нота естіледі: үшеуінің соңғысы әрі ең жоғарысы.",
      ru: "Каждые две секунды слышна только одна короткая нота: последняя и самая высокая из трёх.",
    },
    options: [
      {
        en: "The three frequencies are too close for the ear to tell apart",
        kk: "Үш жиілік бір-біріне тым жақын, құлақ оларды ажырата алмайды",
        ru: "Три частоты слишком близки, ухо их не различает",
      },
      {
        en: "tone() needs pinMode(8, OUTPUT) first",
        kk: "tone() алдында pinMode(8, OUTPUT) болуы керек",
        ru: "Перед tone() нужен pinMode(8, OUTPUT)",
      },
      {
        en: "A buzzer can play only one note per pass of loop()",
        kk: "Пьезодинамик loop()-тың бір айналымында тек бір нота ойнай алады",
        ru: "Пьезодинамик может сыграть только одну ноту за один проход loop()",
      },
      {
        en: "tone() does not wait for the note to end, so each note is replaced at once by the next",
        kk: "tone() нотаның аяқталуын күтпейді, сондықтан әр нотаны келесісі дереу алмастырады",
        ru: "tone() не ждёт конца ноты, поэтому каждую ноту сразу заменяет следующая",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The three tone() calls run within a fraction of a millisecond. The first two notes are replaced before anyone can hear them, and only the third, 330 Hz, plays its 300 ms. Add delay(350) after each tone(): 300 ms for the note and 50 ms of silence between notes. tone() sets up the pin by itself, so pinMode is not needed.",
      kk: "Үш tone() шақыруы миллисекундтың бір бөлігінде орындалады. Алғашқы екі нота ешкім естіп үлгермей алмастырылады, тек үшіншісі — 330 Гц — өзінің 300 мс уақытын ойнайды. Әр tone()-нан кейін delay(350) қос: 300 мс — нотаға, 50 мс — ноталар арасындағы үнсіздікке. tone() пинді өзі баптайды, сондықтан pinMode қажет емес.",
      ru: "Три вызова tone() выполняются за долю миллисекунды. Первые две ноты заменяются раньше, чем их кто-то услышит, и только третья, 330 Гц, звучит свои 300 мс. Добавь delay(350) после каждого tone(): 300 мс на ноту и 50 мс тишины между нотами. tone() сам настраивает пин, так что pinMode не нужен.",
    },
  },
  {
    id: "tone-never-stops",
    lesson: "sound",
    title: {
      en: "The buzzer that won't be quiet",
      kk: "Тоқтамайтын пьезодинамик",
      ru: "Пьезодинамик, который не замолкает",
    },
    primer: {
      en: "tone(pin, frequency) without a duration plays until something stops it. The sound is made in the background by a timer inside the chip, so it goes on whatever the sketch does next. Only noTone(pin), or a new tone() on that pin, ends it.",
      kk: "Ұзақтығы көрсетілмеген tone(pin, жиілік) бір нәрсе тоқтатқанша ойнай береді. Дыбысты микросхеманың ішіндегі таймер фондық режимде шығарады, сондықтан скетч әрі қарай не істесе де, ол жалғаса береді. Оны тек noTone(pin) немесе сол пиндегі жаңа tone() ғана тоқтатады.",
      ru: "tone(pin, частота) без длительности звучит, пока его что-нибудь не остановит. Звук в фоне создаёт таймер внутри микросхемы, поэтому он продолжается, что бы скетч ни делал дальше. Прекращает его только noTone(pin) или новый tone() на том же пине.",
    },
    goal: {
      en: "The buzzer sounds while the button is held and is silent when it is released.",
      kk: "Батырма басулы тұрғанда пьезодинамик дыбыс шығарады, жібергенде үнсіз тұрады.",
      ru: "Пьезодинамик звучит, пока кнопка нажата, и молчит, когда её отпускают.",
    },
    diagram: {
      pins: ["2", "8", "GND"],
      parts: [
        { id: "sw", kind: "button", x: 400, y: 90 },
        { id: "bz", kind: "buzzer", x: 250, y: 142 },
      ],
      wires: [
        ["uno.2", "sw.a"],
        ["sw.b", "GND"],
        ["uno.8", "bz.a"],
        ["bz.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: pin("2"), to: buttonLegA },
      { from: buttonLegB, to: same("GND") },
      ...buzzerWiring,
    ],
    code: `void setup() {
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(2) == LOW) {
    tone(8, 1000);
  }
}`,
    symptom: {
      en: "At first it is silent, as it should be. After the first press the buzzer starts and never stops, even with the button released.",
      kk: "Басында ол тиісінше үнсіз тұрады. Бірінші басудан кейін пьезодинамик дыбыс шығара бастайды да, батырма жіберілсе де тоқтамайды.",
      ru: "Сначала он молчит, как и должен. После первого нажатия пьезодинамик начинает звучать и больше не замолкает, даже когда кнопка отпущена.",
    },
    options: [
      {
        en: "Nothing in the code ever stops the sound: noTone(8) is missing",
        kk: "Кодта дыбысты тоқтататын ештеңе жоқ: noTone(8) жетіспейді",
        ru: "В коде ничто не останавливает звук: не хватает noTone(8)",
      },
      oCheckHigh,
      oButtonResistor,
      {
        en: "The button is stuck in the pressed position",
        kk: "Батырма басылған күйінде қатып қалған",
        ru: "Кнопка залипла в нажатом положении",
      },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "The if has no else. When the button is pressed, tone(8, 1000) starts a sound with no duration; when it is released, the sketch simply does nothing, and the timer keeps the sound going. Add else { noTone(8); }. The button itself is fine: a stuck one would make the buzzer sound from the moment of power-on, and INPUT_PULLUP already gives it the resistor it needs.",
      kk: "if-тің else тармағы жоқ. Батырма басылғанда tone(8, 1000) ұзақтығы жоқ дыбысты бастайды; жіберілгенде скетч жай ештеңе істемейді, ал таймер дыбысты жалғастыра береді. else { noTone(8); } деп қос. Батырманың өзі дұрыс: қатып қалған батырма пьезодинамикті қорек берілген сәттен бастап шулатар еді, ал INPUT_PULLUP оған керек резисторды беріп тұр.",
      ru: "У if нет ветки else. Когда кнопка нажата, tone(8, 1000) запускает звук без длительности; когда её отпускают, скетч просто ничего не делает, а таймер продолжает звук. Добавь else { noTone(8); }. Сама кнопка исправна: залипшая заставила бы пьезодинамик звучать с момента включения, а нужный ей резистор уже даёт INPUT_PULLUP.",
    },
  },
  {
    id: "tone-too-high",
    lesson: "sound",
    title: {
      en: "Turned up to silence",
      kk: "Күшейтпек болды — үні өшті",
      ru: "Сделали громче — стало тихо",
    },
    primer: {
      en: "The second number in tone() is the frequency: how many times a second the pin switches, in hertz (Hz). Frequency sets the pitch, how high the note sounds, not how loud it is. People hear from about 20 Hz to about 20 000 Hz; a small piezo buzzer is loudest at around 2000–4000 Hz.",
      kk: "tone()-дағы екінші сан — жиілік: пиннің секундына неше рет ауысатыны, герцпен (Гц) өлшенеді. Жиілік дыбыстың қаттылығын емес, биіктігін — нотаның қаншалықты жіңішке естілетінін — анықтайды. Адам шамамен 20 Гц-тен 20 000 Гц-ке дейінгі дыбысты естиді; кішкентай пьезодинамик 2000–4000 Гц шамасында ең қатты естіледі.",
      ru: "Второе число в tone() — это частота: сколько раз в секунду переключается пин, в герцах (Гц). Частота задаёт высоту звука — насколько тонко звучит нота, — а не громкость. Человек слышит примерно от 20 Гц до 20 000 Гц; маленький пьезодинамик громче всего звучит около 2000–4000 Гц.",
    },
    goal: {
      en: "A loud, clear beep of half a second, once a second.",
      kk: "Секундына бір рет жарты секундтық қатты, анық дыбыс.",
      ru: "Громкий, чёткий писк длиной полсекунды, раз в секунду.",
    },
    diagram: buzzerCircuit,
    wiring: buzzerWiring,
    code: `void setup() {
}

void loop() {
  tone(8, 40000, 500);
  delay(1000);
}`,
    symptom: {
      en: "With 1000 the beep could be heard but seemed too quiet, so the number was raised to 40000. Now nothing is heard at all.",
      kk: "1000 санымен дыбыс естілетін, бірақ тым ақырын көрінді, сондықтан сан 40000-ға дейін көтерілді. Енді мүлдем ештеңе естілмейді.",
      ru: "С числом 1000 писк был слышен, но казался слишком тихим, поэтому число подняли до 40000. Теперь не слышно вообще ничего.",
    },
    options: [
      {
        en: "40000 does not fit into the number type tone() uses, so the pin stays off",
        kk: "40000 саны tone() қолданатын сан түріне сыймайды, сондықтан пин өшірулі қалады",
        ru: "40000 не помещается в тип числа, который использует tone(), поэтому пин остаётся выключенным",
      },
      {
        en: "The number is the pitch, not the loudness, and 40 000 Hz is above what people can hear",
        kk: "Бұл сан — қаттылық емес, дыбыс биіктігі, ал 40 000 Гц адам ести алатын шектен жоғары",
        ru: "Это число — высота звука, а не громкость, и 40 000 Гц выше того, что слышит человек",
      },
      {
        en: "The buzzer has burnt out from too much power",
        kk: "Пьезодинамик артық қуаттан күйіп кеткен",
        ru: "Пьезодинамик сгорел от слишком большой мощности",
      },
      {
        en: "500 ms is too short for a sound to be heard",
        kk: "500 мс дыбыс естілуі үшін тым қысқа",
        ru: "500 мс слишком мало, чтобы звук был слышен",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "tone(8, 40000, 500) makes the pin switch 40 000 times a second. That is ultrasound: the buzzer still vibrates a little, but no human ear hears it. The number never controlled loudness. Go back to an audible frequency; around 2000–4000 Hz a piezo buzzer sounds loudest. The number itself fits: tone() accepts frequencies up to 65 535.",
      kk: "tone(8, 40000, 500) пинді секундына 40 000 рет ауыстырады. Бұл — ультрадыбыс: пьезодинамик әлі де сәл тербеледі, бірақ оны адам құлағы естімейді. Бұл сан ешқашан қаттылықты басқарған емес. Естілетін жиілікке қайт; пьезодинамик 2000–4000 Гц шамасында ең қатты естіледі. Санның өзі сыяды: tone() 65 535-ке дейінгі жиілікті қабылдайды.",
      ru: "tone(8, 40000, 500) заставляет пин переключаться 40 000 раз в секунду. Это ультразвук: пьезодинамик по-прежнему чуть вибрирует, но человеческое ухо этого не слышит. Громкостью это число никогда не управляло. Вернись к слышимой частоте; около 2000–4000 Гц пьезодинамик звучит громче всего. Само число помещается: tone() принимает частоты до 65 535.",
    },
  },
  {
    id: "two-tones",
    lesson: "sound",
    title: {
      en: "A duet for one voice",
      kk: "Жалғыз дауысты дуэт",
      ru: "Дуэт в один голос",
    },
    primer: {
      en: "The Uno makes tone() with one timer inside its chip, and one timer can keep only one frequency. So only one tone can sound at a time. While a tone is playing on one pin, a call to tone() for a different pin is simply ignored: no error, no sound.",
      kk: "Uno tone() дыбысын микросхемасындағы бір таймермен жасайды, ал бір таймер тек бір жиілікті ұстай алады. Сондықтан бір уақытта тек бір тон естіле алады. Бір пинде тон ойнап тұрғанда, басқа пинге арналған tone() шақыруы жай еленбейді: қате де жоқ, дыбыс та жоқ.",
      ru: "Uno создаёт звук tone() одним таймером внутри микросхемы, а один таймер может держать только одну частоту. Поэтому одновременно может звучать только один тон. Пока тон играет на одном пине, вызов tone() для другого пина просто игнорируется: ни ошибки, ни звука.",
    },
    goal: {
      en: "Two buzzers sound together: a low note on pin 8 and a higher note on pin 9.",
      kk: "Екі пьезодинамик бірге дыбыс шығарады: 8-пинде төмен нота, 9-пинде жоғарырақ нота.",
      ru: "Два пьезодинамика звучат вместе: низкая нота на пине 8 и более высокая на пине 9.",
    },
    diagram: {
      pins: ["8", "9", "GND"],
      parts: [
        { id: "bz1", kind: "buzzer", x: 370, y: 90 },
        { id: "bz2", kind: "buzzer", x: 250, y: 142 },
      ],
      wires: [
        ["uno.8", "bz1.a"],
        ["bz1.b", "GND"],
        ["uno.9", "bz2.a"],
        ["bz2.b", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      {
        from: pin("8"),
        to: {
          en: "Buzzer 1, then GND",
          kk: "1-пьезодинамик, сосын GND",
          ru: "Пьезодинамик 1, затем GND",
        },
      },
      {
        from: pin("9"),
        to: {
          en: "Buzzer 2, then GND",
          kk: "2-пьезодинамик, сосын GND",
          ru: "Пьезодинамик 2, затем GND",
        },
      },
    ],
    code: `void setup() {
  tone(8, 262);
  tone(9, 392);
}

void loop() {
}`,
    symptom: {
      en: "Only the buzzer on pin 8 sounds. If the two buzzers are swapped, it is again the one on pin 9 that stays silent.",
      kk: "Тек 8-пиндегі пьезодинамик дыбыс шығарады. Екі пьезодинамиктің орнын ауыстырса, тағы да 9-пиндегісі үнсіз қалады.",
      ru: "Звучит только пьезодинамик на пине 8. Если поменять два пьезодинамика местами, молчит опять тот, что на пине 9.",
    },
    options: [
      {
        en: "The second buzzer is faulty",
        kk: "Екінші пьезодинамик ақаулы",
        ru: "Второй пьезодинамик неисправен",
      },
      {
        en: "Two buzzers take more current than the board can give",
        kk: "Екі пьезодинамик плата бере алатыннан көп ток тартады",
        ru: "Два пьезодинамика берут больше тока, чем может дать плата",
      },
      {
        en: "Pin 9 is a PWM pin, and tone() does not work on PWM pins",
        kk: "9-пин — ШИМ пині, ал tone() ШИМ пиндерінде жұмыс істемейді",
        ru: "Пин 9 — это ШИМ-пин, а tone() на ШИМ-пинах не работает",
      },
      {
        en: "The Uno can play only one tone at a time, so the second tone() is ignored",
        kk: "Uno бір уақытта тек бір тон ойнай алады, сондықтан екінші tone() еленбейді",
        ru: "Uno может играть только один тон одновременно, поэтому второй tone() игнорируется",
      },
    ],
    answer: 3,
    faultType: "limits",
    explanation: {
      en: "tone(8, 262) starts first and takes the timer. tone(9, 392) is called while that tone is still playing, so it has no effect. Swapping the buzzers proves that both of them work. For two notes at once you need a second board or a sound module; with one Uno, play the notes in turn: noTone(8), then tone(9, 392).",
      kk: "tone(8, 262) бірінші басталып, таймерді иеленеді. tone(9, 392) сол тон әлі ойнап тұрғанда шақырылады, сондықтан оның әсері болмайды. Пьезодинамиктердің орнын ауыстыру екеуінің де жарамды екенін дәлелдейді. Бір мезгілде екі нота үшін екінші плата немесе дыбыс модулі керек; бір Uno-мен ноталарды кезекпен ойнат: noTone(8), сосын tone(9, 392).",
      ru: "tone(8, 262) запускается первым и занимает таймер. tone(9, 392) вызывается, пока тот тон ещё звучит, и поэтому ничего не делает. Перестановка пьезодинамиков доказывает, что оба исправны. Для двух нот сразу нужна вторая плата или звуковой модуль; с одной Uno играй ноты по очереди: noTone(8), затем tone(9, 392).",
    },
  },
  {
    id: "temp-backwards",
    lesson: "temperature",
    title: {
      en: "The sensor with a fever",
      kk: "Қызуы көтерілген датчик",
      ru: "Датчик с жаром",
    },
    primer: {
      en: "The TMP36 temperature sensor has three legs. Looking at its flat side with the legs down, they are: power (+Vs), output (Vout) and ground (GND). The output gives a voltage that rises with temperature. Turned around, the sensor gets power on the wrong legs, and it heats up within seconds.",
      kk: "TMP36 температура датчигінің үш аяғы бар. Жазық жағына аяқтарын төмен қаратып қарасаң, олар мынадай: қорек (+Vs), шығыс (Vout) және жер (GND). Шығыс температурамен бірге өсетін кернеу береді. Теріс қойылса, датчиктің қорегі бөтен аяқтарға түседі де, ол бірнеше секундта қызып кетеді.",
      ru: "У датчика температуры TMP36 три ножки. Если смотреть на плоскую сторону ножками вниз, это: питание (+Vs), выход (Vout) и земля (GND). Выход даёт напряжение, которое растёт вместе с температурой. Если датчик перевернуть, питание попадёт не на те ножки, и он нагреется за несколько секунд.",
    },
    goal: tempGoal,
    diagram: sensorCircuit("TMP36", ["GND", "Vout", "+Vs"]),
    wiring: sensorWiring("TMP36", ["GND", "Vout", "+Vs"]),
    code: tempCode,
    symptom: {
      en: "The Serial Monitor shows a nonsense temperature far above 100, and the sensor itself is too hot to touch.",
      kk: "Serial Monitor 100-ден әлдеқайда жоғары мағынасыз температура көрсетеді, ал датчиктің өзі қол тигізбестей ыстық.",
      ru: "Serial Monitor показывает бессмысленную температуру намного выше 100, а сам датчик такой горячий, что к нему не прикоснуться.",
    },
    options: [
      {
        en: "The formula in the code is wrong for this sensor",
        kk: "Кодтағы формула бұл датчикке сәйкес келмейді",
        ru: "Формула в коде не подходит этому датчику",
      },
      {
        en: "The sensor is the wrong way round: its power leg is on GND and its ground leg on 5V",
        kk: "Датчик теріс қойылған: қорек аяғы GND-да, жер аяғы 5V-та тұр",
        ru: "Датчик стоит наоборот: его ножка питания на GND, а ножка земли на 5V",
      },
      {
        en: "Reading once a second makes the sensor overheat",
        kk: "Секундына бір рет оқу датчикті қыздырып жібереді",
        ru: "Опрос раз в секунду перегревает датчик",
      },
      {
        en: "A0 can only read potentiometers",
        kk: "A0 тек потенциометрлерді оқи алады",
        ru: "A0 умеет читать только потенциометры",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "In the diagram the leg marked +Vs goes to GND and the leg marked GND goes to 5V: the sensor is plugged in backwards. Current flows through it the wrong way, it heats up and the reading means nothing. Unplug the board at once, turn the sensor around and check it: after overheating it may be damaged. The code is correct for a TMP36.",
      kk: "Сызбада +Vs деп белгіленген аяқ GND-ға, ал GND деп белгіленген аяқ 5V-қа қосылған: датчик теріс қойылған. Ток ол арқылы бұрыс бағытта өтеді, датчик қызады, ал көрсеткіштің ешқандай мағынасы жоқ. Платаны дереу ажырат, датчикті аударып қой және оны тексер: қызып кеткеннен кейін ол зақымдануы мүмкін. Код TMP36 үшін дұрыс жазылған.",
      ru: "На схеме ножка с меткой +Vs идёт к GND, а ножка с меткой GND — к 5V: датчик вставлен наоборот. Ток идёт через него не в ту сторону, он греется, а показание ничего не значит. Сразу отключи плату, переверни датчик и проверь его: после перегрева он может быть повреждён. Код для TMP36 правильный.",
    },
  },
  {
    id: "temp-no-offset",
    lesson: "temperature",
    title: {
      en: "Fifty degrees too many",
      kk: "Елу градус артық",
      ru: "Пятьдесят градусов лишних",
    },
    primer: {
      en: "The TMP36 raises its output by 10 mV for every degree. So that it can also show temperatures below zero, it adds a fixed 0.5 V: at 0 °C the output is 0.5 V, and at 25 °C it is 0.75 V. The conversion therefore has two steps: volts = reading × 5.0 ÷ 1024, then degrees = (volts − 0.5) × 100.",
      kk: "TMP36 әр градусқа шығысын 10 мВ-қа көтереді. Нөлден төмен температураны да көрсете алуы үшін ол тұрақты 0,5 В қосады: 0 °C-та шығыс 0,5 В, ал 25 °C-та 0,75 В болады. Сондықтан есептеу екі қадамнан тұрады: вольт = көрсеткіш × 5.0 ÷ 1024, сосын градус = (вольт − 0.5) × 100.",
      ru: "TMP36 повышает выходное напряжение на 10 мВ на каждый градус. Чтобы показывать и температуры ниже нуля, он добавляет постоянные 0,5 В: при 0 °C на выходе 0,5 В, а при 25 °C — 0,75 В. Поэтому пересчёт идёт в два шага: вольты = показание × 5.0 ÷ 1024, затем градусы = (вольты − 0.5) × 100.",
    },
    goal: tempGoal,
    diagram: sensorCircuit("TMP36"),
    wiring: sensorWiring("TMP36"),
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(A0);
  float volts = reading * 5.0 / 1024.0;
  float celsius = volts * 100.0;
  Serial.println(celsius);
  delay(1000);
}`,
    symptom: {
      en: "In a room at about 25 °C the Serial Monitor prints about 75. Warmed between two fingers the number rises, in a draught it falls, but it is always about 50 too high.",
      kk: "Шамамен 25 °C бөлмеде Serial Monitor 75 шамасындағы санды шығарады. Датчикті екі саусақпен жылытса, сан өседі, жел өтінде төмендейді, бірақ әрқашан шамамен 50-ге артық.",
      ru: "В комнате при температуре около 25 °C Serial Monitor печатает около 75. Если согреть датчик двумя пальцами, число растёт, на сквозняке падает, но всегда примерно на 50 больше, чем нужно.",
    },
    options: [
      oSensorBackwards,
      {
        en: "The sensor must be powered from 3.3V, not from 5V",
        kk: "Датчик 5V-тан емес, 3.3V-тан қоректенуі керек",
        ru: "Датчик нужно питать от 3.3V, а не от 5V",
      },
      {
        en: "The formula leaves out the sensor's 0.5 V offset",
        kk: "Формулада датчиктің 0,5 В ығысуы ескерілмеген",
        ru: "В формуле не учтено смещение датчика 0,5 В",
      },
      {
        en: "delay(1000) is too short for the sensor to cool down",
        kk: "delay(1000) датчиктің суып үлгеруі үшін тым қысқа",
        ru: "delay(1000) слишком мала, датчик не успевает остыть",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The sensor responds to warmth and cold, so the wiring is fine; a steady error of 50 points to the arithmetic. The code says celsius = volts * 100.0, which would be right for a sensor that gives 0 V at 0 °C. The TMP36 gives 0.5 V at 0 °C, and 0.5 × 100 is exactly the extra 50. Write (volts - 0.5) * 100.0.",
      kk: "Датчик жылу мен суыққа жауап береді, демек сызба дұрыс; тұрақты 50 қателік есептеуге нұсқайды. Кодта celsius = volts * 100.0 деп жазылған, бұл 0 °C-та 0 В беретін датчик үшін дұрыс болар еді. TMP36 0 °C-та 0,5 В береді, ал 0,5 × 100 — дәл сол артық 50. (volts - 0.5) * 100.0 деп жаз.",
      ru: "Датчик реагирует на тепло и холод, значит, схема в порядке; постоянная ошибка в 50 указывает на арифметику. В коде написано celsius = volts * 100.0, и это было бы верно для датчика, который даёт 0 В при 0 °C. TMP36 даёт при 0 °C 0,5 В, а 0,5 × 100 — это как раз лишние 50. Напиши (volts - 0.5) * 100.0.",
    },
  },
  {
    id: "temp-lm35",
    lesson: "temperature",
    title: {
      en: "Fifty degrees too few",
      kk: "Елу градус кем",
      ru: "Пятидесяти градусов не хватает",
    },
    primer: {
      en: "The LM35 and the TMP36 look alike: a small black half-cylinder with three legs in the same order. Both raise their output by 10 mV per degree. The difference is the starting point: the TMP36 gives 0.5 V at 0 °C, the LM35 gives 0 V. So each has its own formula: (volts − 0.5) × 100 for the TMP36, and volts × 100 for the LM35. The name is printed on the flat side.",
      kk: "LM35 пен TMP36 бір-біріне ұқсас: аяқтарының реті бірдей, үш аяқты кішкентай қара жарты цилиндр. Екеуі де шығысын әр градусқа 10 мВ-қа көтереді. Айырмашылығы — бастапқы нүктеде: TMP36 0 °C-та 0,5 В береді, LM35 — 0 В. Сондықтан әрқайсысының өз формуласы бар: TMP36 үшін (вольт − 0.5) × 100, LM35 үшін вольт × 100. Атауы жазық жағына жазылған.",
      ru: "LM35 и TMP36 похожи: маленький чёрный полуцилиндр с тремя ножками в одинаковом порядке. Оба повышают выходное напряжение на 10 мВ на градус. Разница в точке отсчёта: TMP36 даёт 0,5 В при 0 °C, а LM35 — 0 В. Поэтому у каждого своя формула: (вольты − 0.5) × 100 для TMP36 и вольты × 100 для LM35. Название написано на плоской стороне.",
    },
    goal: tempGoal,
    diagram: sensorCircuit("LM35"),
    wiring: sensorWiring("LM35"),
    code: tempCode,
    symptom: {
      en: "In a room at about 25 °C the Serial Monitor prints about −25. The number follows warmth and cold, but it is always about 50 too low.",
      kk: "Шамамен 25 °C бөлмеде Serial Monitor −25 шамасындағы санды шығарады. Сан жылу мен суыққа ілесіп өзгереді, бірақ әрқашан шамамен 50-ге кем.",
      ru: "В комнате при температуре около 25 °C Serial Monitor печатает около −25. Число меняется вслед за теплом и холодом, но всегда примерно на 50 меньше, чем нужно.",
    },
    options: [
      {
        en: "The part is an LM35, which has no 0.5 V offset, but the formula subtracts it",
        kk: "Бұл бөлшек — LM35, онда 0,5 В ығысу жоқ, ал формула оны азайтады",
        ru: "Эта деталь — LM35, у неё нет смещения 0,5 В, а формула его вычитает",
      },
      oSensorBackwards,
      {
        en: "5.0 / 1024.0 is whole-number division and gives 0",
        kk: "5.0 / 1024.0 — бүтін сандарды бөлу, оның нәтижесі 0",
        ru: "5.0 / 1024.0 — деление целых чисел, и оно даёт 0",
      },
      {
        en: "The room really is colder than it feels",
        kk: "Бөлме шынымен сезілгеннен суығырақ",
        ru: "В комнате на самом деле холоднее, чем кажется",
      },
    ],
    answer: 0,
    faultType: "component",
    explanation: {
      en: "The diagram names the part: LM35. At 25 °C it gives 0.25 V, and the code turns that into (0.25 − 0.5) × 100 = −25. The subtraction belongs to the TMP36. For an LM35 write celsius = volts * 100.0. The division is fine: 5.0 and 1024.0 are written with a decimal point, so the fraction is kept.",
      kk: "Сызбада бөлшектің аты жазылған: LM35. 25 °C-та ол 0,25 В береді, ал код оны (0,25 − 0,5) × 100 = −25 деп есептейді. Азайту TMP36-ға тән. LM35 үшін celsius = volts * 100.0 деп жаз. Бөлу дұрыс: 5.0 мен 1024.0 ондық нүктемен жазылған, сондықтан бөлшек бөлігі сақталады.",
      ru: "На схеме деталь названа: LM35. При 25 °C она даёт 0,25 В, и код превращает это в (0,25 − 0,5) × 100 = −25. Вычитание относится к TMP36. Для LM35 напиши celsius = volts * 100.0. Деление в порядке: 5.0 и 1024.0 записаны с десятичной точкой, так что дробная часть сохраняется.",
    },
  },
  {
    id: "temp-raw-compare",
    lesson: "temperature",
    title: {
      en: "Too hot, every single second",
      kk: "Әр секунд сайын «тым ыстық»",
      ru: "«Слишком жарко» каждую секунду",
    },
    primer: {
      en: "A sketch often holds the same measurement in several forms: the raw number from the pin (0–1023), the voltage, and the final value in degrees. They are different numbers: at 24 °C a TMP36 gives a raw reading of about 150. A condition must compare the variable that is in the same units as the limit.",
      kk: "Скетч көбіне бір өлшемді бірнеше түрде сақтайды: пиннен алынған бастапқы сан (0–1023), кернеу және градуспен берілген соңғы мән. Бұлар — әртүрлі сандар: 24 °C-та TMP36 шамамен 150 деген бастапқы көрсеткіш береді. Шарт шекпен бірдей өлшем бірлігіндегі айнымалыны салыстыруы керек.",
      ru: "Скетч часто хранит одно и то же измерение в нескольких видах: сырое число с пина (0–1023), напряжение и итоговое значение в градусах. Это разные числа: при 24 °C TMP36 даёт сырое показание около 150. Условие должно сравнивать ту переменную, которая измеряется в тех же единицах, что и порог.",
    },
    goal: {
      en: "The Serial Monitor shows the temperature, and adds the warning “Too hot!” only above 30 °C.",
      kk: "Serial Monitor температураны көрсетеді, ал «Too hot!» ескертуін тек 30 °C-тан жоғары болғанда қосады.",
      ru: "Serial Monitor показывает температуру, а предупреждение «Too hot!» добавляет только выше 30 °C.",
    },
    diagram: sensorCircuit("TMP36"),
    wiring: sensorWiring("TMP36"),
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(A0);
  float volts = reading * 5.0 / 1024.0;
  float celsius = (volts - 0.5) * 100.0;
  Serial.println(celsius);
  if (reading > 30) {
    Serial.println("Too hot!");
  }
  delay(1000);
}`,
    symptom: {
      en: "The temperature is right, about 24, but “Too hot!” is printed after every single reading.",
      kk: "Температура дұрыс, шамамен 24, бірақ «Too hot!» әр көрсеткіштен кейін шығады.",
      ru: "Температура верная, около 24, но «Too hot!» печатается после каждого показания.",
    },
    options: [
      {
        en: "30 must be written as 30.0 to be compared with a temperature",
        kk: "Температурамен салыстыру үшін 30-ды 30.0 деп жазу керек",
        ru: "Чтобы сравнивать с температурой, 30 нужно записать как 30.0",
      },
      {
        en: "Serial.println cannot be used twice in one loop()",
        kk: "Serial.println-ді бір loop() ішінде екі рет қолдануға болмайды",
        ru: "Serial.println нельзя вызывать дважды в одном loop()",
      },
      {
        en: "The sensor heats up from the board and is really above 30 °C",
        kk: "Датчик платадан қызады, шын мәнінде ол 30 °C-тан жоғары",
        ru: "Датчик греется от платы и на самом деле горячее 30 °C",
      },
      {
        en: "The condition compares the raw reading with 30, not the temperature",
        kk: "Шарт 30-бен температураны емес, бастапқы көрсеткішті салыстырады",
        ru: "Условие сравнивает с 30 сырое показание, а не температуру",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "The printed temperature is correct, so the sensor and the formula work. The fault is in the if: it tests reading, the raw number from analogRead, which is about 150 in a warm room and always greater than 30. Change the condition to if (celsius > 30).",
      kk: "Шығарылған температура дұрыс, демек датчик те, формула да жұмыс істейді. Ақау if-те: ол reading айнымалысын — analogRead қайтарған бастапқы санды — тексереді, ал ол жылы бөлмеде шамамен 150 және әрқашан 30-дан үлкен. Шартты if (celsius > 30) деп өзгерт.",
      ru: "Температура печатается верная, значит, датчик и формула работают. Ошибка в if: он проверяет reading — сырое число из analogRead, которое в тёплой комнате равно примерно 150 и всегда больше 30. Измени условие на if (celsius > 30).",
    },
  },
  {
    id: "dht-analog-read",
    lesson: "temperature",
    title: {
      en: "450 degrees in the shade",
      kk: "Көлеңкеде 450 градус",
      ru: "450 градусов в тени",
    },
    primer: {
      en: "Sensors answer in two ways. An analog sensor such as the TMP36 puts out a voltage, and analogRead() measures it. A digital sensor such as the DHT11 measures by itself and sends the finished numbers as a fast series of pulses on its data leg. Those pulses are decoded by a library, through a digital pin. Between messages the DHT11 module keeps its data leg at 5 V.",
      kk: "Датчиктер екі тәсілмен жауап береді. TMP36 сияқты аналогтық датчик кернеу шығарады, оны analogRead() өлшейді. DHT11 сияқты цифрлық датчик өзі өлшеп, дайын сандарды дерек аяғы арқылы жылдам импульстар тізбегі түрінде жібереді. Бұл импульстарды кітапхана цифрлық пин арқылы ажыратып оқиды. Хабарламалар арасында DHT11 модулі дерек аяғын 5 В-та ұстайды.",
      ru: "Датчики отвечают двумя способами. Аналоговый датчик, например TMP36, выдаёт напряжение, и его измеряет analogRead(). Цифровой датчик, например DHT11, измеряет сам и отправляет готовые числа быстрой серией импульсов по ножке данных. Эти импульсы расшифровывает библиотека через цифровой пин. Между сообщениями модуль DHT11 держит ножку данных на 5 В.",
    },
    goal: tempGoal,
    diagram: sensorCircuit("DHT11", ["+", "out", "−"]),
    wiring: sensorWiring("DHT11", ["+", "out", "−"]),
    code: tempCode,
    symptom: {
      en: "The Serial Monitor prints about 450 all the time. Breathing on the sensor or holding it in a hand changes nothing.",
      kk: "Serial Monitor үнемі 450 шамасындағы санды шығарады. Датчикке дем үрлесе де, оны қолға ұстаса да ештеңе өзгермейді.",
      ru: "Serial Monitor всё время печатает около 450. Если подышать на датчик или зажать его в руке, ничего не меняется.",
    },
    options: [
      {
        en: "The DHT11 is a digital sensor: it must be read with its library, not with analogRead and a voltage formula",
        kk: "DHT11 — цифрлық датчик: оны analogRead пен кернеу формуласы арқылы емес, өз кітапханасы арқылы оқу керек",
        ru: "DHT11 — цифровой датчик: его нужно читать через библиотеку, а не через analogRead и формулу для напряжения",
      },
      oSensorBackwards,
      {
        en: "The 0.5 in the formula should be 5.0 for this sensor",
        kk: "Бұл датчик үшін формуладағы 0.5 орнында 5.0 тұруы керек",
        ru: "Для этого датчика в формуле вместо 0.5 должно стоять 5.0",
      },
      {
        en: "The DHT11 only works on battery power",
        kk: "DHT11 тек батареямен ғана жұмыс істейді",
        ru: "DHT11 работает только от батарейки",
      },
    ],
    answer: 0,
    faultType: "component",
    explanation: {
      en: "The sketch treats the DHT11 like a TMP36. But its data leg does not carry a voltage that follows temperature: between messages it simply rests at 5 V. analogRead returns about 1023, and the formula turns that into (5.0 − 0.5) × 100 ≈ 450. Move the data wire to a digital pin such as 2, install a DHT library and ask it for the temperature, for example with dht.readTemperature().",
      kk: "Скетч DHT11-ді TMP36 сияқты қабылдайды. Бірақ оның дерек аяғында температураға ілесетін кернеу болмайды: хабарламалар арасында ол жай 5 В-та тұрады. analogRead шамамен 1023 қайтарады, ал формула оны (5,0 − 0,5) × 100 ≈ 450 деп есептейді. Дерек сымын цифрлық пинге, мысалы 2-пинге ауыстыр, DHT кітапханасын орнатып, температураны содан сұра, мысалы dht.readTemperature() арқылы.",
      ru: "Скетч обращается с DHT11 как с TMP36. Но на его ножке данных нет напряжения, которое следует за температурой: между сообщениями на ней просто держится 5 В. analogRead возвращает около 1023, и формула превращает это в (5,0 − 0,5) × 100 ≈ 450. Переставь провод данных на цифровой пин, например 2, установи библиотеку DHT и спрашивай температуру у неё, например через dht.readTemperature().",
    },
  },
  {
    id: "transistor-no-base-resistor",
    lesson: "transistor",
    title: {
      en: "The pin that burnt out quietly",
      kk: "Үнсіз күйіп кеткен пин",
      ru: "Пин, который тихо сгорел",
    },
    primer: {
      en: "A transistor is an electronic switch with three legs. A small current into the base (B) lets a large current flow from the collector (C) to the emitter (E). The pin only gives the command; the motor's power comes from the battery. But the base takes as much current as it is offered, so a resistor of about 1 kΩ always stands between the pin and the base. The diode across the motor is protection; a later mission is about it.",
      kk: "Транзистор — үш аяқты электрондық қосқыш. Базаға (B) кіретін аз ток коллектордан (C) эмиттерге (E) үлкен токтың өтуіне жол ашады. Пин тек бұйрық береді; мотордың қорегі батареядан келеді. Бірақ база өзіне қанша ток берілсе, сонша алады, сондықтан пин мен базаның арасына әрқашан шамамен 1 кОм резистор қойылады. Моторға параллель тұрған диод — қорғаныс; ол туралы кейінгі миссияда айтылады.",
      ru: "Транзистор — это электронный выключатель с тремя ножками. Небольшой ток в базу (B) разрешает большому току течь от коллектора (C) к эмиттеру (E). Пин только даёт команду; питание мотор получает от батареи. Но база берёт столько тока, сколько ей дадут, поэтому между пином и базой всегда ставят резистор около 1 кОм. Диод параллельно мотору — это защита; о нём одна из следующих миссий.",
    },
    goal: motorGoal,
    diagram: transistorCircuit({ baseResistor: false }),
    wiring: transistorWiring({ baseResistor: false }),
    code: motorOnOffCode,
    symptom: {
      en: "The motor does switch on and off. But the transistor and the Arduino's main chip get hot, and after a few days pin 9 stops working altogether.",
      kk: "Мотор шынымен қосылып-өшеді. Бірақ транзистор мен Arduino-ның негізгі микросхемасы қызады, ал бірнеше күннен кейін 9-пин мүлдем істемей қалады.",
      ru: "Мотор действительно включается и выключается. Но транзистор и главная микросхема Arduino греются, а через несколько дней пин 9 перестаёт работать совсем.",
    },
    options: [
      {
        en: "The motor should take its power from the 5V pin, not from a battery",
        kk: "Мотор қоректі батареядан емес, 5V пинінен алуы керек",
        ru: "Мотор должен питаться от пина 5V, а не от батареи",
      },
      {
        en: "The diode next to the motor heats the transistor",
        kk: "Мотордың жанындағы диод транзисторды қыздырады",
        ru: "Диод рядом с мотором нагревает транзистор",
      },
      {
        en: "Two seconds is too long for a transistor to stay on",
        kk: "Екі секунд транзистордың қосулы тұруы үшін тым ұзақ",
        ru: "Две секунды — слишком долго для включённого транзистора",
      },
      {
        en: "There is no resistor between pin 9 and the base, so the pin is overloaded",
        kk: "9-пин мен базаның арасында резистор жоқ, сондықтан пинге артық жүктеме түседі",
        ru: "Между пином 9 и базой нет резистора, и пин перегружен",
      },
    ],
    answer: 3,
    faultType: "component",
    explanation: {
      en: "Pin 9 is wired straight to the base. Nothing limits the current, and the pin gives far more than its safe 20 mA every time it is HIGH. It works for a while, which is what makes this fault dangerous, and then the pin dies. Put a 1 kΩ resistor between pin 9 and the base: about 4 mA flows, and that is enough to switch the motor on.",
      kk: "9-пин базаға тікелей қосылған. Токты ештеңе шектемейді, пин HIGH болған сайын өзінің қауіпсіз 20 мА-інен әлдеқайда көп ток береді. Ол біраз уақыт жұмыс істейді — бұл ақаудың қауіптілігі де осында — сосын пин істен шығады. 9-пин мен базаның арасына 1 кОм резистор қой: шамамен 4 мА өтеді, ал бұл моторды қосуға жеткілікті.",
      ru: "Пин 9 подключён прямо к базе. Ток ничто не ограничивает, и каждый раз при HIGH пин отдаёт намного больше своих безопасных 20 мА. Какое-то время всё работает — этим поломка и опасна, — а потом пин выходит из строя. Поставь между пином 9 и базой резистор 1 кОм: потечёт около 4 мА, и этого хватит, чтобы включить мотор.",
    },
  },
  {
    id: "transistor-swapped",
    lesson: "transistor",
    title: {
      en: "The switch put in backwards",
      kk: "Теріс қойылған қосқыш",
      ru: "Выключатель, вставленный наоборот",
    },
    primer: {
      en: "The three legs of a transistor are not interchangeable. In an NPN transistor the current must enter at the collector (C) and leave at the emitter (E), and the emitter goes to GND. Turned the other way the transistor opens only a crack. The order of the legs differs from model to model, so it is taken from the datasheet picture, not guessed.",
      kk: "Транзистордың үш аяғын бір-бірімен ауыстыруға болмайды. NPN транзисторда ток коллектордан (C) кіріп, эмиттерден (E) шығуы керек, ал эмиттер GND-ға қосылады. Керісінше қойылса, транзистор сәл ғана ашылады. Аяқтардың реті әр модельде әртүрлі, сондықтан оны болжамай, құжаттамадағы (datasheet) суреттен қарайды.",
      ru: "Три ножки транзистора не взаимозаменяемы. У NPN-транзистора ток должен входить в коллектор (C) и выходить из эмиттера (E), а эмиттер подключается к GND. В обратном включении транзистор открывается лишь чуть-чуть. Порядок ножек у разных моделей разный, поэтому его берут с рисунка в документации (datasheet), а не угадывают.",
    },
    goal: motorGoal,
    diagram: transistorCircuit({ swapped: true }),
    wiring: transistorWiring({ swapped: true }),
    code: motorOnOffCode,
    symptom: {
      en: "The motor only hums faintly or barely turns, although it spins strongly when it is touched straight to the same battery.",
      kk: "Мотор әлсіз ғана ызыңдайды немесе әрең айналады, алайда дәл сол батареяға тікелей тигізгенде ол қатты айналады.",
      ru: "Мотор лишь слабо гудит или едва вращается, хотя от той же батареи напрямую он крутится сильно.",
    },
    options: [
      {
        en: "A 1 kΩ base resistor is too large for any transistor",
        kk: "1 кОм база резисторы кез келген транзистор үшін тым үлкен",
        ru: "Резистор базы 1 кОм слишком велик для любого транзистора",
      },
      {
        en: "The collector and the emitter are swapped: the motor is on the emitter and the collector is on GND",
        kk: "Коллектор мен эмиттер ауысып кеткен: мотор эмиттерде, ал коллектор GND-да тұр",
        ru: "Коллектор и эмиттер перепутаны: мотор стоит на эмиттере, а коллектор на GND",
      },
      {
        en: "A 6 V battery is too weak for this motor",
        kk: "6 В батарея бұл мотор үшін тым әлсіз",
        ru: "Батарея 6 В слишком слаба для этого мотора",
      },
      {
        en: "Pin 9 must be driven with analogWrite, not digitalWrite",
        kk: "9-пинді digitalWrite-пен емес, analogWrite-пен басқару керек",
        ru: "Пином 9 нужно управлять через analogWrite, а не digitalWrite",
      },
    ],
    answer: 1,
    faultType: "wiring",
    explanation: {
      en: "Follow the two right-hand legs in the diagram: E goes to the motor and C goes to GND, the opposite of what an NPN transistor needs. In this position it passes only a small part of the current, so the motor gets too little. Turn the transistor so that the emitter is on GND and the collector on the motor. The battery is fine: the motor spins well straight from it.",
      kk: "Сызбадағы оң жақтағы екі аяққа қара: E моторға, ал C GND-ға қосылған — бұл NPN транзисторға керегіне қарама-қарсы. Бұл күйде ол токтың аз ғана бөлігін өткізеді, сондықтан моторға ток жетпейді. Транзисторды эмиттері GND-да, коллекторы моторда болатындай етіп аудар. Батарея дұрыс: мотор одан тікелей жақсы айналады.",
      ru: "Проследи за двумя правыми ножками на схеме: E идёт к мотору, а C — к GND, то есть наоборот по сравнению с тем, что нужно NPN-транзистору. В таком положении он пропускает лишь малую часть тока, и мотору достаётся слишком мало. Переверни транзистор так, чтобы эмиттер был на GND, а коллектор на моторе. Батарея в порядке: напрямую от неё мотор вращается хорошо.",
    },
  },
  {
    id: "transistor-too-small",
    lesson: "transistor",
    title: {
      en: "A small switch for a big motor",
      kk: "Үлкен моторға кішкентай қосқыш",
      ru: "Маленький выключатель для большого мотора",
    },
    primer: {
      en: "Every transistor has a largest current it can switch, given in its datasheet. A BC547 handles up to 100 mA, a PN2222 up to 600 mA, a TIP120 up to 5 A. A motor takes its normal current while running and several times more at the moment it starts. The transistor is chosen with a margin above that.",
      kk: "Әр транзистордың қоса алатын ең үлкен тогы бар, ол құжаттамасында (datasheet) көрсетіледі. BC547 100 мА-ге дейін, PN2222 600 мА-ге дейін, TIP120 5 А-ге дейін шыдайды. Мотор жұмыс кезінде қалыпты тогын, ал іске қосылған сәтте одан бірнеше есе көп ток тартады. Транзистор осыдан артық қормен таңдалады.",
      ru: "У каждого транзистора есть наибольший ток, который он может переключать; он указан в документации (datasheet). BC547 выдерживает до 100 мА, PN2222 — до 600 мА, TIP120 — до 5 А. Мотор берёт свой обычный ток во время работы и в несколько раз больше в момент пуска. Транзистор выбирают с запасом сверх этого.",
    },
    goal: {
      en: "The motor, which takes about 300 mA, runs for two seconds, stops for two seconds, and repeats.",
      kk: "Шамамен 300 мА тартатын мотор екі секунд айналады, екі секунд тоқтайды, осылай қайталайды.",
      ru: "Мотор, который потребляет около 300 мА, две секунды вращается, две секунды стоит и так повторяет.",
    },
    diagram: transistorCircuit({ model: "BC547" }),
    wiring: transistorWiring(),
    code: motorOnOffCode,
    symptom: {
      en: "The motor turns, but weakly. Within a minute the transistor is too hot to touch, and one day it stops working for good.",
      kk: "Мотор айналады, бірақ әлсіз. Бір минуттың ішінде транзистор қол тигізбестей қызады, ал бір күні біржола істен шығады.",
      ru: "Мотор вращается, но слабо. За минуту транзистор нагревается так, что к нему не прикоснуться, а однажды перестаёт работать совсем.",
    },
    options: [
      {
        en: "The BC547 can switch at most 100 mA, and the motor takes about three times that",
        kk: "BC547 ең көбі 100 мА қоса алады, ал мотор одан шамамен үш есе көп тартады",
        ru: "BC547 переключает не больше 100 мА, а мотор берёт примерно втрое больше",
      },
      {
        en: "The base resistor should be removed so that the transistor opens fully",
        kk: "Транзистор толық ашылуы үшін база резисторын алып тастау керек",
        ru: "Резистор базы нужно убрать, чтобы транзистор открылся полностью",
      },
      {
        en: "The diode takes current away from the motor",
        kk: "Диод мотордан ток тартып алады",
        ru: "Диод отбирает ток у мотора",
      },
      {
        en: "The battery minus must not be joined to Arduino GND",
        kk: "Батареяның минусын Arduino GND-мен қосуға болмайды",
        ru: "Минус батареи нельзя соединять с GND Arduino",
      },
    ],
    answer: 0,
    faultType: "limits",
    explanation: {
      en: "The diagram names the transistor: BC547, a small-signal type with a limit of 100 mA. The motor needs about 300 mA and more when starting, so the transistor is overloaded, heats up and eventually fails. The wiring is right; the part is too small. Use a PN2222 (600 mA) or, for bigger motors, a TIP120 or a MOSFET.",
      kk: "Сызбада транзистордың аты жазылған: BC547 — шегі 100 мА болатын шағын сигналдық түр. Моторға шамамен 300 мА, ал іске қосылғанда одан да көп керек, сондықтан транзисторға артық жүктеме түсіп, ол қызады да, ақыры істен шығады. Сызба дұрыс; бөлшек тым кішкентай. PN2222 (600 мА) немесе үлкенірек моторлар үшін TIP120 не MOSFET қолдан.",
      ru: "На схеме транзистор назван: BC547 — маломощный, с пределом 100 мА. Мотору нужно около 300 мА, а при пуске ещё больше, поэтому транзистор перегружен, греется и в конце концов выходит из строя. Схема собрана верно; деталь слишком мала. Возьми PN2222 (600 мА), а для моторов покрупнее — TIP120 или MOSFET.",
    },
  },
  {
    id: "transistor-no-diode",
    lesson: "transistor",
    title: {
      en: "It worked for a week",
      kk: "Бір апта жұмыс істеді",
      ru: "Неделю всё работало",
    },
    primer: {
      en: "A motor is a coil of wire, and a coil resists any sudden change of current. When the transistor switches the motor off, the coil keeps pushing for an instant and produces a short spike of high voltage, far above the battery's. A diode placed across the motor, with its stripe toward the battery plus, gives that spike a safe path. Without it the spike hits the transistor.",
      kk: "Мотор — сым орамы, ал орам токтың кенет өзгеруіне қарсы тұрады. Транзистор моторды өшіргенде, орам бір сәт токты итеруін жалғастырып, батарея кернеуінен әлдеқайда жоғары қысқа кернеу секірісін туғызады. Моторға параллель, жолағы батарея плюсіне қаратып қойылған диод бұл секіріске қауіпсіз жол береді. Онсыз секіріс транзисторға тиеді.",
      ru: "Мотор — это катушка провода, а катушка сопротивляется любому резкому изменению тока. Когда транзистор выключает мотор, катушка ещё мгновение продолжает толкать ток и создаёт короткий всплеск напряжения, намного выше напряжения батареи. Диод, поставленный параллельно мотору полоской к плюсу батареи, даёт этому всплеску безопасный путь. Без него всплеск бьёт по транзистору.",
    },
    goal: motorGoal,
    diagram: transistorCircuit({ diode: "none" }),
    wiring: transistorWiring({ diode: "none" }),
    code: motorOnOffCode,
    symptom: {
      en: "At first everything works. But now and then the board restarts at the very moment the motor is switched off, and after a week the transistor is dead.",
      kk: "Басында бәрі жұмыс істейді. Бірақ анда-санда мотор өшірілген сәтте плата қайта іске қосылады, ал бір аптадан кейін транзистор істен шығады.",
      ru: "Сначала всё работает. Но время от времени плата перезагружается именно в тот момент, когда мотор выключается, а через неделю транзистор выходит из строя.",
    },
    options: [
      {
        en: "The 1 kΩ base resistor is too small",
        kk: "1 кОм база резисторы тым кішкентай",
        ru: "Резистор базы 1 кОм слишком мал",
      },
      {
        en: "The motor should be between the emitter and GND",
        kk: "Мотор эмиттер мен GND арасында тұруы керек",
        ru: "Мотор должен стоять между эмиттером и GND",
      },
      {
        en: "There is no diode across the motor to take the voltage spike at switch-off",
        kk: "Мотор өшкенде пайда болатын кернеу секірісін қабылдайтын диод моторға параллель қойылмаған",
        ru: "Параллельно мотору нет диода, который принял бы всплеск напряжения при выключении",
      },
      {
        en: "Switching every two seconds is too often for a motor",
        kk: "Екі секунд сайын ауыстыру мотор үшін тым жиі",
        ru: "Переключать каждые две секунды — слишком часто для мотора",
      },
    ],
    answer: 2,
    faultType: "component",
    explanation: {
      en: "The trouble always comes at switch-off, and that is the clue. Each time the transistor closes, the motor's coil throws a voltage spike at it; the spike also disturbs the board, and it wears the transistor out until it fails. Add a diode such as a 1N4007 across the motor's two terminals, with the stripe toward the battery plus.",
      kk: "Қиындық әрдайым өшіру сәтінде туады — кілт те осында. Транзистор жабылған сайын мотор орамы оған кернеу секірісін жібереді; бұл секіріс платаның жұмысын да бұзады және транзисторды істен шыққанша тоздырады. Мотордың екі контактісіне параллель, жолағын батарея плюсіне қаратып, 1N4007 сияқты диод қос.",
      ru: "Неприятности всегда случаются при выключении, и это подсказка. Каждый раз, когда транзистор закрывается, катушка мотора бросает на него всплеск напряжения; этот всплеск мешает и плате, и он изнашивает транзистор, пока тот не выйдет из строя. Добавь диод, например 1N4007, параллельно двум контактам мотора, полоской к плюсу батареи.",
    },
  },
  {
    id: "transistor-diode-backwards",
    lesson: "transistor",
    title: {
      en: "The protection that shorts the battery",
      kk: "Батареяны тұйықтайтын қорғаныс",
      ru: "Защита, которая закорачивает батарею",
    },
    primer: {
      en: "A diode passes current in one direction only, from its plain end to its striped end. The protective diode across a motor must point against the normal current: its stripe faces the battery plus, so in normal work nothing flows through it. Turned around, it becomes an easy path past the motor.",
      kk: "Диод токты тек бір бағытта — жолақсыз ұшынан жолақты ұшына қарай — өткізеді. Моторға параллель қойылған қорғаныс диоды қалыпты токқа қарсы бағытталуы керек: оның жолағы батарея плюсіне қарайды, сондықтан қалыпты жұмыс кезінде ол арқылы ештеңе өтпейді. Керісінше қойылса, ол моторды айналып өтетін оңай жолға айналады.",
      ru: "Диод пропускает ток только в одну сторону — от конца без полоски к концу с полоской. Защитный диод параллельно мотору должен стоять против обычного тока: полоской к плюсу батареи, тогда в обычной работе через него ничего не течёт. Если его перевернуть, он становится лёгким путём в обход мотора.",
    },
    goal: motorGoal,
    diagram: transistorCircuit({ diode: "flip" }),
    wiring: transistorWiring({ diode: "flip" }),
    code: motorOnOffCode,
    symptom: {
      en: "The motor never turns. Whenever pin 9 is HIGH, the diode and the transistor heat up fast and the battery runs down in minutes.",
      kk: "Мотор мүлдем айналмайды. 9-пин HIGH болған сайын диод пен транзистор тез қызады, ал батарея бірнеше минутта отырып қалады.",
      ru: "Мотор не вращается совсем. Каждый раз, когда на пине 9 HIGH, диод и транзистор быстро греются, а батарея садится за считаные минуты.",
    },
    options: [
      oMotorBackwards,
      {
        en: "The 1 kΩ base resistor is too large",
        kk: "1 кОм база резисторы тым үлкен",
        ru: "Резистор базы 1 кОм слишком велик",
      },
      {
        en: "Pin 9 cannot switch a transistor",
        kk: "9-пин транзисторды басқара алмайды",
        ru: "Пин 9 не может управлять транзистором",
      },
      {
        en: "The diode is the wrong way round, so the current goes through it instead of the motor",
        kk: "Диод теріс қойылған, сондықтан ток мотор арқылы емес, сол арқылы өтеді",
        ru: "Диод стоит наоборот, и ток идёт через него, а не через мотор",
      },
    ],
    answer: 3,
    faultType: "component",
    explanation: {
      en: "In the diagram the diode's stripe faces the transistor, not the battery plus. As soon as the transistor opens, current runs from the battery plus through the diode straight to the collector and on to GND, past the motor: almost a short circuit. That is why the diode and the transistor heat up and the motor gets nothing. Turn the diode so that its stripe faces the battery plus. A motor wired backwards would just spin the other way.",
      kk: "Сызбада диодтың жолағы батарея плюсіне емес, транзисторға қарап тұр. Транзистор ашылған бойда ток батарея плюсінен диод арқылы тікелей коллекторға, одан әрі GND-ға моторды айналып өтеді: қысқа тұйықталу дерлік. Диод пен транзистордың қызатыны да, моторға ештеңе жетпейтіні де содан. Диодты жолағы батарея плюсіне қарайтындай етіп аудар. Теріс қосылған мотор жай кері бағытта айналар еді.",
      ru: "На схеме полоска диода смотрит на транзистор, а не на плюс батареи. Как только транзистор открывается, ток идёт от плюса батареи через диод прямо на коллектор и дальше в GND, мимо мотора: почти короткое замыкание. Поэтому диод и транзистор греются, а мотору ничего не достаётся. Переверни диод полоской к плюсу батареи. Мотор, подключённый наоборот, просто вращался бы в другую сторону.",
    },
  },
  {
    id: "driver-both-high",
    lesson: "motors",
    title: {
      en: "The motor with the brakes on",
      kk: "Тежегіші басулы мотор",
      ru: "Мотор на тормозе",
    },
    primer: {
      en: "The L298N is a motor driver: a board that stands between the Arduino and a motor and switches the battery's power for it. Two inputs set the direction. IN1 HIGH with IN2 LOW turns the motor one way; IN1 LOW with IN2 HIGH turns it the other way. If both are the same, the motor stops, and with both HIGH the driver actively brakes it. The third input, ENA, sets the speed with analogWrite. The terminal marked 12V takes the battery plus.",
      kk: "L298N — мотор драйвері: Arduino мен мотордың арасында тұрып, моторға батарея қорегін қосып-өшіретін плата. Бағытты екі кіріс анықтайды. IN1 HIGH, IN2 LOW болса, мотор бір бағытта айналады; IN1 LOW, IN2 HIGH болса — екінші бағытта. Екеуі бірдей болса, мотор тоқтайды, ал екеуі де HIGH болғанда драйвер оны белсенді түрде тежейді. Үшінші кіріс ENA жылдамдықты analogWrite арқылы береді. 12V деп белгіленген контактіге батареяның плюсі қосылады.",
      ru: "L298N — это драйвер мотора: плата, которая стоит между Arduino и мотором и переключает для него питание от батареи. Направление задают два входа. IN1 HIGH и IN2 LOW — мотор вращается в одну сторону; IN1 LOW и IN2 HIGH — в другую. Если оба одинаковы, мотор останавливается, а при двух HIGH драйвер его активно тормозит. Третий вход, ENA, задаёт скорость через analogWrite. К клемме с меткой 12V подключают плюс батареи.",
    },
    goal: driverGoal,
    diagram: driverCircuit(),
    wiring: driverWiring(),
    code: driverSketch("9", "HIGH", 200),
    symptom: {
      en: "The motor does not turn, and its shaft is harder to turn by hand than usual, as if something were holding it.",
      kk: "Мотор айналмайды, ал оның білігін қолмен бұру әдеттегіден қиын, бір нәрсе ұстап тұрғандай.",
      ru: "Мотор не вращается, а его вал провернуть рукой труднее обычного, будто его что-то держит.",
    },
    options: [
      {
        en: "200 is too little; a motor starts only at 255",
        kk: "200 тым аз; мотор тек 255-те ғана қозғалады",
        ru: "200 слишком мало; мотор запускается только при 255",
      },
      oNoPwm9,
      {
        en: "IN1 and IN2 are both HIGH, so the driver brakes the motor instead of turning it",
        kk: "IN1 мен IN2 екеуі де HIGH, сондықтан драйвер моторды айналдырмай, тежейді",
        ru: "IN1 и IN2 оба HIGH, поэтому драйвер не вращает мотор, а тормозит его",
      },
      {
        en: "The battery plus must go to the Arduino 5V pin",
        kk: "Батареяның плюсі Arduino-ның 5V пиніне қосылуы керек",
        ru: "Плюс батареи должен идти на пин 5V Arduino",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The sketch writes HIGH to in1 and HIGH to in2. With equal inputs both motor wires are connected to the same side of the battery, so no current flows through the motor, and the driver holds it: that is the stiff shaft. Change one of them, for example digitalWrite(in2, LOW). Pin 9 does have PWM, and 200 out of 255 is plenty.",
      kk: "Скетч in1-ге де, in2-ге де HIGH жазады. Кірістер бірдей болғанда мотордың екі сымы да батареяның бір жағына қосылады, сондықтан мотор арқылы ток өтпейді, ал драйвер оны ұстап тұрады: біліктің қатты айналатыны содан. Біреуін өзгерт, мысалы digitalWrite(in2, LOW). 9-пинде ШИМ бар, ал 255-тен 200 — жеткілікті мән.",
      ru: "Скетч записывает HIGH и в in1, и в in2. При одинаковых входах оба провода мотора подключены к одной и той же стороне батареи, ток через мотор не идёт, а драйвер его удерживает — отсюда тугой вал. Измени один из них, например digitalWrite(in2, LOW). ШИМ на пине 9 есть, а 200 из 255 более чем достаточно.",
    },
  },
  {
    id: "driver-enable-no-pwm",
    lesson: "motors",
    title: {
      en: "All or nothing",
      kk: "Не бәрі, не ештеңе",
      ru: "Всё или ничего",
    },
    primer: {
      en: "The ENA input of the L298N switches the motor's power on and off. Fed with PWM from analogWrite, it switches so fast that the motor runs at a part of its speed: 0 is stopped, 255 is full speed. That only works on a pin that has PWM, marked ~ on the board: 3, 5, 6, 9, 10 and 11. On any other pin analogWrite can only give LOW for values below 128 and HIGH for the rest.",
      kk: "L298N-нің ENA кірісі мотордың қорегін қосып-өшіреді. Оған analogWrite-тан ШИМ берілсе, ол соншалықты жылдам ауысады, мотор жылдамдығының бір бөлігімен айналады: 0 — тоқтап тұр, 255 — толық жылдамдық. Бұл тек ШИМ бар, платада ~ белгісімен көрсетілген пиндерде жұмыс істейді: 3, 5, 6, 9, 10 және 11. Кез келген басқа пинде analogWrite 128-ден кіші мәндерге тек LOW, қалғандарына HIGH бере алады.",
      ru: "Вход ENA у L298N включает и выключает питание мотора. Если подать на него ШИМ из analogWrite, он переключается так быстро, что мотор работает на части своей скорости: 0 — стоит, 255 — полная скорость. Это работает только на пинах с ШИМ, отмеченных на плате знаком ~: 3, 5, 6, 9, 10 и 11. На любом другом пине analogWrite может выдать только LOW для значений меньше 128 и HIGH для остальных.",
    },
    goal: {
      en: "The motor spins slowly, at well under half speed.",
      kk: "Мотор баяу, жарты жылдамдықтан едәуір төмен айналады.",
      ru: "Мотор вращается медленно, заметно меньше чем на половине скорости.",
    },
    diagram: driverCircuit({ ena: "4" }),
    wiring: driverWiring({ ena: "4" }),
    code: driverSketch("4", "LOW", 100),
    symptom: {
      en: "The motor does not turn at all. With 200 in place of 100 it runs at full speed. No number gives a slow speed.",
      kk: "Мотор мүлдем айналмайды. 100-дің орнына 200 жазса, ол толық жылдамдықпен айналады. Ешбір сан баяу жылдамдық бермейді.",
      ru: "Мотор не вращается совсем. Если вместо 100 написать 200, он работает на полной скорости. Ни одно число не даёт медленного вращения.",
    },
    options: [
      {
        en: "IN1 and IN2 are swapped",
        kk: "IN1 мен IN2 орындары ауысып кеткен",
        ru: "IN1 и IN2 перепутаны",
      },
      {
        en: "ENA is on pin 4, which has no PWM, so analogWrite can only switch it fully off or fully on",
        kk: "ENA ШИМ жоқ 4-пинде тұр, сондықтан analogWrite оны тек толық өшіре немесе толық қоса алады",
        ru: "ENA стоит на пине 4, где нет ШИМ, и analogWrite может только полностью выключить его или полностью включить",
      },
      {
        en: "The L298N can change direction but not speed",
        kk: "L298N бағытты өзгерте алады, бірақ жылдамдықты өзгерте алмайды",
        ru: "L298N умеет менять направление, но не скорость",
      },
      {
        en: "The battery is too weak to turn the motor slowly",
        kk: "Батарея моторды баяу айналдыру үшін тым әлсіз",
        ru: "Батарея слишком слаба, чтобы вращать мотор медленно",
      },
    ],
    answer: 1,
    faultType: "limits",
    explanation: {
      en: "In the diagram ENA goes to pin 4, and pin 4 has no ~ mark. There analogWrite(enA, 100) simply gives LOW, so the driver is switched off, and 200 gives HIGH, which is full speed. Move the ENA wire to a PWM pin such as 9 and change enA to match. Swapped IN wires would only reverse the direction.",
      kk: "Сызбада ENA 4-пинге қосылған, ал 4-пинде ~ белгісі жоқ. Онда analogWrite(enA, 100) жай LOW береді, сондықтан драйвер өшірулі тұрады, ал 200 HIGH береді — бұл толық жылдамдық. ENA сымын ШИМ пиніне, мысалы 9-пинге ауыстырып, enA мәнін соған сәйкес өзгерт. IN сымдарының ауысуы тек бағытты кері өзгертер еді.",
      ru: "На схеме ENA идёт к пину 4, а у пина 4 нет знака ~. Там analogWrite(enA, 100) просто выдаёт LOW, и драйвер выключен, а 200 даёт HIGH — это полная скорость. Переставь провод ENA на пин с ШИМ, например 9, и поменяй enA в коде. Перепутанные провода IN только изменили бы направление.",
    },
  },
  {
    id: "driver-low-speed",
    lesson: "motors",
    title: {
      en: "The motor that only hums",
      kk: "Тек ызыңдайтын мотор",
      ru: "Мотор, который только гудит",
    },
    primer: {
      en: "A motor has to overcome its own friction before it moves, and a gearbox adds more. Below a certain PWM value the motor gets too little power to start: it hums and stands still. That lowest working value is different for every motor and battery, and it is found by experiment. It is usually somewhere between 60 and 120 out of 255.",
      kk: "Мотор қозғалмас бұрын өз үйкелісін жеңуі керек, ал редуктор оны одан сайын арттырады. ШИМ мәні белгілі бір шектен төмен болса, моторға қозғалуға қуат жетпейді: ол ызыңдап, орнында тұрады. Бұл ең төменгі жұмыс мәні әр мотор мен батарея үшін әртүрлі, оны тәжірибе арқылы табады. Әдетте ол 255-тен 60 пен 120 аралығында болады.",
      ru: "Прежде чем начать движение, мотору нужно преодолеть собственное трение, а редуктор его ещё добавляет. Ниже определённого значения ШИМ мотору не хватает мощности для старта: он гудит и стоит на месте. Это наименьшее рабочее значение у каждого мотора и батареи своё, и его находят опытом. Обычно оно лежит где-то между 60 и 120 из 255.",
    },
    goal: {
      en: "The motor spins slowly.",
      kk: "Мотор баяу айналады.",
      ru: "Мотор медленно вращается.",
    },
    diagram: driverCircuit(),
    wiring: driverWiring(),
    code: driverSketch("9", "LOW", 30),
    symptom: {
      en: "The motor hums quietly and does not turn. With 150 in place of 30 it spins confidently.",
      kk: "Мотор ақырын ызыңдайды, бірақ айналмайды. 30-дың орнына 150 жазса, ол сенімді айналады.",
      ru: "Мотор тихо гудит и не вращается. Если вместо 30 написать 150, он уверенно крутится.",
    },
    options: [
      {
        en: "30 out of 255 is too little power for the motor to overcome its friction",
        kk: "255-тен 30 — мотордың үйкелісті жеңуіне тым аз қуат",
        ru: "30 из 255 — слишком мало мощности, чтобы мотор преодолел трение",
      },
      oNoPwm9,
      {
        en: "IN1 and IN2 are both LOW",
        kk: "IN1 мен IN2 екеуі де LOW",
        ru: "IN1 и IN2 оба LOW",
      },
      {
        en: "The battery is connected the wrong way round",
        kk: "Батарея теріс қосылған",
        ru: "Батарея подключена наоборот",
      },
    ],
    answer: 0,
    faultType: "limits",
    explanation: {
      en: "The hum shows that current does reach the motor, so the wiring and the direction pins are right. analogWrite(enA, 30) switches the power on for only about 12% of the time, and that is not enough to get this motor moving. Raise the number step by step until the motor starts reliably, and treat that value as its minimum. To go slower than that, use a motor with a gearbox that turns more slowly.",
      kk: "Ызыңның өзі моторға ток жетіп тұрғанын көрсетеді, демек сызба да, бағыт пиндері де дұрыс. analogWrite(enA, 30) қоректі уақыттың шамамен 12%-ында ғана қосады, ал бұл осы моторды қозғалтуға жетпейді. Мотор сенімді қозғала бастағанша санды біртіндеп көтер және сол мәнді оның ең төменгі шегі деп есепте. Одан да баяу айналу үшін баяуырақ айналатын редукторлы мотор ал.",
      ru: "Гул показывает, что ток до мотора доходит, значит, схема и пины направления в порядке. analogWrite(enA, 30) включает питание лишь примерно на 12% времени, и этого не хватает, чтобы сдвинуть этот мотор с места. Поднимай число понемногу, пока мотор не станет надёжно запускаться, и считай это значение его минимумом. Чтобы ехать ещё медленнее, нужен мотор с более медленным редуктором.",
    },
  },
  {
    id: "driver-voltage-drop",
    lesson: "motors",
    title: {
      en: "Where did two volts go?",
      kk: "Екі вольт қайда кетті?",
      ru: "Куда делись два вольта?",
    },
    primer: {
      en: "No switch is perfect. The L298N is an old design, and about 2 V is lost inside it on the way from the battery to the motor, more at high current. That lost power turns into heat, which is why the board carries a heatsink. So the motor always gets less than the battery gives: from 6 V only about 4 V arrives.",
      kk: "Мінсіз қосқыш болмайды. L298N — ескі үлгідегі микросхема, батареядан моторға дейінгі жолда оның ішінде шамамен 2 В жоғалады, ток көп болса — одан да көп. Жоғалған қуат жылуға айналады, сондықтан платада радиатор тұр. Демек, мотор әрқашан батарея бергеннен аз алады: 6 В-тан шамамен 4 В қана жетеді.",
      ru: "Идеальных выключателей не бывает. L298N — старая конструкция, и на пути от батареи к мотору внутри неё теряется около 2 В, а при большом токе ещё больше. Потерянная мощность превращается в тепло, поэтому на плате стоит радиатор. Значит, мотор всегда получает меньше, чем даёт батарея: из 6 В до него доходит только около 4 В.",
    },
    goal: {
      en: "The 6 V motor runs at full power, as strongly as when it is connected straight to the battery.",
      kk: "6 В-тық мотор толық қуатпен, батареяға тікелей қосылғандағыдай қатты айналады.",
      ru: "Мотор на 6 В работает в полную силу, так же мощно, как при прямом подключении к батарее.",
    },
    diagram: driverCircuit({ cells: 4 }),
    wiring: driverWiring(),
    code: driverSketch("9", "LOW", 255),
    symptom: {
      en: "The motor spins, but clearly slower and weaker than straight from the same battery. The driver's heatsink gets warm.",
      kk: "Мотор айналады, бірақ дәл сол батареяға тікелей қосылғандағыдан анық баяу әрі әлсіз. Драйвердің радиаторы жылиды.",
      ru: "Мотор вращается, но заметно медленнее и слабее, чем от той же батареи напрямую. Радиатор драйвера нагревается.",
    },
    options: [
      {
        en: "255 is not the maximum; full speed is 1023",
        kk: "255 — ең жоғары мән емес; толық жылдамдық — 1023",
        ru: "255 — не максимум; полная скорость — это 1023",
      },
      {
        en: "IN2 must also be HIGH for full power",
        kk: "Толық қуат үшін IN2 де HIGH болуы керек",
        ru: "Для полной мощности IN2 тоже должен быть HIGH",
      },
      {
        en: "The Arduino pins are too weak to pass the motor's current",
        kk: "Arduino пиндері мотор тогын өткізу үшін тым әлсіз",
        ru: "Пины Arduino слишком слабы, чтобы пропустить ток мотора",
      },
      {
        en: "The L298N loses about 2 V inside itself, so only about 4 V reaches the motor",
        kk: "L298N өз ішінде шамамен 2 В жоғалтады, сондықтан моторға шамамен 4 В қана жетеді",
        ru: "L298N теряет внутри около 2 В, поэтому до мотора доходит только около 4 В",
      },
    ],
    answer: 3,
    faultType: "power",
    explanation: {
      en: "The code already asks for the maximum: analogWrite accepts 0 to 255. The loss is in the driver: out of the 6 V from four AA cells about 2 V stays in the L298N as heat, and the 6 V motor runs on roughly 4 V. Use a battery about 2 V above what the motor needs, such as six AA cells with a lower PWM value, or a modern driver like the TB6612FNG, which loses only a few tenths of a volt. The motor's current never passes through the Arduino pins.",
      kk: "Код онсыз да ең жоғары мәнді сұрап тұр: analogWrite 0-ден 255-ке дейінгі мәнді қабылдайды. Шығын драйверде: төрт AA элементінен келетін 6 В-тың шамамен 2 В-ы L298N-де жылу болып қалады да, 6 В-тық мотор шамамен 4 В-пен жұмыс істейді. Моторға керегінен шамамен 2 В жоғары батарея ал, мысалы алты AA элементін ШИМ мәнін төмендетіп қолдан, немесе вольттың оннан бірнеше бөлігін ғана жоғалтатын TB6612FNG сияқты заманауи драйвер ал. Мотордың тогы Arduino пиндері арқылы мүлдем өтпейді.",
      ru: "Код и так просит максимум: analogWrite принимает от 0 до 255. Потери — в драйвере: из 6 В от четырёх батареек AA около 2 В остаётся в L298N в виде тепла, и мотор на 6 В работает примерно от 4 В. Возьми батарею примерно на 2 В выше, чем нужно мотору, например шесть батареек AA с меньшим значением ШИМ, или современный драйвер вроде TB6612FNG, который теряет лишь несколько десятых вольта. Ток мотора через пины Arduino не идёт вообще.",
    },
  },
  {
    id: "driver-no-ground",
    lesson: "motors",
    title: {
      en: "Orders that never arrive",
      kk: "Жетпейтін бұйрықтар",
      ru: "Команды, которые не доходят",
    },
    primer: {
      en: "The Arduino tells the driver what to do with voltages on ENA, IN1 and IN2. A voltage is always measured against a zero level, and the driver measures against its own GND. If the Arduino's GND is not joined to the driver's GND, the two boards have no common zero, and the driver cannot tell HIGH from LOW. The battery minus, the driver GND and the Arduino GND must all be connected together.",
      kk: "Arduino драйверге не істеу керегін ENA, IN1 және IN2-дегі кернеулер арқылы айтады. Кернеу әрқашан нөлдік деңгейге қатысты өлшенеді, ал драйвер оны өз GND-сына қатысты өлшейді. Arduino-ның GND-сы драйвердің GND-сымен қосылмаса, екі платаның ортақ нөлі болмайды да, драйвер HIGH пен LOW-ды ажырата алмайды. Батареяның минусы, драйвердің GND-сы және Arduino-ның GND-сы — бәрі өзара қосылуы керек.",
      ru: "Arduino сообщает драйверу, что делать, напряжениями на ENA, IN1 и IN2. Напряжение всегда измеряется относительно нулевого уровня, и драйвер измеряет его относительно своего GND. Если GND Arduino не соединён с GND драйвера, у двух плат нет общего нуля, и драйвер не может отличить HIGH от LOW. Минус батареи, GND драйвера и GND Arduino должны быть соединены вместе.",
    },
    goal: driverGoal,
    diagram: driverCircuit({ ground: false }),
    wiring: driverWiring({ ground: false }),
    code: driverSketch("9", "LOW", 200),
    symptom: {
      en: "The power light on the driver is on, but the motor ignores the sketch: it stands still or twitches at random.",
      kk: "Драйвердегі қорек шамы жанып тұр, бірақ мотор скетчке бағынбайды: орнында тұрады немесе кездейсоқ жұлқынады.",
      ru: "Лампочка питания на драйвере горит, но мотор не слушается скетча: стоит на месте или дёргается как попало.",
    },
    options: [
      {
        en: "A 9 V battery is too much for the L298N",
        kk: "9 В батарея L298N үшін тым көп",
        ru: "Батарея 9 В — это слишком много для L298N",
      },
      {
        en: "ENA must be connected to 5V, not to a pin",
        kk: "ENA пинге емес, 5V-қа қосылуы керек",
        ru: "ENA нужно подключать к 5V, а не к пину",
      },
      {
        en: "The motor wires are swapped between OUT1 and OUT2",
        kk: "Мотор сымдары OUT1 мен OUT2 арасында ауысып кеткен",
        ru: "Провода мотора перепутаны между OUT1 и OUT2",
      },
      {
        en: "The Arduino GND is not joined to the driver's GND and the battery minus",
        kk: "Arduino-ның GND-сы драйвердің GND-сымен және батареяның минусымен қосылмаған",
        ru: "GND Arduino не соединён с GND драйвера и минусом батареи",
      },
    ],
    answer: 3,
    faultType: "wiring",
    explanation: {
      en: "In the diagram three signal wires run from the Arduino to the driver, but the Arduino's GND pin is left unconnected. The driver has power from the battery, hence the light, yet the signals have nothing to be measured against. Add one wire from an Arduino GND pin to the driver's GND terminal, where the battery minus already is. Swapped motor wires would only change the direction.",
      kk: "Сызбада Arduino-дан драйверге үш сигнал сымы барады, бірақ Arduino-ның GND пині қосылмай қалған. Драйвер қоректі батареядан алады — шамның жанатыны содан — бірақ сигналдарды салыстыратын деңгей жоқ. Arduino-ның GND пинінен драйвердің GND контактісіне бір сым қос, батареяның минусы онда қосулы тұр. Мотор сымдарының ауысуы тек бағытты өзгертер еді.",
      ru: "На схеме от Arduino к драйверу идут три сигнальных провода, но пин GND Arduino остался неподключённым. Питание от батареи у драйвера есть — отсюда лампочка, — но сигналы не от чего отсчитывать. Добавь один провод от пина GND Arduino к клемме GND драйвера, куда уже подключён минус батареи. Перепутанные провода мотора изменили бы только направление.",
    },
  },
  {
    id: "line-threshold",
    lesson: "line-sensor",
    title: {
      en: "The line it cannot see",
      kk: "Көрінбейтін сызық",
      ru: "Линия, которую не видно",
    },
    primer: {
      en: "A line sensor shines infrared light down and measures how much comes back. A white floor reflects a lot, black tape almost nothing. On this module the analog output AO gives a low number over a light surface and a high number over a dark one. The sketch tells them apart with a threshold, and the threshold must lie between the two numbers that this sensor really gives on this floor. They are measured first, not guessed.",
      kk: "Сызық датчигі төмен қарай инфрақызыл жарық түсіріп, оның қаншасы қайтып келетінін өлшейді. Ақ еден жарықты көп шағылыстырады, қара таспа шағылыстырмайды десе де болады. Бұл модульдің AO аналогтық шығысы ашық бетте кіші сан, қара бетте үлкен сан береді. Скетч оларды шек мәні арқылы ажыратады, ал шек осы датчик осы еденде шынымен беретін екі санның арасында жатуы керек. Оларды болжамайды, алдымен өлшейді.",
      ru: "Датчик линии светит вниз инфракрасным светом и измеряет, сколько его вернулось. Белый пол отражает много, чёрная лента — почти ничего. У этого модуля аналоговый выход AO даёт маленькое число над светлой поверхностью и большое над тёмной. Скетч различает их по порогу, и порог должен лежать между двумя числами, которые этот датчик действительно выдаёт на этом полу. Их сначала измеряют, а не угадывают.",
    },
    goal: lineGoal,
    diagram: sensorCircuit("TCRT5000", lineAnalog),
    wiring: sensorWiring("TCRT5000", lineAnalog),
    code: lineAnalogCode(900),
    symptom: {
      en: "The Serial Monitor always prints FLOOR. A test sketch that prints the raw number shows about 80 over the floor and about 600 over the tape.",
      kk: "Serial Monitor үнемі FLOOR деп шығарады. Бастапқы санды шығаратын сынақ скетчі еденнің үстінде шамамен 80, таспаның үстінде шамамен 600 көрсетеді.",
      ru: "Serial Monitor всегда печатает FLOOR. Тестовый скетч, который выводит сырое число, показывает около 80 над полом и около 600 над лентой.",
    },
    options: [
      {
        en: "The comparison should be < instead of >",
        kk: "Салыстыруда > орнына < тұруы керек",
        ru: "В сравнении вместо > должно стоять <",
      },
      {
        en: "The sensor is faulty, because its reading never reaches 1023",
        kk: "Датчик ақаулы, өйткені оның көрсеткіші ешқашан 1023-ке жетпейді",
        ru: "Датчик неисправен, потому что его показание никогда не доходит до 1023",
      },
      {
        en: "The threshold of 900 is above both readings; it must lie between them",
        kk: "900 деген шек екі көрсеткіштен де жоғары; ол екеуінің арасында жатуы керек",
        ru: "Порог 900 выше обоих показаний; он должен лежать между ними",
      },
      {
        en: "delay(200) is too long to catch the tape",
        kk: "delay(200) таспаны байқап үлгеру үшін тым ұзақ",
        ru: "delay(200) слишком длинная, чтобы заметить ленту",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The sensor works: 80 and 600 are far apart. But the code asks whether the value is above 900, and neither number ever is, so it always answers FLOOR. Put the threshold halfway between the two measurements: (80 + 600) ÷ 2 = 340. With < instead of > the sketch would print LINE everywhere.",
      kk: "Датчик жұмыс істеп тұр: 80 мен 600 бір-бірінен алшақ. Бірақ код мәннің 900-ден жоғары екенін сұрайды, ал екі санның ешқайсысы оған жетпейді, сондықтан жауап әрқашан FLOOR болады. Шекті екі өлшемнің ортасына қой: (80 + 600) ÷ 2 = 340. > орнына < тұрса, скетч барлық жерде LINE деп шығарар еді.",
      ru: "Датчик работает: 80 и 600 далеко друг от друга. Но код спрашивает, больше ли значение, чем 900, а ни одно из чисел до этого не доходит, поэтому ответ всегда FLOOR. Поставь порог посередине между двумя измерениями: (80 + 600) ÷ 2 = 340. Со знаком < вместо > скетч печатал бы LINE везде.",
    },
  },
  {
    id: "line-inverted",
    lesson: "line-sensor",
    title: {
      en: "Floor and line change places",
      kk: "Еден мен сызық орын ауыстырды",
      ru: "Пол и линия поменялись местами",
    },
    primer: {
      en: "The digital output DO of a line module answers only yes or no. A small comparator on the module compares the reflected light with a level set by a screw. On this module DO is LOW when light comes back, that is over the white floor, and HIGH when it does not, over the black tape. The small light on the module is on while DO is LOW. Other modules do it the other way round, so check before writing the condition.",
      kk: "Сызық модулінің DO цифрлық шығысы тек «иә» немесе «жоқ» деп жауап береді. Модульдегі кішкентай компаратор шағылысқан жарықты бұрандамен қойылған деңгеймен салыстырады. Бұл модульде жарық қайтып келгенде, яғни ақ еденнің үстінде DO LOW болады, ал қайтпағанда, яғни қара таспаның үстінде HIGH болады. Модульдегі кішкентай шам DO LOW кезінде жанып тұрады. Басқа модульдерде бұл керісінше болуы мүмкін, сондықтан шартты жазбас бұрын тексер.",
      ru: "Цифровой выход DO у модуля линии отвечает только «да» или «нет». Маленький компаратор на модуле сравнивает отражённый свет с уровнем, заданным винтом. У этого модуля DO равен LOW, когда свет возвращается, то есть над белым полом, и HIGH, когда не возвращается, над чёрной лентой. Маленькая лампочка на модуле горит, пока DO равен LOW. У других модулей бывает наоборот, поэтому проверь это до того, как писать условие.",
    },
    goal: lineGoal,
    diagram: sensorCircuit("TCRT5000", lineDigital, "2"),
    wiring: sensorWiring("TCRT5000", lineDigital, pin("2")),
    code: lineDigitalCode("LOW"),
    symptom: {
      en: "The words are the wrong way round: FLOOR over the black tape and LINE over the white floor.",
      kk: "Сөздер керісінше шығады: қара таспаның үстінде FLOOR, ақ еденнің үстінде LINE.",
      ru: "Слова выходят наоборот: FLOOR над чёрной лентой и LINE над белым полом.",
    },
    options: [
      {
        en: "The DO wire must go to an analog pin",
        kk: "DO сымы аналогтық пинге қосылуы керек",
        ru: "Провод DO нужно подключать к аналоговому пину",
      },
      {
        en: "The module gives LOW over the floor and HIGH over the tape, but the code treats LOW as the line",
        kk: "Модуль еденнің үстінде LOW, таспаның үстінде HIGH береді, ал код LOW-ды сызық деп қабылдайды",
        ru: "Модуль даёт LOW над полом и HIGH над лентой, а код считает линией LOW",
      },
      {
        en: "The sensor is mounted upside down",
        kk: "Датчик төңкеріліп орнатылған",
        ru: "Датчик установлен вверх ногами",
      },
      oBaud,
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The key idea says which level means what on this module: LOW is the reflecting floor, HIGH is the tape. The condition digitalRead(2) == LOW therefore catches the floor and calls it LINE. Change it to == HIGH. The wiring is right: DO is a digital signal and belongs on a digital pin.",
      kk: "Негізгі ойда бұл модульде қай деңгей нені білдіретіні айтылған: LOW — жарық шағылыстыратын еден, HIGH — таспа. Сондықтан digitalRead(2) == LOW шарты еденді ұстап, оны LINE деп атайды. Оны == HIGH деп өзгерт. Сызба дұрыс: DO — цифрлық сигнал, оның орны цифрлық пинде.",
      ru: "В ключевой идее сказано, какой уровень что означает у этого модуля: LOW — отражающий пол, HIGH — лента. Поэтому условие digitalRead(2) == LOW ловит пол и называет его LINE. Замени его на == HIGH. Схема верная: DO — цифровой сигнал, и его место на цифровом пине.",
    },
  },
  {
    id: "line-too-high",
    lesson: "line-sensor",
    title: {
      en: "Too far to see",
      kk: "Көру үшін тым алыс",
      ru: "Слишком далеко, чтобы видеть",
    },
    primer: {
      en: "The sensor's little infrared lamp is weak. The light spreads out, and only a small part returns to the receiver. The module is made to work 2 to 10 mm above the surface. Higher than that, hardly any light comes back from white or from black, and the two readings become almost the same.",
      kk: "Датчиктің кішкентай инфрақызыл шамы әлсіз. Жарық шашырап кетеді де, қабылдағышқа оның аз ғана бөлігі қайтады. Модуль беттен 2–10 мм биіктікте жұмыс істеуге арналған. Одан жоғары болса, ақтан да, қарадан да жарық қайтпайды десе де болады, екі көрсеткіш бірдей дерлік болып шығады.",
      ru: "Маленькая инфракрасная лампочка датчика слабая. Свет рассеивается, и к приёмнику возвращается только малая его часть. Модуль рассчитан на работу в 2–10 мм над поверхностью. Если поднять его выше, свет почти не возвращается ни от белого, ни от чёрного, и два показания становятся почти одинаковыми.",
    },
    goal: lineGoal,
    diagram: sensorCircuit("TCRT5000", lineAnalog),
    wiring: sensorWiring("TCRT5000", lineAnalog),
    code: lineAnalogCode(340),
    symptom: {
      en: "On the robot the sensor is fixed 4 cm above the floor. The raw number is about 930 over the floor and about 960 over the tape, and the sketch prints LINE everywhere.",
      kk: "Роботта датчик еденнен 4 см биіктікке бекітілген. Бастапқы сан еденнің үстінде шамамен 930, таспаның үстінде шамамен 960, ал скетч барлық жерде LINE деп шығарады.",
      ru: "На роботе датчик закреплён в 4 см над полом. Сырое число около 930 над полом и около 960 над лентой, и скетч везде печатает LINE.",
    },
    options: [
      {
        en: "The sensor is too far from the floor: it must be 2–10 mm above it",
        kk: "Датчик еденнен тым алыс: ол еденнен 2–10 мм биіктікте тұруы керек",
        ru: "Датчик слишком далеко от пола: он должен быть в 2–10 мм над ним",
      },
      {
        en: "The threshold must be raised to 1000",
        kk: "Шекті 1000-ға дейін көтеру керек",
        ru: "Порог нужно поднять до 1000",
      },
      {
        en: "The tape is too narrow for this sensor",
        kk: "Таспа бұл датчик үшін тым жіңішке",
        ru: "Лента слишком узкая для этого датчика",
      },
      {
        en: "The sensor must be powered from 3.3V",
        kk: "Датчик 3.3V-тан қоректенуі керек",
        ru: "Датчик нужно питать от 3.3V",
      },
    ],
    answer: 0,
    faultType: "limits",
    explanation: {
      en: "Both numbers are high and only 30 apart: from 4 cm almost no light returns, whatever is below. No threshold can separate them reliably, because the readings wobble by more than that. Lower the sensor to a few millimetres above the floor; the readings move apart again, to something like 80 and 600, and the threshold of 340 works.",
      kk: "Екі сан да үлкен және араларындағы айырмашылық небәрі 30: 4 см-ден астында не тұрса да жарық қайтпайды десе де болады. Оларды ешбір шек сенімді ажырата алмайды, өйткені көрсеткіштердің өзі одан көбірек ауытқиды. Датчикті еденнен бірнеше миллиметр биіктікке түсір; көрсеткіштер қайтадан алшақтап, шамамен 80 мен 600 болады, сонда 340 деген шек жұмыс істейді.",
      ru: "Оба числа большие и различаются всего на 30: с 4 см свет почти не возвращается, что бы ни было внизу. Никакой порог не разделит их надёжно, потому что сами показания колеблются сильнее. Опусти датчик на несколько миллиметров над полом; показания снова разойдутся, примерно до 80 и 600, и порог 340 заработает.",
    },
  },
  {
    id: "line-trimmer",
    lesson: "line-sensor",
    title: {
      en: "The light that never goes out",
      kk: "Сөнбейтін шам",
      ru: "Лампочка, которая не гаснет",
    },
    primer: {
      en: "The digital output DO compares the reflected light with a level, and that level is set on the module itself, by a small screw called a trimmer. If it is set too far one way, the module answers the same over white and over black. It is adjusted with a screwdriver: turn it until the module's small light is on over the floor and off over the tape.",
      kk: "DO цифрлық шығысы шағылысқан жарықты белгілі бір деңгеймен салыстырады, ал ол деңгей модульдің өзінде, триммер деп аталатын кішкентай бұрандамен қойылады. Ол бір жаққа тым қатты бұралып қалса, модуль ақтың да, қараның да үстінде бірдей жауап береді. Оны бұрауышпен реттейді: модульдің кішкентай шамы еденнің үстінде жанып, таспаның үстінде сөнетін болғанша бұра.",
      ru: "Цифровой выход DO сравнивает отражённый свет с уровнем, а этот уровень задаётся на самом модуле маленьким винтом — подстроечным резистором. Если он выкручен слишком далеко в одну сторону, модуль отвечает одинаково и над белым, и над чёрным. Его настраивают отвёрткой: крути, пока лампочка модуля не станет гореть над полом и гаснуть над лентой.",
    },
    goal: lineGoal,
    diagram: sensorCircuit("TCRT5000", lineDigital, "2"),
    wiring: sensorWiring("TCRT5000", lineDigital, pin("2")),
    code: lineDigitalCode("HIGH"),
    symptom: {
      en: "The Serial Monitor prints FLOOR everywhere, and the small light on the module stays on over the floor and over the tape alike. The analog output AO, checked separately, changes as it should.",
      kk: "Serial Monitor барлық жерде FLOOR деп шығарады, ал модульдегі кішкентай шам еденнің үстінде де, таспаның үстінде де жанып тұрады. Бөлек тексерілген AO аналогтық шығысы тиісінше өзгереді.",
      ru: "Serial Monitor везде печатает FLOOR, а лампочка на модуле горит и над полом, и над лентой. Аналоговый выход AO, проверенный отдельно, меняется как положено.",
    },
    options: [
      {
        en: "The code should test for LOW instead of HIGH",
        kk: "Код HIGH орнына LOW мәнін тексеруі керек",
        ru: "Код должен проверять LOW вместо HIGH",
      },
      {
        en: "DO can only be read with analogRead",
        kk: "DO-ны тек analogRead арқылы оқуға болады",
        ru: "DO можно читать только через analogRead",
      },
      {
        en: "The sensor's infrared lamp has burnt out",
        kk: "Датчиктің инфрақызыл шамы күйіп кеткен",
        ru: "Инфракрасная лампочка датчика сгорела",
      },
      {
        en: "The level on the module itself is set wrong: the trimmer screw needs adjusting",
        kk: "Модульдің өзіндегі деңгей бұрыс қойылған: триммер бұрандасын реттеу керек",
        ru: "Уровень на самом модуле задан неверно: нужно подстроить винт",
      },
    ],
    answer: 3,
    faultType: "component",
    explanation: {
      en: "The light on the module shows DO directly, before any code: it stays on, so DO stays LOW, and the sketch correctly reports FLOOR. The analog output changes, so the lamp and the receiver work. What is wrong is the comparison level on the module. Turn the trimmer slowly until the light goes off over the tape and comes on over the floor. Testing for LOW would only make the sketch print LINE everywhere.",
      kk: "Модульдегі шам DO-ны кодқа дейін тікелей көрсетеді: ол жанып тұр, демек DO LOW күйінде қалады, ал скетч дұрыс FLOOR деп хабарлайды. Аналогтық шығыс өзгереді, демек шам да, қабылдағыш та жұмыс істейді. Бұрыс тұрғаны — модульдегі салыстыру деңгейі. Шам таспаның үстінде сөніп, еденнің үстінде жанатын болғанша триммерді баяу бұра. LOW мәнін тексеру скетчке тек барлық жерде LINE шығартар еді.",
      ru: "Лампочка на модуле показывает DO напрямую, ещё до кода: она горит, значит, DO остаётся LOW, и скетч честно сообщает FLOOR. Аналоговый выход меняется, значит, лампа и приёмник исправны. Неверно задан уровень сравнения на модуле. Медленно крути винт, пока лампочка не начнёт гаснуть над лентой и загораться над полом. Проверка на LOW лишь заставила бы скетч везде печатать LINE.",
    },
  },
  {
    id: "line-sides-swapped",
    lesson: "line-sensor",
    title: {
      en: "The robot that runs from the line",
      kk: "Сызықтан қашатын робот",
      ru: "Робот, который убегает от линии",
    },
    primer: {
      en: "A line-following robot carries two sensors, one on each side of the tape. If the left one sees the line, the robot must steer left; if the right one, right. That only works if “left” in the code is the sensor that is physically on the left. Each sensor's output goes to its own pin, and the code must read the same pins in the same order.",
      kk: "Сызықпен жүретін роботта таспаның екі жағында бір-бірден екі датчик болады. Сызықты сол жақтағысы көрсе, робот солға бұрылуы керек; оң жақтағысы көрсе — оңға. Бұл тек кодтағы «сол» шынымен сол жақта тұрған датчик болғанда ғана жұмыс істейді. Әр датчиктің шығысы өз пиніне барады, ал код сол пиндерді сол ретпен оқуы керек.",
      ru: "У робота, который едет по линии, два датчика — по одному с каждой стороны ленты. Если линию видит левый, робот должен повернуть влево; если правый — вправо. Это работает, только если «левый» в коде — это датчик, который физически стоит слева. Выход каждого датчика идёт на свой пин, и код должен читать те же пины в том же порядке.",
    },
    goal: {
      en: "The Serial Monitor says on which side the black tape is: under the left sensor or under the right one.",
      kk: "Serial Monitor қара таспаның қай жақта екенін айтады: сол жақ датчиктің астында ма, оң жақ датчиктің астында ма.",
      ru: "Serial Monitor сообщает, с какой стороны чёрная лента: под левым датчиком или под правым.",
    },
    diagram: {
      pins: ["5V", "A0", "A1", "GND"],
      parts: [
        {
          id: "mod",
          kind: "chip",
          title: { en: "Line module", kk: "Сызық модулі", ru: "Модуль линии" },
          x: 330,
          y: 102,
          left: ["VCC", "L", "R", "GND"],
        },
      ],
      wires: [
        ["uno.5V", "5V"],
        ["mod.VCC", "5V"],
        ["uno.A0", "mod.L"],
        ["uno.A1", "mod.R"],
        ["mod.GND", "GND"],
        ["uno.GND", "GND"],
      ],
    },
    wiring: [
      { from: { en: "Module VCC", kk: "Модуль VCC", ru: "Модуль VCC" }, to: same("5V") },
      {
        from: {
          en: "Module L (left sensor)",
          kk: "Модуль L (сол жақ датчик)",
          ru: "Модуль L (левый датчик)",
        },
        to: same("A0"),
      },
      {
        from: {
          en: "Module R (right sensor)",
          kk: "Модуль R (оң жақ датчик)",
          ru: "Модуль R (правый датчик)",
        },
        to: same("A1"),
      },
      { from: { en: "Module GND", kk: "Модуль GND", ru: "Модуль GND" }, to: same("GND") },
    ],
    code: `const int leftPin = A1;
const int rightPin = A0;
const int threshold = 340;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int left = analogRead(leftPin);
  int right = analogRead(rightPin);
  if (left > threshold) {
    Serial.println("LINE ON THE LEFT");
  } else if (right > threshold) {
    Serial.println("LINE ON THE RIGHT");
  } else {
    Serial.println("NO LINE");
  }
  delay(200);
}`,
    symptom: {
      en: "The sides are mixed up: with the tape under the left sensor it prints LINE ON THE RIGHT, and the other way round. A robot steering by this would turn away from the line.",
      kk: "Жақтар шатасып кеткен: таспа сол жақ датчиктің астында тұрғанда LINE ON THE RIGHT деп шығады, және керісінше. Осыған сүйеніп бұрылатын робот сызықтан алыстап кетер еді.",
      ru: "Стороны перепутаны: когда лента под левым датчиком, печатается LINE ON THE RIGHT, и наоборот. Робот, который рулит по этим данным, уезжал бы от линии.",
    },
    options: [
      {
        en: "The threshold of 340 is too low",
        kk: "340 деген шек тым төмен",
        ru: "Порог 340 слишком низкий",
      },
      {
        en: "Both comparisons should use < instead of >",
        kk: "Екі салыстыруда да > орнына < тұруы керек",
        ru: "В обоих сравнениях вместо > должно стоять <",
      },
      {
        en: "Left and right are swapped between the wiring and the code",
        kk: "Сызба мен кодта сол мен оң орындары ауысып кеткен",
        ru: "Левый и правый перепутаны между схемой и кодом",
      },
      {
        en: "Two sensors cannot share one 5V pin",
        kk: "Екі датчик бір 5V пинін бөлісе алмайды",
        ru: "Два датчика не могут делить один пин 5V",
      },
    ],
    answer: 2,
    faultType: "wiring",
    explanation: {
      en: "In the diagram output L goes to A0 and output R to A1. The code says leftPin = A1 and rightPin = A0, so it reads the right sensor and calls it left. Each sensor does see the tape; only the names are crossed. Swap the two pin names in the code, or the two wires.",
      kk: "Сызбада L шығысы A0-ге, R шығысы A1-ге барады. Кодта leftPin = A1 және rightPin = A0 деп жазылған, сондықтан ол оң жақ датчикті оқып, оны сол жақ деп атайды. Әр датчик таспаны көріп тұр; тек атаулары шатасқан. Кодтағы екі пин атауын немесе екі сымды ауыстыр.",
      ru: "На схеме выход L идёт на A0, а выход R — на A1. В коде написано leftPin = A1 и rightPin = A0, поэтому он читает правый датчик и называет его левым. Каждый датчик ленту видит; перепутаны только названия. Поменяй местами два названия пинов в коде или два провода.",
    },
  },
  {
    id: "loop-from-one",
    lesson: "arrays-loops",
    title: {
      en: "The LED that was skipped",
      kk: "Аттап кеткен жарықдиод",
      ru: "Светодиод, который пропустили",
    },
    primer: {
      en: "An array is a row of numbered boxes under one name. int pins[3] = {8, 9, 10} makes three boxes: pins[0] is 8, pins[1] is 9, pins[2] is 10. The numbering starts from 0, not from 1, so the last box of an array of three is number 2. A for loop walks through them: for (int i = 0; i < 3; i++) gives i the values 0, 1 and 2.",
      kk: "Массив — бір атпен аталатын, нөмірленген ұяшықтар қатары. int pins[3] = {8, 9, 10} үш ұяшық жасайды: pins[0] — 8, pins[1] — 9, pins[2] — 10. Нөмірлеу 1-ден емес, 0-ден басталады, сондықтан үш элементті массивтің соңғы ұяшығының нөмірі — 2. for циклі оларды аралап шығады: for (int i = 0; i < 3; i++) i-ге 0, 1 және 2 мәндерін береді.",
      ru: "Массив — это ряд пронумерованных ячеек под одним именем. int pins[3] = {8, 9, 10} создаёт три ячейки: pins[0] — это 8, pins[1] — это 9, pins[2] — это 10. Нумерация начинается с 0, а не с 1, поэтому последняя ячейка массива из трёх имеет номер 2. Цикл for проходит по ним: for (int i = 0; i < 3; i++) даёт i значения 0, 1 и 2.",
    },
    goal: {
      en: "All three LEDs light up.",
      kk: "Үш жарықдиодтың бәрі жанады.",
      ru: "Загораются все три светодиода.",
    },
    diagram: threeLedCircuit,
    wiring: threeLedWiring,
    code: `int pins[3] = {8, 9, 10};

void setup() {
  for (int i = 1; i < 3; i++) {
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], HIGH);
  }
}

void loop() {
}`,
    symptom: {
      en: "The LEDs on pins 9 and 10 light up. The first one, on pin 8, stays dark.",
      kk: "9 және 10-пиндердегі жарықдиодтар жанады. Біріншісі, 8-пиндегісі, жанбайды.",
      ru: "Светодиоды на пинах 9 и 10 загораются. Первый, на пине 8, не горит.",
    },
    options: [
      {
        en: "The array needs size 4 to hold three pins",
        kk: "Үш пинді сақтау үшін массивтің өлшемі 4 болуы керек",
        ru: "Чтобы хранить три пина, массиву нужен размер 4",
      },
      {
        en: "The loop starts from 1, but the first element of an array is number 0",
        kk: "Цикл 1-ден басталады, ал массивтің бірінші элементінің нөмірі — 0",
        ru: "Цикл начинается с 1, а первый элемент массива имеет номер 0",
      },
      {
        en: "i < 3 should be i <= 3",
        kk: "i < 3 орнына i <= 3 болуы керек",
        ru: "Вместо i < 3 должно быть i <= 3",
      },
      {
        en: "The first LED is plugged in backwards",
        kk: "Бірінші жарықдиод теріс қосылған",
        ru: "Первый светодиод вставлен наоборот",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The loop gives i the values 1 and 2, so it sets up and lights pins[1] and pins[2], which are pins 9 and 10. pins[0], pin 8, is never touched. Start the loop from 0: for (int i = 0; i < 3; i++). With i <= 3 the loop would also reach pins[3], which does not exist.",
      kk: "Цикл i-ге 1 және 2 мәндерін береді, сондықтан ол pins[1] мен pins[2]-ні, яғни 9 және 10-пиндерді баптап, жағады. pins[0], яғни 8-пин, мүлдем қозғалмайды. Циклді 0-ден баста: for (int i = 0; i < 3; i++). i <= 3 болса, цикл жоқ pins[3] элементіне де жетер еді.",
      ru: "Цикл даёт i значения 1 и 2, поэтому он настраивает и зажигает pins[1] и pins[2], то есть пины 9 и 10. До pins[0], пина 8, дело не доходит. Начни цикл с 0: for (int i = 0; i < 3; i++). С условием i <= 3 цикл дошёл бы ещё и до pins[3], которого не существует.",
    },
  },
  {
    id: "array-out-of-bounds",
    lesson: "arrays-loops",
    title: {
      en: "The fourth of three",
      kk: "Үшеудің төртіншісі",
      ru: "Четвёртый из трёх",
    },
    primer: {
      en: "An array of three has elements 0, 1 and 2. The board does not check the number in the brackets. Ask for element 3 and there is no error: it simply reads the piece of memory that comes after the array, whatever happens to be stored there. The usual cause is a loop condition written with <= where < was meant.",
      kk: "Үш элементті массивте 0, 1 және 2 нөмірлі элементтер бар. Плата жақшадағы нөмірді тексермейді. 3-элементті сұрасаң, қате шықпайды: ол жай массивтен кейін тұрған жад бөлігін, онда не сақталса, соны оқиды. Әдеттегі себебі — цикл шартында < орнына <= жазылуы.",
      ru: "В массиве из трёх есть элементы 0, 1 и 2. Плата не проверяет номер в скобках. Попроси элемент 3 — ошибки не будет: она просто прочитает кусок памяти, который идёт после массива, что бы там ни лежало. Обычная причина — условие цикла, записанное через <= там, где имелось в виду <.",
    },
    goal: {
      en: "The LED steps through three brightness levels, 10, 80 and 255, one second each, and the Serial Monitor prints each level.",
      kk: "Жарықдиод үш жарықтық деңгейін — 10, 80 және 255 — бір секундтан кезекпен көрсетеді, ал Serial Monitor әр деңгейді шығарады.",
      ru: "Светодиод по очереди показывает три уровня яркости — 10, 80 и 255, по секунде каждый, а Serial Monitor печатает каждый уровень.",
    },
    diagram: ledCircuit("9"),
    wiring: ledWiring("9"),
    code: `int levels[3] = {10, 80, 255};

void setup() {
  Serial.begin(9600);
  pinMode(9, OUTPUT);
}

void loop() {
  for (int i = 0; i <= 3; i++) {
    analogWrite(9, levels[i]);
    Serial.println(levels[i]);
    delay(1000);
  }
}`,
    symptom: {
      en: "After 10, 80 and 255 the Serial Monitor prints a fourth number that is not in the list at all, and the LED shows a fourth, unexpected brightness.",
      kk: "10, 80 және 255-тен кейін Serial Monitor тізімде мүлдем жоқ төртінші санды шығарады, ал жарықдиод төртінші, күтпеген жарықтықты көрсетеді.",
      ru: "После 10, 80 и 255 Serial Monitor печатает четвёртое число, которого в списке вообще нет, а светодиод показывает четвёртую, неожиданную яркость.",
    },
    options: [
      {
        en: "i <= 3 makes four passes, and levels[3] is outside the array",
        kk: "i <= 3 төрт айналым жасайды, ал levels[3] массивтен тыс жатыр",
        ru: "i <= 3 даёт четыре прохода, а levels[3] лежит за пределами массива",
      },
      {
        en: "The array must be declared inside loop()",
        kk: "Массив loop() ішінде жариялануы керек",
        ru: "Массив нужно объявлять внутри loop()",
      },
      {
        en: "Serial.println changes the numbers in the array",
        kk: "Serial.println массивтегі сандарды өзгертеді",
        ru: "Serial.println меняет числа в массиве",
      },
      {
        en: "analogWrite cannot take its value from an array",
        kk: "analogWrite мәнді массивтен ала алмайды",
        ru: "analogWrite не может брать значение из массива",
      },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "The condition i <= 3 lets i be 0, 1, 2 and 3: four passes for three elements. On the last pass the sketch reads levels[3], memory that belongs to something else, and uses that stray number as a brightness. Write i < 3. A good habit: the number in the condition is the same as the size of the array, and the sign is <.",
      kk: "i <= 3 шарты i-ге 0, 1, 2 және 3 мәндерін қабылдауға мүмкіндік береді: үш элементке төрт айналым. Соңғы айналымда скетч levels[3]-ті — басқа нәрсеге тиесілі жадты — оқып, сол кездейсоқ санды жарықтық ретінде қолданады. i < 3 деп жаз. Жақсы әдет: шарттағы сан массивтің өлшемімен бірдей, ал белгі — <.",
      ru: "Условие i <= 3 разрешает i быть 0, 1, 2 и 3: четыре прохода на три элемента. На последнем проходе скетч читает levels[3] — память, которая принадлежит чему-то другому, — и использует это случайное число как яркость. Напиши i < 3. Хорошая привычка: число в условии совпадает с размером массива, а знак — <.",
    },
  },
  {
    id: "while-no-increment",
    lesson: "arrays-loops",
    title: {
      en: "Stuck on the first step",
      kk: "Бірінші қадамда тұрып қалды",
      ru: "Застрял на первом шаге",
    },
    primer: {
      en: "A while loop repeats its body for as long as its condition is true. Something inside the body must therefore change what the condition tests, or it stays true forever and the sketch never leaves the loop. A for loop keeps that step in its first line (i++); in a while loop you must write it yourself.",
      kk: "while циклі шарты ақиқат болып тұрғанша денесін қайталай береді. Сондықтан дененің ішіндегі бір нәрсе шарт тексеретін мәнді өзгертуі керек, әйтпесе шарт мәңгі ақиқат болып қалады да, скетч циклден ешқашан шықпайды. for циклі бұл қадамды бірінші жолында (i++) сақтайды; while циклінде оны өзің жазуың керек.",
      ru: "Цикл while повторяет своё тело, пока его условие истинно. Значит, что-то внутри тела должно менять то, что проверяет условие, иначе оно останется истинным навсегда и скетч никогда не выйдет из цикла. Цикл for держит этот шаг в первой строке (i++); в цикле while его нужно написать самому.",
    },
    goal: {
      en: "A running light: the LEDs on pins 8, 9 and 10 flash one after another, over and over.",
      kk: "Жүгірме от: 8, 9 және 10-пиндердегі жарықдиодтар бірінен соң бірі жанып-сөнеді, осылай қайталана береді.",
      ru: "Бегущий огонь: светодиоды на пинах 8, 9 и 10 вспыхивают один за другим, снова и снова.",
    },
    diagram: threeLedCircuit,
    wiring: threeLedWiring,
    code: `${threePinSetup}
void loop() {
  int i = 0;
  while (i < 3) {
    digitalWrite(pins[i], HIGH);
    delay(300);
    digitalWrite(pins[i], LOW);
  }
}`,
    symptom: {
      en: "The LED on pin 8 is on all the time. The other two never light.",
      kk: "8-пиндегі жарықдиод үнемі жанып тұрады. Қалған екеуі мүлдем жанбайды.",
      ru: "Светодиод на пине 8 горит постоянно. Два других не загораются вообще.",
    },
    options: [
      {
        en: "while cannot be used with arrays",
        kk: "while циклін массивтермен қолдануға болмайды",
        ru: "while нельзя использовать с массивами",
      },
      {
        en: "delay(300) is too short for the next LED to start",
        kk: "delay(300) келесі жарықдиод жанып үлгеруі үшін тым қысқа",
        ru: "delay(300) слишком короткая, следующий светодиод не успевает включиться",
      },
      {
        en: "int i = 0 must be placed outside loop()",
        kk: "int i = 0 жолы loop()-тан тыс тұруы керек",
        ru: "Строка int i = 0 должна стоять вне loop()",
      },
      {
        en: "Nothing in the while loop changes i, so it never moves past the first LED",
        kk: "while циклінде i-ді ештеңе өзгертпейді, сондықтан ол бірінші жарықдиодтан әрі өтпейді",
        ru: "В цикле while ничто не меняет i, поэтому он не идёт дальше первого светодиода",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "i is 0 and stays 0: the body switches pins[0] on, waits, switches it off, and the condition i < 3 is still true. So pin 8 is switched off and on again within an instant, which the eye sees as always on, and the sketch never reaches pins 9 and 10. Add i++ as the last line of the body.",
      kk: "i 0-ге тең және сол күйінде қалады: дене pins[0]-ді қосады, күтеді, өшіреді, ал i < 3 шарты әлі де ақиқат. Сондықтан 8-пин өшіп, сол сәтте қайта қосылады — көзге ол үнемі жанып тұрғандай көрінеді — ал скетч 9 және 10-пиндерге ешқашан жетпейді. Дененің соңғы жолы ретінде i++ қос.",
      ru: "i равно 0 и так и остаётся 0: тело включает pins[0], ждёт, выключает, а условие i < 3 по-прежнему истинно. Поэтому пин 8 выключается и тут же включается снова — глаз видит его горящим постоянно, — а до пинов 9 и 10 скетч не доходит никогда. Добавь i++ последней строкой тела.",
    },
  },
  {
    id: "array-byte-overflow",
    lesson: "arrays-loops",
    title: {
      en: "Notes that did not fit",
      kk: "Сыймай қалған ноталар",
      ru: "Ноты, которые не поместились",
    },
    primer: {
      en: "Every element of an array has the type written in front of it. A byte holds whole numbers from 0 to 255 and takes one cell of memory; an int holds −32 768 to 32 767 and takes two. A number that is too big for its type is not rejected: it is cut down, and for a byte that means 256 is taken away until it fits.",
      kk: "Массивтің әр элементінің түрі массивтің алдында жазылған түрмен бірдей. byte 0-ден 255-ке дейінгі бүтін сандарды сақтайды және жадтың бір ұяшығын алады; int −32 768-ден 32 767-ге дейін сақтайды және екі ұяшық алады. Өз түріне сыймайтын сан қабылданбай қалмайды: ол қысқартылады, ал byte үшін бұл сан сыйғанша одан 256 алынып тасталады дегенді білдіреді.",
      ru: "У каждого элемента массива тот тип, который написан перед массивом. byte хранит целые числа от 0 до 255 и занимает одну ячейку памяти; int хранит от −32 768 до 32 767 и занимает две. Число, которое слишком велико для своего типа, не отклоняется: оно обрезается, и для byte это значит, что из него вычитается 256, пока оно не поместится.",
    },
    goal: {
      en: "The buzzer plays do, re, mi (262, 294 and 330 Hz), then is silent for two seconds.",
      kk: "Пьезодинамик до, ре, ми ноталарын (262, 294 және 330 Гц) ойнайды, сосын екі секунд үнсіз тұрады.",
      ru: "Пьезодинамик играет до, ре, ми (262, 294 и 330 Гц), затем две секунды молчит.",
    },
    diagram: buzzerCircuit,
    wiring: buzzerWiring,
    code: `byte notes[3];

void setup() {
  notes[0] = 262;
  notes[1] = 294;
  notes[2] = 330;
}

void loop() {
  for (int i = 0; i < 3; i++) {
    tone(8, notes[i], 300);
    delay(350);
  }
  delay(2000);
}`,
    symptom: {
      en: "Instead of the three notes the buzzer makes wrong sounds, mostly a low rattle.",
      kk: "Үш нотаның орнына пьезодинамик бұрыс дыбыстар шығарады, көбіне төмен дырылдаған үн.",
      ru: "Вместо трёх нот пьезодинамик издаёт неправильные звуки, в основном низкий треск.",
    },
    options: [
      {
        en: "tone() cannot take its frequency from an array",
        kk: "tone() жиілікті массивтен ала алмайды",
        ru: "tone() не может брать частоту из массива",
      },
      {
        en: "delay(350) is shorter than the notes need",
        kk: "delay(350) ноталарға керегінен қысқа",
        ru: "delay(350) короче, чем нужно нотам",
      },
      {
        en: "The array is of type byte, which holds only 0–255, so the three frequencies are cut down",
        kk: "Массивтің түрі — byte, ол тек 0–255 сақтайды, сондықтан үш жиілік қысқартылады",
        ru: "Массив имеет тип byte, который хранит только 0–255, поэтому три частоты обрезаются",
      },
      {
        en: "The array must be filled inside loop(), not in setup()",
        kk: "Массивті setup() ішінде емес, loop() ішінде толтыру керек",
        ru: "Массив нужно заполнять внутри loop(), а не в setup()",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "262, 294 and 330 are all above 255. Stored in a byte they become 262 − 256 = 6, 294 − 256 = 38 and 330 − 256 = 74, and tone() receives those numbers instead of the notes. Declare the array as int notes[3]. Choose byte only when every value is sure to stay within 0–255.",
      kk: "262, 294 және 330 — бәрі 255-тен үлкен. byte ішінде сақталғанда олар 262 − 256 = 6, 294 − 256 = 38 және 330 − 256 = 74 болып шығады, сөйтіп tone() ноталардың орнына осы сандарды алады. Массивті int notes[3] деп жарияла. byte түрін тек әр мән 0–255 аралығында қалатынына сенімді болғанда ғана таңда.",
      ru: "262, 294 и 330 больше 255. В byte они превращаются в 262 − 256 = 6, 294 − 256 = 38 и 330 − 256 = 74, и tone() получает эти числа вместо нот. Объяви массив как int notes[3]. Выбирай byte, только когда каждое значение наверняка останется в пределах 0–255.",
    },
  },
  {
    id: "loop-delay-outside",
    lesson: "arrays-loops",
    title: {
      en: "All at once",
      kk: "Бәрі бір мезетте",
      ru: "Все разом",
    },
    primer: {
      en: "A loop repeats only what stands between its curly braces. A line after the closing brace runs once, when the loop has finished. So a pause that should happen on every pass must be inside the braces. Three passes without a pause take a few millionths of a second: to the eye they are one moment.",
      kk: "Цикл тек өзінің жүйелі жақшаларының арасында тұрғанды ғана қайталайды. Жабатын жақшадан кейінгі жол цикл аяқталған соң бір рет орындалады. Сондықтан әр айналымда болуы тиіс кідіріс жақшалардың ішінде тұруы керек. Кідіріссіз үш айналым секундтың миллионнан бірнеше бөлігін ғана алады: көзге бұл — бір сәт.",
      ru: "Цикл повторяет только то, что стоит между его фигурными скобками. Строка после закрывающей скобки выполняется один раз, когда цикл уже закончился. Поэтому пауза, которая нужна на каждом проходе, должна быть внутри скобок. Три прохода без паузы занимают несколько миллионных долей секунды: для глаза это одно мгновение.",
    },
    goal: {
      en: "The three LEDs come on one after another, half a second apart, then all go out together.",
      kk: "Үш жарықдиод жарты секунд аралықпен бірінен соң бірі жанады, сосын бәрі бірге сөнеді.",
      ru: "Три светодиода загораются один за другим с интервалом в полсекунды, затем все вместе гаснут.",
    },
    diagram: threeLedCircuit,
    wiring: threeLedWiring,
    code: `${threePinSetup}
void loop() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(pins[i], HIGH);
  }
  delay(500);
  for (int i = 0; i < 3; i++) {
    digitalWrite(pins[i], LOW);
  }
  delay(500);
}`,
    symptom: {
      en: "All three LEDs come on at the same instant and go out at the same instant.",
      kk: "Үш жарықдиод та бір мезетте жанып, бір мезетте сөнеді.",
      ru: "Все три светодиода загораются в один и тот же миг и в один миг гаснут.",
    },
    options: [
      {
        en: "delay(500) stands after the loop's closing brace, so there is no pause between the LEDs",
        kk: "delay(500) циклдің жабатын жақшасынан кейін тұр, сондықтан жарықдиодтар арасында кідіріс жоқ",
        ru: "delay(500) стоит после закрывающей скобки цикла, поэтому между светодиодами нет паузы",
      },
      {
        en: "One loop cannot switch three LEDs",
        kk: "Бір цикл үш жарықдиодты қоса алмайды",
        ru: "Один цикл не может переключать три светодиода",
      },
      {
        en: "i must start from 1 for the pauses to work",
        kk: "Кідірістер жұмыс істеуі үшін i 1-ден басталуы керек",
        ru: "Чтобы паузы работали, i должно начинаться с 1",
      },
      {
        en: "The three resistors make the LEDs light at the same time",
        kk: "Үш резистор жарықдиодтарды бір уақытта жандырады",
        ru: "Три резистора заставляют светодиоды загораться одновременно",
      },
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "Look at the braces of the first loop: its body is only digitalWrite(pins[i], HIGH). The three LEDs are switched on within an instant, and only then does delay(500) run, once. Move the delay inside the loop, right after the digitalWrite, and each LED will wait half a second before the next.",
      kk: "Бірінші циклдің жақшаларына қара: оның денесі — тек digitalWrite(pins[i], HIGH). Үш жарықдиод бір сәтте қосылады, содан кейін ғана delay(500) бір рет орындалады. delay-ді циклдің ішіне, digitalWrite-тан кейін бірден қой, сонда әр жарықдиод келесісінің алдында жарты секунд күтеді.",
      ru: "Посмотри на скобки первого цикла: его тело — только digitalWrite(pins[i], HIGH). Три светодиода включаются за одно мгновение, и только потом один раз выполняется delay(500). Перенеси delay внутрь цикла, сразу после digitalWrite, и каждый светодиод будет ждать полсекунды перед следующим.",
    },
  },
  {
    id: "function-not-called",
    lesson: "functions",
    title: {
      en: "Written but never used",
      kk: "Жазылды, бірақ қолданылмады",
      ru: "Написано, но не использовано",
    },
    primer: {
      en: "A function is a named block of code. Writing it only teaches the board how to do something; nothing happens until the function is called by its name with parentheses, like blinkTwice();. The board itself calls only two functions: setup() once and loop() again and again. Everything else runs only if those two call it.",
      kk: "Функция — аты бар код блогы. Оны жазу платаға бір нәрсені қалай істеу керегін ғана үйретеді; функция атымен, жақшасымен бірге шақырылмайынша — мысалы blinkTwice(); — ештеңе болмайды. Плата өзі тек екі функцияны шақырады: setup()-ты бір рет, loop()-ты қайта-қайта. Қалғанының бәрі сол екеуі шақырғанда ғана орындалады.",
      ru: "Функция — это блок кода с именем. Написать её — значит только научить плату что-то делать; ничего не происходит, пока функцию не вызовут по имени со скобками, например blinkTwice();. Сама плата вызывает только две функции: setup() один раз и loop() снова и снова. Всё остальное выполняется, только если его вызовут эти две.",
    },
    goal: {
      en: "The LED blinks twice quickly, pauses for a second, and repeats.",
      kk: "Жарықдиод екі рет жылдам жыпылықтайды, бір секунд кідіреді, осылай қайталайды.",
      ru: "Светодиод дважды быстро мигает, делает паузу в секунду и повторяет.",
    },
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: blinkTwiceCode("delay(1000);"),
    symptom: neverLights,
    options: [
      {
        en: "The function must be written below loop(), not above it",
        kk: "Функция loop()-тың үстінде емес, астында жазылуы керек",
        ru: "Функцию нужно писать ниже loop(), а не выше",
      },
      {
        en: "delay(150) is too short for the eye",
        kk: "delay(150) көз үшін тым қысқа",
        ru: "delay(150) слишком мала для глаза",
      },
      optLedBackwards,
      {
        en: "blinkTwice() is written but never called: loop() only waits",
        kk: "blinkTwice() жазылған, бірақ ешқашан шақырылмайды: loop() тек күтеді",
        ru: "blinkTwice() написана, но нигде не вызывается: loop() только ждёт",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "Read loop(): its only line is delay(1000). Nothing ever says blinkTwice(), so the eight lines inside that function never run and the pin stays LOW. Add blinkTwice(); before the delay. Where a function is written, above or below loop(), makes no difference in an Arduino sketch.",
      kk: "loop()-ты оқы: оның жалғыз жолы — delay(1000). Ешқайда blinkTwice() деп жазылмаған, сондықтан сол функцияның ішіндегі сегіз жол ешқашан орындалмайды, ал пин LOW күйінде қалады. delay-дің алдына blinkTwice(); қос. Функцияның қайда жазылғаны — loop()-тың үстінде ме, астында ма — Arduino скетчінде маңызды емес.",
      ru: "Прочитай loop(): его единственная строка — delay(1000). Нигде не сказано blinkTwice(), поэтому восемь строк внутри этой функции никогда не выполняются, и пин остаётся в LOW. Добавь blinkTwice(); перед delay. Где написана функция — выше или ниже loop(), — в скетче Arduino значения не имеет.",
    },
  },
  {
    id: "function-no-parens",
    lesson: "functions",
    title: {
      en: "Named, but not called",
      kk: "Аталды, бірақ шақырылмады",
      ru: "Назвали, но не вызвали",
    },
    primer: {
      en: "To call a function you write its name followed by parentheses: blinkTwice();. The parentheses are what says “do it now”. The name alone, blinkTwice;, is also a legal line, but it only mentions the function and does nothing. The compiler lets it through, at most with a warning that is easy to miss.",
      kk: "Функцияны шақыру үшін оның атын жақшамен бірге жазады: blinkTwice();. «Қазір орында» дегенді дәл осы жақша білдіреді. Жалғыз аты, blinkTwice;, — бұл да рұқсат етілген жол, бірақ ол функцияны тек атап өтеді де, ештеңе істемейді. Компилятор оны өткізіп жібереді, ең көп дегенде оңай байқалмай қалатын ескерту береді.",
      ru: "Чтобы вызвать функцию, пишут её имя и скобки: blinkTwice();. Именно скобки означают «выполни сейчас». Одно имя, blinkTwice;, — тоже допустимая строка, но она только упоминает функцию и ничего не делает. Компилятор её пропускает, в лучшем случае с предупреждением, которое легко не заметить.",
    },
    goal: {
      en: "The LED blinks twice quickly, pauses for a second, and repeats.",
      kk: "Жарықдиод екі рет жылдам жыпылықтайды, бір секунд кідіреді, осылай қайталайды.",
      ru: "Светодиод дважды быстро мигает, делает паузу в секунду и повторяет.",
    },
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: blinkTwiceCode("blinkTwice;\n  delay(1000);"),
    symptom: neverLights,
    options: [
      {
        en: "The line blinkTwice; has no parentheses, so the function is not called",
        kk: "blinkTwice; жолында жақша жоқ, сондықтан функция шақырылмайды",
        ru: "В строке blinkTwice; нет скобок, поэтому функция не вызывается",
      },
      {
        en: "A function must return a value before it can be called",
        kk: "Функцияны шақыру үшін ол мән қайтаруы керек",
        ru: "Функцию можно вызвать, только если она возвращает значение",
      },
      {
        en: "loop() is not allowed to call other functions",
        kk: "loop()-қа басқа функцияларды шақыруға болмайды",
        ru: "loop() не может вызывать другие функции",
      },
      oNotOutput,
    ],
    answer: 0,
    faultType: "code",
    explanation: {
      en: "loop() contains blinkTwice; without parentheses. That line names the function and moves on, so the LED is never touched. Write blinkTwice();. This is the same symptom as a function that is not mentioned at all, and it is harder to spot because the name is there.",
      kk: "loop() ішінде blinkTwice; жақшасыз жазылған. Бұл жол функцияны атап өтеді де, әрі қарай кетеді, сондықтан жарықдиодқа ештеңе жетпейді. blinkTwice(); деп жаз. Бұл — мүлдем аталмаған функциямен бірдей белгі, бірақ оны байқау қиынырақ, өйткені аты тұр.",
      ru: "В loop() написано blinkTwice; без скобок. Эта строка называет функцию и идёт дальше, так что до светодиода дело не доходит. Напиши blinkTwice();. Симптом тот же, что и у функции, которую вообще не упомянули, но заметить его труднее, потому что имя на месте.",
    },
  },
  {
    id: "function-scope",
    lesson: "functions",
    title: {
      en: "The variable next door",
      kk: "Көрші бөлмедегі айнымалы",
      ru: "Переменная в соседней комнате",
    },
    primer: {
      en: "A variable exists only inside the curly braces where it was created. One made inside setup() disappears when setup() ends, and loop() has never heard of it. A variable that several functions need is declared at the very top of the sketch, outside all functions: it is then called global and is visible everywhere.",
      kk: "Айнымалы тек өзі жасалған жүйелі жақшалардың ішінде ғана өмір сүреді. setup() ішінде жасалған айнымалы setup() аяқталғанда жойылады, ал loop() ол туралы ештеңе білмейді. Бірнеше функцияға керек айнымалы скетчтің ең басында, барлық функциялардан тыс жарияланады: ондай айнымалы глобалды деп аталады және барлық жерден көрінеді.",
      ru: "Переменная существует только внутри тех фигурных скобок, где её создали. Созданная внутри setup() исчезает, когда setup() заканчивается, и loop() о ней ничего не знает. Переменную, которая нужна нескольким функциям, объявляют в самом верху скетча, вне всех функций: тогда она называется глобальной и видна везде.",
    },
    goal: blinkGoal,
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void setup() {
  int ledPin = 8;
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}`,
    symptom: {
      en: "The sketch does not upload. The IDE shows: 'ledPin' was not declared in this scope.",
      kk: "Скетч жүктелмейді. IDE мынаны көрсетеді: 'ledPin' was not declared in this scope.",
      ru: "Скетч не загружается. IDE показывает: 'ledPin' was not declared in this scope.",
    },
    options: [
      {
        en: "The name ledPin must be written in capital letters",
        kk: "ledPin атауы бас әріптермен жазылуы керек",
        ru: "Имя ledPin нужно писать заглавными буквами",
      },
      {
        en: "A variable cannot hold a pin number",
        kk: "Айнымалы пин нөмірін сақтай алмайды",
        ru: "Переменная не может хранить номер пина",
      },
      {
        en: "ledPin is created inside setup() and does not exist in loop()",
        kk: "ledPin setup() ішінде жасалған және loop() ішінде жоқ",
        ru: "ledPin создана внутри setup() и в loop() не существует",
      },
      {
        en: "pinMode must come before the variable is declared",
        kk: "pinMode айнымалы жарияланбас бұрын тұруы керек",
        ru: "pinMode должен стоять до объявления переменной",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The message means: in this place the name ledPin is unknown. It is declared inside the braces of setup(), so it exists only there, and the two lines in loop() that use it cannot see it. Move int ledPin = 8; to the top of the sketch, above setup().",
      kk: "Хабарлама мынаны білдіреді: бұл жерде ledPin атауы белгісіз. Ол setup()-тың жақшалары ішінде жарияланған, сондықтан тек сонда ғана бар, ал loop() ішіндегі оны қолданатын екі жол оны көре алмайды. int ledPin = 8; жолын скетчтің басына, setup()-тың үстіне көшір.",
      ru: "Сообщение означает: в этом месте имя ledPin неизвестно. Оно объявлено внутри скобок setup(), поэтому существует только там, и две строки в loop(), которые его используют, его не видят. Перенеси int ledPin = 8; в начало скетча, выше setup().",
    },
  },
  {
    id: "function-args-swapped",
    lesson: "functions",
    title: {
      en: "Pin three, eight times",
      kk: "Үшінші пин, сегіз рет",
      ru: "Пин три, восемь раз",
    },
    primer: {
      en: "A function can take values, called arguments, in its parentheses. They are matched by position, not by meaning: the first value goes into the first name, the second into the second. With void blink(int pin, int times), the call blink(8, 3) means pin 8, three times. The compiler cannot notice if two numbers are in the wrong order.",
      kk: "Функция жақшасының ішінде аргументтер деп аталатын мәндерді қабылдай алады. Олар мағынасына қарай емес, орнына қарай сәйкестендіріледі: бірінші мән бірінші атауға, екіншісі екіншісіне түседі. void blink(int pin, int times) болса, blink(8, 3) шақыруы «8-пин, үш рет» дегенді білдіреді. Екі санның орны ауысып кетсе, компилятор оны байқай алмайды.",
      ru: "Функция может принимать в скобках значения — аргументы. Они сопоставляются по месту, а не по смыслу: первое значение попадает в первое имя, второе — во второе. При void blink(int pin, int times) вызов blink(8, 3) означает «пин 8, три раза». Если два числа стоят не в том порядке, компилятор этого заметить не может.",
    },
    goal: {
      en: "The LED on pin 8 blinks three times, pauses for two seconds, and repeats.",
      kk: "8-пиндегі жарықдиод үш рет жыпылықтайды, екі секунд кідіреді, осылай қайталайды.",
      ru: "Светодиод на пине 8 мигает три раза, делает паузу в две секунды и повторяет.",
    },
    diagram: ledCircuit("8"),
    wiring: ledWiring("8"),
    code: `void blink(int pin, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH);
    delay(200);
    digitalWrite(pin, LOW);
    delay(200);
  }
}

void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  blink(3, 8);
  delay(2000);
}`,
    symptom: {
      en: "The LED never lights up. Yet the board is busy: each pass of loop() takes over five seconds instead of about three.",
      kk: "Жарықдиод мүлдем жанбайды. Алайда плата бос тұрған жоқ: loop()-тың әр айналымы шамамен үш секундтың орнына бес секундтан астам уақыт алады.",
      ru: "Светодиод не загорается вообще. При этом плата занята: каждый проход loop() длится больше пяти секунд вместо примерно трёх.",
    },
    options: [
      {
        en: "A function cannot contain a for loop",
        kk: "Функцияның ішінде for циклі бола алмайды",
        ru: "Внутри функции не может быть цикла for",
      },
      {
        en: "The arguments are in the wrong order: blink(3, 8) means pin 3, eight times",
        kk: "Аргументтердің реті бұрыс: blink(3, 8) «3-пин, сегіз рет» дегенді білдіреді",
        ru: "Аргументы стоят не в том порядке: blink(3, 8) означает «пин 3, восемь раз»",
      },
      {
        en: "pinMode must be called inside blink()",
        kk: "pinMode blink() ішінде шақырылуы керек",
        ru: "pinMode нужно вызывать внутри blink()",
      },
      {
        en: "The variable i must be global",
        kk: "i айнымалысы глобалды болуы керек",
        ru: "Переменная i должна быть глобальной",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "The function is declared as blink(int pin, int times), and the call is blink(3, 8). So pin gets 3 and times gets 8: the sketch toggles pin 3, where nothing is connected, eight times. That takes 3.2 seconds, which is why the pass is so long. Write blink(8, 3).",
      kk: "Функция blink(int pin, int times) деп жарияланған, ал шақыру — blink(3, 8). Сондықтан pin 3-ке, times 8-ге тең болады: скетч ештеңе қосылмаған 3-пинді сегіз рет қосып-өшіреді. Бұған 3,2 секунд кетеді — айналымның ұзақ болатыны содан. blink(8, 3) деп жаз.",
      ru: "Функция объявлена как blink(int pin, int times), а вызов — blink(3, 8). Поэтому pin получает 3, а times — 8: скетч восемь раз переключает пин 3, к которому ничего не подключено. На это уходит 3,2 секунды — вот почему проход такой долгий. Напиши blink(8, 3).",
    },
  },
  {
    id: "function-copy",
    lesson: "functions",
    title: {
      en: "Only the copy got brighter",
      kk: "Көшірмесі ғана жарқырады",
      ru: "Ярче стала только копия",
    },
    primer: {
      en: "When a variable is passed to a function, the function receives a copy of its value. Changing the copy inside the function does not change the original. To get a result out, the function returns it with return, and the caller stores it: brightness = brighter(brightness);.",
      kk: "Айнымалы функцияға берілгенде, функция оның мәнінің көшірмесін алады. Функцияның ішінде көшірмені өзгерту түпнұсқаны өзгертпейді. Нәтижені сыртқа шығару үшін функция оны return арқылы қайтарады, ал шақырушы оны сақтайды: brightness = brighter(brightness);.",
      ru: "Когда переменную передают в функцию, функция получает копию её значения. Изменение копии внутри функции не меняет оригинал. Чтобы вынести результат наружу, функция возвращает его через return, а вызывающий код сохраняет: brightness = brighter(brightness);.",
    },
    goal: {
      en: "Every half second the LED gets one step brighter.",
      kk: "Жарықдиод әр жарты секунд сайын бір қадамға жарығырақ жанады.",
      ru: "Каждые полсекунды светодиод становится на шаг ярче.",
    },
    diagram: ledCircuit("9"),
    wiring: ledWiring("9"),
    code: `int brightness = 0;

void brighter(int value) {
  value = value + 50;
}

void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  brighter(brightness);
  analogWrite(9, brightness);
  delay(500);
}`,
    symptom: {
      en: "The LED stays dark and never gets any brighter.",
      kk: "Жарықдиод сөнген күйінде қалады, мүлдем жарқырамайды.",
      ru: "Светодиод остаётся тёмным и ярче не становится.",
    },
    options: [
      oNoPwm9,
      {
        en: "A step of 50 is too small to see",
        kk: "50 деген қадам көзге көріну үшін тым аз",
        ru: "Шаг 50 слишком мал, чтобы его увидеть",
      },
      {
        en: "brighter() changes only its own copy; the variable brightness stays 0",
        kk: "brighter() тек өз көшірмесін өзгертеді; brightness айнымалысы 0 күйінде қалады",
        ru: "brighter() меняет только свою копию; переменная brightness остаётся равной 0",
      },
      {
        en: "brightness must be declared as float",
        kk: "brightness float түрінде жариялануы керек",
        ru: "brightness нужно объявить как float",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "brighter(brightness) hands the function the number 0. Inside, value becomes 50, and then the function ends and value is thrown away. brightness is still 0, so analogWrite(9, 0) keeps the LED off. Let the function return the result, int brighter(int value) { return value + 50; }, and store it: brightness = brighter(brightness);.",
      kk: "brighter(brightness) функцияға 0 санын береді. Ішінде value 50-ге тең болады, сосын функция аяқталып, value жойылады. brightness әлі де 0, сондықтан analogWrite(9, 0) жарықдиодты өшірулі ұстайды. Функция нәтижені қайтарсын: int brighter(int value) { return value + 50; }, ал сен оны сақта: brightness = brighter(brightness);.",
      ru: "brighter(brightness) передаёт функции число 0. Внутри value становится равным 50, затем функция заканчивается, и value пропадает. brightness по-прежнему 0, поэтому analogWrite(9, 0) держит светодиод выключенным. Пусть функция возвращает результат: int brighter(int value) { return value + 50; }, а ты его сохраняй: brightness = brighter(brightness);.",
    },
  },
  {
    id: "ram-lost-on-reset",
    lesson: "memory",
    title: {
      en: "The counter with no memory",
      kk: "Жады жоқ есептегіш",
      ru: "Счётчик без памяти",
    },
    primer: {
      en: "The Uno has three kinds of memory. Flash holds the sketch and keeps it without power. RAM holds the variables while the sketch runs and is wiped at every reset and power-off. EEPROM is a small store of 1024 cells that keeps its contents without power; a sketch reads and writes it with the EEPROM library.",
      kk: "Uno-да жадтың үш түрі бар. Flash скетчті сақтайды және оны қорексіз де ұстайды. RAM скетч жұмыс істеп тұрғанда айнымалыларды сақтайды және әр қайта іске қосылғанда, қорек өшкенде тазаланады. EEPROM — мазмұнын қорексіз сақтайтын 1024 ұяшықты шағын қойма; скетч оны EEPROM кітапханасы арқылы оқиды және жазады.",
      ru: "У Uno три вида памяти. Flash хранит скетч и не теряет его без питания. RAM (оперативная память) хранит переменные, пока скетч работает, и очищается при каждой перезагрузке и выключении. EEPROM — небольшое хранилище из 1024 ячеек, которое сохраняет содержимое без питания; скетч читает и пишет его через библиотеку EEPROM.",
    },
    goal: {
      en: "The board counts button presses and still knows the total after the power has been off and on again.",
      kk: "Плата батырма басуларын санайды және қорек өшіп, қайта қосылғаннан кейін де жалпы санды біледі.",
      ru: "Плата считает нажатия кнопки и помнит общее число после выключения и повторного включения питания.",
    },
    diagram: buttonOnlyCircuit,
    wiring: buttonOnlyWiring,
    code: `int count = 0;

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(2) == LOW) {
    count = count + 1;
    Serial.println(count);
    delay(300);
  }
}`,
    symptom: {
      en: "Counting works. But after the USB cable is pulled out and put back, the count starts from 1 again.",
      kk: "Санау жұмыс істейді. Бірақ USB кабелін суырып, қайта қосқаннан кейін санақ тағы 1-ден басталады.",
      ru: "Счёт работает. Но после того как USB-кабель вынули и вставили обратно, счёт снова начинается с 1.",
    },
    options: [
      {
        en: "An int cannot count beyond 255",
        kk: "int 255-тен әрі санай алмайды",
        ru: "int не может считать дальше 255",
      },
      {
        en: "The variable count lives in RAM, which is wiped when the power goes off",
        kk: "count айнымалысы RAM-да тұрады, ал ол қорек өшкенде тазаланады",
        ru: "Переменная count хранится в RAM, которая очищается при выключении питания",
      },
      {
        en: "delay(300) erases the variable",
        kk: "delay(300) айнымалыны өшіріп тастайды",
        ru: "delay(300) стирает переменную",
      },
      {
        en: "The button restarts the board",
        kk: "Батырма платаны қайта іске қосады",
        ru: "Кнопка перезагружает плату",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "count is an ordinary variable, so it lives in RAM. Each time the board starts, the line int count = 0 runs again and the old total is gone. Save the total in EEPROM after every press with EEPROM.put(0, count), and read it back in setup() with EEPROM.get(0, count).",
      kk: "count — кәдімгі айнымалы, сондықтан ол RAM-да тұрады. Плата іске қосылған сайын int count = 0 жолы қайта орындалады да, ескі сан жоғалады. Әр басудан кейін жалпы санды EEPROM.put(0, count) арқылы EEPROM-ға сақта, ал setup() ішінде оны EEPROM.get(0, count) арқылы қайта оқы.",
      ru: "count — обычная переменная, поэтому она хранится в RAM. При каждом запуске платы строка int count = 0 выполняется заново, и старое число пропадает. Сохраняй число в EEPROM после каждого нажатия через EEPROM.put(0, count), а в setup() читай его обратно через EEPROM.get(0, count).",
    },
  },
  {
    id: "eeprom-fresh-255",
    lesson: "memory",
    title: {
      en: "A new board that starts at 255",
      kk: "255-тен басталатын жаңа плата",
      ru: "Новая плата, которая начинает с 255",
    },
    primer: {
      en: "EEPROM.read(address) returns the number stored in one cell, and EEPROM.write(address, value) stores one. A cell that has never been written is not 0: an erased EEPROM cell holds 255. A sketch that loads a saved value must therefore know what to do the very first time, when nothing has been saved yet.",
      kk: "EEPROM.read(адрес) бір ұяшықта сақталған санды қайтарады, ал EEPROM.write(адрес, мән) оған сан сақтайды. Ешқашан жазылмаған ұяшықта 0 тұрмайды: тазартылған EEPROM ұяшығында 255 тұрады. Сондықтан сақталған мәнді жүктейтін скетч ең бірінші ретте, әлі ештеңе сақталмаған кезде не істеу керегін білуі тиіс.",
      ru: "EEPROM.read(адрес) возвращает число, которое хранится в одной ячейке, а EEPROM.write(адрес, значение) записывает его. В ячейке, в которую ещё не писали, лежит не 0: стёртая ячейка EEPROM содержит 255. Поэтому скетч, который загружает сохранённое значение, должен знать, что делать в самый первый раз, когда ещё ничего не сохранено.",
    },
    goal: {
      en: "The board counts button presses, remembers the total without power and prints it when switched on. A new board starts from 0.",
      kk: "Плата батырма басуларын санайды, жалпы санды қорексіз есте сақтайды және қосылған кезде оны шығарады. Жаңа плата 0-ден бастайды.",
      ru: "Плата считает нажатия кнопки, помнит общее число без питания и печатает его при включении. Новая плата начинает с 0.",
    },
    diagram: buttonOnlyCircuit,
    wiring: buttonOnlyWiring,
    code: `#include <EEPROM.h>

byte count;

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);
  count = EEPROM.read(0);
  Serial.println(count);
}

void loop() {
  if (digitalRead(2) == LOW) {
    count = count + 1;
    EEPROM.write(0, count);
    Serial.println(count);
    delay(300);
  }
}`,
    symptom: {
      en: "On a brand-new board, where nothing has ever been saved, the sketch prints 255 at the start instead of 0.",
      kk: "Ешқашан ештеңе сақталмаған жап-жаңа платада скетч басында 0-дің орнына 255 шығарады.",
      ru: "На совершенно новой плате, где ещё ничего не сохраняли, скетч в начале печатает 255 вместо 0.",
    },
    options: [
      {
        en: "EEPROM.read must be called in loop(), not in setup()",
        kk: "EEPROM.read setup() ішінде емес, loop() ішінде шақырылуы керек",
        ru: "EEPROM.read нужно вызывать в loop(), а не в setup()",
      },
      {
        en: "The board is faulty: a new EEPROM must contain zeros",
        kk: "Плата ақаулы: жаңа EEPROM-да нөлдер болуы керек",
        ru: "Плата бракованная: в новой EEPROM должны быть нули",
      },
      {
        en: "Address 0 is reserved and cannot be used",
        kk: "0-адрес резервтелген, оны қолдануға болмайды",
        ru: "Адрес 0 зарезервирован, и его нельзя использовать",
      },
      {
        en: "An empty EEPROM cell reads as 255, and the sketch does not handle the first start",
        kk: "Бос EEPROM ұяшығы 255 болып оқылады, ал скетч бірінші іске қосылуды ескермейді",
        ru: "Пустая ячейка EEPROM читается как 255, а скетч не учитывает первый запуск",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "Nothing is broken: 255 is what an untouched cell contains. The sketch takes it for a saved count. Handle the first start in setup(): if (count == 255) count = 0;. A count that may really reach 255 needs a second cell as a marker that something has been saved.",
      kk: "Ештеңе бұзылмаған: қозғалмаған ұяшықта дәл 255 тұрады. Скетч оны сақталған сан деп қабылдайды. Бірінші іске қосылуды setup() ішінде ескер: if (count == 255) count = 0;. Шынымен 255-ке жетуі мүмкін санаққа «бір нәрсе сақталды» деген белгі ретінде екінші ұяшық керек.",
      ru: "Ничего не сломано: 255 — это то, что лежит в нетронутой ячейке. Скетч принимает это за сохранённый счёт. Учти первый запуск в setup(): if (count == 255) count = 0;. Счётчику, который и вправду может дойти до 255, нужна вторая ячейка — метка, что что-то уже сохраняли.",
    },
  },
  {
    id: "eeprom-over-255",
    lesson: "memory",
    title: {
      en: "300 presses, 44 remembered",
      kk: "300 рет басылды, 44 есте қалды",
      ru: "300 нажатий, запомнилось 44",
    },
    primer: {
      en: "One EEPROM cell holds one byte: a number from 0 to 255. EEPROM.write() and EEPROM.read() work with exactly one cell. A bigger number is cut down to what fits. For an int, which needs two cells, there are EEPROM.put(address, variable) and EEPROM.get(address, variable): they store and load as many cells as the variable's type takes.",
      kk: "Бір EEPROM ұяшығы бір байтты — 0-ден 255-ке дейінгі санды — сақтайды. EEPROM.write() пен EEPROM.read() дәл бір ұяшықпен жұмыс істейді. Үлкенірек сан сыятын бөлігіне дейін қысқартылады. Екі ұяшық қажет ететін int үшін EEPROM.put(адрес, айнымалы) және EEPROM.get(адрес, айнымалы) бар: олар айнымалының түрі қанша ұяшық алса, сонша ұяшықты сақтайды және жүктейді.",
      ru: "Одна ячейка EEPROM хранит один байт — число от 0 до 255. EEPROM.write() и EEPROM.read() работают ровно с одной ячейкой. Число побольше обрезается до того, что помещается. Для int, которому нужно две ячейки, есть EEPROM.put(адрес, переменная) и EEPROM.get(адрес, переменная): они сохраняют и загружают столько ячеек, сколько занимает тип переменной.",
    },
    goal: {
      en: "The board counts button presses, remembers the total without power and prints it when switched on.",
      kk: "Плата батырма басуларын санайды, жалпы санды қорексіз есте сақтайды және қосылған кезде оны шығарады.",
      ru: "Плата считает нажатия кнопки, помнит общее число без питания и печатает его при включении.",
    },
    diagram: buttonOnlyCircuit,
    wiring: buttonOnlyWiring,
    code: `#include <EEPROM.h>

int score = 0;

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);
  score = EEPROM.read(0);
  Serial.println(score);
}

void loop() {
  if (digitalRead(2) == LOW) {
    score = score + 1;
    EEPROM.write(0, score);
    Serial.println(score);
    delay(300);
  }
}`,
    symptom: {
      en: "Up to 255 presses the total is remembered correctly. After 300 presses and a restart the board prints 44.",
      kk: "255 басуға дейін жалпы сан дұрыс есте сақталады. 300 рет басып, қайта іске қосқаннан кейін плата 44 шығарады.",
      ru: "До 255 нажатий число запоминается правильно. После 300 нажатий и перезапуска плата печатает 44.",
    },
    options: [
      {
        en: "The EEPROM is worn out after 300 writes",
        kk: "EEPROM 300 жазудан кейін тозған",
        ru: "EEPROM износилась после 300 записей",
      },
      {
        en: "The variable score should be a byte",
        kk: "score айнымалысы byte түрінде болуы керек",
        ru: "Переменная score должна иметь тип byte",
      },
      {
        en: "EEPROM.write stores one byte, 0–255, so 300 is cut down to 44",
        kk: "EEPROM.write бір байт (0–255) сақтайды, сондықтан 300 саны 44-ке дейін қысқарады",
        ru: "EEPROM.write сохраняет один байт (0–255), поэтому 300 обрезается до 44",
      },
      {
        en: "delay(300) loses some of the presses",
        kk: "delay(300) кейбір басуларды жоғалтады",
        ru: "delay(300) теряет часть нажатий",
      },
    ],
    answer: 2,
    faultType: "limits",
    explanation: {
      en: "score is an int and counts to 300 without trouble. But EEPROM.write(0, score) stores only one byte of it: 300 − 256 = 44. That is the number read back after the restart. Replace the two calls with EEPROM.put(0, score) and EEPROM.get(0, score), which save the whole int. An EEPROM cell survives about 100 000 writes, so 300 is nothing.",
      kk: "score — int, ол 300-ге дейін еш қиындықсыз санайды. Бірақ EEPROM.write(0, score) оның тек бір байтын сақтайды: 300 − 256 = 44. Қайта іске қосылғаннан кейін оқылатын сан — осы. Екі шақыруды бүкіл int-ті сақтайтын EEPROM.put(0, score) және EEPROM.get(0, score) дегенге ауыстыр. EEPROM ұяшығы шамамен 100 000 жазуға шыдайды, сондықтан 300 — түк емес.",
      ru: "score имеет тип int и спокойно считает до 300. Но EEPROM.write(0, score) сохраняет только один его байт: 300 − 256 = 44. Это число и читается после перезапуска. Замени два вызова на EEPROM.put(0, score) и EEPROM.get(0, score), которые сохраняют int целиком. Ячейка EEPROM выдерживает около 100 000 записей, так что 300 — это ничто.",
    },
  },
  {
    id: "eeprom-write-in-loop",
    lesson: "memory",
    title: {
      en: "Worn out by remembering",
      kk: "Есте сақтаудан тозған жад",
      ru: "Память, стёртая запоминанием",
    },
    primer: {
      en: "EEPROM cells wear out. Each cell is guaranteed for about 100 000 writes; after that it may stop holding its value. Reading costs nothing. So a sketch writes to EEPROM rarely: when a value has really changed, or when the user presses “save”. EEPROM.update() helps: it writes only if the new value differs from the stored one.",
      kk: "EEPROM ұяшықтары тозады. Әр ұяшыққа шамамен 100 000 жазуға кепілдік беріледі; одан кейін ол мәнін сақтамай қалуы мүмкін. Оқу ештеңеге тұрмайды. Сондықтан скетч EEPROM-ға сирек жазады: мән шынымен өзгергенде немесе пайдаланушы «сақтау» батырмасын басқанда. EEPROM.update() көмектеседі: ол жаңа мән сақталғаннан өзгеше болғанда ғана жазады.",
      ru: "Ячейки EEPROM изнашиваются. Каждая ячейка гарантированно выдерживает около 100 000 записей; после этого она может перестать хранить значение. Чтение ничего не стоит. Поэтому скетч пишет в EEPROM редко: когда значение действительно изменилось или когда пользователь нажал «сохранить». Помогает EEPROM.update(): он записывает, только если новое значение отличается от сохранённого.",
    },
    goal: {
      en: "The board remembers the last position of the knob and prints it when it is switched on.",
      kk: "Плата тұтқаның соңғы күйін есте сақтайды және қосылған кезде оны шығарады.",
      ru: "Плата запоминает последнее положение ручки и печатает его при включении.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `#include <EEPROM.h>

void setup() {
  Serial.begin(9600);
  Serial.println(EEPROM.read(0));
}

void loop() {
  int level = analogRead(A0) / 4;
  EEPROM.write(0, level);
}`,
    symptom: {
      en: "For the first weeks it worked. Now the number printed at switch-on is often wrong, wherever the knob was left.",
      kk: "Алғашқы апталарда бәрі жұмыс істеді. Қазір қосылған кезде шығатын сан тұтқа қай күйде қалдырылса да жиі қате болады.",
      ru: "Первые недели всё работало. Теперь число, которое печатается при включении, часто неверное, в каком бы положении ни оставили ручку.",
    },
    options: [
      {
        en: "analogRead(A0) / 4 does not fit into one EEPROM cell",
        kk: "analogRead(A0) / 4 бір EEPROM ұяшығына сыймайды",
        ru: "analogRead(A0) / 4 не помещается в одну ячейку EEPROM",
      },
      oPotWorn,
      {
        en: "The sketch writes to EEPROM on every pass of loop() and has worn the cell out",
        kk: "Скетч loop()-тың әр айналымында EEPROM-ға жазады және ұяшықты тоздырып жіберген",
        ru: "Скетч пишет в EEPROM на каждом проходе loop() и износил ячейку",
      },
      {
        en: "EEPROM forgets its contents after a few weeks without power",
        kk: "EEPROM қорексіз бірнеше аптадан кейін мазмұнын ұмытады",
        ru: "EEPROM забывает содержимое через несколько недель без питания",
      },
    ],
    answer: 2,
    faultType: "limits",
    explanation: {
      en: "loop() has no pause, and each pass ends with EEPROM.write. One write takes about 3 ms, so the sketch makes roughly 300 writes a second and passes the guaranteed 100 000 in about six minutes of running. After that the cell fails sooner or later. Write only when needed: use EEPROM.update(0, level), and better still save only when a button is pressed. The value itself fits: 1023 ÷ 4 is 255.",
      kk: "loop()-та кідіріс жоқ, ал әр айналым EEPROM.write-пен аяқталады. Бір жазу шамамен 3 мс алады, сондықтан скетч секундына шамамен 300 рет жазады да, кепілдік берілген 100 000 жазудан шамамен алты минут жұмыста асып кетеді. Одан кейін ұяшық ерте ме, кеш пе істен шығады. Тек қажет кезде жаз: EEPROM.update(0, level) қолдан, ал одан да дұрысы — тек батырма басылғанда сақта. Мәннің өзі сыяды: 1023 ÷ 4 — бұл 255.",
      ru: "В loop() нет паузы, а каждый проход заканчивается вызовом EEPROM.write. Одна запись занимает около 3 мс, поэтому скетч делает примерно 300 записей в секунду и переходит гарантированные 100 000 примерно за шесть минут работы. После этого ячейка рано или поздно отказывает. Пиши только при необходимости: используй EEPROM.update(0, level), а ещё лучше — сохраняй только по нажатию кнопки. Само значение помещается: 1023 ÷ 4 — это 255.",
    },
  },
  {
    id: "ram-full",
    lesson: "memory",
    title: {
      en: "No room for the numbers",
      kk: "Сандарға орын жоқ",
      ru: "Числам не хватило места",
    },
    primer: {
      en: "The Uno has only 2048 bytes of RAM for all variables together. An int takes 2 bytes, so an array of 1500 ints needs 3000 bytes, more than the whole board has. The Arduino IDE adds up the global variables when it builds the sketch and reports how much of the RAM they use.",
      kk: "Uno-да барлық айнымалыларға бар болғаны 2048 байт RAM бар. int 2 байт алады, сондықтан 1500 int-тен тұратын массивке 3000 байт керек — бұл бүкіл платадағыдан көп. Arduino IDE скетчті құрастырғанда глобалды айнымалыларды қосып есептейді және олардың RAM-ның қанша бөлігін алатынын хабарлайды.",
      ru: "У Uno всего 2048 байт RAM на все переменные вместе. int занимает 2 байта, поэтому массиву из 1500 int нужно 3000 байт — больше, чем есть у всей платы. Arduino IDE при сборке скетча складывает глобальные переменные и сообщает, какую часть RAM они занимают.",
    },
    goal: {
      en: "The board records 1500 readings of the knob, one every 10 ms, and then prints them all.",
      kk: "Плата тұтқаның 1500 көрсеткішін әр 10 мс сайын бір-бірден жазып алады, сосын бәрін шығарады.",
      ru: "Плата записывает 1500 показаний ручки, по одному каждые 10 мс, и затем печатает их все.",
    },
    diagram: potCircuit,
    wiring: potWiring,
    code: `int samples[1500];

void setup() {
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 1500; i++) {
    samples[i] = analogRead(A0);
    delay(10);
  }
  for (int i = 0; i < 1500; i++) {
    Serial.println(samples[i]);
  }
}`,
    symptom: {
      en: "The sketch does not upload. The IDE reports that global variables use about 150% of dynamic memory and that there is not enough memory.",
      kk: "Скетч жүктелмейді. IDE глобалды айнымалылар динамикалық жадтың шамамен 150%-ын алатынын және жад жеткіліксіз екенін хабарлайды.",
      ru: "Скетч не загружается. IDE сообщает, что глобальные переменные занимают около 150% динамической памяти и что памяти недостаточно.",
    },
    options: [
      {
        en: "The array of 1500 ints needs 3000 bytes, and the Uno has 2048 bytes of RAM",
        kk: "1500 int-тен тұратын массивке 3000 байт керек, ал Uno-да 2048 байт RAM бар",
        ru: "Массиву из 1500 int нужно 3000 байт, а у Uno 2048 байт RAM",
      },
      {
        en: "The sketch is too long for the board's flash memory",
        kk: "Скетч платаның flash жадына сыймайтындай ұзын",
        ru: "Скетч слишком длинный для flash-памяти платы",
      },
      {
        en: "An array cannot be filled inside a for loop",
        kk: "Массивті for циклінің ішінде толтыруға болмайды",
        ru: "Массив нельзя заполнять внутри цикла for",
      },
      {
        en: "The USB cable is too slow for 1500 numbers",
        kk: "USB кабелі 1500 сан үшін тым баяу",
        ru: "USB-кабель слишком медленный для 1500 чисел",
      },
    ],
    answer: 0,
    faultType: "limits",
    explanation: {
      en: "“Dynamic memory” in the message is RAM. 1500 × 2 bytes = 3000 bytes, about one and a half times the 2048 the Uno has, so the sketch cannot be built. Record fewer readings: 500 ints take 1000 bytes and leave room for everything else. Or print each reading at once instead of storing it. The sketch itself is tiny; flash is not the problem.",
      kk: "Хабарламадағы «динамикалық жад» — бұл RAM. 1500 × 2 байт = 3000 байт, бұл Uno-дағы 2048 байттан шамамен бір жарым есе көп, сондықтан скетчті құрастыру мүмкін емес. Көрсеткіштерді азырақ жаз: 500 int 1000 байт алады және қалғанына орын қалдырады. Немесе әр көрсеткішті сақтамай, бірден шығар. Скетчтің өзі өте шағын; мәселе flash-та емес.",
      ru: "«Динамическая память» в сообщении — это RAM. 1500 × 2 байта = 3000 байт, примерно в полтора раза больше, чем 2048 у Uno, поэтому скетч собрать нельзя. Записывай меньше показаний: 500 int занимают 1000 байт и оставляют место для всего остального. Или печатай каждое показание сразу, не сохраняя его. Сам скетч крошечный; дело не во flash.",
    },
  },
  {
    id: "interrupt-wrong-pin",
    lesson: "interrupts",
    title: {
      en: "The pin that cannot interrupt",
      kk: "Үзіліс жасай алмайтын пин",
      ru: "Пин, который не умеет прерывать",
    },
    primer: {
      en: "Normally a sketch has to keep asking a pin for its state. An interrupt works the other way: the pin itself calls the board. attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING) means: the moment pin 2 falls from HIGH to LOW, pause whatever is running, execute the function onPress, then carry on. On the Uno only two pins can do this: 2 and 3.",
      kk: "Әдетте скетч пиннің күйін қайта-қайта сұрап тұруы керек. Үзіліс керісінше жұмыс істейді: пиннің өзі платаны шақырады. attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING) мынаны білдіреді: 2-пин HIGH-тан LOW-ға түскен сәтте орындалып жатқанды тоқтата тұр, onPress функциясын орында, сосын әрі қарай жалғастыр. Uno-да мұны тек екі пин істей алады: 2 және 3.",
      ru: "Обычно скетч должен сам постоянно спрашивать у пина его состояние. Прерывание работает наоборот: пин сам зовёт плату. attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING) означает: в тот момент, когда пин 2 падает с HIGH на LOW, приостанови то, что выполняется, выполни функцию onPress и продолжай дальше. У Uno так умеют только два пина: 2 и 3.",
    },
    goal: {
      en: "Each press of the button switches the LED: on, off, on again.",
      kk: "Батырманы әр басқанда жарықдиод ауысады: жанады, сөнеді, қайта жанады.",
      ru: "Каждое нажатие кнопки переключает светодиод: включён, выключен, снова включён.",
    },
    diagram: buttonLedCircuit("4"),
    wiring: [
      { from: pin("4"), to: buttonLegA },
      { from: buttonLegB, to: same("GND") },
      ...ledWiring("8"),
    ],
    code: `bool ledOn = false;

void onPress() {
  ledOn = !ledOn;
  digitalWrite(8, ledOn);
}

void setup() {
  pinMode(4, INPUT_PULLUP);
  pinMode(8, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(4), onPress, FALLING);
}

void loop() {
}`,
    symptom: {
      en: "Pressing the button does nothing. The LED stays dark.",
      kk: "Батырманы басқанда ештеңе болмайды. Жарықдиод жанбайды.",
      ru: "Нажатие кнопки ничего не даёт. Светодиод не загорается.",
    },
    options: [
      {
        en: "FALLING should be RISING",
        kk: "FALLING орнына RISING болуы керек",
        ru: "Вместо FALLING должно быть RISING",
      },
      {
        en: "loop() must not be empty",
        kk: "loop() бос болмауы керек",
        ru: "loop() не должен быть пустым",
      },
      {
        en: "On the Uno only pins 2 and 3 can trigger an interrupt, and the button is on pin 4",
        kk: "Uno-да үзілісті тек 2 және 3-пиндер тудыра алады, ал батырма 4-пинде тұр",
        ru: "У Uno прерывание могут вызывать только пины 2 и 3, а кнопка стоит на пине 4",
      },
      oButtonResistor,
    ],
    answer: 2,
    faultType: "limits",
    explanation: {
      en: "The button is on pin 4 and the code asks for an interrupt on pin 4. The Uno has no interrupt there, so attachInterrupt quietly does nothing and onPress is never run. Move the button wire to pin 2 and change both 4s in the code to 2. With RISING the LED would simply switch on release instead of on press.",
      kk: "Батырма 4-пинде тұр, ал код 4-пинде үзіліс сұрайды. Uno-да ол жерде үзіліс жоқ, сондықтан attachInterrupt үнсіз ештеңе істемейді, ал onPress ешқашан орындалмайды. Батырма сымын 2-пинге ауыстырып, кодтағы екі 4-ті де 2-ге өзгерт. RISING болса, жарықдиод жай батырманы басқанда емес, жібергенде ауысар еді.",
      ru: "Кнопка стоит на пине 4, и код просит прерывание на пине 4. У Uno там прерывания нет, поэтому attachInterrupt молча ничего не делает, и onPress не выполняется никогда. Переставь провод кнопки на пин 2 и замени обе четвёрки в коде на 2. С RISING светодиод просто переключался бы при отпускании, а не при нажатии.",
    },
  },
  {
    id: "interrupt-floating",
    lesson: "interrupts",
    title: {
      en: "The counter that counts by itself",
      kk: "Өздігінен санайтын есептегіш",
      ru: "Счётчик, который считает сам",
    },
    primer: {
      en: "An interrupt reacts to every change on its pin, including changes nobody intended. A pin set as plain INPUT with a button to GND is held by nothing while the button is released: it floats and picks up noise from the air and from a hand nearby. Each random dip looks like a press. The word volatile in front of a variable marks one that an interrupt changes; a later mission explains it.",
      kk: "Үзіліс өз пиніндегі әр өзгеріске, соның ішінде ешкім қаламаған өзгерістерге де жауап береді. Кәдімгі INPUT режиміндегі, батырмасы GND-ға қосылған пинді батырма жіберулі кезде ештеңе ұстамайды: ол «қалқып» тұрады және ауадан, жақындаған қолдан кедергі қабылдайды. Әр кездейсоқ төмендеу басу сияқты көрінеді. Айнымалының алдындағы volatile сөзі оны үзіліс өзгертетінін белгілейді; ол туралы кейінгі миссияда айтылады.",
      ru: "Прерывание реагирует на каждое изменение на своём пине, в том числе на те, которых никто не хотел. Пин в режиме обычного INPUT с кнопкой к GND ничем не удерживается, пока кнопка отпущена: он «висит в воздухе» и ловит помехи из воздуха и от руки поблизости. Каждый случайный провал выглядит как нажатие. Слово volatile перед переменной отмечает, что её меняет прерывание; об этом одна из следующих миссий.",
    },
    goal: pressGoal,
    diagram: buttonOnlyCircuit,
    wiring: buttonOnlyWiring,
    code: interruptCounterCode("INPUT", "FALLING"),
    symptom: {
      en: "The number grows by itself, faster when a hand comes near the wire, although nobody touches the button.",
      kk: "Батырмаға ешкім тимесе де, сан өздігінен өседі, қол сымға жақындағанда тіпті жылдамырақ.",
      ru: "Число растёт само, и быстрее, когда к проводу подносят руку, хотя кнопку никто не трогает.",
    },
    options: [
      {
        en: "The variable presses must not be volatile",
        kk: "presses айнымалысы volatile болмауы керек",
        ru: "Переменная presses не должна быть volatile",
      },
      {
        en: "delay(500) makes the counter run ahead",
        kk: "delay(500) есептегішті алға оздырады",
        ru: "delay(500) заставляет счётчик убегать вперёд",
      },
      {
        en: "Pin 2 is a plain INPUT with nothing holding it HIGH, so noise triggers the interrupt",
        kk: "2-пин кәдімгі INPUT режимінде, оны HIGH күйінде ештеңе ұстамайды, сондықтан үзілісті кедергі тудырады",
        ru: "Пин 2 — обычный INPUT, его ничто не удерживает в HIGH, и прерывание срабатывает от помех",
      },
      {
        en: "The Uno cannot count presses with an interrupt",
        kk: "Uno үзіліс арқылы басуларды санай алмайды",
        ru: "Uno не может считать нажатия через прерывание",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "pinMode(2, INPUT) leaves the pin floating whenever the button is released. Its voltage wanders, and every time it happens to fall, the interrupt counts a press. Write pinMode(2, INPUT_PULLUP): the built-in resistor holds the pin HIGH, and only a real press pulls it to LOW.",
      kk: "pinMode(2, INPUT) батырма жіберулі кезде пинді «қалқып» тұрған күйде қалдырады. Оның кернеуі ауытқып тұрады, ал ол кездейсоқ төмендеген сайын үзіліс басуды санайды. pinMode(2, INPUT_PULLUP) деп жаз: кіріктірілген резистор пинді HIGH күйінде ұстайды, ал оны LOW-ға тек шынайы басу ғана тартады.",
      ru: "pinMode(2, INPUT) оставляет пин «висеть в воздухе», пока кнопка отпущена. Его напряжение гуляет, и каждый раз, когда оно случайно падает, прерывание засчитывает нажатие. Напиши pinMode(2, INPUT_PULLUP): встроенный резистор удержит пин в HIGH, и к LOW его притянет только настоящее нажатие.",
    },
  },
  {
    id: "interrupt-mode-low",
    lesson: "interrupts",
    title: {
      en: "One press, a thousand counts",
      kk: "Бір басу, мың санақ",
      ru: "Одно нажатие, тысяча отсчётов",
    },
    primer: {
      en: "The last word in attachInterrupt says what to react to. FALLING is the moment the pin goes from HIGH to LOW; RISING is the opposite moment; CHANGE is both. LOW is different: it is not a moment but a state. While the pin is LOW the handler is run again and again without a break, and the rest of the sketch hardly gets a turn.",
      kk: "attachInterrupt-тағы соңғы сөз неге жауап беру керегін айтады. FALLING — пиннің HIGH-тан LOW-ға өтетін сәті; RISING — оған қарама-қарсы сәт; CHANGE — екеуі де. LOW басқаша: бұл сәт емес, күй. Пин LOW болып тұрғанда өңдегіш үзіліссіз қайта-қайта орындалады, ал скетчтің қалған бөлігіне кезек тимейді десе де болады.",
      ru: "Последнее слово в attachInterrupt говорит, на что реагировать. FALLING — это момент, когда пин переходит с HIGH на LOW; RISING — противоположный момент; CHANGE — оба. LOW устроен иначе: это не момент, а состояние. Пока на пине LOW, обработчик запускается снова и снова без перерыва, а остальному скетчу почти не достаётся очереди.",
    },
    goal: pressGoal,
    diagram: buttonOnlyCircuit,
    wiring: buttonOnlyWiring,
    code: interruptCounterCode("INPUT_PULLUP", "LOW"),
    symptom: {
      en: "One press adds thousands to the number, and while the button is held down nothing new is printed.",
      kk: "Бір басу санға мыңдап қосады, ал батырма басулы тұрғанда жаңа ештеңе шықпайды.",
      ru: "Одно нажатие прибавляет к числу тысячи, а пока кнопка удерживается, ничего нового не печатается.",
    },
    options: [
      {
        en: "Contact bounce adds thousands of extra presses",
        kk: "Контактілердің ыршуы мыңдаған артық басу қосады",
        ru: "Дребезг контактов добавляет тысячи лишних нажатий",
      },
      {
        en: "The mode LOW runs the handler again and again while the button is held; one count per press needs FALLING",
        kk: "LOW режимі батырма басулы тұрғанда өңдегішті қайта-қайта орындайды; бір басуға бір санақ үшін FALLING керек",
        ru: "Режим LOW запускает обработчик снова и снова, пока кнопка нажата; для одного отсчёта на нажатие нужен FALLING",
      },
      {
        en: "An int is too small for a counter",
        kk: "int есептегіш үшін тым кішкентай",
        ru: "int слишком мал для счётчика",
      },
      {
        en: "INPUT_PULLUP turns every press into many",
        kk: "INPUT_PULLUP әр басуды көп басуға айналдырады",
        ru: "INPUT_PULLUP превращает каждое нажатие во множество",
      },
    ],
    answer: 1,
    faultType: "code",
    explanation: {
      en: "With LOW the handler starts again the instant it ends, for as long as the button holds the pin at LOW: thousands of runs in a short press. They take all the processor's time, so loop() stands still and nothing is printed. Change LOW to FALLING to react once, at the moment of pressing. Bounce adds a handful of extra counts, not thousands, and it does not stop the printing.",
      kk: "LOW режимінде өңдегіш аяқталған сәтте қайта басталады — батырма пинді LOW күйінде ұстап тұрғанша: қысқа бір басуда мыңдаған рет. Олар процессордың бүкіл уақытын алады, сондықтан loop() тоқтап тұрады және ештеңе шықпайды. Басу сәтінде бір рет қана жауап беру үшін LOW-ды FALLING-ке өзгерт. Ыршу мыңдаған емес, бірнеше ғана артық санақ қосады және шығаруды тоқтатпайды.",
      ru: "В режиме LOW обработчик запускается заново в тот же миг, как закончился, — всё время, пока кнопка держит пин в LOW: тысячи запусков за одно короткое нажатие. Они забирают всё время процессора, поэтому loop() стоит на месте и ничего не печатается. Замени LOW на FALLING, чтобы реагировать один раз, в момент нажатия. Дребезг добавляет несколько лишних отсчётов, а не тысячи, и печать не останавливает.",
    },
  },
  {
    id: "interrupt-time-stops",
    lesson: "interrupts",
    title: {
      en: "The handler where time stands still",
      kk: "Уақыт тоқтап қалатын өңдегіш",
      ru: "Обработчик, в котором остановилось время",
    },
    primer: {
      en: "While an interrupt handler runs, all other interrupts wait. One of them is the timer that moves the board's clock forward. So inside a handler millis() always returns the same number and delay() does not work. A handler must be a few quick lines: note what happened and return. Anything that takes time belongs in loop().",
      kk: "Үзіліс өңдегіші орындалып жатқанда, қалған үзілістердің бәрі күтеді. Солардың бірі — платаның сағатын алға жылжытатын таймер. Сондықтан өңдегіштің ішінде millis() әрқашан бір ғана санды қайтарады, ал delay() жұмыс істемейді. Өңдегіш бірнеше жылдам жолдан тұруы керек: не болғанын белгілеп, қайту. Уақыт алатын нәрсенің бәрінің орны — loop().",
      ru: "Пока выполняется обработчик прерывания, все остальные прерывания ждут. Одно из них — таймер, который двигает вперёд часы платы. Поэтому внутри обработчика millis() всегда возвращает одно и то же число, а delay() не работает. Обработчик должен состоять из нескольких быстрых строк: отметить, что произошло, и вернуться. Всё, что требует времени, должно быть в loop().",
    },
    goal: {
      en: "Each press lights the LED for one second.",
      kk: "Әр басу жарықдиодты бір секундқа жағады.",
      ru: "Каждое нажатие зажигает светодиод на одну секунду.",
    },
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `void onPress() {
  digitalWrite(8, HIGH);
  unsigned long start = millis();
  while (millis() - start < 1000) {
  }
  digitalWrite(8, LOW);
}

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING);
}

void loop() {
}`,
    symptom: {
      en: "After the first press the LED comes on and never goes out. The board reacts to nothing more until it is reset.",
      kk: "Бірінші басудан кейін жарықдиод жанады да, қайта сөнбейді. Плата қайта іске қосылғанша ештеңеге жауап бермейді.",
      ru: "После первого нажатия светодиод загорается и больше не гаснет. Плата ни на что не реагирует до перезагрузки.",
    },
    options: [
      {
        en: "1000 does not fit into an unsigned long",
        kk: "1000 саны unsigned long түріне сыймайды",
        ru: "1000 не помещается в unsigned long",
      },
      {
        en: "FALLING works only once after power-on",
        kk: "FALLING қорек берілгеннен кейін тек бір рет жұмыс істейді",
        ru: "FALLING срабатывает только один раз после включения",
      },
      {
        en: "The LED needs a larger resistor to switch off",
        kk: "Жарықдиод сөнуі үшін үлкенірек резистор керек",
        ru: "Чтобы светодиод погас, нужен резистор побольше",
      },
      {
        en: "Inside the handler millis() stands still, so the waiting loop never ends",
        kk: "Өңдегіштің ішінде millis() өзгермейді, сондықтан күту циклі ешқашан аяқталмайды",
        ru: "Внутри обработчика millis() стоит на месте, поэтому цикл ожидания не заканчивается никогда",
      },
    ],
    answer: 3,
    faultType: "code",
    explanation: {
      en: "onPress() switches the LED on and then waits until millis() has grown by 1000. But the clock is moved by another interrupt, which cannot run while this handler is busy, so millis() never changes and the while loop spins forever. In the handler only set a flag, for example pressed = true, and let loop() light the LED, wait a second and switch it off.",
      kk: "onPress() жарықдиодты қосады, сосын millis() 1000-ға өскенше күтеді. Бірақ сағатты басқа үзіліс жылжытады, ал ол осы өңдегіш бос болмайынша орындала алмайды, сондықтан millis() мүлдем өзгермейді де, while циклі мәңгі айнала береді. Өңдегіште тек жалауша қой, мысалы pressed = true, ал жарықдиодты жағу, бір секунд күту және өшіру loop() ішінде болсын.",
      ru: "onPress() включает светодиод и затем ждёт, пока millis() не вырастет на 1000. Но часы двигает другое прерывание, а оно не может выполниться, пока занят этот обработчик, поэтому millis() не меняется, и цикл while крутится вечно. В обработчике только выставляй флаг, например pressed = true, а включать светодиод, ждать секунду и выключать его пусть будет loop().",
    },
  },
  {
    id: "interrupt-no-volatile",
    lesson: "interrupts",
    title: {
      en: "The flag nobody looks at",
      kk: "Ешкім қарамайтын жалауша",
      ru: "Флаг, на который никто не смотрит",
    },
    primer: {
      en: "The compiler makes a sketch faster by not re-reading a variable that, as far as it can see, nothing changes. It cannot see interrupts: a handler may change a variable at any moment, between any two lines. The word volatile in front of the variable tells the compiler exactly that: read it from memory every single time. Every variable shared between a handler and the rest of the sketch must be volatile.",
      kk: "Компилятор, өзі көріп тұрғандай ештеңе өзгертпейтін айнымалыны қайта оқымау арқылы скетчті жылдамдатады. Ол үзілістерді көре алмайды: өңдегіш айнымалыны кез келген сәтте, кез келген екі жолдың арасында өзгерте алады. Айнымалының алдындағы volatile сөзі компиляторға дәл осыны айтады: оны әр жолы жадтан оқы. Өңдегіш пен скетчтің қалған бөлігі ортақ қолданатын әр айнымалы volatile болуы керек.",
      ru: "Компилятор ускоряет скетч тем, что не перечитывает переменную, которую, насколько он видит, ничто не меняет. Прерываний он не видит: обработчик может изменить переменную в любой момент, между любыми двумя строками. Слово volatile перед переменной сообщает компилятору именно это: читай её из памяти каждый раз. Каждая переменная, общая для обработчика и остального скетча, должна быть volatile.",
    },
    goal: {
      en: "The LED is dark until the button is pressed for the first time, and then stays on.",
      kk: "Батырма бірінші рет басылғанша жарықдиод сөніп тұрады, сосын жанған күйінде қалады.",
      ru: "Светодиод не горит, пока кнопку не нажмут в первый раз, а затем остаётся включённым.",
    },
    diagram: pullupButtonCircuit,
    wiring: pullupButtonWiring,
    code: `bool pressed = false;

void onPress() {
  pressed = true;
}

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING);
}

void loop() {
  while (pressed == false) {
  }
  digitalWrite(8, HIGH);
}`,
    symptom: {
      en: "The LED never lights up, however many times the button is pressed.",
      kk: "Батырма қанша рет басылса да, жарықдиод жанбайды.",
      ru: "Светодиод не загорается, сколько бы раз ни нажимали кнопку.",
    },
    options: [
      {
        en: "An interrupt handler is not allowed to change variables",
        kk: "Үзіліс өңдегішіне айнымалыларды өзгертуге болмайды",
        ru: "Обработчику прерывания нельзя менять переменные",
      },
      {
        en: "FALLING should be LOW",
        kk: "FALLING орнына LOW болуы керек",
        ru: "Вместо FALLING должно быть LOW",
      },
      {
        en: "pressed is not volatile, so the compiler never re-reads it inside the waiting loop",
        kk: "pressed айнымалысы volatile емес, сондықтан компилятор оны күту циклінің ішінде қайта оқымайды",
        ru: "pressed не объявлена как volatile, и компилятор не перечитывает её внутри цикла ожидания",
      },
      {
        en: "while cannot be used inside loop()",
        kk: "while циклін loop() ішінде қолдануға болмайды",
        ru: "while нельзя использовать внутри loop()",
      },
    ],
    answer: 2,
    faultType: "code",
    explanation: {
      en: "The handler does set pressed to true. But the compiler looked at the empty loop while (pressed == false) { }, saw nothing in it that could change pressed, and turned it into a loop that never checks again. Declare the variable as volatile bool pressed = false; and the loop will read it from memory on every pass.",
      kk: "Өңдегіш pressed-ке шынымен true мәнін береді. Бірақ компилятор while (pressed == false) { } бос циклін қарап, оның ішінде pressed-ті өзгерте алатын ештеңе көрмеді де, оны енді қайтып тексермейтін циклге айналдырды. Айнымалыны volatile bool pressed = false; деп жарияла, сонда цикл оны әр айналымда жадтан оқитын болады.",
      ru: "Обработчик действительно присваивает pressed значение true. Но компилятор посмотрел на пустой цикл while (pressed == false) { }, не увидел в нём ничего, что могло бы изменить pressed, и превратил его в цикл, который больше ничего не проверяет. Объяви переменную как volatile bool pressed = false; — и цикл будет читать её из памяти на каждом проходе.",
    },
  },
];

// A complete transistor switch: the illustration for the lesson on transistors.
export const transistorExample: Diagram = transistorCircuit();

// A correctly built LED circuit, for the lesson on breadboards.
export const breadboardExample: Board = {
  rows: 14,
  items: [
    { kind: "lead", at: "3a", label: "Pin 8" },
    { kind: "resistor", from: "3c", to: "7c", label: "220 Ω" },
    { kind: "led", long: "7e", short: "9e" },
    { kind: "lead", at: "9a", label: "GND" },
  ],
};

// A complete, working battery circuit: the illustration for the lesson on closed loops.
export const closedLoopExample: Diagram = batteryCircuit(
  "4.5",
  [
    { id: "r1", kind: "resistor", label: "220 Ω", x: 230, y: 100 },
    { id: "d1", kind: "led", x: 350, y: 100 },
  ],
  [
    ["r1.a", "5V"],
    ["r1.b", "d1.a"],
    ["d1.b", "GND"],
  ],
);

// The order missions are played in; a mission's level is its group here.
const LEVELS: string[][] = [
  // 1. Electricity from zero
  [
    "open-loop",
    "gap-in-the-middle",
    "short-wire",
    "led-backwards-battery",
    "low-voltage",
    "blue-on-3v",
    "dim-on-battery",
    "too-bright-9v",
    "no-resistor-9v",
  ],
  // 2. Meet the Arduino
  [
    "wrong-pin",
    "no-ground",
    "both-ends-gnd",
    "gnd-to-5v",
    "led-on-5v",
    "second-led-forgotten",
    "missing-semicolon",
    "missing-brace",
    "wrong-capital",
    "setup-once",
    "no-second-delay",
    "delay-units",
    "led-backwards",
    "missing-pinmode",
    "pinmode-other-pin",
  ],
  // 3. LEDs and buttons
  [
    "resistor-too-large",
    "resistor-too-small",
    "leds-in-series",
    "active-low-led",
    "floating-button",
    "pullup-inverted",
    "button-to-5v",
    "button-no-pullup",
    "button-wrong-pin",
    "button-read-once",
    "button-short",
    "no-pwm-pin",
    "pwm-percent",
    "fade-no-delay",
  ],
  // 4. On the breadboard
  ["bb-same-row", "bb-one-off", "bb-split-rail", "bb-resistor-bypassed", "bb-across-gap"],
  // 5. Colour and sound
  [
    "rgb-pins-swapped",
    "rgb-digital-write",
    "rgb-colors-pile-up",
    "rgb-common-anode",
    "rgb-one-resistor",
    "buzzer-click",
    "tone-no-delay",
    "tone-never-stops",
    "tone-too-high",
    "two-tones",
  ],
  // 6. Knobs and sensors
  [
    "pot-no-5v",
    "pot-both-5v",
    "pot-wrong-pin",
    "pot-on-3v3",
    "analog-read-digital-pin",
    "digital-read-analog",
    "analogwrite-overflow",
    "ldr-no-divider",
    "threshold-reversed",
    "sonar-swapped",
    "sonar-no-gnd",
    "sonar-no-trig",
  ],
  // 7. Temperature and line sensors
  [
    "temp-backwards",
    "temp-no-offset",
    "temp-lm35",
    "temp-raw-compare",
    "dht-analog-read",
    "line-threshold",
    "line-inverted",
    "line-too-high",
    "line-trimmer",
    "line-sides-swapped",
  ],
  // 8. Serial and modules
  [
    "serial-no-begin",
    "print-no-newline",
    "serial-quotes",
    "serial-write",
    "baud-mismatch",
    "led-on-tx",
    "i2c-swapped",
    "servo-wrong-pin",
    "servo-no-signal",
  ],
  // 9. Loops, arrays, functions
  [
    "loop-from-one",
    "while-no-increment",
    "loop-delay-outside",
    "array-out-of-bounds",
    "array-byte-overflow",
    "function-not-called",
    "function-no-parens",
    "function-scope",
    "function-args-swapped",
    "function-copy",
  ],
  // 10. Power
  [
    "motor-on-pin",
    "servo-brownout",
    "servo-on-3v3",
    "no-common-ground",
    "battery-on-5v-pin",
    "battery-reversed",
  ],
  // 11. Transistors and motors
  [
    "transistor-no-base-resistor",
    "transistor-swapped",
    "transistor-too-small",
    "transistor-no-diode",
    "transistor-diode-backwards",
    "driver-both-high",
    "driver-enable-no-pwm",
    "driver-low-speed",
    "driver-voltage-drop",
    "driver-no-ground",
  ],
  // 12. Memory and interrupts
  [
    "ram-lost-on-reset",
    "eeprom-fresh-255",
    "eeprom-over-255",
    "eeprom-write-in-loop",
    "ram-full",
    "interrupt-wrong-pin",
    "interrupt-floating",
    "interrupt-mode-low",
    "interrupt-time-stops",
    "interrupt-no-volatile",
  ],
  // 13. Hidden traps
  [
    "delay-blocks",
    "two-rates",
    "millis-int",
    "millis-no-update",
    "assign-in-if",
    "semicolon-after-if",
    "int-division",
    "minute-overflow",
    "count-resets",
    "copy-paste-else",
    "pins-swapped-in-code",
    "button-bounce",
    "toggle-held",
    "servo-kills-pwm",
    "serial-pins",
  ],
];

export const missions: Mission[] = LEVELS.flatMap((ids, i) =>
  ids.map((id) => {
    const mission = catalog.find((m) => m.id === id);
    if (!mission) throw new Error(`Unknown mission "${id}"`);
    return { ...mission, level: (i + 1) as Mission["level"] };
  }),
);
