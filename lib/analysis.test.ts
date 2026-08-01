import { describe, expect, it } from "vitest";
import { demoAssets, formatBytes, validateImage } from "./analysis";

describe("asset analysis helpers", () => {
  it("formats byte values for evidence metadata", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(18_400_000)).toBe("17.5 MB");
  });

  it("rejects unsupported and oversized browser-demo files", () => {
    expect(validateImage({ type: "application/pdf", size: 100 })).toMatch(
      /supported image/,
    );
    expect(
      validateImage({ type: "image/jpeg", size: 26 * 1024 * 1024 }),
    ).toMatch(/25 MB/);
    expect(
      validateImage({ type: "image/webp", size: 2 * 1024 * 1024 }),
    ).toBeNull();
  });

  it("keeps demo evidence states explicit and non-ambiguous", () => {
    expect(demoAssets.map((asset) => asset.state)).toEqual([
      "verified",
      "edited",
      "missing",
    ]);
    expect(demoAssets.find((asset) => asset.state === "missing")?.score).toBe(
      0,
    );
  });
});
