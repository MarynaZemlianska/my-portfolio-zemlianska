// ===== MOBILE SCROLL EFFECTS (home page) =====
// Scroll-scrubbed effects for phones, in the spirit of GSAP ScrollTrigger
// "scrub": every target gets a progress custom property that follows the
// scroll position both ways, and CSS turns it into motion
// (styles: scss/base/_scroll-fx.scss, all under html.fx-scroll).
//   --p      0 -> 1 while the element scrolls into the screen
//   --cover  0 -> 1 while the next stacked card slides over this one
// Phones only (the desktop keeps its own entrance animations); off for
// "reduce motion".
import { prefersReducedMotion } from "./utils.js";

const MOBILE = "(max-width: 768px)";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Entrance progress: 0 when the element's top is at `from` (share of the
// screen height from the top), 1 when it reaches `to`.
const ENTER = [
    { sel: ".section-projects .card-poster", from: 1, to: 0.35 },
    { sel: ".section-services .service-card", from: 1, to: 0.45 },
    { sel: ".section-about .about-photo-container", from: 1, to: 0.3 },
    { sel: ".section-steps .list-items li", from: 0.95, to: 0.6 },
    { sel: ".section-faq .faq-item", from: 1, to: 0.75 },
];

export function initScrollFx() {
    if (!document.querySelector(".hero-home") || prefersReducedMotion()) return;

    const mq = window.matchMedia(MOBILE);
    const root = document.documentElement;

    const entering = ENTER.flatMap(({ sel, from, to }) =>
        [...document.querySelectorAll(sel)].map((el) => ({ el, from, to, last: -1 })),
    );
    const stack = [...document.querySelectorAll(".why-cards .why-card")].map((el, i, all) => ({
        el,
        next: all[i + 1],
        last: -1,
    }));
    if (!entering.length && !stack.length) return;

    const set = (item, name, value) => {
        const v = Math.round(value * 1000) / 1000;
        if (v === item.last) return;
        item.last = v;
        item.el.style.setProperty(name, v);
    };

    const update = () => {
        const vh = window.innerHeight;

        entering.forEach((item) => {
            const top = item.el.getBoundingClientRect().top;
            set(item, "--p", clamp01((vh * item.from - top) / (vh * (item.from - item.to))));
        });

        // a card is fully covered when the next one has slid up to its top
        stack.forEach((item) => {
            if (!item.next) return;
            const r = item.el.getBoundingClientRect();
            const nextTop = item.next.getBoundingClientRect().top;
            set(item, "--cover", clamp01(1 - (nextTop - r.top) / r.height));
        });
    };

    let queued = false;
    const schedule = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            update();
        });
    };

    const apply = () => {
        const on = mq.matches;
        root.classList.toggle("fx-scroll", on);
        if (on) {
            window.addEventListener("scroll", schedule, { passive: true });
            window.addEventListener("resize", schedule);
            update();
        } else {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        }
    };

    mq.addEventListener("change", apply);
    apply();
}
