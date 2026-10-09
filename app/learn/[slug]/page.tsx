import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonView } from "@/components/LessonView";
import { lessons } from "@/lib/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export default function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ slug }) => {
        const index = lessons.findIndex((l) => l.slug === slug);
        if (index < 0) notFound();
        return <LessonView index={index} />;
      })}
    </Suspense>
  );
}
