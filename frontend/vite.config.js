import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import { findAvailablePort, saveCurrentPort } from './utils/portDiscovery.js'

// https://vite.dev/config/
export default defineConfig(async () => {
  // Find an available port starting from 5173
  const port = await findAvailablePort(5173);
  
  // Save the port for other processes
  saveCurrentPort(port);
  
  if (port !== 5173) {
    console.log(`\n⚠️  Port 5173 was busy, frontend will start on port ${port} instead\n`);
  }

  return {
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
      port: port,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
    preview: {
      port: port + 1000, // Use a different port for preview to avoid conflicts
      host: true,
    }
  };
})
