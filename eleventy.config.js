import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import * as sass from "sass";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const CSS_IN = "src/scss/main.scss";
const CSS_DIR = "assets/css"; // relative to the build output directory

export default function (eleventyConfig) {
    // ===== STATIC ASSETS =====
    eleventyConfig.addPassthroughCopy({
        "src/images/*.svg": "assets/images", // raster images go through eleventy-img
        "src/images/og": "assets/images/og",
        "src/js/main.js": "assets/js/main.js",
        "src/js/modules": "assets/js/modules",
        "src/js/config.js": "assets/js/config.js",
        "src/fonts": "assets/fonts",
        "src/_redirects": "_redirects",
        "src/_headers": "_headers",
    });

    // ===== RESPONSIVE IMAGES =====
    // Every <img src="/images/…"> becomes <picture> with AVIF/WebP + srcset and
    // real width/height. Author attributes (loading, fetchpriority, alt, class) are kept.
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        formats: ["avif", "webp", "auto"],
        widths: [400, 800, 1200],
        urlPath: "/assets/img/",
        outputDir: path.join(eleventyConfig.directories.output, "assets/img/"),
        sharpAvifOptions: { quality: 62 },
        sharpWebpOptions: { quality: 82 },
        htmlOptions: {
            imgAttributes: {
                loading: "lazy",
                decoding: "async",
                // largest on-screen size is ~600px (project cards, hero) on desktop
                sizes: "(max-width: 768px) 100vw, 600px",
            },
            pictureAttributes: {},
        },
    });

    // Legacy pre-11ty pages, kept for reference only.
    eleventyConfig.ignores.add("src/html/**");

    eleventyConfig.addFilter("year", () => new Date().getFullYear());

    // ===== SCSS =====
    // Compiled before every build (and on every watch rebuild).
    eleventyConfig.addWatchTarget("src/scss/");
    // The file name carries a content hash so it can be cached forever
    // (see src/_headers); templates read the URL from the `cssUrl` global.
    let cssUrl = "";
    eleventyConfig.addGlobalData("cssUrl", () => cssUrl);
    eleventyConfig.on("eleventy.before", ({ directories }) => {
        const { css } = sass.compile(CSS_IN, { style: "compressed" });
        const hash = crypto.createHash("sha256").update(css).digest("hex").slice(0, 10);
        const dir = path.join(directories.output, CSS_DIR);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `style.${hash}.css`), css);
        cssUrl = `/${CSS_DIR}/style.${hash}.css`;
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
