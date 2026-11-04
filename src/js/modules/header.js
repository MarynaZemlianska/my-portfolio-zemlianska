export function initHeader() {
    const header = document.querySelector(".header");
    const burger = document.getElementById("burger");
    const nav = document.querySelector(".nav");
    const toTopBtn = document.getElementById("toTopBtn");

    // ===== ENTRANCE =====
    if (header) {
        header.classList.add("hidden");
        setTimeout(() => {
            header.classList.remove("hidden");
            header.classList.add("visible");
        }, 100);
    }

    // ===== ACTIVE LINK =====
    document.querySelectorAll(".nav-link").forEach((link) => {
        if (!link.getAttribute("href").startsWith("#") && link.pathname === window.location.pathname) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    // ===== SCROLL STATE =====
    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        header?.classList.toggle("scrolled", y > 20);
        toTopBtn?.classList.toggle("show", y > 300);
    }, { passive: true });

    toTopBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // ===== MOBILE MENU =====
    if (burger && nav) {
        const setMenu = (open) => {
            burger.classList.toggle("active", open);
            nav.classList.toggle("active", open);
            document.body.classList.toggle("menu-open", open);
            burger.setAttribute("aria-expanded", String(open));
        };

        burger.setAttribute("aria-expanded", "false");
        burger.addEventListener("click", () => setMenu(!nav.classList.contains("active")));

        // close after navigating to a section / page
        nav.querySelectorAll("a[href]:not([href='#'])").forEach((a) =>
            a.addEventListener("click", () => setMenu(false))
        );

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && nav.classList.contains("active")) {
                setMenu(false);
                burger.focus();
            }
        });
    }

    // ===== SERVICES DROPDOWN =====
    // The label is a link to the services page; the arrow button opens the list
    // (tap / keyboard; hover still works on desktop).
    document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle) => {
        const item = toggle.closest(".nav-item");
        if (!item) return;

        const set = (open) => {
            item.classList.toggle("active", open);
            toggle.setAttribute("aria-expanded", String(open));
        };

        toggle.addEventListener("click", () => set(!item.classList.contains("active")));

        item.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && item.classList.contains("active")) {
                e.stopPropagation();
                set(false);
                toggle.focus();
            }
        });

        document.addEventListener("click", (e) => {
            if (!item.contains(e.target)) set(false);
        });
    });
}
