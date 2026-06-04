module.exports = {
  apps: [
    {
      name: "nextjob-api",
      cwd: "/home/ubuntu/nextjob/backend",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
