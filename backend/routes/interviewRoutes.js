// import express from "express";
// import {
//   getInterviewCategories,
//   createInterviewCategory,
//   updateInterviewCategory,
//   deleteInterviewCategory,
//   generateInterviewQuestions
// } from "../controllers/interviewController.js";
// import { protectAdmin } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/categories", getInterviewCategories);
// router.post("/categories", protectAdmin, createInterviewCategory);
// router.put("/categories/:id", protectAdmin, updateInterviewCategory);
// router.delete("/categories/:id", protectAdmin, deleteInterviewCategory);
// router.post("/generate", generateInterviewQuestions);

// export default router;


import express from "express";
import {
  getInterviewCategories,
  createInterviewCategory,
  updateInterviewCategory,
  deleteInterviewCategory,
  generateInterviewQuestions,
  chatWithInterviewAI
} from "../controllers/interviewController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories", getInterviewCategories);
router.post("/categories", protectAdmin, createInterviewCategory);
router.put("/categories/:id", protectAdmin, updateInterviewCategory);
router.delete("/categories/:id", protectAdmin, deleteInterviewCategory);
router.post("/generate", generateInterviewQuestions);
router.post("/chat", chatWithInterviewAI);

export default router;