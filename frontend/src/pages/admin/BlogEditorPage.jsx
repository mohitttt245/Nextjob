import "react-quill/dist/quill.snow.css";

import { ChevronDown, ChevronUp, Save } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Link, useNavigate, useParams } from "react-router-dom";
import FeedbackBanner from "../../components/FeedbackBanner";
import InputField from "../../components/InputField";
import SectionHeader from "../../components/SectionHeader";
import TextAreaField from "../../components/TextAreaField";
import { useAuth } from "../../context/AuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { createBlog, getBlogByIdAdmin, updateBlog } from "../../services/blogsService";
import { parseCommaSeparated, toCommaSeparated } from "../../utils/formatters";

const blogCategories = ["Interview Tips", "Resume", "Career Advice", "Internships"];

const blankForm = {
  title: "",
  excerpt: "",
  coverImage: "",
  category: "Career Advice",
  tags: "",
  content: "",
  metaTitle: "",
  metaDescription: ""
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"]
  ]
};

const editorStyles = `
  .blog-editor .ql-toolbar {
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-bottom: none;
    border-radius: 1rem 1rem 0 0;
    background: rgba(255, 255, 255, 0.9);
  }

  .dark .blog-editor .ql-toolbar {
    border-color: rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.82);
  }

  .blog-editor .ql-container {
    min-height: 18rem;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 0 0 1rem 1rem;
    background: rgba(255, 255, 255, 0.92);
    font-family: "Manrope", ui-sans-serif, system-ui, sans-serif;
    font-size: 0.95rem;
  }

  .dark .blog-editor .ql-container {
    border-color: rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.82);
    color: #e2e8f0;
  }

  .blog-editor .ql-editor {
    min-height: 18rem;
  }

  .dark .blog-editor .ql-stroke {
    stroke: #e2e8f0;
  }

  .dark .blog-editor .ql-fill {
    fill: #e2e8f0;
  }

  .dark .blog-editor .ql-picker {
    color: #e2e8f0;
  }
`;

const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isEditMode = Boolean(id);

  useDocumentTitle(isEditMode ? "Edit Blog" : "New Blog");

  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState("");
  const [notice, setNotice] = useState({ type: "info", message: "" });
  const [showSeo, setShowSeo] = useState(Boolean(id));

  const handleAdminRequestError = (requestError, fallbackMessage) => {
    if (requestError.response?.status === 401) {
      logout();
      setNotice({ type: "error", message: "Your admin session expired. Please sign in again." });
      return;
    }

    setNotice({
      type: "error",
      message: requestError.response?.data?.message || fallbackMessage
    });
  };

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadBlog = async () => {
      try {
        setLoading(true);
        setNotice({ type: "info", message: "" });

        const blog = await getBlogByIdAdmin(id);
        setForm({
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          coverImage: blog.coverImage || "",
          category: blog.category || "Career Advice",
          tags: toCommaSeparated(blog.tags),
          content: blog.content || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || ""
        });
      } catch (requestError) {
        handleAdminRequestError(requestError, "Unable to load this blog post.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, isEditMode]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (status) => {
    if (!form.title.trim()) {
      setNotice({ type: "error", message: "Title is required." });
      return;
    }

    try {
      setSubmitting(status);
      setNotice({ type: "info", message: "" });

      const payload = {
        ...form,
        tags: parseCommaSeparated(form.tags),
        status
      };

      if (isEditMode) {
        await updateBlog(id, payload);
      } else {
        await createBlog(payload);
      }

      navigate("/admin/blogs", {
        replace: true,
        state: {
          notice: {
            type: "success",
            message: status === "published" ? "Blog post published successfully." : "Draft saved successfully."
          }
        }
      });
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to save this blog post.");
    } finally {
      setSubmitting("");
    }
  };

  return (
    <div className="page-wrap space-y-6 sm:space-y-8">
      <style>{editorStyles}</style>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Admin Editor"
          title={isEditMode ? "Update your blog post" : "Create a new blog post"}
          description="The slug is generated automatically from the title, drafts stay private, and publishing uses the same admin authentication flow already active in NextJob."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/admin/blogs" className="btn-secondary w-full sm:w-auto">
            Back to Blogs
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={Boolean(submitting)}
            className="btn-secondary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {submitting === "draft" ? "Saving Draft..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={Boolean(submitting)}
            className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {submitting === "published" ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <FeedbackBanner type={notice.type} message={notice.message} />

      {loading ? (
        <div className="glass-panel-strong p-8 text-sm text-slate-500 dark:text-slate-400">
          Loading blog editor...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel-strong space-y-5 p-5 sm:p-6 lg:p-8">
            <InputField
              label="Title"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Write a clear article title"
              required
            />

            <TextAreaField
              label="Excerpt"
              value={form.excerpt}
              onChange={(event) => handleChange("excerpt", event.target.value)}
              placeholder="Add a short summary for blog cards and previews"
              rows={4}
            />

            <InputField
              label="Cover Image URL"
              value={form.coverImage}
              onChange={(event) => handleChange("coverImage", event.target.value)}
              placeholder="https://example.com/cover-image.jpg"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                  className="field"
                >
                  {blogCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <InputField
                label="Tags"
                value={form.tags}
                onChange={(event) => handleChange("tags", event.target.value)}
                placeholder="react, interview prep, resume tips"
              />
            </div>

            <div className="blog-editor">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Content
              </span>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => handleChange("content", value)}
                modules={quillModules}
                placeholder="Write the full article content in HTML-rich format."
              />
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setShowSeo((current) => !current)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">SEO Settings</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Optional meta title and description for the public blog post page.
                  </p>
                </div>
                {showSeo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showSeo ? (
                <div className="mt-4 grid gap-4">
                  <InputField
                    label="Meta Title"
                    value={form.metaTitle}
                    onChange={(event) => handleChange("metaTitle", event.target.value)}
                    placeholder="Optional SEO title"
                  />
                  <TextAreaField
                    label="Meta Description"
                    value={form.metaDescription}
                    onChange={(event) => handleChange("metaDescription", event.target.value)}
                    placeholder="Optional SEO description"
                    rows={4}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="glass-panel p-5 sm:p-6">
              <p className="section-kicker">Publishing Notes</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
                Keep the current admin workflow intact
              </h3>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Save unfinished work as drafts, publish only when ready, and let the backend handle slug
                generation from the title.
              </p>
            </div>

            {form.coverImage ? (
              <div className="glass-panel overflow-hidden">
                <img src={form.coverImage} alt="Blog cover preview" className="h-64 w-full object-cover" />
                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Cover image preview
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    This is how the article lead image will appear on the public post page.
                  </p>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      )}
    </div>
  );
};

export default BlogEditorPage;
