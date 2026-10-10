import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonView } from "@/components/LessonView";
import { lessonFigure } from "@/lib/extras";
import { lessons } from "@/lib/lessons";
import { breadboardExample } from "@/lib/missions";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export default function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ slug }) => {
        const index = lessons.findIndex((l) => l.slug === slug);
        if (index < 0) notFound();
        return (
          <LessonView
            lesson={lessons[index]}
            index={index}
            figure={lessonFigure(slug)}
            board={slug === "breadboard" ? breadboardExample : undefined}
          />
        );
      })}
    </Suspense>
  );
}
