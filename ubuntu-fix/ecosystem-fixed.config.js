module.exports = {
  apps: [
    {
      name: 'auras-backend',
      script: './server.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      error_file: '../logs/backend-error.log',
      out_file: '../logs/backend-out.log',
      log_file: '../logs/backend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-frontend',
      script: 'serve',
      args: ['-s', 'dist', '-l', '5174'],
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production' },
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      log_file: '../logs/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-landing',
      script: './server.js',
      cwd: './landingpage',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOST: '0.0.0.0'
      },
      error_file: '../logs/landing-error.log',
      out_file: '../logs/landing-out.log',
      log_file: '../logs/landing-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10
    }
  ]
};
