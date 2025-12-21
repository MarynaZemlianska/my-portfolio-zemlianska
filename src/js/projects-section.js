document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(
        '.title-projects, .cards-column1'
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.25 }
    );

    items.forEach(el => observer.observe(el));
});
