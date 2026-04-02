module.exports = {
  apps: [
    {
      name: 'voltexbazar-api',
      script: '/root/voltexbazar/server/src/index.js',
      instances: 2,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      kill_timeout: 5000,
      restart_delay: 2000,
      min_uptime: '10s',
      max_restarts: 10,
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'voltexbazar-web',
      cwd: '/root/voltexbazar',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      kill_timeout: 5000,
      restart_delay: 2000,
      min_uptime: '10s',
      max_restarts: 10,
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production' }
    }
  ]
};
