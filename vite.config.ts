import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'audio-streaming-and-files',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/audio/')) {
              try {
                const urlWithoutQuery = req.url.split('?')[0];
                const rawParam = urlWithoutQuery.replace(/^\/audio\//, '');
                const decodedName = decodeURIComponent(rawParam);
                const filePath = path.resolve(__dirname, 'public/audio', decodedName);

                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                  const stat = fs.statSync(filePath);

                  // Guard against corrupted HTML files uploaded with media extensions
                  if (stat.size < 4096) {
                    try {
                      const sample = fs.readFileSync(filePath, 'utf-8');
                      if (sample.includes('<html') || sample.includes('<!doctype') || sample.includes('410 Gone')) {
                        res.writeHead(404, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-cache' });
                        res.end(`File "${decodedName}" is not a valid audio file (corrupted HTML).`);
                        return;
                      }
                    } catch {
                      // Proceed
                    }
                  }

                  const ext = path.extname(filePath).toLowerCase();
                  const contentType = ext === '.mp4' ? 'video/mp4' : 'audio/mpeg';
                  const totalSize = stat.size;
                  const range = req.headers.range;

                  if (range) {
                    const parts = range.replace(/bytes=/, '').split('-');
                    const start = parseInt(parts[0], 10);
                    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
                    const chunksize = end - start + 1;
                    res.writeHead(206, {
                      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                      'Accept-Ranges': 'bytes',
                      'Content-Length': chunksize,
                      'Content-Type': contentType,
                      'Cache-Control': 'no-cache',
                    });
                    fs.createReadStream(filePath, { start, end }).pipe(res);
                  } else {
                    res.writeHead(200, {
                      'Content-Length': totalSize,
                      'Content-Type': contentType,
                      'Accept-Ranges': 'bytes',
                      'Cache-Control': 'no-cache',
                    });
                    fs.createReadStream(filePath).pipe(res);
                  }
                  return;
                } else {
                  // Crucial: Missing audio files MUST 404, never fallback to index.html
                  res.writeHead(404, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-cache' });
                  res.end(`Audio file "${decodedName}" not found in /public/audio/`);
                  return;
                }
              } catch (e) {
                console.error('[Audio Middleware Error]', e);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error loading audio');
                return;
              }
            }
            next();
          });

          server.middlewares.use('/api/audio-files', (_req, res) => {
            try {
              const audioDir = path.resolve(__dirname, 'public/audio');
              if (fs.existsSync(audioDir)) {
                const files = fs.readdirSync(audioDir);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(files));
                return;
              }
            } catch {
              // Ignore
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
