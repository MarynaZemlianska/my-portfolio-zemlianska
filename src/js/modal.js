document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("LLvGckVcu-rYdYajp"); // Твой User ID

    const modal = document.getElementById('consultationModal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('consultationForm');
    const successMessage = document.getElementById("successMessage");

    openBtn.addEventListener('click', () => {
        modal.classList.remove('is-hidden');
        modal.classList.add('is-visible');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-visible');
        modal.classList.add('is-hidden');
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('is-visible');
            modal.classList.add('is-hidden');
        }
    });

    form.addEventListener('submit', function(e){
        e.preventDefault();

        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        emailjs.send('service_z4roncj', 'template_aau9edp', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                successMessage.classList.add("visible");
                form.reset();
                setTimeout(() => {
                    successMessage.classList.remove("visible");
                    modal.classList.remove('is-visible');
                    modal.classList.add('is-hidden');
                }, 4000);
            }, function(error) {
                console.log('FAILED...', error);
                alert("Oops! Something went wrong, please try again.");
            });
    });
});
