// Minimal production-like static server for tests: node tests/serve.js <dir> <port>
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const [root = "_site", port = "5650"] = process.argv.slice(2);
const TYPES = {
    ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
    ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png",
    ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain",
};

http.createServer((req, res) => {
    let file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not found");
    }
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    let body = fs.readFileSync(file);
    const headers = { "Content-Type": type };
    if (/text|javascript|svg|xml/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
        body = zlib.gzipSync(body);
        headers["Content-Encoding"] = "gzip";
    }
    res.writeHead(200, headers);
    res.end(body);
}).listen(Number(port), "127.0.0.1");
