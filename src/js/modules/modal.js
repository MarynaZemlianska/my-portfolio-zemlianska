import { cleanPhone, validateLead, sendLead, leadText } from "./lead.js";

export function initModal() {
    const modal = document.getElementById("consultationModal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".modal-close");
    const form = document.getElementById("consultationForm");
    const toastSuccess = document.getElementById("toast-success");
    const toastError = document.getElementById("toast-error");
    let lastTrigger = null;

    const isOpen = () => modal.classList.contains("is-visible");

    function open(trigger) {
        lastTrigger = trigger;
        modal.classList.add("is-visible");
        modal.classList.remove("is-hidden");
        document.body.style.overflow = "hidden";
        form?.querySelector("input, textarea")?.focus();
    }

    function close() {
        modal.classList.remove("is-visible");
        modal.classList.add("is-hidden");
        document.body.style.overflow = "";
        lastTrigger?.focus();
    }

    document.querySelectorAll(".open-modal, .quote-btn, .btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            open(btn);
        });
    });

    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });

    document.addEventListener("keydown", (e) => {
        if (!isOpen()) return;
        if (e.key === "Escape") close();

        // keep keyboard focus inside the dialog
        if (e.key === "Tab") {
            const focusable = [...modal.querySelectorAll("button, input, textarea, a[href]")];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    function showToast(el, text) {
        if (!el) return;
        el.textContent = text;
        el.classList.add("show");
        setTimeout(() => el.classList.remove("show"), 3000);
    }

    if (!form) return;
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const lead = {
            name: form.elements.name.value.trim(),
            phone: cleanPhone(form.elements.phone.value.trim()),
            message: form.elements.message.value.trim(),
            source: "Modal",
        };

        const invalid = validateLead(lead);
        if (invalid) {
            showToast(toastError, leadText[invalid]);
            form.elements[invalid].focus();
            return;
        }

        submitBtn.disabled = true;
        const ok = await sendLead(lead);
        submitBtn.disabled = false;

        if (!ok) {
            showToast(toastError, leadText.error);
            return;
        }

        showToast(toastSuccess, leadText.success);
        form.reset();
        setTimeout(close, 800);
    });
}
