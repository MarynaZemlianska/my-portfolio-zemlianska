function updateGradientHeight() {
    const topContainer = document.querySelector('.top-container');
    const gradient = document.querySelector('.header-gradient');
    if (!topContainer || !gradient) return;

    // Координата нижней границы top-container относительно документа
    const topContainerRect = topContainer.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bottomPosition = topContainerRect.top + scrollTop + topContainer.offsetHeight;

    gradient.style.height = `${bottomPosition}px`;
}

updateGradientHeight();
window.addEventListener('resize', updateGradientHeight);
window.addEventListener('scroll', updateGradientHeight);
