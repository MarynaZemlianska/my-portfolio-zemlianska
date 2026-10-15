// Fade-up reveal + card tilt for service pages.
// Block-scoped so its names don't collide with other global scripts.
{
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        }, {
            threshold: 0.15
        });

        document.querySelectorAll(".fade-up").forEach(el => {
            observer.observe(el);
        });
        const cards = document.querySelectorAll(".lp-card");

        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
      scale(1.02)
    `;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      scale(1)
    `;
            });
        });

}
