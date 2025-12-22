// section-about.js — анимация при скролле
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.about-title, .ellipse-photo, .text-items');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
});
