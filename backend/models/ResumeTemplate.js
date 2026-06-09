import mongoose from "mongoose";

const resumeTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    description: { type: String, default: "", trim: true },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, trim: true },
    size: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    publicId: { type: String },        // Cloudinary public ID
    resourceType: { type: String },    // "image" or "raw"
  },
  { timestamps: true }
);

const ResumeTemplate = mongoose.model("ResumeTemplate", resumeTemplateSchema);

export default ResumeTemplate;
