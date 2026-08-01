import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Verity product experience", () => {
  test("core routes render without serious accessibility violations", async ({
    page,
  }) => {
    for (const route of [
      "/",
      "/verify",
      "/workspace",
      "/report/northstar-editorial",
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(
        results.violations.filter((violation) =>
          ["critical", "serious"].includes(violation.impact ?? ""),
        ),
      ).toEqual([]);
    }
  });

  test("local image analysis exposes all inspection tools and report", async ({
    page,
  }) => {
    await page.goto("/verify");
    await page
      .locator('input[type="file"]')
      .setInputFiles({
        name: "evidence.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#315cff"/></svg>',
        ),
      });
    await expect(
      page.getByText("No credential found", { exact: true }),
    ).toBeVisible({ timeout: 8_000 });
    await page.getByRole("tab", { name: "Credential layers" }).click();
    await expect(page.getByText("Active manifest")).toBeVisible();
    await page.getByRole("tab", { name: "Fingerprint" }).click();
    await expect(page.getByText("SHA-256 / LOCAL DIGEST")).toBeVisible();
    await page.getByRole("button", { name: /Open evidence report/i }).click();
    await expect(
      page.getByRole("heading", { name: "evidence.svg" }),
    ).toBeVisible();
  });

  test("workspace filtering and responsive navigation remain usable", async ({
    page,
  }) => {
    await page.goto("/workspace");
    await page.getByPlaceholder("Search assets").fill("campaign");
    await expect(page.getByText("Campaign-export.png")).toBeVisible();
    await expect(page.getByText("Northern-light.jpg")).toBeHidden();
    await page.getByRole("button", { name: "Review", exact: true }).click();
    await expect(page.getByText("Campaign-export.png")).toBeVisible();
  });
});
