require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  apps: [{
    name: "ecotup-api",
    script: "app.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    env: {
      NODE_ENV: "production",
      PORT: process.env.PORT || 8000,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      STORAGE_TYPE: process.env.STORAGE_TYPE || "filesystem",
      UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
      BASE_URL: process.env.BASE_URL || "http://127.0.0.1:8000",
      GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || "",
      GCS_BUCKET: process.env.GCS_BUCKET || "",
      GCS_KEY_FILE: process.env.GCS_KEY_FILE || "",
    },
  }],
};
