document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const toTopBtn = document.getElementById("toTopBtn");

    // ================= HEADER =================
    header.classList.add("hidden");

    setTimeout(() => {
        header.classList.remove("hidden");
        header.classList.add("visible");
    }, 100);

    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const scroll = window.scrollY;

        header.classList.toggle("scrolled", scroll > 20);

        // кнопка "наверх"
        if (toTopBtn) {
            toTopBtn.classList.toggle("show", scroll > 300);
        }

        lastScroll = scroll;
    }, { passive: true });

    // ================= SINGLE OBSERVER =================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            el.classList.add("visible");

            // ===== COUNTER =====
            if (el.classList.contains("stat-number")) {
                if (el.dataset.started === "true") return;
                el.dataset.started = "true";

                const target = Number(el.dataset.target);
                const duration = 800;
                const startTime = performance.now();

                const animate = (time) => {
                    const progress = Math.min((time - startTime) / duration, 1);
                    el.textContent = Math.floor(progress * target);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target + "+";
                    }
                };

                requestAnimationFrame(animate);
            }

            observer.unobserve(el);
        });
    }, {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px"
    });

    // ================= ELEMENTS TO OBSERVE =================
    document.querySelectorAll(`
        .top-container-h1,
        .items-text,
        .top-image,
        .top-right a,
        .button-mobile2,
        .section-testimonials,
        .section-faq,
        .quote-section,
        .stat-number
    `).forEach(el => observer.observe(el));

    // ================= FAQ =================
    document.querySelectorAll(".faq-question").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".faq-item").classList.toggle("active");
        });
    });

    // ================= TESTIMONIALS SLIDER =================
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

    // ================= TO TOP BUTTON CLICK =================
    if (toTopBtn) {
        toTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});