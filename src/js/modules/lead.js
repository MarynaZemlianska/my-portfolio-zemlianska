// Lead submission (both the modal form and the contact section form).
// Credentials come from the local, gitignored config.js (window.APP_CONFIG).
import { pageLang } from "./utils.js";

const MESSAGES = {
    uk: {
        name: "Введіть коректне ім'я",
        phone: "Введіть коректний номер телефону (10–15 цифр)",
        message: "Напишіть повідомлення",
        success: "Дякую! Ваша заявка успішно відправлена. Я зв'яжуся з вами найближчим часом.",
        error: "Сталася помилка! Спробуйте ще раз або напишіть мені в Telegram.",
    },
    en: {
        name: "Please enter a valid name",
        phone: "Please enter a valid phone number (10–15 digits)",
        message: "Please write a message",
        success: "Thank you! Your request has been sent. I will get back to you as soon as possible.",
        error: "Something went wrong. Please try again or message me on Telegram.",
    },
};

export const leadText = MESSAGES[pageLang()];

const NAME_RE = /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+([\s'’-][A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+)*$/;
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

/** Sends a lead to Telegram. Resolves true on success. */
export async function sendLead({ name, phone, message, source }) {
    const { botToken, chatId } = window.APP_CONFIG?.telegram ?? {};
    if (!botToken || !chatId) {
        console.error("Lead form: Telegram config is missing (src/js/config.js).");
        return false;
    }

    const text =
`📩 Нова заявка

👤 Ім’я: ${name}
📞 Телефон: ${phone}
💬 Повідомлення: ${message}

📍 ${source} · ${window.location.pathname}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

    try {
        const res = await fetch(url);
        return res.ok;
    } catch (err) {
        console.error("Lead form: network error", err);
        return false;
    }
}
