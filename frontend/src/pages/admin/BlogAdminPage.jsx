import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import FeedbackBanner from "../../components/FeedbackBanner";
import SectionHeader from "../../components/SectionHeader";
import { useAuth } from "../../context/AuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { deleteBlog, listBlogsAdmin, updateBlog } from "../../services/blogsService";
import { formatDate } from "../../utils/formatters";

const BlogAdminPage = () => {
  useDocumentTitle("Manage Blogs");

  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState({ type: "info", message: "" });

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

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setNotice({ type: "info", message: "" });
      setBlogs(await listBlogsAdmin());
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    if (!location.state?.notice) {
      return;
    }

    setNotice(location.state.notice);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) {
      return;
    }

    try {
      setBusy(id);
      await deleteBlog(id);
      await loadBlogs();
      setNotice({ type: "success", message: "Blog post deleted successfully." });
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to delete this blog post.");
    } finally {
      setBusy("");
    }
  };

  const handleStatusToggle = async (blog) => {
    const nextStatus = blog.status === "published" ? "draft" : "published";

    try {
      setBusy(blog._id);
      await updateBlog(blog._id, { status: nextStatus });
      await loadBlogs();
      setNotice({
        type: "success",
        message: `"${blog.title}" moved to ${nextStatus}.`
      });
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to update the blog status.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="page-wrap space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Admin Blogs"
          title="Manage published posts and private drafts from a dedicated blog workspace"
          description="Create long-form content, keep drafts private, and toggle article visibility without disturbing the existing jobs or internships dashboard."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/admin" className="btn-secondary w-full sm:w-auto">
            Back to Dashboard
          </Link>
          <Link to="/admin/blogs/new" className="btn-primary w-full sm:w-auto">
            <Plus size={16} />
            New Post
          </Link>
        </div>
      </div>

      <FeedbackBanner type={notice.type} message={notice.message} />

      {loading ? (
        <div className="glass-panel-strong p-8 text-sm text-slate-500 dark:text-slate-400">
          Loading blog posts...
        </div>
      ) : blogs.length ? (
        <div className="glass-panel-strong overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50/70 dark:bg-slate-900/60">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Views</th>
                  <th className="px-5 py-4">Updated</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="align-top">
                    <td className="px-5 py-4">
                      <div className="min-w-[16rem]">
                        <p className="font-semibold text-slate-950 dark:text-white">{blog.title}</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{blog.slug}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{blog.category}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          blog.status === "published"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">{blog.views}</td>
                    <td className="px-5 py-4">{formatDate(blog.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-[16rem] flex-wrap gap-2">
                        <Link to={`/admin/blogs/edit/${blog._id}`} className="btn-secondary">
                          <SquarePen size={16} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(blog)}
                          disabled={busy === blog._id}
                          className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold ${
                            blog.status === "published"
                              ? "border border-slate-300 bg-white/85 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                              : "bg-tide text-white shadow-lg shadow-tide/25 hover:bg-teal-600"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {blog.status === "published" ? "Move to Draft" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog._id)}
                          disabled={busy === blog._id}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:border-rose-300 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No blog posts yet"
          description="Create your first draft to start the new blog section without changing the rest of the site."
        />
      )}
    </div>
  );
};

export default BlogAdminPage;
