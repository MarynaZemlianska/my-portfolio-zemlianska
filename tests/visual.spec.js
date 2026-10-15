import { test, expect } from "@playwright/test";
import { mockTelegram } from "./helpers.js";

// Visual regression of the first screen of each page type, so design changes are
// noticed. Update intentionally changed baselines with: npx playwright test --update-snapshots
const PAGES = ["/", "/en/", "/projects/", "/services/landing-page/", "/en/services/corporate-website/", "/privacy/"];

test.describe("visual", () => {
    test.skip(() => !["chromium", "mobile-chrome"].includes(test.info().project.name), "baselines are kept for desktop and phone Chromium");
    for (const path of PAGES) {
        test(`first screen ${path}`, async ({ page }) => {
            await mockTelegram(page);
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.goto(path);
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(300);
            await expect(page).toHaveScreenshot({ fullPage: false });
        });
    }
});
