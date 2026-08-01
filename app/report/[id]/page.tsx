import { EvidenceReport } from "@/components/evidence-report";
import { demoAssets } from "@/lib/analysis";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const asset = demoAssets.find((item) => item.id === id);
  return {
    title: asset
      ? `${asset.name} — Evidence report — Verity`
      : "Evidence report — Verity",
    robots: { index: false, follow: false },
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EvidenceReport id={id} />;
}
