import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { uploadsRootDir } from "./config/paths.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import jobRoutes from "./routes/jobRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import resumeTemplateRoutes from "./routes/resumeTemplateRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import downloadRoute from "./routes/downloadRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: false
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsRootDir));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/resume-templates", resumeTemplateRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api", downloadRoute);        // ← moved here, after app is initialized

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
};

startServer();