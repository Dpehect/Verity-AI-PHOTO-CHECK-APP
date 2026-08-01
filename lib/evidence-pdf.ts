import type { AssetAnalysis } from "./analysis";
import { formatBytes } from "./analysis";

const escapePdf = (value: string) =>
  value.replace(/[^\x20-\x7e]/g, "?").replace(/([\\()])/g, "\\$1");

export function createEvidencePdf(analysis: AssetAnalysis, status: string) {
  const lines = [
    [18, 800, 11, "VERITY / EVIDENCE REPORT"],
    [18, 770, 22, analysis.name.slice(0, 46)],
    [18, 746, 9, `Report ID: ${analysis.id}`],
    [18, 720, 13, "Verification result"],
    [18, 702, 11, status],
    [18, 670, 10, `File type: ${analysis.mime}`],
    [18, 654, 10, `File size: ${formatBytes(analysis.size)}`],
    [
      18,
      638,
      10,
      `Dimensions: ${analysis.width ? `${analysis.width} x ${analysis.height}` : "Unavailable"}`,
    ],
    [18, 622, 10, `Signer: ${analysis.signer || "Unavailable"}`],
    [18, 606, 10, `Ingredients: ${analysis.ingredients || "None found"}`],
    [18, 570, 12, "SHA-256 fingerprint"],
    [18, 550, 8, analysis.fingerprint.slice(0, 40)],
    [18, 536, 8, analysis.fingerprint.slice(40)],
    [
      18,
      70,
      8,
      "Content provenance describes available history; it does not determine whether a claim is true.",
    ],
  ] as const;
  const content = [
    "0.192 0.361 1 rg",
    "18 817 559 8 re f",
    "0 0 0 rg",
    ...lines.map(
      ([x, y, size, value]) =>
        `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdf(value)}) Tj ET`,
    ),
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadEvidencePdf(analysis: AssetAnalysis, status: string) {
  const url = URL.createObjectURL(createEvidencePdf(analysis, status));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `verity-${analysis.id.slice(0, 8)}.pdf`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
