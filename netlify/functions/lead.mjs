// Lead form endpoint: POST /api/lead  { name, phone, message, source, page, website, budget?, service?, referral? }
// Sends the lead to Telegram. The bot token and chat id come from Netlify
// environment variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) and never reach the browser.

const NAME_RE = /^(?=.{2,80}$)[A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+([\s'’-][A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+)*$/;
const PHONE_RE = /^\+?\d{10,15}$/;

const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

export default async (req) => {
    if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

    let data;
    try {
        data = await req.json();
    } catch {
        return json({ ok: false, error: "bad_request" }, 400);
    }

    // Honeypot: real visitors never see or fill this field. Pretend success to bots.
    if (clean(data.website, 200)) return json({ ok: true });

    const lead = {
        name: clean(data.name, 80),
        phone: clean(data.phone, 20).replace(/[^\d+]/g, "").replace(/(?!^)\+/g, ""),
        message: clean(data.message, 2000),
        source: clean(data.source, 40) || "Form",
        page: clean(data.page, 200),
        // optional selects of the contacts-page brief form
        budget: clean(data.budget, 40),
        service: clean(data.service, 60),
        referral: clean(data.referral, 40),
    };

    if (!NAME_RE.test(lead.name) || !PHONE_RE.test(lead.phone) || lead.message.length < 3) {
        return json({ ok: false, error: "invalid" }, 422);
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
        console.error("lead: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured");
        return json({ ok: false, error: "not_configured" }, 500);
    }

    const extra = [
        lead.service && `🧩 Тип сайту: ${lead.service}`,
        lead.budget && `💰 Бюджет: ${lead.budget}`,
        lead.referral && `🔎 Звідки дізнались: ${lead.referral}`,
    ].filter(Boolean).join("\n");

    // Same message format as before the move to a serverless function (extra lines only when filled).
    const text =
`📩 Нова заявка

👤 Ім’я: ${lead.name}
📞 Телефон: ${lead.phone}
💬 Повідомлення: ${lead.message}
${extra ? `${extra}\n` : ""}
📍 ${lead.source} · ${lead.page}`;

    // TELEGRAM_API_BASE exists only so tests can point the function at a local stub.
    const api = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";

    try {
        const res = await fetch(`${api}/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text }),
        });
        if (!res.ok) {
            console.error("lead: Telegram responded with status", res.status);
            return json({ ok: false, error: "upstream" }, 502);
        }
    } catch (err) {
        console.error("lead: Telegram request failed", err.message);
        return json({ ok: false, error: "upstream" }, 502);
    }

    return json({ ok: true });
};

export const config = { path: "/api/lead" };
