// Defaults for every page in src/pages/.
// Each page sets `key` (see _data/routes.js) and `lang`.
export default {
    layout: "layouts/base.njk",
    scripts: [
        "header",
        "home-page",
        "projects-section",
        "steps-section",
        "contacts-section",
        "services-section",
        "about-section",
        "footer",
        "config",
        "modal",
        "lang",
    ],
    eleventyComputed: {
        permalink: (data) => data.routes[data.key][data.lang],
    },
};
