// Contact section form. Previously only showed a "sent" toast without
// sending anything — now it uses the same lead pipeline as the modal.
import { cleanPhone, validateLead, sendLead, leadText } from "./lead.js";

export function initContactForm() {
    const form = document.querySelector(".section-contacts .form");
    const toast = document.getElementById("toast");
    if (!form || !toast) return;

    const fields = {
        name: document.getElementById("user-name"),
        phone: document.getElementById("user-phone"),
        message: document.getElementById("user-message"),
    };
    if (!fields.name || !fields.phone || !fields.message) return;

    const submitBtn = form.querySelector('[type="submit"]');

    fields.name.addEventListener("input", () => {
        fields.name.value = fields.name.value.replace(/[^A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'’-]/g, "");
    });

    fields.phone.addEventListener("input", () => {
        fields.phone.value = cleanPhone(fields.phone.value);
    });

    // a custom validity message must be cleared, or the field stays invalid forever
    Object.values(fields).forEach((field) =>
        field.addEventListener("input", () => field.setCustomValidity(""))
    );

    function showToast(text, isError = false) {
        toast.textContent = text;
        toast.classList.toggle("toast-error", isError);
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const lead = {
            name: fields.name.value.trim(),
            phone: fields.phone.value.trim(),
            message: fields.message.value.trim(),
            source: "Contact form",
            website: form.elements.website?.value ?? "",
        };

        const invalid = validateLead(lead);
        if (invalid) {
            const field = fields[invalid];
            field.setCustomValidity(leadText[invalid]);
            field.reportValidity();
            field.focus();
            return;
        }

        submitBtn.disabled = true;
        const ok = await sendLead(lead);
        submitBtn.disabled = false;

        if (!ok) {
            showToast(leadText.error, true);
            return;
        }

        showToast(leadText.success);
        form.reset();
    });
}
