export const LANGS = ["en", "kk", "ru"] as const;
export type Lang = (typeof LANGS)[number];
export type Text = Record<Lang, string>;
export type FaultType = "component" | "code" | "wiring" | "limits" | "power";

// Two-terminal parts have terminals "a" (left) and "b" (right); x, y is terminal "a".
// Chips have named pins on their left and right edges; x, y is the top-left corner.
export type Part =
  | { id: string; kind: "resistor"; label: string; x: number; y: number }
  | { id: string; kind: "led"; x: number; y: number; flip?: boolean; tint?: "blue" }
  | { id: string; kind: "button" | "motor" | "wire"; x: number; y: number }
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

export type Mission = {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  lesson: string;
  title: Text;
  primer: Text;
  goal: Text;
  diagram: Diagram;
  wiring: { from: Text; to: Text }[];
  code: string;
  symptom: Text;
  options: Text[];
  answer: number;
  faultType: FaultType;
  explanation: Text;
};

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
];

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
  ["open-loop", "short-wire", "low-voltage", "no-resistor-9v"],
  [
    "wrong-pin",
    "no-ground",
    "missing-semicolon",
    "setup-once",
    "no-second-delay",
    "led-backwards",
    "missing-pinmode",
  ],
  ["resistor-too-large", "floating-button", "pullup-inverted", "no-pwm-pin", "leds-in-series"],
  [
    "pot-no-5v",
    "digital-read-analog",
    "analogwrite-overflow",
    "ldr-no-divider",
    "baud-mismatch",
    "sonar-swapped",
    "i2c-swapped",
    "button-short",
  ],
  ["motor-on-pin", "servo-brownout", "no-common-ground"],
  ["delay-blocks", "millis-int", "assign-in-if", "int-division", "button-bounce", "serial-pins"],
];

export const missions: Mission[] = LEVELS.flatMap((ids, i) =>
  ids.map((id) => {
    const mission = catalog.find((m) => m.id === id);
    if (!mission) throw new Error(`Unknown mission "${id}"`);
    return { ...mission, level: (i + 1) as Mission["level"] };
  }),
);
