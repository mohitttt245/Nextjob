import fs from "fs/promises";
import path from "path";
import asyncHandler from "../middleware/asyncHandler.js";
import { templateUploadsDir } from "../config/paths.js";
import { parseBoolean } from "./opportunityUtils.js";
import ResumeTemplate from "../models/ResumeTemplate.js";

const removeFileIfExists = async (fileUrl) => {
  if (!fileUrl?.startsWith("/uploads/templates/")) {
    return;
  }

  const filePath = path.resolve(
    templateUploadsDir,
    fileUrl.replace("/uploads/templates/", "")
  );

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const getResumeTemplates = asyncHandler(async (_req, res) => {
  const templates = await ResumeTemplate.find().sort({ isFeatured: -1, createdAt: -1 });
  res.json(templates);
});

const createResumeTemplate = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Template file is required.");
  }

  const template = await ResumeTemplate.create({
    title: req.body.title?.trim() || req.file.originalname,
    category: req.body.category?.trim() || "General",
    description: req.body.description?.trim() || "",
    fileName: req.file.originalname,
    fileUrl: `/uploads/templates/${req.file.filename}`,
    fileType: req.file.mimetype,
    size: req.file.size,
    isFeatured: parseBoolean(req.body.isFeatured)
  });

  res.status(201).json(template);
});

const updateResumeTemplate = asyncHandler(async (req, res) => {
  const template = await ResumeTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Resume template not found.");
  }

  if (req.file) {
    await removeFileIfExists(template.fileUrl);
    template.fileName = req.file.originalname;
    template.fileUrl = `/uploads/templates/${req.file.filename}`;
    template.fileType = req.file.mimetype;
    template.size = req.file.size;
  }

  template.title = req.body.title?.trim() || template.title;
  template.category = req.body.category?.trim() || template.category;
  template.description = req.body.description?.trim() || template.description;

  if (typeof req.body.isFeatured !== "undefined") {
    template.isFeatured = parseBoolean(req.body.isFeatured);
  }

  const updatedTemplate = await template.save();
  res.json(updatedTemplate);
});

const deleteResumeTemplate = asyncHandler(async (req, res) => {
  const template = await ResumeTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Resume template not found.");
  }

  await removeFileIfExists(template.fileUrl);
  await template.deleteOne();

  res.json({ message: "Resume template deleted successfully." });
});

export {
  getResumeTemplates,
  createResumeTemplate,
  updateResumeTemplate,
  deleteResumeTemplate
};
