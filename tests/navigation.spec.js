import { test, expect } from "@playwright/test";
import { SERVICES, mockTelegram } from "./helpers.js";

test.beforeEach(async ({ page }) => { await mockTelegram(page); });

const PAIRS = [["/", "/en/"], ["/projects/", "/en/projects/"], ["/privacy/", "/en/privacy/"],
    ...SERVICES.map((s) => [`/services/${s}/`, `/en/services/${s}/`])];

for (const [uk, en] of PAIRS) {
    test(`language switch keeps the page: ${uk} <-> ${en}`, async ({ page, isMobile }) => {
        const switcher = isMobile ? ".mobile-lang-switch" : ".lang-switch";
        await page.goto(uk);
        if (isMobile) await page.click("#burger");
        await page.click(`${switcher} .lang-btn:not(.active)`);
        await expect(page).toHaveURL(en);
        if (isMobile) await page.click("#burger");
        await page.click(`${switcher} .lang-btn:not(.active)`);
        await expect(page).toHaveURL(uk);
    });
}

test("hreflang-style counterpart links exist for every page", async ({ page }) => {
    for (const [uk, en] of PAIRS) {
        await page.goto(uk);
        await expect(page.locator(`.lang-btn[data-url="${en}"]`).first()).toHaveCount(1);
    }
});

test("services dropdown reaches every service page", async ({ page, isMobile }) => {
    for (const s of SERVICES) {
        await page.goto("/en/");
        if (isMobile) await page.click("#burger");
        await page.click(".nav-link--dropdown");
        await page.click(`.dropdown-menu a[href="/en/services/${s}/"]`);
        await expect(page).toHaveURL(`/en/services/${s}/`);
    }
});

test("mobile menu opens, closes with Escape and on navigation", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await page.click("#burger");
    await expect(page.locator(".nav")).toHaveClass(/active/);
    await expect(page.locator("#burger")).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator(".nav")).not.toHaveClass(/active/);
});

test("back-to-top button appears after scrolling", async ({ page }) => {
    await page.goto("/en/");
    await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
    await expect(page.locator("#toTopBtn")).toHaveClass(/show/);
});
