// Scroll-reveal wiring for every section. Each call is a no-op when the
// section isn't on the current page.
import { reveal } from "./utils.js";

// Every section heading rises slowly out of a soft blur (styles: scss/base/_motion.scss).
// Skipped: hero h1s (CSS entrance, LCP), the quote title (own wipe-in),
// the modal title.
const HEADINGS = "h2:not(.quote-title, .policy-title, #consultationTitle)";

function initHeadingReveals() {
    const headings = document.querySelectorAll(HEADINGS);
    headings.forEach((h) => h.classList.add("heading-reveal"));
    reveal(headings, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
}

export function initReveals() {
    initHeadingReveals();

    // Hero entrance is pure CSS (sections/_hero.scss) so the LCP image never waits for JS.
    // FAQ, testimonials
    reveal(".button-mobile2, .hero-link, .section-testimonials, .section-faq", {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px",
    });
    // Quote: early, so the card is seen lying flat before it stands up (quote-lift.js)
    reveal(".quote-section", { threshold: 0.05 });

    // Projects
    reveal(".section-projects", { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
    reveal(".title-projects, .projects-subtitle", { threshold: 0.3, rootMargin: "0px 0px -10% 0px" });
    reveal(".card", { threshold: 0.1, rootMargin: "0px 0px -40px 0px", stagger: 150 });

    // Development steps
    document.querySelectorAll(".list-items li").forEach((step, i) => {
        step.style.transitionDelay = `${0.1 * i}s`;
    });
    reveal(".title-steps, .list-items li");

    // Services, why-me, about
    reveal(".title-services, .service-card");
    reveal(".why-title, .why-subtitle, .why-card");
    reveal(".about-title, .ellipse-photo, .text-items, .about-title-arrow");

    // Brief form
    reveal(".brief-steps li, .brief-card", { threshold: 0.1, stagger: 120 });

    // Footer
    reveal(".footer-container > *, .footer-info");
    reveal(".footer-wordmark", { threshold: 0.3 });

    // Service pages
    reveal(".fade-up", { threshold: 0.15, className: "show" });
}
