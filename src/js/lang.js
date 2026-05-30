function getLangFromPath(path) {
    if (path.startsWith('/en')) return 'en';
    return 'ua';
}

const currentLang = getLangFromPath(window.location.pathname);

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langBtn === currentLang);

    btn.addEventListener('click', () => {
        window.location.href = btn.dataset.url;
    });
});

