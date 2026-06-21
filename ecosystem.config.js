module.exports = {
  apps: [{
    name: "ecotup-api",
    script: "app.js",
    instances: "max",
    exec_mode: "cluster",
    env_file: ".env",
    watch: false,
  }],
};
