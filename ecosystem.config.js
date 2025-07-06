module.exports = {
  apps: [
    {
      name: 'auras-backend',
      script: './backend/server.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      listen_timeout: 10000,
      kill_timeout: 5000,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      watch: false,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-landing',
      script: './landingpage/server.js',
      cwd: './landingpage',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOST: '0.0.0.0'
      },
      error_file: './logs/landing-error.log',
      out_file: './logs/landing-out.log',
      log_file: './logs/landing-combined.log',
      time: true,
      watch: false,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-wallet',
      script: './walletPage/server.js',
      cwd: './walletPage',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      error_file: './logs/wallet-error.log',
      out_file: './logs/wallet-out.log',
      log_file: './logs/wallet-combined.log',
      time: true,
      watch: false,
      autorestart: true,
      max_restarts: 10
    }
  ]
};
