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
window.addEventListener("scroll", () => {
    console.log("scrollY:", window.scrollY);
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
    '.button-mobile2', // 👈 ДОБАВИЛИ
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
        if (!entry.isIntersecting) return;

        const counter = entry.target;

        // 🛑 защита от повторного запуска
        if (counter.dataset.started === "true") return;
        counter.dataset.started = "true";

        const target = Number(counter.dataset.target);
        const duration = 900;
        const startTime = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const value = Math.floor(progress * target);

            counter.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target + "+";
            }
        };

        requestAnimationFrame(animate);

        observer.unobserve(counter);
    });
}, {
    threshold: 0.3, // 👈 лучше для мобилки
    rootMargin: "0px 0px -10% 0px"
});

counters.forEach(counter => counterObserver.observe(counter));

// ===== FAQ ACCORDION =====
document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".faq-item").classList.toggle("active");
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

//Секция просчёта цен
const quoteSection = document.querySelector('.quote-section');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

if (quoteSection) observer.observe(quoteSection);


//Стрелка
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toTopBtn");

    if (!btn) return;

    const toggleBtn = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        if (scrollTop > 300) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    };

    window.addEventListener("scroll", toggleBtn, { passive: true });

    // важно — проверить сразу при загрузке
    toggleBtn();

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});