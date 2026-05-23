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
                if (el.dataset.started === "true") return;
                el.dataset.started = "true";

                const target = Number(el.dataset.target) || 0;

                const duration = 450;

                let start = null;

                const step = (timestamp) => {
                    if (!start) start = timestamp;

                    const progress = Math.min((timestamp - start) / duration, 1);

                    const eased = 1 - Math.pow(1 - progress, 3);

                    el.textContent = Math.floor(eased * target);

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target + "+";
                    }
                };

                requestAnimationFrame(step);
            }
            obs.unobserve(el);
        });
        const counters = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.section-stats');

const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';

    const bar = el.parentElement.querySelector('.stat-bar span');

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const value = Math.floor(progress * target);

        el.textContent = value + suffix;

        // 🔥 прогресс-полоса (0–100%)
        if (bar) {
            bar.style.width = (progress * 100) + '%';
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + suffix;
            if (bar) bar.style.width = '100%';
        }
    };

    requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => animateCounter(counter));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

if (statsSection) {
    statsObserver.observe(statsSection);
}
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

    // ================= WHY SECTION =================
const whyTitle = document.querySelector('.why-title');
const whySubtitle = document.querySelector('.why-subtitle');
const whyCards = document.querySelectorAll('.why-card');

const whyObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
    });
}, {
    threshold: 0.2
});

if (whyTitle) whyObserver.observe(whyTitle);
if (whySubtitle) whyObserver.observe(whySubtitle);

whyCards.forEach(card => {
    whyObserver.observe(card);
});
    

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