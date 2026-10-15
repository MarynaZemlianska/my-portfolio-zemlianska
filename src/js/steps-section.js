document.addEventListener('DOMContentLoaded', () => {

    // ================= STEPS ANIMATION =================
    const title = document.querySelector('.title-steps');
    const steps = document.querySelectorAll('.list-items li');

    const stepsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                stepsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    if (title) stepsObserver.observe(title);

    steps.forEach((step, i) => {
        stepsObserver.observe(step);
        step.style.transitionDelay = `${0.1 * i}s`;
    });


    // ================= COUNTERS =================
    const counters = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.section-stats');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';

        let start = 0;
        const duration = 1200; // 1.2s animation
        const startTime = performance.now();

        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const value = Math.floor(progress * target);

            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                counters.forEach(counter => animateCounter(counter));

                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.4
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

});