// Scroll-reveal wiring for every section. Each call is a no-op when the
// section isn't on the current page.
import { reveal, revealGroup } from "./utils.js";

export function initReveals() {
    // Hero, FAQ, testimonials, quote
    reveal(`.top-container-h1, .items-text, .top-image, .top-right a, .button-mobile2,
            .section-testimonials, .section-faq, .quote-section`, {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px",
    });

    // Projects
    reveal(".section-projects", { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
    reveal(".card", { threshold: 0.1, rootMargin: "0px 0px -40px 0px", stagger: 70 });

    // Development steps
    document.querySelectorAll(".list-items li").forEach((step, i) => {
        step.style.transitionDelay = `${0.1 * i}s`;
    });
    reveal(".title-steps, .list-items li");

    // Services, why-me, about
    reveal(".title-services, .service-card");
    reveal(".why-title, .why-subtitle, .why-card");
    reveal(".about-title, .ellipse-photo, .text-items, .about-title-arrow");

    // Contacts
    reveal(".contacts-title");
    revealGroup(".section-contacts .form",
        ".form .form-label, .input1, .input2, .input3, .form-button, .info-form");

    // Footer
    reveal(".footer-container > *");

    // Service pages
    reveal(".fade-up", { threshold: 0.15, className: "show" });
}
