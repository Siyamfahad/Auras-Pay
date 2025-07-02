const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { findAvailablePort, saveCurrentPort } = require('./utils/portDiscovery');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const defaultPort = 3002; // Different default port to avoid conflict with landing page

async function startServer() {
  try {
    // Find an available port starting from the default port
    const port = await findAvailablePort(defaultPort);
    
    // Save the current port for other processes
    saveCurrentPort(port);
    
    // Create Next.js app
    const app = next({ dev, hostname, port });
    const handle = app.getRequestHandler();
    
    await app.prepare();
    
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, (err) => {
      if (err) throw err;
      
      console.log(`🚀 Wallet Page ready on http://${hostname}:${port}`);
      
      if (port !== defaultPort) {
        console.log(`⚠️  Port ${defaultPort} was busy, wallet page started on port ${port} instead`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start wallet page server:', error.message);
    process.exit(1);
  }
}

startServer(); 