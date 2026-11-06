// Particle field behind the contacts form (markup: <canvas class="particle-field"> in partials/brief.njk).
// Drifting dots in the brand gradient, linked by thin lines when close; they move away from the cursor.
// Draws only while on screen; "Reduce motion" draws one still frame.
import { prefersReducedMotion } from "./utils.js";

const FROM = [255, 0, 204]; // #ff00cc
const TO = [107, 134, 255]; // #6b86ff
const LINK = 120; // px — max distance for a connecting line
const MOUSE_R = 140; // px — cursor push radius
const MAX_DOTS = 160;
const AREA_PER_DOT = 9000; // px² of canvas per dot

const mix = (k) => FROM.map((f, i) => Math.round(f + (TO[i] - f) * k)).join(",");

export function initParticleField() {
    document.querySelectorAll(".particle-field").forEach(initField);
}

function initField(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dots = [];
    let inView = false;
    let frame = 0;
    let mx = -1e4;
    let my = -1e4;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(MAX_DOTS, Math.round((w * h) / AREA_PER_DOT));
        while (dots.length < count) {
            dots.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: 0.8 + Math.random() * 2,
            });
        }
        dots.length = count;
        dots.forEach((d) => {
            d.x = Math.min(d.x, w);
            d.y = Math.min(d.y, h);
        });
    };

    const step = () => {
        for (const d of dots) {
            const dx = d.x - mx;
            const dy = d.y - my;
            const dist = Math.hypot(dx, dy);
            if (dist < MOUSE_R && dist > 0) {
                const push = (1 - dist / MOUSE_R) * 0.6;
                d.vx += (dx / dist) * push;
                d.vy += (dy / dist) * push;
            }
            d.vx = d.vx * 0.96 + (Math.random() - 0.5) * 0.03;
            d.vy = d.vy * 0.96 + (Math.random() - 0.5) * 0.03;
            // keep a slow drift so the field never freezes
            if (Math.abs(d.vx) + Math.abs(d.vy) < 0.15) {
                d.vx += (Math.random() - 0.5) * 0.1;
                d.vy += (Math.random() - 0.5) * 0.1;
            }
            d.x = (d.x + d.vx + w) % w;
            d.y = (d.y + d.vy + h) % h;
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 0.6;
        const link2 = LINK * LINK;
        for (let i = 0; i < dots.length; i++) {
            const a = dots[i];
            for (let j = i + 1; j < dots.length; j++) {
                const b = dots[j];
                const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
                if (d2 >= link2) continue;
                ctx.strokeStyle = `rgba(${mix((a.x + b.x) / 2 / w)},${(0.35 * (1 - d2 / link2)).toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
        for (const d of dots) {
            ctx.fillStyle = `rgba(${mix(d.x / w)},0.85)`;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const loop = () => {
        step();
        draw();
        frame = inView ? requestAnimationFrame(loop) : 0;
    };

    resize();
    draw();
    new ResizeObserver(() => {
        resize();
        if (still || !inView) draw();
    }).observe(canvas);
    if (still) return;

    // the canvas ignores pointer events (the form sits on top), so track the cursor on the window
    window.addEventListener("pointermove", (e) => {
        if (!inView) return;
        const rect = canvas.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => {
        mx = my = -1e4;
    });

    new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !frame) frame = requestAnimationFrame(loop);
    }).observe(canvas);
}
