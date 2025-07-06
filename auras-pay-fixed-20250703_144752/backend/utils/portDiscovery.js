const fs = require('fs');
const path = require('path');
const net = require('net');

// File to store the current backend port
const PORT_FILE = path.join(__dirname, '../.current-port');

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
 * Get the current backend port from the saved file
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
async function findAvailablePort(startPort = 3001) {
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
 * Update the frontend .env file with the backend URL
 */
function updateFrontendEnv(port) {
  const frontendEnvPath = path.join(__dirname, '../../frontend/.env');
  const frontendEnvLocalPath = path.join(__dirname, '../../frontend/.env.local');
  
  const envContent = `VITE_API_URL=http://91.99.185.144:${port}\n`;
  
  try {
    // Update .env.local (takes precedence over .env)
    fs.writeFileSync(frontendEnvLocalPath, envContent, 'utf8');
    console.log(`✅ Updated frontend environment: VITE_API_URL=http://91.99.185.144:${port}`);
  } catch (error) {
    console.error('Failed to update frontend .env:', error.message);
  }
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

module.exports = {
  saveCurrentPort,
  getCurrentPort,
  isPortAvailable,
  findAvailablePort,
  updateFrontendEnv,
  cleanupPortFile
}; 