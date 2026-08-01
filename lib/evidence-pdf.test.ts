import { describe, expect, it } from "vitest";
import { demoAssets } from "./analysis";
import { createEvidencePdf } from "./evidence-pdf";

describe("evidence PDF export", () => {
  it("creates a downloadable PDF document containing the report identity", async () => {
    const blob = createEvidencePdf(demoAssets[0], "Credential verified");
    const content = await blob.text();
    expect(blob.type).toBe("application/pdf");
    expect(content.startsWith("%PDF-1.4")).toBe(true);
    expect(content).toContain("northstar-editorial");
    expect(content).toContain("%%EOF");
  });
});
