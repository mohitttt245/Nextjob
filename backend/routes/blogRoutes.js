import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  getBlogBySlug,
  getPublishedBlogs,
  updateBlog
} from "../controllers/blogController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPublishedBlogs).post(protectAdmin, createBlog);
router.get("/admin", protectAdmin, getAllBlogsAdmin);
router
  .route("/admin/:id")
  .get(protectAdmin, getBlogByIdAdmin)
  .put(protectAdmin, updateBlog)
  .delete(protectAdmin, deleteBlog);
router.get("/:slug", getBlogBySlug);

export default router;
