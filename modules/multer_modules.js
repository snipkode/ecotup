const path = require("path");
const fs = require("fs");

const uploadToFilesystem = (file, destination) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8000";
  return new Promise((resolve, reject) => {
    const dir = path.join(uploadDir, destination);
    fs.mkdirSync(dir, { recursive: true });
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(dir, fileName);
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) return reject(`Error saving file: ${err}`);
      resolve(`${baseUrl}/${uploadDir}/${destination}/${fileName}`);
    });
  });
};

const uploadToGCS = (file, destination) => {
  const { Storage } = require("@google-cloud/storage");
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_KEY_FILE || "serviceaccount-key.json",
  });
  const bucket = storage.bucket(process.env.GCS_BUCKET);
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(`${destination}/${fileName}`);
    const stream = fileUpload.createWriteStream({ metadata: { contentType: file.mimetype } });
    stream.on("error", (err) => reject(`Error uploading file: ${err}`));
    stream.on("finish", () => resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`));
    stream.end(file.buffer);
  });
};

const uploadFileToStorage = (file, destination) => {
  if (process.env.STORAGE_TYPE === "gcs") return uploadToGCS(file, destination);
  return uploadToFilesystem(file, destination);
};

module.exports = { uploadFileToStorage };
