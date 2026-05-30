// =========================
// CONTACTS ANIMATION + FORM
// =========================

document.addEventListener('DOMContentLoaded', () => {

    const contactsTitle = document.querySelector('.contacts-title');
    const form = document.querySelector('.form');
    const successMessage = document.getElementById('successMessage');

    const formElements = form
        ? Array.from(
            form.querySelectorAll(
                '.form-label, .input1, .input2, .input3, .form-button, .info-form'
            )
        )
        : [];

    // =========================
    // TITLE ANIMATION
    // =========================
    if (contactsTitle) {
        const titleObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        titleObserver.observe(contactsTitle);
    }

    // =========================
    // FORM ANIMATION
    // =========================
    if (form) {
        const formObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {

                    formElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, index * 100);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        formObserver.observe(form);
    }

    // =========================
    // INPUT VALIDATION
    // =========================

    const nameInput = document.getElementById('user-name');
    const phoneInput = document.getElementById('user-phone');
    const messageInput = document.getElementById('user-message');

    if (!form || !nameInput || !phoneInput || !messageInput || !successMessage) return;

    nameInput.addEventListener('input', () => {
        nameInput.value = nameInput.value.replace(
            /[^A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]/g,
            ''
        );
        nameInput.setCustomValidity('');
    });

    phoneInput.addEventListener('input', () => {
        let value = phoneInput.value.replace(/[^\d+]/g, '');

        if (value.includes('+')) {
            value = '+' + value.replace(/\+/g, '');
        }

        phoneInput.value = value;
        phoneInput.setCustomValidity('');
    });

    messageInput.addEventListener('input', () => {
        messageInput.setCustomValidity('');
    });

    // =========================
    // SUBMIT (FIXED)
    // =========================

    form.addEventListener('submit', (e) => {

        e.preventDefault(); 
        e.stopPropagation(); // 🔥 УБИРАЕТ "ПРЫЖОК" И СБОЙ СКРОЛЛА

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const message = messageInput.value.trim();

        const nameRegex =
            /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+([\s'-][A-Za-zА-Яа-яЁёЇїІіЄєҐґ]+)*$/;

        const phoneRegex =
            /^\+?[0-9]{10,15}$/;

        // validation
        if (!nameRegex.test(name)) {
            nameInput.focus();
            nameInput.setCustomValidity("Введіть коректне ім'я");
            nameInput.reportValidity();
            return;
        }

        if (!phoneRegex.test(phone)) {
            phoneInput.focus();
            phoneInput.setCustomValidity("Введіть коректний номер телефону");
            phoneInput.reportValidity();
            return;
        }

        if (!message) {
            messageInput.focus();
            messageInput.setCustomValidity("Будь ласка, введіть повідомлення");
            messageInput.reportValidity();
            return;
        }

        // =========================
        // SUCCESS MESSAGE
        // =========================

        successMessage.classList.add('visible');

        setTimeout(() => {
            successMessage.classList.remove('visible');
        }, 3000);

        form.reset();
    });

});