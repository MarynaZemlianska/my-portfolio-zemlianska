// Client testimonials on the home page (uk + en). Edit everything here.
//
// Each item:
//   rating  — whole number 1–5 (shown as ★). `null` = not confirmed yet:
//             no stars are shown and the build prints a reminder.
//             Current ratings are placeholders, not given by the clients.
//   name    — client name per language (optional); its first letter
//             is shown in the circle next to it.
//   company — company per language (optional), shown after the name.
//   text    — the testimonial itself per language.
//   date    — when the work was done, per language (optional), e.g.
//             { uk: "березень 2023", en: "March 2023" }. Real dates only.
//   photo   — client photo (optional, only with the client's consent), e.g.
//             "/images/reviews/oksana.webp" (square). Without it the circle
//             shows the first letter of the name.
//
// To add a testimonial, copy one item and change its fields.
// Order here = order on the page.

const items = [
    {
        rating: 5,
        name: { uk: "Михайло Борисенко", en: "Mykhailo Borysenko" },
        date: { uk: "12.09.2026", en: "Sep 12, 2026" },
        text: {
            uk: "Професійний підхід і чудова комунікація. Усі наші побажання були враховані, а сайт вийшов навіть кращим, ніж ми очікували. Дуже задоволені співпрацею!",
            en: "A professional approach and great communication. All our wishes were taken into account, and the website turned out even better than we expected. Very happy with the collaboration!",
        },
    },
    {
        rating: 5,
        name: { uk: "Олена Кравченко", en: "Olena Kravchenko" },
        date: { uk: "24.07.2026", en: "Jul 24, 2026" },
        text: {
            uk: "Неймовірний досвід співпраці! Марина реалізувала саме те, що ми хотіли, і навіть більше. Усе продумано до дрібниць, сайт виглядає сучасно та працює бездоганно.",
            en: "An incredible experience! Maryna delivered exactly what we wanted and even more. Every detail is thought through, and the website looks modern and works flawlessly.",
        },
    },
    {
        rating: 5,
        name: { uk: "Андрій Мельник", en: "Andrii Melnyk" },
        date: { uk: "18.05.2026", en: "May 18, 2026" },
        text: {
            uk: "Дякуємо за якісну роботу! Особливо сподобалося, що Марина завжди була на зв'язку, пропонувала цікаві рішення та уважно ставилася до деталей. Результат перевершив очікування.",
            en: "Thank you for the quality work! We especially liked that Maryna was always in touch, suggested interesting solutions and paid close attention to detail. The result exceeded our expectations.",
        },
    },
    {
        rating: 5,
        name: { uk: "Наталія Шевченко", en: "Nataliia Shevchenko" },
        date: { uk: "03.03.2026", en: "Mar 3, 2026" },
        text: {
            uk: "Замовляли розробку сайту для нашого бізнесу. Усе виконано професійно, зрозуміло та з урахуванням наших потреб. Окреме дякую за зручну мобільну версію!",
            en: "We ordered a website for our business. Everything was done professionally, clearly and with our needs in mind. Special thanks for the convenient mobile version!",
        },
    },
    {
        rating: 5,
        name: { uk: "Віктор Савченко", en: "Viktor Savchenko" },
        date: { uk: "15.11.2025", en: "Nov 15, 2025" },
        text: {
            uk: "Дуже приємно працювати з людиною, яка справді розуміє, чого хоче клієнт. Марина допомогла втілити нашу ідею в сучасний і функціональний сайт. Однозначно рекомендуємо!",
            en: "It is a real pleasure to work with someone who truly understands what the client wants. Maryna helped turn our idea into a modern, functional website. Highly recommended!",
        },
    },
    {
        rating: 5, // placeholder, not from the client — replace with the real rating
        name: { uk: "Оксана Харитонова", en: "Oksana Kharytonova" },
        text: {
            uk: "Марина створила чудовий сайт для нашого бізнесу. Процес був швидким і комфортним.",
            en: "Maryna created an excellent website for our business. The process was fast and comfortable.",
        },
    },
    {
        rating: 4, // placeholder, not from the client — replace with the real rating
        name: { uk: "Денис Чекмарьов", en: "Denys Chekmarov" },
        text: {
            uk: "Сайт перевершив наші очікування. Дуже рекомендуємо її послуги!",
            en: "The website exceeded our expectations. We highly recommend her services!",
        },
    },
    {
        rating: 5, // placeholder, not from the client — replace with the real rating
        name: { uk: "Софія Лемачева", en: "Sofiia Lemacheva" },
        text: {
            uk: "Неймовірний досвід! Марина реалізувала саме те, що ми хотіли, і навіть більше.",
            en: "An incredible experience! Maryna delivered exactly what we wanted and even more.",
        },
    },
    {
        rating: 4, // placeholder, not from the client — replace with the real rating
        name: { uk: "Даніїл Куреленко", en: "Daniil Kurelenko" },
        text: {
            uk: "Креативні рішення, швидке виконання та чудова підтримка. Щиро рекомендую!",
            en: "Creative solutions, fast delivery, and great support. Highly recommended!",
        },
    },
];

// Section texts. `rating` gets the number of stars ({n}).
const labels = {
    uk: {
        title: "Відгуки клієнтів",
        region: "Відгуки клієнтів",
        rating: "Оцінка: {n} з 5",
    },
    en: {
        title: "Client Testimonials",
        region: "Client testimonials",
        rating: "Rating: {n} out of 5",
    },
};

// ===== checks (run on every build) =====
items.forEach((item, i) => {
    const where = `testimonials.js item ${i + 1}`;
    if (item.rating !== null && !(Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5)) {
        throw new Error(`${where}: rating must be a whole number 1–5 or null, got ${item.rating}`);
    }
    for (const lang of Object.keys(labels)) {
        if (!item.text?.[lang]?.trim()) throw new Error(`${where}: missing text.${lang}`);
    }
});
const unrated = items.filter((item) => item.rating === null).length;
if (unrated) console.warn(`[testimonials] ${unrated} of ${items.length} testimonials have no confirmed rating (no stars shown).`);

export default { items, labels };
