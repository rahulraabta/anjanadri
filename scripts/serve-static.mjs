import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { resolve, join, extname, sep } from "node:path";

const root = resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/x-component",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      if (statSync(file).isDirectory()) {
        const index = join(file, "index.html");
        file = statSync(index, { throwIfNoEntry: false })?.isFile() ? index : `${file}.html`;
      }
    } catch {
      if (!extname(file)) file += ".html";
    }
    if (!statSync(file).isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(file).on("error", () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
}).listen(3000, "127.0.0.1", () => {
  console.log("Static export available at http://localhost:3000");
});
