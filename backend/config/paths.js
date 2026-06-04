import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsRootDir = path.resolve(
  process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads")
);

const templateUploadsDir = path.join(uploadsRootDir, "templates");

export { uploadsRootDir, templateUploadsDir };
