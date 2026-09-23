"use client";

import dynamic from "next/dynamic";

const BrochureScrollViewer = dynamic(
  () => import("@/components/academic-sessions/BrochureScrollViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(92vh,1100px)] min-h-[560px] items-center justify-center rounded-2xl border border-navy/10 bg-white shadow-sm sm:min-h-[720px]">
        <p className="text-sm text-navy/50">Loading brochure…</p>
      </div>
    ),
  }
);

type BrochureViewerSectionProps = {
  url: string;
  title: string;
};

/** Client boundary so `next/dynamic` + `ssr: false` is valid. */
export default function BrochureViewerSection({
  url,
  title,
}: BrochureViewerSectionProps) {
  return <BrochureScrollViewer url={url} title={title} />;
}
