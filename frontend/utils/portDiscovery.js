import fs from 'fs';
import path from 'path';
import net from 'net';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File to store the current frontend port
const PORT_FILE = path.join(__dirname, '../.current-port');

/**
 * Check if a port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .listen(port, () => {
        server.close(() => resolve(true));
      })
      .on('error', () => resolve(false));
  });
}

/**
 * Find an available port starting from the given port
 */
async function findAvailablePort(startPort = 5173) {
  let port = parseInt(startPort);
  
  while (port < 65535) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  
  throw new Error('No available ports found');
}

/**
 * Save the current port to a file for other processes to read
 */
function saveCurrentPort(port) {
  try {
    fs.writeFileSync(PORT_FILE, port.toString(), 'utf8');
  } catch (error) {
    console.error('Failed to save current port:', error.message);
  }
}

/**
 * Get the current frontend port from the saved file
 */
function getCurrentPort() {
  try {
    if (fs.existsSync(PORT_FILE)) {
      const port = fs.readFileSync(PORT_FILE, 'utf8').trim();
      return parseInt(port);
    }
  } catch (error) {
    console.error('Failed to read current port:', error.message);
  }
  return null;
}

/**
 * Clean up port file when process exits
 */
function cleanupPortFile() {
  try {
    if (fs.existsSync(PORT_FILE)) {
      fs.unlinkSync(PORT_FILE);
    }
  } catch (error) {
    console.error('Failed to cleanup port file:', error.message);
  }
}

// Cleanup on process exit
process.on('exit', cleanupPortFile);
process.on('SIGINT', () => {
  cleanupPortFile();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanupPortFile();
  process.exit(0);
});

export {
  isPortAvailable,
  findAvailablePort,
  saveCurrentPort,
  getCurrentPort,
  cleanupPortFile
}; 