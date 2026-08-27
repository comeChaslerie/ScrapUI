// Sert le build de production de la démo, avec repli SPA sur index.html.
//
// Pourquoi pas `ng serve` : le serveur de développement injecte du
// live-reload et ouvre des ports annexes, deux sources d'instabilité pour
// des captures d'écran. Un serveur statique n'a aucune de ces surprises.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/demo/browser/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? 4300);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);
  const candidate = join(root, normalize(decodeURIComponent(url.pathname)));

  const file =
    candidate.startsWith(root) && existsSync(candidate) && statSync(candidate).isFile()
      ? candidate
      : join(root, 'index.html');

  res.writeHead(200, {
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`démo servie sur http://localhost:${port}`));
