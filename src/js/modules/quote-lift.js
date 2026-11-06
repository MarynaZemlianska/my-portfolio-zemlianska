// "Quote" card lies flat and stands up as the section scrolls into view
// (styles: sections/_quote.scss, driven by the --lay custom property:
// 1 = lying flat, 0 = upright). Off for "reduce motion".
import { prefersReducedMotion, rafThrottle } from "./utils.js";

export function initQuoteLift() {
    if (prefersReducedMotion()) return;

    document.querySelectorAll(".quote-container").forEach((card) => {
        const update = () => {
            const vh = window.innerHeight;
            // measured on the section: the card's own box changes with its tilt
            const top = (card.parentElement ?? card).getBoundingClientRect().top;
            // 0 when the section enters the viewport, 1 when its top reaches 15% from the top
            const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.85)));
            const eased = 1 - (1 - p) ** 2;
            card.style.setProperty("--lay", (1 - eased).toFixed(4));
        };

        update();
        window.addEventListener("scroll", rafThrottle(update), { passive: true });
        window.addEventListener("resize", rafThrottle(update));
    });
}
