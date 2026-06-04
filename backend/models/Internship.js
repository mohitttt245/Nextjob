import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    skills: [{ type: String, required: true, trim: true }],
    lastDate: { type: Date, required: true },
    applyUrl: { type: String, required: true, trim: true },
    employmentType: { type: String, default: "Internship", trim: true },
    experienceLevel: { type: String, default: "Entry-level", trim: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);

export default Internship;
