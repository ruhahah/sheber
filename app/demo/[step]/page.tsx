import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MissionView } from "@/components/MissionView";
import { DEMO } from "@/lib/extras";
import { missions } from "@/lib/missions";

export function generateStaticParams() {
  return DEMO.map((_, i) => ({ step: String(i + 1) }));
}

export default function DemoPage({ params }: PageProps<"/demo/[step]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ step }) => {
        const n = Number(step);
        const index = missions.findIndex((m) => m.id === DEMO[n - 1]);
        if (index < 0) notFound();
        return <MissionView key={step} index={index} demo={n} />;
      })}
    </Suspense>
  );
}
