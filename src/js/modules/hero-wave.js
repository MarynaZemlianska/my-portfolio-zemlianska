// Dot wave under every hero (markup: partials/hero-wave.njk, styles: scss/sections/_hero-wave.scss).
// A grid of dots on a sine surface, seen in perspective, coloured with the brand gradient.
// Draws only while on screen; "Reduce motion" draws one still frame.
import { prefersReducedMotion } from "./utils.js";

const COLS = 70;
const ROWS = 26;
const FROM = [255, 0, 204]; // #ff00cc
const TO = [59, 76, 255]; // #3b4cff
const SPEED = 0.4; // 1 = original pace

export function initHeroWave() {
    document.querySelectorAll(".hero-wave-canvas").forEach(initWave);
}

function initWave(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let inView = false;
    let frame = 0;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
        ctx.clearRect(0, 0, w, h);
        const cols = w < 768 ? Math.round(COLS * 0.6) : COLS;
        const amp = h * 0.16;
        for (let r = 0; r < ROWS; r++) {
            const depth = r / (ROWS - 1); // 0 = far, 1 = near
            const z = 0.35 + depth * 0.65; // perspective scale
            const baseY = h * (0.15 + depth * 0.7);
            for (let c = 0; c < cols; c++) {
                const u = c / (cols - 1);
                const x = w / 2 + (u - 0.5) * w * (0.6 + z * 0.9);
                const y = baseY
                    + Math.sin(u * 7 + t * 0.9 + depth * 2.5) * amp * z
                    + Math.sin(u * 3 - t * 0.6 + depth * 4) * amp * 0.5 * z;
                const k = u;
                ctx.fillStyle = `rgba(${FROM.map((f, i) => Math.round(f + (TO[i] - f) * k)).join(",")},${(0.15 + depth * 0.75).toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(x, y, 0.6 + z * 1.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    const loop = (now) => {
        draw((now / 1000) * SPEED);
        frame = inView ? requestAnimationFrame(loop) : 0;
    };

    resize();
    draw(0);
    new ResizeObserver(() => {
        resize();
        if (still || !inView) draw(0);
    }).observe(canvas);
    if (still) return;

    new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !frame) frame = requestAnimationFrame(loop);
    }).observe(canvas);
}
