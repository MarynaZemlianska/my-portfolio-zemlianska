document.addEventListener('DOMContentLoaded', () => {

    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.getElementById('modalClose');

    const mobileBtn = document.getElementById('openModalMobile');
    const desktopBtn = document.getElementById('openModalDesktop');
    const headerBtn = document.getElementById('openModal');

    // ===== BURGER =====
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // ===== OPEN MODAL =====
    function openModal() {
        if (!modal) return;
        modal.classList.remove('is-hidden');
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // ===== CLOSE MODAL =====
    function closeModal() {
        if (!modal) return;
        modal.classList.add('is-hidden');
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // ===== EVENTS =====
    [mobileBtn, desktopBtn, headerBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // клик по фону (закрытие)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

});