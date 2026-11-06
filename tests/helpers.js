export const SERVICES = ["landing-page", "business-website", "corporate-website", "personal-website", "e-commerce", "additional"];

export const PAGES = [
    "/", "/en/", "/services/", "/en/services/", "/projects/", "/en/projects/", "/contacts/", "/en/contacts/", "/privacy/", "/en/privacy/",
    ...SERVICES.flatMap((s) => [`/services/${s}/`, `/en/services/${s}/`]),
];

/**
 * Guards a page for lead tests:
 * - the browser must never talk to Telegram directly (that would mean a leaked token path)
 * - records every browser request to /api/lead
 * - optional failure simulation of the endpoint: { fail: true } (network) or { status: 502 }
 * Real forwarding to the Telegram stub is verified via telegramLog().
 */
export async function mockTelegram(page, { status, fail = false, delay = 0 } = {}) {
    const calls = [];
    page.directTelegram = [];
    await page.route("https://api.telegram.org/**", (route) => {
        page.directTelegram.push(route.request().url());
        return route.abort();
    });
    await page.route("**/api/lead", async (route) => {
        let body = {};
        try { body = JSON.parse(route.request().postData() || "{}"); } catch { /* ignore */ }
        calls.push(body);
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (fail) return route.abort("internetdisconnected");
        if (status) return route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ ok: false }) });
        return route.continue();
    });
    return calls;
}

/** Messages the Telegram stub received (from the real serverless function). */
export async function telegramLog(request, marker) {
    const res = await request.get("/__telegram/log");
    const log = await res.json();
    return marker ? log.filter((m) => (m.text || "").includes(marker)) : log;
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

/** Collect uncaught errors and console errors (incl. CSP violations). */
export function trackErrors(page) {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    return errors;
}
