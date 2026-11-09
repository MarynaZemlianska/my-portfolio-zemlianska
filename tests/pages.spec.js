import { test, expect } from "@playwright/test";
import { PAGES, mockTelegram, scrollThrough, trackErrors } from "./helpers.js";
import testimonials from "../src/_data/testimonials.js";

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

// The home hero must fill the first screen: nothing of "Projects" before scrolling.
const FOLD_SIZES = [[320, 640], [375, 667], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
for (const path of ["/", "/en/"]) {
    test(`home ${path}: first screen is the hero only`, async ({ page }) => {
        test.skip(test.info().project.name !== "chromium", "viewport sizes are set explicitly; one engine is enough");
        for (const [width, height] of FOLD_SIZES) {
            await page.setViewportSize({ width, height });
            await page.goto(path);
            const r = await page.evaluate(() => {
                const hero = document.querySelector(".hero-home").getBoundingClientRect();
                const projects = document.querySelector(".section-projects").getBoundingClientRect();
                return { vh: innerHeight, heroBottom: hero.bottom, projectsTop: projects.top,
                    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
            });
            expect(r.heroBottom, `${width}x${height}: hero reaches the bottom of the screen`).toBeGreaterThanOrEqual(r.vh - 1);
            expect(r.projectsTop, `${width}x${height}: Projects starts below the fold`).toBeGreaterThanOrEqual(r.vh);
            expect(r.overflow, `${width}x${height}: no horizontal scroll`).toBeLessThanOrEqual(0);
        }
    });
}

// Home testimonials come from src/_data/testimonials.js
for (const [path, label] of [["/", "Оцінка: "], ["/en/", "Rating: "]]) {
    test(`home ${path}: testimonials show rating, text and author`, async ({ page }) => {
        await page.goto(path);
        // the list is rendered twice for the seamless loop; the copy is aria-hidden
        const cards = page.locator(".review-card:not([aria-hidden])");
        await expect(cards).toHaveCount(testimonials.items.length);
        await expect(page.locator(".review-card[aria-hidden='true']")).toHaveCount(testimonials.items.length);
        for (const card of await cards.all()) {
            await expect(card.locator(".review-text p")).not.toBeEmpty();
            await expect(card.locator(".review-name")).not.toBeEmpty();
            const rating = card.locator(".review-rating");
            if (await rating.count()) {
                await expect(rating).toHaveAttribute("aria-label", new RegExp(`^${label}[1-5] `));
            }
        }

        // keyboard: with focus on the row the drift pauses, ArrowRight glides
        // it by about one card (reviews-marquee.js moves it with a transform)
        const slider = page.locator(".reviews-slider");
        const list = page.locator(".reviews-list");
        await slider.scrollIntoViewIfNeeded();
        await slider.focus();
        const x = () => list.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
        await page.waitForTimeout(200);
        const before = await x();
        await page.keyboard.press("ArrowRight");
        await expect.poll(async () => Math.abs((await x()) - before)).toBeGreaterThan(50);
    });
}
