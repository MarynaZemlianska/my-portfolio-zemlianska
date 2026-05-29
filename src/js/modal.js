document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.getElementById('modalClose');

    const form = document.getElementById('consultationForm');

    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    const openBtns = document.querySelectorAll(
        '.open-modal, .quote-btn, .btn'
    );

    /* =========================
       OPEN MODAL
    ========================= */
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            modal.classList.remove('is-hidden');
            modal.classList.add('is-visible');

            document.body.style.overflow = 'hidden';
        });
    });

    /* =========================
       CLOSE MODAL
    ========================= */
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

    /* =========================
       VALIDATION FUNCTION
    ========================= */
    function validateForm({ name, email, phone, message }) {

        const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]{2,40}$/;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // нормальный международный формат
        const phoneRegex = /^\+?[0-9\s()-]{10,20}$/;

        if (!nameRegex.test(name)) {
            return "Введіть коректне ім’я (2–40 символів)";
        }

        if (!emailRegex.test(email)) {
            return "Введіть коректний email";
        }

        if (!phoneRegex.test(phone)) {
            return "Введіть коректний номер телефону (+...)";
        }

       

        return null;
    }

    /* =========================
       SHOW ERROR
    ========================= */
    function showError(text) {

        errorMessage.textContent = text;
        errorMessage.classList.add("visible");

        setTimeout(() => {
            errorMessage.classList.remove("visible");
        }, 3000);
    }

    /* =========================
       FORM SUBMIT
    ========================= */
    form.addEventListener('submit', function (e) {

        e.preventDefault();

        successMessage.classList.remove("visible");
        errorMessage.classList.remove("visible");

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const message = form.message.value.trim();

        const error = validateForm({ name, email, phone, message });

        if (error) {
            showError(error);
            return;
        }

        const formData = { name, email, phone, message };

        console.log("FORM DATA:", formData);

        setTimeout(() => {

            successMessage.classList.add("visible");

            form.reset();

            setTimeout(() => {
                successMessage.classList.remove("visible");
                closeModal();
            }, 3000);

        }, 600);
    });

});