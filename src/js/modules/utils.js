export const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const pageLang = () => (document.documentElement.lang === "en" ? "en" : "uk");

const toArray = (targets) =>
    typeof targets === "string" ? [...document.querySelectorAll(targets)] : [...targets];

/**
 * Adds `className` to each element the first time it scrolls into view.
 * `stagger` (ms) delays each element by its index in the set.
 */
export function reveal(targets, {
    threshold = 0.2,
    rootMargin = "0px",
    className = "visible",
    stagger = 0,
} = {}) {
    const els = toArray(targets);
    if (!els.length) return;

    if (prefersReducedMotion()) {
        els.forEach((el) => el.classList.add(className));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const show = () => el.classList.add(className);
            stagger ? setTimeout(show, els.indexOf(el) * stagger) : show();
            observer.unobserve(el);
        });
    }, { threshold, rootMargin });

    els.forEach((el) => observer.observe(el));
}

/** Reveals all `items` (staggered) once `trigger` scrolls into view. */
export function revealGroup(trigger, items, { threshold = 0.2, stagger = 100, className = "visible" } = {}) {
    const triggerEl = typeof trigger === "string" ? document.querySelector(trigger) : trigger;
    if (!triggerEl) return;
    const els = toArray(items);

    if (prefersReducedMotion()) {
        els.forEach((el) => el.classList.add(className));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        els.forEach((el, i) => setTimeout(() => el.classList.add(className), i * stagger));
        observer.disconnect();
    }, { threshold });

    observer.observe(triggerEl);
}

/** Runs `fn` at most once per animation frame. */
export function rafThrottle(fn) {
    let queued = false;
    return (...args) => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fn(...args);
        });
    };
}
