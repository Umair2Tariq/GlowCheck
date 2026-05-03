const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT) || 4173;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function resolvePath(requestUrl) {
  const pathname = decodeURIComponent(requestUrl.split("?")[0]);
  const target = pathname === "/" ? "/index.html" : pathname;
  const normalized = path.normalize(path.join(root, target));

  if (!normalized.startsWith(root)) {
    return null;
  }

  return normalized;
}

const server = http.createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      if (error.code === "ENOENT") {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  });
});

server.listen(port, () => {
  console.log(`GlowCheck running at http://localhost:${port}`);
});
