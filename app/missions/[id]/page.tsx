import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MissionView } from "@/components/MissionView";
import { missions } from "@/lib/missions";

export function generateStaticParams() {
  return missions.map((m) => ({ id: m.id }));
}

export default function MissionPage({ params }: PageProps<"/missions/[id]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ id }) => {
        const index = missions.findIndex((m) => m.id === id);
        if (index < 0) notFound();
        return <MissionView key={id} index={index} />;
      })}
    </Suspense>
  );
}
