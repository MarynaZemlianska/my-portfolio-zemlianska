import fs from "node:fs";
import path from "node:path";
import * as sass from "sass";

const CSS_IN = "src/scss/main.scss";
const CSS_OUT = "_site/assets/css/style.css";

export default function (eleventyConfig) {
    // ===== STATIC ASSETS =====
    eleventyConfig.addPassthroughCopy({
        "src/images": "assets/images",
        "src/js": "assets/js",
        "src/fonts": "assets/fonts",
        "src/_redirects": "_redirects",
    });

    // Legacy pre-11ty pages, kept for reference only.
    eleventyConfig.ignores.add("src/html/**");

    eleventyConfig.addFilter("year", () => new Date().getFullYear());

    // ===== SCSS =====
    // Compiled before every build (and on every watch rebuild).
    eleventyConfig.addWatchTarget("src/scss/");
    eleventyConfig.on("eleventy.before", () => {
        const { css } = sass.compile(CSS_IN, { style: "compressed" });
        fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
        fs.writeFileSync(CSS_OUT, css);
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
