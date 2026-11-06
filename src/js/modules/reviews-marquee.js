// ===== TESTIMONIALS: DRIFT + SWIPE =====
// The cards drift left -> right on their own and can be dragged/swiped
// either way (touch, mouse, trackpad). A swipe keeps a little momentum and
// then eases back into the drift. The list holds two copies of the cards,
// so the position wraps around seamlessly.
// Without JS the CSS keyframe loop runs instead; with reduced motion there
// is no drift and the row is a plain native scroller (see _reviews.scss).
import { prefersReducedMotion } from "./utils.js";

const SPEED_DESKTOP = 45; // px per second
const SPEED_SMALL = 20; // tablets and phones: slower, easier to read
const FRICTION = 0.92; // momentum decay per frame after a swipe

export function initReviewsMarquee() {
    const slider = document.querySelector(".reviews-slider");
    const list = slider?.querySelector(".reviews-list");
    if (!slider || !list || prefersReducedMotion()) return;

    list.classList.add("is-js"); // switches the CSS loop off
    const small = window.matchMedia("(max-width: 1024px)");

    let offset = 0; // grows -> cards move right
    let half = list.scrollWidth / 2;
    let velocity = 0; // px/frame left over from a swipe
    let paused = false; // mouse hover / keyboard focus
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastT = 0;
    let moved = false;
    let prev = performance.now();

    const render = () => {
        const x = (((offset % half) + half) % half) - half; // -half .. 0
        list.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const tick = (now) => {
        const dt = Math.min(64, now - prev) / 1000;
        prev = now;
        if (!dragging) {
            if (Math.abs(velocity) > 0.05) {
                offset += velocity;
                velocity *= FRICTION;
            } else if (!paused) {
                offset += (small.matches ? SPEED_SMALL : SPEED_DESKTOP) * dt;
            }
        }
        render();
        requestAnimationFrame(tick);
    };

    // ----- drag / swipe -----
    slider.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragging = true;
        moved = false;
        velocity = 0;
        startX = lastX = e.clientX;
        startOffset = offset;
        lastT = e.timeStamp;
        slider.classList.add("is-dragging");
    });

    slider.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 6) {
            moved = true;
            slider.setPointerCapture(e.pointerId);
        }
        if (!moved) return;
        offset = startOffset + dx;
        const dt = Math.max(1, e.timeStamp - lastT);
        velocity = ((e.clientX - lastX) / dt) * 16; // px per ~frame
        lastX = e.clientX;
        lastT = e.timeStamp;
    });

    const end = (e) => {
        if (!dragging) return;
        dragging = false;
        slider.classList.remove("is-dragging");
        if (slider.hasPointerCapture?.(e.pointerId)) slider.releasePointerCapture(e.pointerId);
        if (!moved) velocity = 0;
    };
    slider.addEventListener("pointerup", end);
    slider.addEventListener("pointercancel", end);

    // a drag must not count as a click on anything inside the card
    slider.addEventListener("click", (e) => {
        if (moved) {
            e.preventDefault();
            e.stopPropagation();
            moved = false;
        }
    }, true);

    // trackpad / shift+wheel horizontal scroll
    slider.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        offset -= e.deltaX;
        velocity = 0;
    }, { passive: false });

    // keyboard: arrows move by one card while the slider has focus
    slider.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const card = list.querySelector(".review-card");
        const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(card).marginRight) : 300;
        velocity = dir * step * (1 - FRICTION); // glides about one card
    });

    // pause while a mouse hovers the cards (reading) or focus is inside
    slider.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") paused = true; });
    slider.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") paused = false; });
    slider.addEventListener("focusin", () => { paused = true; });
    slider.addEventListener("focusout", () => { paused = false; });

    new ResizeObserver(() => { half = list.scrollWidth / 2 || 1; }).observe(list);
    requestAnimationFrame(tick);
}
