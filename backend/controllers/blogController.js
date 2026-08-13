import slugify from "slugify";
import asyncHandler from "../middleware/asyncHandler.js";
import Blog from "../models/Blog.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 24;
const blogCategories = ["Interview Tips", "Resume", "Career Advice", "Internships"];
const blogStatuses = ["draft", "published"];

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const parseTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildSlugBase = (title) =>
  slugify(normalizeString(title) || "blog-post", {
    lower: true,
    strict: true,
    trim: true
  }) || "blog-post";

const buildUniqueSlug = async (title, excludeId = "") => {
  const baseSlug = buildSlugBase(title);
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await Blog.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const getPublishedBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(DEFAULT_PAGE, Number.parseInt(req.query.page || DEFAULT_PAGE, 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(req.query.limit || DEFAULT_LIMIT, 10) || DEFAULT_LIMIT)
  );
  const category = normalizeString(req.query.category);
  const query = {
    status: "published",
    ...(category ? { category } : {})
  };

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Blog.countDocuments(query)
  ]);

  res.json({
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit))
    }
  });
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found.");
  }

  res.json(blog);
});

const getAllBlogsAdmin = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find().sort({ updatedAt: -1, createdAt: -1 });
  res.json(blogs);
});

const getBlogByIdAdmin = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found.");
  }

  res.json(blog);
});

const createBlog = asyncHandler(async (req, res) => {
  const title = normalizeString(req.body.title);
  const category = normalizeString(req.body.category) || "Career Advice";
  const status = req.body.status === "published" ? "published" : "draft";

  if (!title) {
    res.status(400);
    throw new Error("Title is required.");
  }

  if (!blogCategories.includes(category)) {
    res.status(400);
    throw new Error("Invalid blog category.");
  }

  const blog = await Blog.create({
    title,
    slug: await buildUniqueSlug(title),
    excerpt: normalizeString(req.body.excerpt),
    content: req.body.content || "",
    coverImage: normalizeString(req.body.coverImage),
    category,
    tags: parseTags(req.body.tags),
    status,
    metaTitle: normalizeString(req.body.metaTitle),
    metaDescription: normalizeString(req.body.metaDescription)
  });

  res.status(201).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found.");
  }

  if (typeof req.body.title !== "undefined") {
    const nextTitle = normalizeString(req.body.title);

    if (!nextTitle) {
      res.status(400);
      throw new Error("Title is required.");
    }

    if (nextTitle !== blog.title) {
      blog.slug = await buildUniqueSlug(nextTitle, blog._id);
    }

    blog.title = nextTitle;
  }

  if (typeof req.body.excerpt !== "undefined") {
    blog.excerpt = normalizeString(req.body.excerpt);
  }

  if (typeof req.body.content !== "undefined") {
    blog.content = req.body.content || "";
  }

  if (typeof req.body.coverImage !== "undefined") {
    blog.coverImage = normalizeString(req.body.coverImage);
  }

  if (typeof req.body.category !== "undefined") {
    const nextCategory = normalizeString(req.body.category);

    if (!blogCategories.includes(nextCategory)) {
      res.status(400);
      throw new Error("Invalid blog category.");
    }

    blog.category = nextCategory;
  }

  if (typeof req.body.tags !== "undefined") {
    blog.tags = parseTags(req.body.tags);
  }

  if (typeof req.body.status !== "undefined") {
    const nextStatus = normalizeString(req.body.status);

    if (!blogStatuses.includes(nextStatus)) {
      res.status(400);
      throw new Error("Invalid blog status.");
    }

    blog.status = nextStatus;
  }

  if (typeof req.body.metaTitle !== "undefined") {
    blog.metaTitle = normalizeString(req.body.metaTitle);
  }

  if (typeof req.body.metaDescription !== "undefined") {
    blog.metaDescription = normalizeString(req.body.metaDescription);
  }

  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found.");
  }

  await blog.deleteOne();
  res.json({ message: "Blog post deleted successfully." });
});

export {
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  createBlog,
  updateBlog,
  deleteBlog
};
