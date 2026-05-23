
const contactsTitle = document.querySelector('.contacts-title');
const form = document.querySelector('.form');
const formElements = form ? Array.from(form.querySelectorAll('.form-title, .form-label, .input1, .input2, .input3, .form-button, .info-form')) : [];

// IntersectionObserver 
const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (contactsTitle) titleObserver.observe(contactsTitle);

// IntersectionObserver 
const formObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
           
            formElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100); 
            });
            formObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (form) formObserver.observe(form);
