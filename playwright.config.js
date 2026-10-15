import { defineConfig, devices } from "@playwright/test";

// `npm test` builds the site and serves _site/ with production-like headers.
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
        command: "npm run build && node tests/serve.js _site 5650",
        url: "http://127.0.0.1:5650/",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
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
