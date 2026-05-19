const translations = {
  en: {
    "meta.title": "Home - Web{LAB} Zemlianska - Websites development",

    "nav.home": "HOME",
    "nav.services": "SERVICES",
    "nav.prices": "PRICES",
    "nav.projects": "PROJECTS",
    "nav.contacts": "CONTACTS",

    "services.landing": "Landing website",
    "services.business": "Business card website",
    "services.corporate": "Corporate website",
    "services.personal": "Personal website",
    "services.ecommerce": "E-commerce websites",
    "services.other": "Other services",

    "buttons.consult": "Free consultation",
    "buttons.estimate": "Get a Free Estimate",
    "buttons.contact": "Get a free consultation",

    "hero.title": "Websites development",
    "hero.text": "Hello, there! I’m a web developer, Maryna Zemlianska. I will bring your business idea to life.",

    "stats.sites": "Sites Completed",
    "stats.years": "Years in IT",
    "stats.clients": "Clients Served",

    "projects.title": "Projects",
    "projects.subtitle": "Click to view the project",

    "services.title": "Services",
    "services.subtitle": "Choose a site type",

    "quote.title": "Request a Website Cost Estimate",
    "quote.text": "Planning to build a website? I create modern, fast and conversion-focused websites.",

    "about.title": "About developer",
    "about.text1": "Hello! My name is Maryna Zemlianska...",

    "why.title": "Why Choose Me",
    "why.subtitle": "Modern websites with thoughtful design...",

    "faq.title": "FAQ",
    "faq.subtitle": "Frequently Asked Questions",

    "faq.q1": "How can I order a website?",
    "faq.a1": "To get started contact me...",

    "contact.title": "Contact me",

    "footer.copy": "Copyright © Maryna Zemlianska 2026"
  },

  ua: {
    "meta.title": "Головна - Web{LAB} Zemlianska - Розробка сайтів",

    "nav.home": "ГОЛОВНА",
    "nav.services": "ПОСЛУГИ",
    "nav.prices": "ЦІНИ",
    "nav.projects": "ПРОЄКТИ",
    "nav.contacts": "КОНТАКТИ",

    "services.landing": "Лендінг сайт",
    "services.business": "Сайт-візитка",
    "services.corporate": "Корпоративний сайт",
    "services.personal": "Персональний сайт",
    "services.ecommerce": "Інтернет-магазин",
    "services.other": "Інші послуги",

    "buttons.consult": "Безкоштовна консультація",
    "buttons.estimate": "Отримати оцінку",
    "buttons.contact": "Отримати консультацію",

    "hero.title": "Розробка сайтів",
    "hero.text": "Вітаю! Я веб-розробниця Марина Землянська. Допоможу реалізувати вашу бізнес-ідею.",

    "stats.sites": "Зроблених сайтів",
    "stats.years": "Років в IT",
    "stats.clients": "Клієнтів",

    "projects.title": "Проєкти",
    "projects.subtitle": "Натисніть, щоб переглянути",

    "services.title": "Послуги",
    "services.subtitle": "Оберіть тип сайту",

    "quote.title": "Запит на оцінку сайту",
    "quote.text": "Плануєте створити сайт? Я розробляю сучасні та швидкі сайти.",

    "about.title": "Про розробника",
    "about.text1": "Вітаю! Мене звати Марина Землянська...",

    "why.title": "Чому обирають мене",
    "why.subtitle": "Сучасні сайти з продуманим дизайном...",

    "faq.title": "Питання",
    "faq.subtitle": "Часті запитання",

    "faq.q1": "Як замовити сайт?",
    "faq.a1": "Щоб почати, зв'яжіться зі мною...",

    "contact.title": "Контакти",

    "footer.copy": "© Марина Землянська 2026 Всі права захищено"
  }
};

// APPLY LANGUAGE
function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = translations[lang][key] || el.innerHTML;
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.lang === lang) btn.classList.add("active");
  });

  localStorage.setItem("lang", lang);
}

// EVENTS
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

// INIT
const savedLang = localStorage.getItem("lang") || "ua";
setLanguage(savedLang);