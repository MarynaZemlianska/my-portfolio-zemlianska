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

## Local configuration (not in git)

The lead forms send requests to Telegram. The bot credentials live in
`src/js/config.js`, which is **gitignored**. Create it from the template:

```sh
cp src/js/config.example.js src/js/config.js   # then fill in the real values
```

Note: anything shipped to the browser is public. See "Security" below.

## Domain / SEO

Absolute URLs (canonical, hreflang, Open Graph, JSON-LD, `sitemap.xml`) are generated
only when the production origin is known:

```sh
SITE_URL=https://your-domain.com npm run build
```

(or set `SITE_URL` in the hosting provider's build settings).

## Deploying (Netlify)

- Build command: `npm run build` · Publish directory: `_site`
- Environment: `SITE_URL=https://…`
- `src/_redirects` keeps the old URLs (`/src/html/*.html`, `/en/*.html`) working with 301s.
- `src/_headers` sets long-term caching for hashed assets and basic security headers.
- `src/js/config.js` must exist at build time (see above) or the forms cannot send.

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

The Telegram bot token is used from client-side JavaScript, so it is visible to anyone
who opens the site, even though it is not in git. Recommended next step: move the
call to a serverless function (e.g. Netlify Function) that holds the token in an
environment variable; the forms then post to `/.netlify/functions/lead`.
