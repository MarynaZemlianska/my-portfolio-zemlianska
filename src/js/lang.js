document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = btn.dataset.url;
    });
});