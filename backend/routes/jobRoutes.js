import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getJobs).post(protectAdmin, createJob);
router.route("/:id").get(getJobById).put(protectAdmin, updateJob).delete(protectAdmin, deleteJob);

export default router;
