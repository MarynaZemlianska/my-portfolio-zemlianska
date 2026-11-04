import { prefersReducedMotion, rafThrottle } from "./utils.js";

// ===== FAQ ACCORDION =====
export function initFaq() {
    document.querySelectorAll(".faq-question").forEach((btn) => {
        const item = btn.closest(".faq-item");
        if (!item) return;
        btn.setAttribute("aria-expanded", "false");
        btn.addEventListener("click", () => {
            const open = item.classList.toggle("active");
            btn.setAttribute("aria-expanded", String(open));
        });
    });
}

// ===== TESTIMONIALS SLIDER =====
export function initReviews() {
    const slider = document.querySelector(".reviews-slider");
    const list = document.querySelector(".reviews-list");
    const next = document.querySelector(".reviews-next");
    const prev = document.querySelector(".reviews-prev");
    if (!slider || !list || !next || !prev) return;

    const step = () => {
        const card = list.querySelector(".review-card");
        const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
        return (card?.offsetWidth || 0) + gap;
    };
    const behavior = () => (prefersReducedMotion() ? "auto" : "smooth");
    const go = (dir) => slider.scrollBy({ left: dir * step(), behavior: behavior() });

    next.addEventListener("click", () => go(1));
    prev.addEventListener("click", () => go(-1));

    // Arrow keys move one card at a time while the slider has focus
    slider.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: 1, ArrowLeft: -1 };
        if (e.key in keys) {
            e.preventDefault();
            go(keys[e.key]);
        } else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            slider.scrollTo({ left: e.key === "Home" ? 0 : slider.scrollWidth, behavior: behavior() });
        }
    });

    // Arrows are dimmed at the ends; aria-disabled (not disabled) keeps focus on the button
    const update = rafThrottle(() => {
        const max = slider.scrollWidth - slider.clientWidth - 2;
        prev.setAttribute("aria-disabled", String(slider.scrollLeft <= 2));
        next.setAttribute("aria-disabled", String(slider.scrollLeft >= max));
    });
    slider.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
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

    const update = rafThrottle(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        photo.style.transform = `translateY(${progress * 60}px)`;
        text.style.transform = `translateY(${progress * -40}px)`;
    });

    window.addEventListener("scroll", update, { passive: true });
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
