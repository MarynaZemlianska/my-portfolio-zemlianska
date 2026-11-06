// Pointer-driven micro-interactions for the home page (styles: scss/base/_motion.scss).
// Desktop mouse only, and off for "reduce motion".
import { prefersReducedMotion, rafThrottle } from "./utils.js";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ===== CURSOR SPOTLIGHT ON PROJECT SCREENSHOTS =====
function initSpotlight() {
    document.querySelectorAll(".section-projects .card-image").forEach((el) => {
        el.addEventListener("pointermove", (e) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
            el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
        });
    });
}

// ===== MAGNETIC BUTTONS =====
// Uses the `translate` property, so the buttons' own transforms (reveal,
// hover lift) keep working.
function initMagnetic() {
    const strength = 0.25;
    const maxShift = 8;

    document.querySelectorAll(".button-desktop, .hero-cta, .hero-link, .quote-btn").forEach((el) => {
        el.addEventListener("pointermove", (e) => {
            const rect = el.getBoundingClientRect();
            const clamp = (v) => Math.max(-maxShift, Math.min(maxShift, v * strength));
            const x = clamp(e.clientX - rect.left - rect.width / 2);
            const y = clamp(e.clientY - rect.top - rect.height / 2);
            el.style.translate = `${x}px ${y}px`;
        });
        el.addEventListener("pointerleave", () => {
            const from = el.style.translate;
            el.style.translate = "";
            if (from) {
                el.animate([{ translate: from }, { translate: "0 0" }], {
                    duration: 450,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                });
            }
        });
    });
}

export function initMotion() {
    if (prefersReducedMotion() || !finePointer()) return;
    initSpotlight();
    initMagnetic();
}
