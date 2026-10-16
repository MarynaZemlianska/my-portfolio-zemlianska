# Maryna Zemlianska — portfolio (Web{LAB} Zemlianska)

Static bilingual site (UA at `/`, EN at `/en/`) built with **Eleventy**, **Sass** and
plain **ES-module JavaScript**. No client-side framework.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dev dependencies |
| `npm run dev` | Build + local server with live reload (http://localhost:8080) |
| `npm run build` | Production build into `_site/` |
| `npm run validate` | Build and validate the HTML of every page |
| `npm test` | Playwright suite (Chrome, Firefox, WebKit, phone, tablet) |
| `npm run test:update-visual` | Re-create visual baselines after an *intentional* design change |

First run of the tests: `npx playwright install` (downloads the test browsers).

## Lead forms → Telegram (serverless)

Both forms POST to `/api/lead`, a Netlify Function (`netlify/functions/lead.mjs`) that
re-validates the data, drops bots (hidden honeypot field) and forwards the lead to
Telegram. The bot token and chat id live **only** in environment variables — they are
not in git, not in the browser and not in `_site`.

| Variable | Where |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Netlify → Site configuration → Environment variables (scope: Functions) |
| `TELEGRAM_CHAT_ID` | same |

Local testing with real sending: copy `.env.example` to `.env` (gitignored), fill it in, then
run `npx netlify-cli dev` (serves the site *and* the function on http://localhost:8888).
`npm run dev` serves only the static site — the forms will show an error there.

Tests never contact Telegram: `tests/serve.js` runs the real function against a local stub.

## Domain / SEO

Absolute URLs (canonical, hreflang, Open Graph, JSON-LD, `sitemap.xml`) are generated only
when the production origin is known:

- on Netlify production builds the primary site URL (`URL`, e.g. the custom domain) is used
  automatically; deploy previews get none;
- `SITE_URL=https://your-domain.com` overrides it (also for local builds).

## Deploying (Netlify, from Git)

Settings come from `netlify.toml`: build command `npm run build`, publish `_site`,
functions `netlify/functions`, Node 22.

1. Netlify → **Add new site → Import an existing project** → pick this repository.
2. Branch to deploy: `main` (after merging `modernization`), build settings are read from `netlify.toml`.
3. **Environment variables**: add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
   (mark them as *secret*; scope must include Functions). Optional: `SITE_URL`.
4. Deploy. Then **Domain management** → add the custom domain if you have one and redeploy
   so canonical/sitemap use it.
5. Verify (see "Checking real sending" below).

`src/_redirects` keeps old URLs (`/src/html/*.html`, `/en/*.html`) working with 301s.
`src/_headers` sets caching, a Content-Security-Policy and security headers.

### Checking real sending after deploy

1. Open the deployed site, submit the **modal** form with a recognisable message,
   e.g. `Test modal — please ignore`.
2. Submit the **contact form** at the bottom of the home page the same way.
3. Each should show the success message and arrive in Telegram as
   `📩 Нова заявка … 📍 Modal · /` (or `Contact form · /`).
4. If an error message appears: Netlify → Logs → Functions → `lead`.
   `not_configured` = environment variables missing (redeploy after adding them);
   `Telegram responded with status 401/400` = token / chat id value is wrong.

## Structure

```
src/
  pages/{uk,en}/      page content (one file per page; key + lang in front matter)
  _includes/          layout and shared partials (header, footer, modal)
  _data/              routes.js (all URLs), i18n.js (UI strings), site.js
  scss/               abstracts / base / components / layout / sections / pages
  js/                 main.js + modules/ (one module per feature)
  images/  fonts/     sources (raster images are optimised at build time)
scripts/subset-fonts.py   how the Latin+Cyrillic font subsets were made
tests/                    Playwright tests
```

Breakpoints: `@include down(md)` etc. (see `src/scss/abstracts/_breakpoints.scss`).

## Security

- No secrets in the repository; `.env` and the old `src/js/config.js` are gitignored.
- The browser only knows `/api/lead`; the Telegram token is used server-side only.
- Content-Security-Policy allows scripts, styles, fonts and requests from the site itself only.
