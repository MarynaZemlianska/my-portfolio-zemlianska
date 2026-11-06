import { prefersReducedMotion, rafThrottle } from "./utils.js";

// ===== FAQ ACCORDION =====
export function initFaq() {
    document.querySelectorAll(".faq-question").forEach((btn) => {
        const item = btn.closest(".faq-item");
        if (!item) return;
        btn.setAttribute("aria-expanded", String(item.classList.contains("active")));
        btn.addEventListener("click", () => {
            const open = item.classList.toggle("active");
            btn.setAttribute("aria-expanded", String(open));
        });
    });
}

// ===== PROJECT FILTERS =====
export function initProjectFilters() {
    const buttons = document.querySelectorAll(".projects-filters button");
    const cards = document.querySelectorAll(".card[data-type]");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.classList.contains("active")));
        btn.addEventListener("click", () => {
            buttons.forEach((b) => {
                b.classList.toggle("active", b === btn);
                b.setAttribute("aria-pressed", String(b === btn));
            });
            const filter = btn.dataset.filter;
            cards.forEach((card) => {
                card.style.display = filter === "all" || filter === card.dataset.type ? "flex" : "none";
            });
        });
    });
}

// ===== LANGUAGE SWITCH =====
export function initLangSwitch() {
    document.querySelectorAll(".lang-btn[data-url]").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!btn.classList.contains("active")) window.location.href = btn.dataset.url;
        });
    });
}

// ===== ABOUT PARALLAX =====
export function initAboutParallax() {
    const section = document.querySelector(".section-about");
    const photo = document.querySelector(".about-photo-container");
    const text = document.querySelector(".about-title-wrap");
    if (!section || !photo || !text || prefersReducedMotion()) return;

    // only while photo and text sit side by side: in the one-column layout
    // (title -> photo -> text) the opposite shifts made the text run over the photo
    const sideBySide = window.matchMedia("(min-width: 951px)");

    const update = rafThrottle(() => {
        if (!sideBySide.matches) {
            photo.style.transform = "";
            text.style.transform = "";
            return;
        }
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        photo.style.transform = `translateY(${progress * 60}px)`;
        text.style.transform = `translateY(${progress * -40}px)`;
    });

    window.addEventListener("scroll", update, { passive: true });
    sideBySide.addEventListener("change", update);
    update();
}

// ===== SERVICE PAGE CARD TILT =====
export function initCardTilt() {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;

    document.querySelectorAll(".lp-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const rx = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
            const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
        });
    });
}
