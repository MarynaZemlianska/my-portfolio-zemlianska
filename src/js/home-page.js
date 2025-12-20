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

    // Заголовок
    observer.observe(document.querySelector('.top-container-h1'));
    // Текст
    observer.observe(document.querySelector('.items-text'));
    // Фото
    observer.observe(document.querySelector('.top-image'));
    // Соцсети
    document.querySelectorAll('.top-right a').forEach(icon => observer.observe(icon));
});
