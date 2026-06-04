import express from "express";
import {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
} from "../controllers/internshipController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getInternships).post(protectAdmin, createInternship);
router
  .route("/:id")
  .get(getInternshipById)
  .put(protectAdmin, updateInternship)
  .delete(protectAdmin, deleteInternship);

export default router;
