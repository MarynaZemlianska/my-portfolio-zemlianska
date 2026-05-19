document.addEventListener("DOMContentLoaded", () => {

    const sectionTitle = document.querySelector('.title-services');

    const cards = document.querySelectorAll('.service-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимируем один раз
            }
        });
    }, { threshold: 0.2 });

    if (sectionTitle) observer.observe(sectionTitle);

    cards.forEach(card => observer.observe(card));
});
