import { test, expect } from "@playwright/test";
import { mockTelegram, telegramLog } from "./helpers.js";

const marker = () => `T${Date.now()}${Math.floor(Math.random() * 1e6)}`;

async function openModal(page) {
    await page.locator(".open-modal:visible").first().click();
    await expect(page.locator("#consultationForm")).toBeVisible();
}

async function fillModal(page, { name = "Test User", phone = "+380 63 000 00 00", message = "Hello there" } = {}) {
    await page.fill("#consultationForm [name=name]", name);
    await page.fill("#consultationForm [name=phone]", phone);
    await page.fill("#consultationForm [name=message]", message);
}

test("modal: lead goes browser -> /api/lead -> Telegram, once (EN)", async ({ page, request }) => {
    const calls = await mockTelegram(page, { delay: 300 });
    const m = marker();
    await page.goto("/en/");
    await openModal(page);
    await fillModal(page, { message: `Hello ${m}` });
    await page.click("#consultationForm [type=submit]");
    await expect(page.locator("#consultationForm [type=submit]")).toBeDisabled();
    await page.click("#consultationForm [type=submit]", { force: true }).catch(() => {});
    await expect(page.locator("#toast-success")).toHaveClass(/show/);
    await expect(page.locator("#toast-success")).toContainText("Thank you");

    expect(calls).toHaveLength(1);
    const sent = await telegramLog(request, m);
    expect(sent).toHaveLength(1);
    expect(sent[0].chat_id).toBe("TEST-CHAT");
    expect(sent[0].text).toContain("+380630000000");
    expect(sent[0].text).toContain("Modal · /en/");
    expect(page.directTelegram, "browser never calls Telegram directly").toEqual([]);
});

test("brief form on the home page sends the lead (UA)", async ({ page, request }) => {
    const calls = await mockTelegram(page);
    const m = marker();
    await page.goto("/");
    await page.fill("#user-name", "Марина");
    await page.fill("#user-phone", "+380630000000");
    await page.fill("#user-message", `Перевірка ${m}`);
    await page.check(".brief-consent input");
    await page.click(".brief-button");
    await expect(page.locator("#toast")).toHaveClass(/show/);
    await expect(page.locator("#toast")).toContainText("Дякую");
    expect(calls).toHaveLength(1);
    const sent = await telegramLog(request, m);
    expect(sent).toHaveLength(1);
    expect(sent[0].text).toContain("Brief form · /");
    await expect(page.locator("#user-name")).toHaveValue("");
});

test("modal: network failure keeps data and shows an error (UA)", async ({ page }) => {
    await mockTelegram(page, { fail: true });
    await page.goto("/");
    await openModal(page);
    await fillModal(page, { name: "Тест", message: "Привіт" });
    await page.click("#consultationForm [type=submit]");
    await expect(page.locator("#toast-error")).toHaveClass(/show/);
    await expect(page.locator("#toast-error")).toContainText("помилка");
    await expect(page.locator("#consultationForm [name=message]")).toHaveValue("Привіт");
    await expect(page.locator("#consultationForm [type=submit]")).toBeEnabled();
});

test("brief form: Telegram error is reported to the user, data kept", async ({ page }) => {
    await mockTelegram(page);
    await page.goto("/en/");
    await page.fill("#user-name", "Test");
    await page.fill("#user-phone", "+380630000000");
    await page.fill("#user-message", "SIMULATE_TELEGRAM_ERROR please");
    await page.check(".brief-consent input");
    await page.click(".brief-button");
    await expect(page.locator("#toast")).toHaveClass(/show/);
    await expect(page.locator("#toast")).toContainText("Something went wrong");
    await expect(page.locator("#user-message")).toHaveValue("SIMULATE_TELEGRAM_ERROR please");
});

test("modal: invalid input is rejected in the browser, no request", async ({ page }) => {
    const calls = await mockTelegram(page);
    await page.goto("/en/");
    await openModal(page);
    await fillModal(page, { phone: "123" });
    await page.click("#consultationForm [type=submit]");
    await expect(page.locator("#toast-error")).toHaveClass(/show/);
    await expect(page.locator("#toast-error")).toContainText("phone");
    expect(calls).toHaveLength(0);
});

test("contact form: validation message is in the page language", async ({ page }) => {
    const calls = await mockTelegram(page);
    await page.goto("/en/");
    await page.fill("#user-name", "Test");
    await page.fill("#user-phone", "12");
    await page.fill("#user-message", "Hi there");
    await page.check(".brief-consent input");
    await page.click(".brief-button");
    const msg = await page.evaluate(() => document.getElementById("user-phone").validationMessage);
    expect(msg).toMatch(/phone/i);
    expect(calls).toHaveLength(0);
});

test("modal: Escape closes and returns focus", async ({ page }) => {
    await mockTelegram(page);
    await page.goto("/en/");
    const opener = page.locator(".open-modal:visible").first();
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#consultationForm")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#consultationModal")).toBeHidden();
    await expect(opener).toBeFocused();
});

test.describe("serverless endpoint /api/lead", () => {
    test("validates on the server and rejects bad input", async ({ request }) => {
        const m = marker();
        const bad = await request.post("/api/lead", { data: { name: "X", phone: "1", message: `x ${m}` } });
        expect(bad.status()).toBe(422);
        expect(await telegramLog(request, m)).toHaveLength(0);
    });

    test("honeypot: bots get ok but nothing is forwarded", async ({ request }) => {
        const m = marker();
        const res = await request.post("/api/lead", {
            data: { name: "Bot Name", phone: "+380630000000", message: `spam ${m}`, website: "http://spam" },
        });
        expect(res.status()).toBe(200);
        expect(await telegramLog(request, m)).toHaveLength(0);
    });

    test("only POST is allowed", async ({ request }) => {
        expect((await request.get("/api/lead")).status()).toBe(405);
    });
});

test("no Telegram credentials or API calls in the shipped site", async ({ request }) => {
    for (const asset of ["/assets/js/main.js", "/assets/js/modules/lead.js", "/en/", "/"]) {
        const text = await (await request.get(asset)).text();
        expect(text, asset).not.toContain("api.telegram.org");
        expect(text, asset).not.toMatch(/\d{8,10}:[A-Za-z0-9_-]{30,}/); // bot token shape
        expect(text, asset).not.toContain("APP_CONFIG");
    }
    expect((await request.get("/assets/js/config.js")).status()).toBe(404);
});

test("contacts page brief form sends selects and requires consent (EN)", async ({ page, request }) => {
    const calls = await mockTelegram(page);
    const m = marker();
    await page.goto("/en/contacts/");
    await page.fill("#user-name", "Test User");
    await page.fill("#user-phone", "+380630000000");
    await page.selectOption("#user-budget", "$600–1000");
    await page.selectOption("#user-service", "Online store");
    await page.selectOption("#user-referral", "Google");
    await page.fill("#user-message", `Brief ${m}`);

    await page.click(".brief-button");
    expect(calls, "no request without consent").toHaveLength(0);

    await page.check(".brief-consent input");
    await page.click(".brief-button");
    await expect(page.locator("#toast")).toHaveClass(/show/);
    expect(calls).toHaveLength(1);
    const sent = await telegramLog(request, m);
    expect(sent).toHaveLength(1);
    expect(sent[0].text).toContain("Online store");
    expect(sent[0].text).toContain("$600–1000");
    expect(sent[0].text).toContain("Google");
    expect(sent[0].text).toContain("Brief form · /en/contacts/");
});
