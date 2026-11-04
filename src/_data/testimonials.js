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
//
// To add a testimonial, copy one item and change its fields.
// Order here = order on the page.

const items = [
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
        name: { uk: "Михайло Борисенко", en: "Mykhailo Borysenko" },
        text: {
            uk: "Професійний підхід і відмінна комунікація. Дуже задоволені результатом.",
            en: "Professional approach and great communication. We are very satisfied with the result.",
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
        prev: "Попередній відгук",
        next: "Наступний відгук",
        rating: "Оцінка: {n} з 5",
    },
    en: {
        title: "Client Testimonials",
        region: "Client testimonials",
        prev: "Previous testimonial",
        next: "Next testimonial",
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
