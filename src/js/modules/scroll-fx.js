// ===== MOBILE SCROLL EFFECTS: STACKED "WHY ME" CARDS =====
// The other scroll effects of the home page are native CSS scroll-driven
// animations (scss/base/_scroll-fx.scss). This one depends on where the
// *next* card is, which CSS can't see, so JS writes
//   --cover  0 -> 1 while the next stacked card slides over this one
// and CSS (under html.fx-scroll) turns it into a sink-back + dim.
// Phones only; off for "reduce motion".
import { prefersReducedMotion } from "./utils.js";

const MOBILE = "(max-width: 768px)";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function initScrollFx() {
    if (prefersReducedMotion()) return;

    const cards = [...document.querySelectorAll(".why-cards .why-card")];
    if (cards.length < 2) return;

    const mq = window.matchMedia(MOBILE);
    const root = document.documentElement;
    const last = new Map();

    // a card is fully covered when the next one has slid up to its top
    const update = () => {
        cards.forEach((el, i) => {
            const next = cards[i + 1];
            if (!next) return;
            const r = el.getBoundingClientRect();
            const v = Math.round(clamp01(1 - (next.getBoundingClientRect().top - r.top) / r.height) * 1000) / 1000;
            if (v === last.get(el)) return;
            last.set(el, v);
            el.style.setProperty("--cover", v);
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
