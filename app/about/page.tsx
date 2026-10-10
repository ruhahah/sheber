"use client";

import Link from "next/link";
import type { Text } from "@/lib/missions";
import { useAppState } from "@/lib/store";
import { ui } from "@/lib/ui";

const title: Text = { en: "About Sheber", kk: "Sheber туралы", ru: "О Sheber" };

const sections: { heading: Text; body: Text; steps?: Text[] }[] = [
  {
    heading: { en: "What it is", kk: "Бұл не", ru: "Что это" },
    body: {
      en: "Sheber is a trainer for finding faults in electronics and Arduino projects. Instead of explaining how things work and hoping it sticks, it shows a project that doesn't work and asks you to find out why.",
      kk: "Sheber — электроника мен Arduino жобаларындағы ақауларды іздеуге арналған тренажёр. Ол бәрінің қалай жұмыс істейтінін түсіндіріп, есте қалар деп үміттенудің орнына, жұмыс істемейтін жобаны көрсетіп, себебін табуды сұрайды.",
      ru: "Sheber — тренажёр по поиску неисправностей в электронике и проектах на Arduino. Вместо того чтобы объяснять, как всё устроено, и надеяться, что это запомнится, он показывает проект, который не работает, и просит выяснить почему.",
    },
  },
  {
    heading: { en: "How it works", kk: "Қалай жұмыс істейді", ru: "Как это работает" },
    body: {
      en: "Every mission has the same three steps.",
      kk: "Әр миссия бірдей үш қадамнан тұрады.",
      ru: "В каждой миссии одни и те же три шага.",
    },
    steps: [
      {
        en: "Read what the project should do and what actually happens.",
        kk: "Жоба не істеуі керек екенін және шын мәнінде не болатынын оқы.",
        ru: "Прочитай, что проект должен делать и что происходит на самом деле.",
      },
      {
        en: "Study the circuit and the code.",
        kk: "Сызба мен кодты зертте.",
        ru: "Изучи схему и код.",
      },
      {
        en: "Pick the fault. The explanation shows where it was and how to fix it.",
        kk: "Ақауды таңда. Түсіндірме оның қай жерде болғанын және қалай жөндеуге болатынын көрсетеді.",
        ru: "Выбери поломку. Разбор покажет, где она была и как её исправить.",
      },
    ],
  },
  {
    heading: { en: "Who it is for", kk: "Кімге арналған", ru: "Для кого" },
    body: {
      en: "For anyone starting from zero, and especially for schools that have no robotics kits: everything runs in the browser.",
      kk: "Нөлден бастайтын кез келген адамға, әсіресе робототехника жинақтары жоқ мектептерге арналған: бәрі браузерде жұмыс істейді.",
      ru: "Для всех, кто начинает с нуля, и особенно для школ без наборов по робототехнике: всё работает в браузере.",
    },
  },
  {
    heading: { en: "Your data", kk: "Деректерің", ru: "Твои данные" },
    body: {
      en: "Your name, avatar, settings and answers are saved only in this browser. Nothing is sent to a server. If you copy your result, only you decide who gets it.",
      kk: "Атың, аватарың, баптауларың мен жауаптарың тек осы браузерде сақталады. Серверге ештеңе жіберілмейді. Нәтижеңді көшірсең, оны кімге жіберетініңді өзің ғана шешесің.",
      ru: "Имя, аватар, настройки и ответы сохраняются только в этом браузере. На сервер ничего не отправляется. Если ты копируешь результат, только ты решаешь, кому его отправить.",
    },
  },
  {
    heading: { en: "Sources", kk: "Дереккөздер", ru: "Источники" },
    body: {
      en: "Explanations follow the official Arduino documentation; most missions link to the page they rely on.",
      kk: "Түсіндірмелер Arduino-ның ресми құжаттамасына сүйенеді; миссиялардың көбінде негізге алынған бетке сілтеме бар.",
      ru: "Разборы опираются на официальную документацию Arduino; в большинстве миссий есть ссылка на страницу, на которой они основаны.",
    },
  },
];

export default function About() {
  const { lang } = useAppState();
  const t = ui[lang];

  return (
    <main className="mx-auto max-w-2xl">
      <p className="eyebrow">{t.about}</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">{title[lang]}</h1>

      {sections.map((section) => (
        <section key={section.heading.en} className="mt-10">
          <h2 className="font-display text-xl font-bold">{section.heading[lang]}</h2>
          <p className="mt-3 text-lg leading-relaxed">{section.body[lang]}</p>
          {section.steps && (
            <ol className="mt-4 space-y-3">
              {section.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="keycap">{i + 1}</span>
                  <span className="text-lg leading-relaxed">{step[lang]}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/demo/1" className="btn btn-primary">
          {t.demoStart} →
        </Link>
        <Link href="/learn" className="btn">
          {t.navLearn} →
        </Link>
      </div>
    </main>
  );
}
