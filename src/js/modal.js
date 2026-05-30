// =========================
// MODAL + FORM (STABLE VERSION)
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('consultationForm');

    const toastSuccess = document.getElementById("toast-success");
    const toastError = document.getElementById("toast-error");

    const openBtns = document.querySelectorAll(
        '.open-modal, .quote-btn, .btn'
    );

    // =========================
    // OPEN MODAL
    // =========================
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            modal.classList.add('is-visible');
            modal.classList.remove('is-hidden');

            document.body.style.overflow = 'hidden';
        });
    });

    // =========================
    // CLOSE MODAL
    // =========================
    function closeModal() {
        modal.classList.remove('is-visible');
        modal.classList.add('is-hidden');

        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // =========================
    // VALIDATION
    // =========================
    function validateForm({ name, phone, message }) {

        const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]{2,40}$/;
        const phoneRegex = /^\+?[1-9]\d{7,14}$/;

        if (!nameRegex.test(name)) return "Невірне ім’я";
        if (!phoneRegex.test(phone)) return "Невірний телефон";
        if (!message) return "Порожнє повідомлення";

        return null;
    }

    // =========================
    // TOAST
    // =========================
    function showToast(type) {

        const el = type === "success" ? toastSuccess : toastError;

        if (!el) return;

        el.classList.add("show");

        setTimeout(() => {
            el.classList.remove("show");
        }, 3000);
    }

    // =========================
    // SUBMIT
    // =========================
    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const name = form.elements.name.value.trim();
        let phone = form.elements.phone.value.trim();
        const message = form.elements.message.value.trim();

        phone = phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');

        const error = validateForm({ name, phone, message });

        if (error) {
            showToast("error");
            return;
        }

        // simulate send
        setTimeout(() => {

            showToast("success");

            form.reset();

            setTimeout(() => {
                closeModal();
            }, 1200);

        }, 500);
    });

});