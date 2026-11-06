// Home hero 3D scene (markup: partials/hero-scene.njk, styles: scss/sections/_hero-scene.scss).
// Feeds three CSS variables to the scene, eased so the motion stays smooth:
//   --p      how far the hero has scrolled away, 0..1
//   --mx/my  pointer position over the hero, -1..1 (desktop mouse only)
// "Reduce motion" keeps the scene still in its starting pose.
import { prefersReducedMotion } from "./utils.js";

export function initHeroScene() {
    const hero = document.querySelector(".hero-home");
    const scene = hero?.querySelector(".hero-scene");
    if (!scene || prefersReducedMotion()) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const target = { p: 0, mx: 0, my: 0 };
    const current = { ...target };
    let running = false;
    let inView = true;

    const readScroll = () => {
        const rect = hero.getBoundingClientRect();
        target.p = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.6)));
    };

    const tick = () => {
        let moving = false;
        for (const key of ["p", "mx", "my"]) {
            const delta = target[key] - current[key];
            current[key] = Math.abs(delta) < 0.0005 ? target[key] : current[key] + delta * 0.1;
            if (current[key] !== target[key]) moving = true;
            scene.style.setProperty(`--${key}`, current[key].toFixed(4));
        }
        running = moving;
        if (moving) requestAnimationFrame(tick);
    };

    const start = () => {
        if (running || !inView) return;
        running = true;
        requestAnimationFrame(tick);
    };

    new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
            readScroll();
            start();
        }
    }).observe(hero);

    window.addEventListener("scroll", () => {
        if (!inView) return;
        readScroll();
        start();
    }, { passive: true });

    hero.addEventListener("pointermove", (e) => {
        if (!finePointer.matches) return;
        target.mx = (e.clientX / window.innerWidth - 0.5) * 2;
        target.my = ((e.clientY - hero.getBoundingClientRect().top) / hero.offsetHeight - 0.5) * 2;
        start();
    });
    hero.addEventListener("pointerleave", () => {
        target.mx = 0;
        target.my = 0;
        start();
    });

    readScroll();
    start();
}
