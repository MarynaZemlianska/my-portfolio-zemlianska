// Lead submission (both the modal form and the contact section form).
import { pageLang } from "./utils.js";

const MESSAGES = {
    uk: {
        name: "Введіть коректне ім'я",
        phone: "Введіть коректний номер телефону (10–15 цифр)",
        message: "Напишіть повідомлення",
        consent: "Підтвердьте згоду з політикою конфіденційності",
        success: "Дякую! Ваша заявка успішно відправлена. Я зв'яжуся з вами найближчим часом.",
        error: "Сталася помилка! Спробуйте ще раз або напишіть мені в Telegram.",
    },
    en: {
        name: "Please enter a valid name",
        phone: "Please enter a valid phone number (10–15 digits)",
        message: "Please write a message",
        consent: "Please accept the privacy policy",
        success: "Thank you! Your request has been sent. I will get back to you as soon as possible.",
        error: "Something went wrong. Please try again or message me on Telegram.",
    },
};

export const leadText = MESSAGES[pageLang()];

// at least 2 letters, words separated by space / apostrophe / hyphen
const NAME_RE = /^(?=.{2,})[A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+([\s'’-][A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+)*$/;
const PHONE_RE = /^\+?\d{10,15}$/;

export const cleanPhone = (value) =>
    value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");

/** Returns the name of the first invalid field, or null. */
export function validateLead({ name, phone, message }) {
    if (!NAME_RE.test(name)) return "name";
    if (!PHONE_RE.test(phone)) return "phone";
    if (message.length < 3) return "message";
    return null;
}

/**
 * Sends a lead to the serverless endpoint (netlify/functions/lead.mjs), which
 * forwards it to Telegram. No credentials exist in the browser.
 * Resolves true on success.
 */
export async function sendLead({ name, phone, message, source, website = "", budget = "", service = "", referral = "" }) {
    try {
        const res = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, phone, message, source, website, budget, service, referral,
                page: window.location.pathname,
            }),
        });
        const body = await res.json().catch(() => ({}));
        return res.ok && body.ok === true;
    } catch (err) {
        console.error("Lead form: network error", err);
        return false;
    }
}
