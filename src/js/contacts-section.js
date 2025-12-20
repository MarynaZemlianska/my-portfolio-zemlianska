// Получаем элементы
const contactsTitle = document.querySelector('.contacts-title');
const form = document.querySelector('.form');
const formElements = form ? Array.from(form.querySelectorAll('.form-title, .form-label, .input1, .input2, .input3, .form-button, .info-form')) : [];

// IntersectionObserver для заголовка
const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (contactsTitle) titleObserver.observe(contactsTitle);

// IntersectionObserver для формы
const formObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            // добавляем класс visible всем элементам формы с небольшой задержкой
            formElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100); // 100ms между каждым элементом
            });
            formObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (form) formObserver.observe(form);
