document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector('.section-projects');
    const cards = document.querySelectorAll('.card');

    /* ===== SECTION ===== */
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,          // 🔥 почти сразу
        rootMargin: "0px 0px -50px 0px"
    });

    sectionObserver.observe(section);

    /* ===== CARDS ===== */
    const cardsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = [...cards].indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 70);     // 🔥 быстрый каскад

                cardsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    cards.forEach(card => cardsObserver.observe(card));
});
