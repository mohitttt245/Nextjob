import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  getResumeTemplates,
  createResumeTemplate,
  updateResumeTemplate,
  deleteResumeTemplate
} from "../controllers/resumeTemplateController.js";

const router = express.Router();

router
  .route("/")
  .get(getResumeTemplates)
  .post(protectAdmin, upload.single("templateFile"), createResumeTemplate);

router
  .route("/:id")
  .put(protectAdmin, upload.single("templateFile"), updateResumeTemplate)
  .delete(protectAdmin, deleteResumeTemplate);

export default router;
