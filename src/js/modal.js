document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // CONFIG (ВСТАВЬ СВОЙ НОВЫЙ ТОКЕН)
    // =========================
    const BOT_TOKEN = "8609215221:AAHjVahRzgjVOeafayuqZj5xVgZofmNdFYo";
    const CHAT_ID = "PUT_CHAT_ID_HERE";

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

    function isValidName(name) {
        return name.trim().length >= 2;
    }

    function isValidPhone(phone) {
        return /^\+?\d{10,15}$/.test(phone);
    }

    function isValidMessage(message) {
        return message.trim().length >= 3;
    }

    function getError(name, phone, message) {

        if (!isValidName(name)) {
            return "❗ Введіть ім’я (мінімум 2 символи)";
        }

        if (!isValidPhone(phone)) {
            return "❗ Введіть номер телефону у форматі +380XXXXXXXXX";
        }

        if (!isValidMessage(message)) {
            return "❗ Напишіть повідомлення";
        }

        return null;
    }

    // =========================
    // TELEGRAM SEND
    // =========================
    async function sendToTelegram(name, phone, message) {

        const text =
`📩 Нова заявка

👤 Ім’я: ${name}
📞 Телефон: ${phone}
💬 Повідомлення: ${message}
`;

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text
            })
        });

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

        const error = getError(name, phone, message);

        if (error) {
            showToast("error", error);
            return;
        }

        try {
            const success = await sendToTelegram(name, phone, message);

            if (!success) {
                showToast("error", "Не вдалося відправити заявку");
                return;
            }

            showToast("success", "Дякую! Я зв'яжуся з вами найближчим часом.");

            form.reset();

            setTimeout(() => {
                closeModal();
            }, 900);

        } catch (err) {
            console.error(err);
            showToast("error", "Помилка з'єднання з Telegram");
        }
    });

});