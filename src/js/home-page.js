document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const toTopBtn = document.getElementById("toTopBtn");

    // ================= HEADER INIT =================
    if (header) {
        header.classList.add("hidden");

        setTimeout(() => {
            header.classList.remove("hidden");
            header.classList.add("visible");
        }, 100);
    }

    // ================= SCROLL HANDLER (OPTIMIZED) =================
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        if (header) {
            header.classList.toggle("scrolled", scrollY > 20);
        }

        if (toTopBtn) {
            toTopBtn.classList.toggle("show", scrollY > 300);
        }
    }, { passive: true });

    // ================= INTERSECTION OBSERVER =================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.add("visible");

            // ================= COUNTER =================
            if (el.classList.contains("stat-number")) {
    if (el.dataset.started) return;
    el.dataset.started = "true";

    const target = Number(el.dataset.target) || 0;
    const duration = 500; // 🔥 быстрее (0.5 сек)
    const start = performance.now();

    const easeOutQuad = (t) => t * (2 - t); // ускоряет старт

    const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = easeOutQuad(progress);

        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            el.textContent = target + "+";
        }
    };

    requestAnimationFrame(animate);
}
            obs.unobserve(el);
        });
    }, {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px"
    });

    // ================= ELEMENTS =================
    const elements = document.querySelectorAll(`
        .top-container-h1,
        .items-text,
        .top-image,
        .top-right a,
        .button-mobile2,
        .section-testimonials,
        .section-faq,
        .quote-section,
        .stat-number
    `);

    elements.forEach(el => observer.observe(el));

    // ================= FAQ =================
    document.querySelectorAll(".faq-question").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            if (item) item.classList.toggle("active");
        });
    });

    // ================= SLIDER =================
    const slider = document.querySelector(".testimonials-slider");
    const nextBtn = document.querySelector(".slider-next");
    const prevBtn = document.querySelector(".slider-prev");

    if (slider && nextBtn && prevBtn) {
        nextBtn.addEventListener("click", () => {
            slider.scrollBy({ left: slider.offsetWidth, behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            slider.scrollBy({ left: -slider.offsetWidth, behavior: "smooth" });
        });
    }

    // ================= TO TOP BUTTON =================
    if (toTopBtn) {
        toTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});