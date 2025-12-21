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
