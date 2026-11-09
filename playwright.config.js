import { defineConfig, devices } from "@playwright/test";

// `npm test` builds the site into its own folder (_site-test/, so a running
// `npm run dev`, which rewrites _site/ in dev mode, can't swap files under the
// tests) and serves it with production-like headers.
// Telegram is always mocked in tests (see tests/helpers.js) — no real leads are sent.
export default defineConfig({
    testDir: "tests",
    fullyParallel: true,
    workers: 2,
    timeout: 60_000,
    retries: process.env.CI ? 1 : 0,
    reporter: [["list"]],
    use: {
        baseURL: "http://127.0.0.1:5650",
        trace: "retain-on-failure",
        navigationTimeout: 20_000,
        actionTimeout: 10_000,
    },
    expect: {
        toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
    },
    webServer: {
        // not cleaned between runs: the generated images stay as a cache
        // (a clean build regenerates every AVIF/WebP and can take minutes)
        command: "npx eleventy --output=_site-test && node tests/serve.js _site-test 5650",
        url: "http://127.0.0.1:5650/",
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
        { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
        { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
        { name: "tablet-safari", use: { ...devices["iPad (gen 7)"] } },
    ],
});
