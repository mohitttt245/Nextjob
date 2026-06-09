import multer from "multer";
import { storage } from "../config/cloudinary.js";

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/svg+xml"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Unsupported file type. Upload PDF, DOC, DOCX, PNG, JPG, or SVG files only."));
};

const upload = multer({
  storage,          // ← Cloudinary storage instead of diskStorage
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;