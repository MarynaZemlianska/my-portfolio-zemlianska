document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Header (логотип + меню)
    observer.observe(document.querySelector('header'));

    // Top container
    observer.observe(document.querySelector('.top-container-h1'));
    observer.observe(document.querySelector('.items-text'));
    observer.observe(document.querySelector('.top-image'));
    document.querySelectorAll('.top-right a').forEach(icon => observer.observe(icon));
});

document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                // Добавляем класс visible к каждому наблюдаемому элементу
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Заголовок
    const h1 = document.querySelector('.top-container-h1');
    if(h1) observer.observe(h1);

    // Текст
    const text = document.querySelector('.items-text');
    if(text) observer.observe(text);

    // Фото
    const img = document.querySelector('.top-image');
    if(img) observer.observe(img);

    // Соцсети
    const icons = document.querySelectorAll('.top-right a');
    icons.forEach(icon => observer.observe(icon));
});

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-number");
    
    const options = {
        threshold: 0.5
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute("data-target");
                let count = 0;
                const step = Math.ceil(target / 100);

                const increment = () => {
                    count += step;
                    if(count > target) count = target;
                    counter.textContent = count;
                    if(count < target) {
                        requestAnimationFrame(increment);
                    }
                };
                increment();
                observer.unobserve(counter);
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);
    counters.forEach(counter => observer.observe(counter));
});



/* accordion */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        item.classList.toggle('active');
    });
});

/* scroll reveal */
const faqSection = document.querySelector('.section-faq');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            faqSection.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

observer.observe(faqSection);


const slider = document.querySelector('.testimonials-slider');
const nextBtn = document.querySelector('.slider-next');
const prevBtn = document.querySelector('.slider-prev');

let scrollAmount = 0;
const cardWidth = 320; // ширина карточки + gap

nextBtn.addEventListener('click', () => {
    if(scrollAmount < slider.scrollWidth - slider.clientWidth){
        scrollAmount += cardWidth;
        slider.style.transform = `translateX(-${scrollAmount}px)`;
    }
});

prevBtn.addEventListener('click', () => {
    if(scrollAmount > 0){
        scrollAmount -= cardWidth;
        slider.style.transform = `translateX(-${scrollAmount}px)`;
    }
});

