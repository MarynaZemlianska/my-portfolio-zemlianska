document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.getElementById('modalClose');

    const form = document.getElementById('consultationForm');

    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    
    const openBtns = document.querySelectorAll(
        '#openModal, #openQuoteModal, #openModalMobile'
    );

    /* ===== OPEN ===== */
    openBtns.forEach(btn => {

        if (!btn) return;

        btn.addEventListener('click', () => {

            modal.classList.remove('is-hidden');
            modal.classList.add('is-visible');

            document.body.style.overflow = 'hidden';

        });

    });

    /* ===== CLOSE ===== */
    function closeModal() {

        modal.classList.remove('is-visible');
        modal.classList.add('is-hidden');

        document.body.style.overflow = '';

    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {

        if (e.target === modal) {
            closeModal();
        }

    });

    /* ===== ESC ===== */
    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            closeModal();
        }

    });

    /* ===== FORM SEND ===== */
    form.addEventListener('submit', function(e){

        e.preventDefault();


        successMessage.classList.remove("visible");

        if (errorMessage) {
            errorMessage.classList.remove("visible");
        }

      
        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        console.log("FORM DATA:", formData);

   
        setTimeout(() => {

            successMessage.classList.add("visible");

            form.reset();

            setTimeout(() => {

                successMessage.classList.remove("visible");

                closeModal();

            }, 3000);

        }, 800);

    });

});