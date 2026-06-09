import asyncHandler from "../middleware/asyncHandler.js";
import { cloudinary } from "../config/cloudinary.js";
import { parseBoolean } from "./opportunityUtils.js";
import ResumeTemplate from "../models/ResumeTemplate.js";

const removeFileFromCloudinary = async (publicId, resourceType) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

const getResumeTemplates = asyncHandler(async (_req, res) => {
  const templates = await ResumeTemplate.find().sort({ isFeatured: -1, createdAt: -1 });
  res.json(templates);
});

const createResumeTemplate = asyncHandler(async (req, res) => {
  const manualUrl = req.body.fileUrl?.trim();

  if (!manualUrl && !req.file) {
    res.status(400);
    throw new Error("Provide either a Cloudinary URL or upload a file.");
  }

  const isUpload = !manualUrl && req.file;

  const template = await ResumeTemplate.create({
    title: req.body.title?.trim() || req.file?.originalname || "Untitled",
    category: req.body.category?.trim() || "General",
    description: req.body.description?.trim() || "",
    fileName: isUpload ? req.file.originalname : manualUrl,
    fileUrl: isUpload ? req.file.path : manualUrl,
    publicId: isUpload ? req.file.filename : null,
    resourceType: isUpload ? "raw" : null,
    fileType: isUpload ? req.file.mimetype : "application/pdf",
    size: isUpload ? req.file.size : null,
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

  const manualUrl = req.body.fileUrl?.trim();

  if (req.file) {
    if (template.publicId) {
      await removeFileFromCloudinary(template.publicId, template.resourceType);
    }
    template.fileName = req.file.originalname;
    template.fileUrl = req.file.path;
    template.publicId = req.file.filename;
    template.resourceType = "raw";
    template.fileType = req.file.mimetype;
    template.size = req.file.size;

  } else if (manualUrl && manualUrl !== template.fileUrl) {
    if (template.publicId) {
      await removeFileFromCloudinary(template.publicId, template.resourceType);
    }
    template.fileName = manualUrl;
    template.fileUrl = manualUrl;
    template.publicId = null;
    template.resourceType = null;
    template.fileType = "application/pdf";
    template.size = null;
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

  await removeFileFromCloudinary(template.publicId, template.resourceType);
  await template.deleteOne();

  res.json({ message: "Resume template deleted successfully." });
});

export {
  getResumeTemplates,
  createResumeTemplate,
  updateResumeTemplate,
  deleteResumeTemplate
};