import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES, mockTelegram, scrollThrough } from "./helpers.js";

test.describe("axe WCAG 2.2 AA", () => {
    test.skip(() => test.info().project.name !== "chromium", "axe results don't depend on the engine; run once");
    for (const path of PAGES) {
        test(`no violations: ${path}`, async ({ page }) => {
            await mockTelegram(page);
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.goto(path);
            await scrollThrough(page);
            const { violations } = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
                .analyze();
            expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
        });
    }
});

test("keyboard: skip link, focus ring, dropdown", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop keyboard flow");
    // Safari only tabs to links when "Press Tab to highlight each item" is enabled (OS setting)
    test.skip(test.info().project.name === "webkit", "WebKit default Tab order skips links");
    await mockTelegram(page);
    await page.goto("/en/");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();

    await page.locator(".nav-dropdown-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".dropdown-menu a").first()).toBeVisible();
});

test("reduced motion: content is visible without scrolling animations", async ({ page }) => {
    await mockTelegram(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/");
    // reduced-motion transitions last 0.01ms; allow the next rendered frames to apply them
    await expect.poll(() => page.evaluate(() =>
        [...document.querySelectorAll(".why-card, .service-card, .card, .top-image, .top-container-h1")]
            .filter((el) => getComputedStyle(el).opacity === "0").map((el) => el.className)),
    { timeout: 2000 }).toEqual([]);
});
