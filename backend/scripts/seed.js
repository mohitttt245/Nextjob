import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";
import Internship from "../models/Internship.js";
import ResumeTemplate from "../models/ResumeTemplate.js";
import InterviewCategory from "../models/InterviewCategory.js";
import {
  jobs,
  internships,
  interviewCategories,
  resumeTemplates
} from "../data/sampleData.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Job.deleteMany(),
      Internship.deleteMany(),
      ResumeTemplate.deleteMany(),
      InterviewCategory.deleteMany()
    ]);

    await Promise.all([
      Job.insertMany(jobs),
      Internship.insertMany(internships),
      ResumeTemplate.insertMany(resumeTemplates),
      InterviewCategory.insertMany(interviewCategories)
    ]);

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
