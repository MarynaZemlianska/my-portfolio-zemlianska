export default {
    name: "Maryna Zemlianska",
    // Production origin without trailing slash, e.g. "https://zemlianska.dev".
    // canonical / hreflang / Open Graph URLs are only emitted once this is set.
    url: process.env.SITE_URL || "",
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
