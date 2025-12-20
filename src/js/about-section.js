// section-about.js
document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector('.about-title');
    const photo = document.querySelector('.ellipse-photo');
    const textItems = document.querySelector('.text-items');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(title);
    observer.observe(photo);
    observer.observe(textItems);
});
