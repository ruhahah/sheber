import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MissionView } from "@/components/MissionView";
import { missionProps } from "@/lib/extras";
import { missions } from "@/lib/missions";

export function generateStaticParams() {
  return missions.map((m) => ({ id: m.id }));
}

export default function MissionPage({ params }: PageProps<"/missions/[id]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ id }) => {
        const props = missionProps(id);
        if (!props) notFound();
        return <MissionView key={id} {...props} />;
      })}
    </Suspense>
  );
}
