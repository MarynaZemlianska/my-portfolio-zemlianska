import fs from "node:fs";
import path from "node:path";
import * as sass from "sass";

const CSS_IN = "src/scss/main.scss";
const CSS_OUT = "assets/css/style.css"; // relative to the build output directory

export default function (eleventyConfig) {
    // ===== STATIC ASSETS =====
    eleventyConfig.addPassthroughCopy({
        "src/images": "assets/images",
        "src/js/main.js": "assets/js/main.js",
        "src/js/modules": "assets/js/modules",
        "src/js/config.js": "assets/js/config.js",
        "src/fonts": "assets/fonts",
        "src/_redirects": "_redirects",
    });

    // Legacy pre-11ty pages, kept for reference only.
    eleventyConfig.ignores.add("src/html/**");

    eleventyConfig.addFilter("year", () => new Date().getFullYear());

    // ===== SCSS =====
    // Compiled before every build (and on every watch rebuild).
    eleventyConfig.addWatchTarget("src/scss/");
    eleventyConfig.on("eleventy.before", ({ directories }) => {
        const out = path.join(directories.output, CSS_OUT);
        const { css } = sass.compile(CSS_IN, { style: "compressed" });
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, css);
    });

    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
        templateFormats: ["njk", "html"],
        htmlTemplateEngine: "njk",
    };
}
