// ===== DEVELOPMENT STEPS: SNAKE LINE =====
// Draws an SVG path through the step circles and reveals it with the scroll.
// Desktop (steps alternate sides): the line comes in from the edge, runs into
// the circle, drops below the text, crosses to the other side, turns down and
// enters the next circle from that side. Phones: a straight vertical line.
import { prefersReducedMotion, rafThrottle } from "./utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const R = 22; // corner radius

export function initStepsPath() {
    document.querySelectorAll(".list-steps").forEach(setup);
}

function setup(box) {
    const steps = [...box.querySelectorAll(".list-items > li")];
    if (steps.length < 2) return;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("steps-path");
    svg.setAttribute("aria-hidden", "true");
    const id = `steps-grad-${Math.random().toString(36).slice(2, 8)}`;
    svg.innerHTML = `
        <defs>
            <linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
                <stop offset="0" stop-color="#ff00cc"/>
                <stop offset="0.35" stop-color="#8103ff"/>
                <stop offset="0.7" stop-color="#3b4cff"/>
                <stop offset="1" stop-color="#00d4ff"/>
            </linearGradient>
        </defs>
        <path class="steps-path-track"/>
        <path class="steps-path-line" stroke="url(#${id})"/>`;
    box.prepend(svg);

    const grad = svg.querySelector("linearGradient");
    const track = svg.querySelector(".steps-path-track");
    const line = svg.querySelector(".steps-path-line");
    const wide = window.matchMedia("(min-width: 768px)");
    let length = 0;

    const build = () => {
        const w = box.clientWidth;
        const h = box.clientHeight;
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        grad.setAttribute("y2", String(h));

        // layout positions (offsets ignore the reveal transforms)
        const pts = steps.map((li) => {
            const c = li.querySelector(".step-circle");
            return {
                x: li.offsetLeft + c.offsetLeft + c.offsetWidth / 2,
                y: li.offsetTop + c.offsetTop + c.offsetHeight / 2,
                top: li.offsetTop,
                bottom: li.offsetTop + li.offsetHeight,
            };
        });

        const d = wide.matches ? snake(pts, w, h) : straight(pts, h);
        track.setAttribute("d", d);
        line.setAttribute("d", d);
        length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        update();
    };

    // progress: starts when the list top reaches 75% of the screen,
    // complete when its bottom reaches 60%
    const update = rafThrottle(() => {
        if (prefersReducedMotion()) {
            line.style.strokeDashoffset = "0";
            return;
        }
        const r = box.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.75;
        const end = vh * 0.6;
        const p = Math.min(1, Math.max(0, (start - r.top) / (r.height + start - end)));
        line.style.strokeDashoffset = `${length * (1 - p)}`;
    });

    build();
    new ResizeObserver(build).observe(box);
    wide.addEventListener("change", build);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
}

// Desktop snake. Steps alternate: even index = circle on the left.
function snake(pts, w, h) {
    const left = 6;
    const right = w - 6;
    let d = "";

    pts.forEach((p, i) => {
        const fromLeft = i % 2 === 0;
        const edge = fromLeft ? left : right;
        const other = fromLeft ? right : left;
        const dir = fromLeft ? 1 : -1; // horizontal direction into the circle
        const next = pts[i + 1];
        // the line crosses in the gap between this row and the next one
        const turnY = next ? (p.bottom + next.top) / 2 : Math.min(h - 4, p.bottom + 35);

        if (i === 0) d += `M ${edge} ${p.y} `;
        // into the circle
        d += `H ${p.x} `;
        // down beside the text, then across to the other side
        d += `V ${turnY - R} `;
        d += `Q ${p.x} ${turnY} ${p.x + dir * R} ${turnY} `;
        if (!next) {
            d += `H ${other} `;
            return;
        }
        d += `H ${other - dir * R} `;
        d += `Q ${other} ${turnY} ${other} ${turnY + R} `;
        // down the far edge to the next circle's level, then in
        d += `V ${next.y - R} `;
        d += `Q ${other} ${next.y} ${other - dir * R} ${next.y} `;
    });
    return d.trim();
}

function straight(pts, h) {
    const x = pts[0].x;
    return `M ${x} ${Math.max(0, pts[0].y - 30)} V ${Math.min(h, pts[pts.length - 1].y + 30)}`;
}
