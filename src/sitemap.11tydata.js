// The sitemap needs absolute URLs, so it is only written when the production
// origin is known (see _data/site.js). Returning false skips the file entirely.
export default {
    eleventyComputed: {
        permalink: (data) => (data.site.url ? "/sitemap.xml" : false),
    },
};
