// ===== ABOUT TEXT: WORD-BY-WORD REVEAL =====
// Wraps every word of the "About" text in <span class="about-w"> (an accent
// phrase counts as one unit, so its gradient stays continuous) and lights the
// words up in reading order as the text scrolls through the screen.
import { prefersReducedMotion, rafThrottle } from "./utils.js";

export function initAboutWords() {
    const box = document.querySelector(".section-about .text-items");
    if (!box || prefersReducedMotion()) return;

    const units = [];
    box.querySelectorAll("p").forEach((p) => {
        [...p.childNodes].forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach((part) => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        frag.append(part);
                        return;
                    }
                    const w = document.createElement("span");
                    w.className = "about-w";
                    w.textContent = part;
                    frag.append(w);
                    units.push(w);
                });
                node.replaceWith(frag);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.classList.add("about-w");
                units.push(node);
            }
        });
    });

    // starts when the text top reaches 90% of the screen,
    // fully lit when its bottom reaches 70%
    const update = rafThrottle(() => {
        const r = box.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.9;
        const end = vh * 0.7;
        const p = Math.min(1, Math.max(0, (start - r.top) / (r.height + start - end)));
        const lit = Math.round(p * units.length);
        units.forEach((u, i) => u.classList.toggle("is-lit", i < lit));
    });

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
}
