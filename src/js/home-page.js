document.addEventListener("DOMContentLoaded", () => {
    // ===== HEADER =====
    const header = document.querySelector("header");
    header.classList.add("hidden");
    setTimeout(() => {
        header.classList.remove("hidden");
        header.classList.add("visible");
    }, 100);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const revealSelectors = [
        '.top-container-h1',
        '.items-text',
        '.top-image',
        '.top-right a',
        '.about-title',
        '.about-title-arrow',
        '.ellipse-photo',
        '.text-items p',
        '.section-testimonials',
        '.section-faq'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => revealObserver.observe(el));
    });

    // ===== COUNTERS =====
    const counters = document.querySelectorAll(".stat-number");
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute("data-target");
                let count = 0;
                const step = Math.ceil(target / 100);

                const increment = () => {
                    count += step;
                    if (count > target) count = target;
                    counter.textContent = count;
                    if (count < target) requestAnimationFrame(increment);
                };
                increment();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            item.classList.toggle('active');
        });
    });

    // ===== TESTIMONIALS SLIDER =====
    const slider = document.querySelector('.testimonials-slider');
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');

    if (slider && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
    }

    // Появление секции отзывов
    const section = document.querySelector('.section-testimonials');
    if (section) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    section.classList.add('visible');
                    obs.unobserve(section);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(section);
    }
});
