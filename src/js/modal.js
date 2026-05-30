document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // CONFIG
    // =========================
    const BOT_TOKEN = "8609215221:AAEK81koYSAezC8IlKyptB-_F9KQuMi7Du4";
    const CHAT_ID = "593216853";

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('consultationForm');

    const toastSuccess = document.getElementById("toast-success");
    const toastError = document.getElementById("toast-error");

    const openBtns = document.querySelectorAll('.open-modal, .quote-btn, .btn');

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
    // TOAST
    // =========================
    function showToast(type, text = "") {
        const el = type === "success" ? toastSuccess : toastError;
        if (!el) return;

        if (text) el.textContent = text;

        el.classList.add("show");

        setTimeout(() => {
            el.classList.remove("show");
        }, 3000);
    }

    // =========================
    // HELPERS
    // =========================

    function cleanPhone(input) {
        let phone = input.replace(/[^\d+]/g, '');
        phone = phone.replace(/(?!^)\+/g, '');
        return phone;
    }

    function validate(name, phone, message) {
        if (name.trim().length < 2) return "❗ Введіть ім’я";
        if (!/^\+?\d{10,15}$/.test(phone)) return "❗ Невірний номер телефону";
        if (message.trim().length < 3) return "❗ Напишіть повідомлення";
        return null;
    }

    // =========================
    // TELEGRAM SEND (FIXED FOR NETLIFY)
    // =========================
    async function sendToTelegram(name, phone, message) {

        const text =
`📩 Нова заявка

👤 Ім’я: ${name}
📞 Телефон: ${phone}
💬 Повідомлення: ${message}`;

        const url =
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`;

        const res = await fetch(url);

        return res.ok;
    }

    // =========================
    // SUBMIT
    // =========================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.elements.name.value.trim();
        let phone = cleanPhone(form.elements.phone.value.trim());
        const message = form.elements.message.value.trim();

        const error = validate(name, phone, message);

        if (error) {
            showToast("error", error);
            return;
        }

        try {
            const success = await sendToTelegram(name, phone, message);

            if (!success) {
                showToast("error", "Сталася помилка! Спробуйте ще. Можливо щось некоректно введено.");
                return;
            }

            showToast("success", "Дякую! Ваша заявка успішно відправлена.Я зв'яжуся з вами найближчим часом.");

            form.reset();

            setTimeout(() => {
                closeModal();
            }, 800);

        } catch (err) {
            console.error(err);
            showToast("error", "❌ Помилка з'єднання");
        }
    });

});