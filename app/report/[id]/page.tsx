import { EvidenceReport } from "@/components/evidence-report";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EvidenceReport id={id}/>;
}
