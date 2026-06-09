import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // PDFs, DOC, DOCX must use resource_type: "raw"
    // Images (PNG, JPG, SVG) use resource_type: "image"
    const isImage = ["image/png", "image/jpeg", "image/svg+xml"].includes(file.mimetype);

    return {
      folder: "resume-templates",
      resource_type: isImage ? "image" : "raw",
      allowed_formats: ["pdf", "doc", "docx", "png", "jpg", "svg"],
    };
  },
});

export { cloudinary, storage };