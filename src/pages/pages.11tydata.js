// Defaults for every page in src/pages/.
// Each page sets `key` (see _data/routes.js) and `lang`.
export default {
    layout: "layouts/base.njk",
    eleventyComputed: {
        permalink: (data) => data.routes[data.key][data.lang],
    },
};
