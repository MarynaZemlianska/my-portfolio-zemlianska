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
        "src/fonts": "assets/fonts",
        "src/_redirects": "_redirects",
        "src/_headers": "_headers",
    });

    // ===== RESPONSIVE IMAGES =====
    // Every <img src="/images/…"> becomes <picture> with AVIF/WebP + srcset and
    // real width/height. Author attributes (loading, fetchpriority, alt, class) are kept.
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        formats: ["avif", "webp", "auto"],
        widths: [400, 800, 1200, 1600],
        urlPath: "/assets/img/",
        outputDir: path.join(eleventyConfig.directories.output, "assets/img/"),
        // project screenshots carry small UI text, which blurs at lower quality
        sharpAvifOptions: { quality: 80 },
        sharpWebpOptions: { quality: 90 },
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

    eleventyConfig.addFilter("year", () => new Date().getFullYear());

    // Heading accent (base/_typography.scss): the last word — or the last two
    // when the last one is short ("me") — in the italic serif gradient.
    // Same rule as the static headings in src/pages. Returns HTML: use with `| safe`.
    eleventyConfig.addFilter("accentLast", (text) => {
        const escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const words = String(text).trim().split(/\s+/);
        if (words.length < 2) return escape(text);
        const short = words.at(-1).replace(/[^\p{L}\p{N}]/gu, "").length <= 3;
        const k = short && words.length > 2 ? 2 : 1;
        return `${escape(words.slice(0, -k).join(" "))} <em class="accent-serif">${escape(words.slice(-k).join(" "))}</em>`;
    });

    // ===== SCSS =====
    // Compiled before every build (and on every watch rebuild).
    eleventyConfig.addWatchTarget("src/scss/");
    // The file name carries a content hash so it can be cached forever
    // (see src/_headers); templates read the URL via the `cssUrl` shortcode —
    // a shortcode runs at render time, so watch rebuilds pick up the new hash
    // (global data is cached by the dev server and kept the stale URL).
    let cssUrl = "";
    eleventyConfig.addShortcode("cssUrl", () => cssUrl);
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
