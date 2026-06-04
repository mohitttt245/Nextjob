import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    skills: [{ type: String, required: true, trim: true }],
    lastDate: { type: Date, required: true },
    applyUrl: { type: String, required: true, trim: true },
    employmentType: { type: String, default: "Full-time", trim: true },
    experienceLevel: { type: String, default: "Mid-level", trim: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
