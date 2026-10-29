import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const rootArg = process.argv[2];
const port = Number(process.argv[3] || 4174);

if (!rootArg) {
  console.error("Usage: node static-server.mjs <folder> <port>");
  process.exit(1);
}

const root = path.resolve(rootArg);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".geojson": "application/geo+json; charset=utf-8",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = decoded === "/" ? "/index.html" : decoded;
  const fullPath = path.resolve(root, `.${requested}`);
  return fullPath.startsWith(root) ? fullPath : path.join(root, "index.html");
}

const server = createServer(async (req, res) => {
  try {
    let filePath = safePath(req.url || "/");
    if (!existsSync(filePath)) {
      filePath = path.join(root, "index.html");
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error));
  }
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`SALES CHAMPIONS LEAGUE aciliyor: ${url}`);
  console.log("Kapatmak icin bu pencereyi kapatabilir veya Ctrl+C kullanabilirsiniz.");
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" });
  }
});
