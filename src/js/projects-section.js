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
        threshold: 0.05,    
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
                }, index * 70);  

                cardsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    cards.forEach(card => cardsObserver.observe(card));
});


  /* ===== FILTERS ===== */
const buttons = document.querySelectorAll('.projects-filters button');
const cards = document.querySelectorAll('.card');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
            const type = card.dataset.type;

            if (filter === 'all' || filter === type) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });

    });
});