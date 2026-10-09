import type { Lang, Text } from "./missions";

export type Term = {
  id: string;
  label: Text;
  definition: Text;
  // How to spot the term in running text. Word stems, because Russian and Kazakh inflect.
  match: RegExp | Record<Lang, RegExp>;
};

const same = (s: string): Text => ({ en: s, kk: s, ru: s });
// "ток" but not "поток": no Cyrillic letter directly before it.
const tok = /(?<![а-яёәғқңөұүһі])ток/i;

export const glossary: Term[] = [
  {
    id: "voltage",
    label: { en: "Voltage", kk: "Кернеу", ru: "Напряжение" },
    definition: {
      en: "The push that moves current, measured in volts (V).",
      kk: "Токты итеретін күш; вольтпен (В) өлшенеді.",
      ru: "Сила, которая толкает ток; измеряется в вольтах (В).",
    },
    match: { en: /voltage|\bvolts?\b/i, kk: /кернеу/i, ru: /напряжени/i },
  },
  {
    id: "current",
    label: { en: "Current", kk: "Ток", ru: "Ток" },
    definition: {
      en: "How much electric charge is flowing, measured in amperes (A) or milliamps (mA).",
      kk: "Тізбек бойымен қанша заряд ағып жатқаны; ампермен (А) немесе миллиампермен (мА) өлшенеді.",
      ru: "Сколько заряда течёт по цепи; измеряется в амперах (А) или миллиамперах (мА).",
    },
    match: { en: /\bcurrent\b/i, kk: tok, ru: tok },
  },
  {
    id: "resistor",
    label: { en: "Resistor", kk: "Резистор", ru: "Резистор" },
    definition: {
      en: "A part that holds the current back. Its value is measured in ohms (Ω).",
      kk: "Токты шектейтін бөлшек. Оның шамасы оммен (Ом) өлшенеді.",
      ru: "Деталь, которая ограничивает ток. Её величина измеряется в омах (Ом).",
    },
    match: { en: /resistor/i, kk: /резистор/i, ru: /резистор/i },
  },
  {
    id: "led",
    label: { en: "LED", kk: "Жарықдиод", ru: "Светодиод" },
    definition: {
      en: "A small light that lets current through in one direction only.",
      kk: "Токты тек бір бағытта өткізетін кішкентай жарық көзі.",
      ru: "Маленький источник света, который пропускает ток только в одну сторону.",
    },
    match: { en: /\bLEDs?\b/, kk: /жарықдиод/i, ru: /светодиод/i },
  },
  {
    id: "short",
    label: { en: "Short circuit", kk: "Қысқа тұйықталу", ru: "Короткое замыкание" },
    definition: {
      en: "A direct path from plus to minus with nothing to limit the current.",
      kk: "Плюстен минусқа токты ештеңе шектемейтін тікелей жол.",
      ru: "Прямой путь от плюса к минусу, на котором ничто не ограничивает ток.",
    },
    match: { en: /short circuit|shorted/i, kk: /қысқа тұйықталу/i, ru: /коротк\S* замыкани/i },
  },
  {
    id: "pin",
    label: { en: "Pin", kk: "Пин", ru: "Пин" },
    definition: {
      en: "A numbered contact on the board that a wire plugs into.",
      kk: "Платаның сым қосылатын нөмірленген контактісі.",
      ru: "Пронумерованный контакт платы, в который вставляют провод.",
    },
    match: { en: /\bpins?\b/i, kk: /пин/i, ru: /пин/i },
  },
  {
    id: "gnd",
    label: same("GND"),
    definition: {
      en: "Ground: the minus side of the circuit and the zero level all voltages are measured from.",
      kk: "Жер: тізбектің минусы және барлық кернеу өлшенетін нөлдік деңгей.",
      ru: "Земля: минус цепи и нулевой уровень, от которого отсчитывают все напряжения.",
    },
    match: /GND/,
  },
  {
    id: "5v",
    label: same("5V"),
    definition: {
      en: "The pin that always gives plus 5 volts.",
      kk: "Әрдайым плюс 5 вольт беретін пин.",
      ru: "Пин, на котором всегда плюс 5 вольт.",
    },
    match: /\b5V\b/,
  },
  {
    id: "sketch",
    label: { en: "Sketch", kk: "Скетч", ru: "Скетч" },
    definition: {
      en: "A program for the Arduino.",
      kk: "Arduino-ға арналған бағдарлама.",
      ru: "Программа для Arduino.",
    },
    match: { en: /sketch/i, kk: /скетч/i, ru: /скетч/i },
  },
  {
    id: "high-low",
    label: same("HIGH / LOW"),
    definition: {
      en: "The two states of a digital pin: HIGH is 5 V (on), LOW is 0 V (off).",
      kk: "Сандық пиннің екі күйі: HIGH — 5 В (қосулы), LOW — 0 В (өшірулі).",
      ru: "Два состояния цифрового пина: HIGH — это 5 В (включено), LOW — 0 В (выключено).",
    },
    match: /\b(HIGH|LOW)\b/,
  },
  {
    id: "pinmode",
    label: same("pinMode()"),
    definition: {
      en: "Tells the board whether a pin is an output (controls something) or an input (reads something).",
      kk: "Платаға пиннің шығыс (бір нәрсені басқарады) немесе кіріс (бір нәрсені оқиды) екенін хабарлайды.",
      ru: "Сообщает плате, работает пин как выход (чем-то управляет) или как вход (что-то читает).",
    },
    match: /pinMode/,
  },
  {
    id: "delay",
    label: same("delay()"),
    definition: {
      en: "Pauses the whole program for the given number of milliseconds (1000 = one second).",
      kk: "Бүкіл бағдарламаны берілген миллисекунд санына тоқтатады (1000 = бір секунд).",
      ru: "Останавливает всю программу на заданное число миллисекунд (1000 = одна секунда).",
    },
    match: /delay\(/,
  },
  {
    id: "pullup",
    label: same("Pull-up / pull-down"),
    definition: {
      en: "A resistor that holds an input pin at a known level while nothing else drives it.",
      kk: "Кірісті ештеңе басқармай тұрғанда оны белгілі деңгейде ұстайтын резистор.",
      ru: "Резистор, который удерживает вход на известном уровне, пока им ничто не управляет.",
    },
    match: /pull-?(up|down)|PULLUP/i,
  },
  {
    id: "pwm",
    label: { en: "PWM", kk: "ШИМ (PWM)", ru: "ШИМ (PWM)" },
    definition: {
      en: "Switching a pin on and off very fast to imitate a voltage between 0 and 5 V.",
      kk: "0 мен 5 В арасындағы кернеуді бейнелеу үшін пинді өте жылдам қосып-өшіру.",
      ru: "Очень быстрое включение и выключение пина, которое имитирует напряжение между 0 и 5 В.",
    },
    match: /PWM|ШИМ|analogWrite/,
  },
  {
    id: "analogread",
    label: same("analogRead()"),
    definition: {
      en: "Measures the voltage on pins A0–A5 and returns a number from 0 to 1023.",
      kk: "A0–A5 пиндеріндегі кернеуді өлшеп, 0-ден 1023-ке дейінгі сан қайтарады.",
      ru: "Измеряет напряжение на пинах A0–A5 и возвращает число от 0 до 1023.",
    },
    match: /analogRead/,
  },
  {
    id: "serial",
    label: same("Serial Monitor"),
    definition: {
      en: "A window in the Arduino IDE that shows the text the board sends to the computer.",
      kk: "Arduino IDE-дегі плата компьютерге жіберген мәтінді көрсететін терезе.",
      ru: "Окно в Arduino IDE, которое показывает текст, отправленный платой на компьютер.",
    },
    match: /Serial/,
  },
  {
    id: "millis",
    label: same("millis()"),
    definition: {
      en: "Returns how many milliseconds have passed since the board started.",
      kk: "Плата іске қосылғаннан бері қанша миллисекунд өткенін қайтарады.",
      ru: "Возвращает, сколько миллисекунд прошло с запуска платы.",
    },
    match: /millis/,
  },
];

// The glossary terms that occur in a piece of text, in glossary order.
export function termsIn(text: string, lang: Lang) {
  return glossary.filter((term) =>
    (term.match instanceof RegExp ? term.match : term.match[lang]).test(text),
  );
}
