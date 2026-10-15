import { prefersReducedMotion } from "./utils.js";

const DURATION = 1200;

function animate(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const bar = el.parentElement.querySelector(".stat-bar span");

    const finish = () => {
        el.textContent = target + suffix;
        if (bar) bar.style.width = "100%";
    };

    if (prefersReducedMotion()) return finish();

    const start = performance.now();
    const step = (now) => {
        const progress = Math.min((now - start) / DURATION, 1);
        el.textContent = Math.floor(progress * target) + suffix;
        if (bar) bar.style.width = progress * 100 + "%";
        progress < 1 ? requestAnimationFrame(step) : finish();
    };
    requestAnimationFrame(step);
}

export function initCounters() {
    const section = document.querySelector(".section-stats");
    if (!section) return;
    const counters = section.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        counters.forEach((el) => {
            el.classList.add("visible");
            animate(el);
        });
        observer.disconnect();
    }, { threshold: 0.4 });

    observer.observe(section);
}
