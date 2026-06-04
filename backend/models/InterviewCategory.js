import mongoose from "mongoose";

const interviewCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "", trim: true },
    hrPrompt: { type: String, default: "", trim: true },
    technicalFocus: { type: String, default: "", trim: true },
    aptitudeFocus: { type: String, default: "", trim: true },
    sampleRoles: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const InterviewCategory = mongoose.model("InterviewCategory", interviewCategorySchema);

export default InterviewCategory;
