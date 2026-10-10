import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MissionView } from "@/components/MissionView";
import { DEMO, missionProps } from "@/lib/extras";

export function generateStaticParams() {
  return DEMO.map((_, i) => ({ step: String(i + 1) }));
}

export default function DemoPage({ params }: PageProps<"/demo/[step]">) {
  return (
    <Suspense fallback={null}>
      {params.then(({ step }) => {
        const n = Number(step);
        const props = missionProps(DEMO[n - 1]);
        if (!props) notFound();
        return <MissionView key={step} {...props} demo={{ step: n, total: DEMO.length }} />;
      })}
    </Suspense>
  );
}
