module.exports = {
  apps: [
    {
      name: "llm-flow",
      script: "node_modules/next/dist/bin/next",

      args: "start",
      cwd: "/home/ubuntu/llm-flow",

      interpreter: "/home/ubuntu/.nvm/versions/node/v24.12.0/bin/node",

      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3636
      }
    }
  ]
};