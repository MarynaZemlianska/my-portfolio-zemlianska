// Production-like test server: node tests/serve.js <dir> <port>
// - serves the built site with the headers from _site/_headers (incl. CSP)
// - POST /api/lead runs the real Netlify Function (netlify/functions/lead.mjs)
// - the function talks to a local Telegram stub (/__telegram/…) instead of api.telegram.org;
//   GET /__telegram/log returns what the stub received, so tests can assert on it.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const [root = "_site", port = "5650"] = process.argv.slice(2);
const ORIGIN = `http://127.0.0.1:${port}`;

// Test-only credentials and the stub address; real values never appear in tests.
process.env.TELEGRAM_BOT_TOKEN = "TEST-TOKEN";
process.env.TELEGRAM_CHAT_ID = "TEST-CHAT";
process.env.TELEGRAM_API_BASE = `${ORIGIN}/__telegram`;
const { default: leadHandler } = await import("../netlify/functions/lead.mjs");

const TYPES = {
    ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
    ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png",
    ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain",
};

// _headers: "path-pattern" line followed by indented "Name: value" lines
function loadHeaders() {
    const rules = [];
    const file = path.join(root, "_headers");
    if (!fs.existsSync(file)) return rules;
    let current = null;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
        if (!line.trim() || line.trim().startsWith("#")) continue;
        if (!/^\s/.test(line)) {
            current = { re: new RegExp("^" + line.trim().replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"), headers: {} };
            rules.push(current);
        } else if (current) {
            const i = line.indexOf(":");
            let value = line.slice(i + 1).trim();
            // the test server is plain http on localhost
            value = value.replace(/;\s*upgrade-insecure-requests/, "");
            current.headers[line.slice(0, i).trim()] = value;
        }
    }
    return rules;
}
const headerRules = loadHeaders();

const telegramLog = [];

const readBody = (req) => new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

http.createServer(async (req, res) => {
    const url = new URL(req.url, ORIGIN);

    // ---- Telegram stub ----
    if (url.pathname.startsWith("/__telegram/")) {
        if (url.pathname === "/__telegram/log") {
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(telegramLog));
        }
        const body = JSON.parse((await readBody(req)) || "{}");
        const fail = /SIMULATE_TELEGRAM_ERROR/.test(body.text || "");
        telegramLog.push({ path: url.pathname, chat_id: body.chat_id, text: body.text, status: fail ? 500 : 200 });
        res.writeHead(fail ? 500 : 200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: !fail }));
    }

    // ---- serverless function ----
    if (url.pathname === "/api/lead") {
        const body = req.method === "POST" ? await readBody(req) : undefined;
        const response = await leadHandler(new Request(url, { method: req.method, headers: req.headers, body }));
        res.writeHead(response.status, Object.fromEntries(response.headers));
        return res.end(await response.text());
    }

    // ---- static files ----
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not found");
    }
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    const headers = { "Content-Type": type };
    for (const rule of headerRules) if (rule.re.test(url.pathname)) Object.assign(headers, rule.headers);
    let body = fs.readFileSync(file);
    if (/text|javascript|svg|xml/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
        body = zlib.gzipSync(body);
        headers["Content-Encoding"] = "gzip";
    }
    res.writeHead(200, headers);
    res.end(body);
}).listen(Number(port), "127.0.0.1");
