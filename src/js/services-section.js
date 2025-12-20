document.addEventListener("DOMContentLoaded", () => {
    // Заголовок секции
    const sectionTitle = document.querySelector('.title-services');
    // Все карточки
    const cards = document.querySelectorAll('.service-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимируем один раз
            }
        });
    }, { threshold: 0.2 });

    // Подключаем заголовок
    if (sectionTitle) observer.observe(sectionTitle);
    // Подключаем карточки
    cards.forEach(card => observer.observe(card));
});
