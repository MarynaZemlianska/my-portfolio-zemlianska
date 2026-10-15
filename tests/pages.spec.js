import { test, expect } from "@playwright/test";
import { PAGES, mockTelegram, scrollThrough, trackErrors } from "./helpers.js";

for (const path of PAGES) {
    test(`page ${path}: loads cleanly`, async ({ page }) => {
        await mockTelegram(page);
        const errors = trackErrors(page);
        const failed = [];
        page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

        await page.goto(path);
        await scrollThrough(page);

        expect(errors, "no JS / console errors").toEqual([]);
        expect(failed, "no failed requests").toEqual([]);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("#consultationModal")).toHaveCount(1);

        const lang = await page.getAttribute("html", "lang");
        expect(lang).toBe(path.startsWith("/en/") ? "en" : "uk");
        await expect(page).toHaveTitle(/Web\{LAB\} Zemlianska/);
        expect(await page.getAttribute('meta[name="description"]', "content")).toBeTruthy();

        // real horizontal overflow (not hidden by CSS)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, "no horizontal scroll").toBeLessThanOrEqual(0);
    });
}

test("all internal links resolve", async ({ page, request }) => {
    const links = new Set();
    for (const path of PAGES) {
        await page.goto(path);
        for (const href of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) {
            if (href.startsWith("/") && !href.startsWith("//")) links.add(href.split("#")[0]);
        }
    }
    for (const link of links) {
        const res = await request.get(link);
        expect(res.status(), link).toBe(200);
    }
});
