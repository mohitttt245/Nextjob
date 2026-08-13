import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["Interview Tips", "Resume", "Career Advice", "Internships"],
      default: "Career Advice",
      trim: true
    },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
