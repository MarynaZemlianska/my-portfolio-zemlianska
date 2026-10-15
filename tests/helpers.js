export const SERVICES = ["landing-page", "business-website", "corporate-website", "personal-website", "e-commerce", "additional"];

export const PAGES = [
    "/", "/en/", "/projects/", "/en/projects/", "/privacy/", "/en/privacy/",
    ...SERVICES.flatMap((s) => [`/services/${s}/`, `/en/services/${s}/`]),
];

/** Intercept the Telegram API so tests never send real leads. Returns a call log. */
export async function mockTelegram(page, { status = 200, fail = false, delay = 0 } = {}) {
    const calls = [];
    // the real config.js (with the bot token) is local-only; tests always use a dummy one
    await page.route("**/assets/js/config.js", (route) => route.fulfill({
        contentType: "text/javascript",
        body: 'window.APP_CONFIG = { telegram: { botToken: "TEST", chatId: "1" } };',
    }));
    await page.route("https://api.telegram.org/**", async (route) => {
        const url = new URL(route.request().url());
        calls.push({ text: url.searchParams.get("text") });
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (fail) return route.abort("internetdisconnected");
        return route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ ok: status === 200 }) });
    });
    return calls;
}

/** Scroll through the page so scroll-reveal content and lazy images settle. */
export async function scrollThrough(page) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = await page.evaluate(() => window.innerHeight * 0.8);
    for (let y = 0; y < height; y += step) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

/** Collect uncaught errors and console errors. */
export function trackErrors(page) {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    return errors;
}
