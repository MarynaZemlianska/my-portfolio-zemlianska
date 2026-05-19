document.addEventListener("DOMContentLoaded", () => {

    // ===== VISIBILITY ANIMATION =====
    const elements = document.querySelectorAll(
        '.about-title, .ellipse-photo, .text-items, .about-title-arrow'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));


    // ===== PARALLAX (ONLY ONE WRAPPER!) =====
    const section = document.querySelector(".section-about");
    const photo = document.querySelector(".about-photo-container");
    const textWrap = document.querySelector(".about-title-wrap");

    if (!section || !photo || !textWrap) return;

    window.addEventListener("scroll", () => {

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const progress = Math.min(
            Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
            1
        );

        // 🔥 мягкое движение
        const photoY = progress * 60;
        const textY = progress * -40;

        photo.style.transform = `translateY(${photoY}px)`;
        textWrap.style.transform = `translateY(${textY}px)`;
    });

});