document.addEventListener('DOMContentLoaded', () => {

    const title = document.querySelector('.title-steps');
    const steps = document.querySelectorAll('.list-items li');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    // наблюдаем за заголовком
    if (title) observer.observe(title);

    // наблюдаем за шагами с задержкой анимации
    steps.forEach((step, i) => {
        observer.observe(step);
        step.style.transitionDelay = `${0.1 * i}s`; // stagger
    });

});
