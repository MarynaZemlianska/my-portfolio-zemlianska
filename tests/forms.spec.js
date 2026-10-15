import { test, expect } from "@playwright/test";
import { mockTelegram } from "./helpers.js";

async function openModal(page) {
    await page.locator(".open-modal:visible").first().click();
    await expect(page.locator("#consultationForm")).toBeVisible();
}

async function fillModal(page, { name = "Test User", phone = "+380 63 000 00 00", message = "Hello there" } = {}) {
    await page.fill("#consultationForm [name=name]", name);
    await page.fill("#consultationForm [name=phone]", phone);
    await page.fill("#consultationForm [name=message]", message);
}

test("modal: valid lead is sent once and confirmed (EN)", async ({ page }) => {
    const calls = await mockTelegram(page, { delay: 300 });
    await page.goto("/en/");
    await openModal(page);
    await fillModal(page);
    await page.click("#consultationForm [type=submit]");
    await expect(page.locator("#consultationForm [type=submit]")).toBeDisabled();
    await page.click("#consultationForm [type=submit]", { force: true }).catch(() => {});
    await expect(page.locator("#toast-success")).toContainText("Thank you");
    expect(calls).toHaveLength(1);
    expect(calls[0].text).toContain("+380630000000");
    expect(calls[0].text).toContain("Modal");
});

test("modal: network failure keeps data and shows an error (UA)", async ({ page }) => {
    await mockTelegram(page, { fail: true });
    await page.goto("/");
    await openModal(page);
    await fillModal(page, { name: "Тест", message: "Привіт" });
    await page.click("#consultationForm [type=submit]");
    await expect(page.locator("#toast-error")).toContainText("помилка");
    await expect(page.locator("#consultationForm [name=message]")).toHaveValue("Привіт");
    await expect(page.locator("#consultationForm [type=submit]")).toBeEnabled();
});

test("modal: invalid input is rejected without a request", async ({ page }) => {
    const calls = await mockTelegram(page);
    await page.goto("/en/");
    await openModal(page);
    await fillModal(page, { phone: "123" });
    await page.click("#consultationForm [type=submit]");
    await expect(page.locator("#toast-error")).toContainText("phone");
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

test("contact section form sends the lead (it used to only show a toast)", async ({ page }) => {
    const calls = await mockTelegram(page);
    await page.goto("/");
    await page.fill("#user-name", "Марина");
    await page.fill("#user-phone", "+380630000000");
    await page.fill("#user-message", "Перевірка");
    await page.click(".section-contacts .form-button");
    await expect(page.locator("#toast")).toContainText("Дякую");
    expect(calls).toHaveLength(1);
    expect(calls[0].text).toContain("Contact form");
    await expect(page.locator("#user-name")).toHaveValue("");
});

test("contact form: validation message is in the page language", async ({ page }) => {
    const calls = await mockTelegram(page);
    await page.goto("/en/");
    await page.fill("#user-name", "Test");
    await page.fill("#user-phone", "12");
    await page.fill("#user-message", "Hi there");
    await page.click(".section-contacts .form-button");
    const msg = await page.evaluate(() => document.getElementById("user-phone").validationMessage);
    expect(msg).toMatch(/phone/i);
    expect(calls).toHaveLength(0);
});
