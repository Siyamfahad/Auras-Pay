import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to handle clean URLs
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url;
          
          // If requesting root, serve index.html
          if (url === '/') {
            req.url = '/index.html';
            return next();
          }
          
          // If requesting a directory path without extension, try to serve index.html from that directory
          if (!url.includes('.') && !url.includes('?')) {
            const publicPath = resolve(__dirname, 'public');
            const requestedPath = resolve(publicPath, url.slice(1));
            const indexPath = resolve(requestedPath, 'index.html');
            
            // Check if directory/index.html exists
            if (fs.existsSync(indexPath)) {
              req.url = url.endsWith('/') ? url + 'index.html' : url + '/index.html';
              return next();
            }
          }
          
          next();
        });
      }
    }
  ],
  server: {
    port: 5174,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
  preview: {
    port: 5174,
    host: true,
  }
})
