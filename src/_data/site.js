export default {
    name: "Maryna Zemlianska",
    // Production origin without trailing slash. canonical / hreflang / Open Graph /
    // sitemap are only emitted when it is known: SITE_URL if set, otherwise the
    // primary site URL Netlify provides for production builds (CONTEXT=production).
    // Deploy previews and local builds get no absolute URLs (nothing made up).
    url: (process.env.SITE_URL || (process.env.CONTEXT === "production" ? process.env.URL : "") || "").replace(/\/$/, ""),
    email: "mv.zemlianska@gmail.com",
    telegram: "https://t.me/zemlianska_dev",
    viber: "viber://chat?number=%2B380637657506",
    // Public profiles for structured data (schema.org sameAs). Add GitHub / LinkedIn here.
    profiles: [
        "https://www.instagram.com/zemlianska_maryna/",
        "https://t.me/zemlianska_dev",
    ],
    // Order matters: the first entry is x-default.
    languages: ["uk", "en"],
    // Order of the EN | UA switcher buttons.
    switcherOrder: ["en", "uk"],
};
