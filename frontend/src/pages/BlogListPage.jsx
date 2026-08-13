import { ArrowRight, ChevronLeft, ChevronRight, Eye, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import PageLoader from "../components/PageLoader";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { listPublishedBlogs } from "../services/blogsService";
import { formatDate } from "../utils/formatters";

const categories = ["All", "Interview Tips", "Resume", "Career Advice", "Internships"];
const defaultPagination = { page: 1, limit: 6, total: 0, pages: 1 };

const BlogListPage = () => {
  useDocumentTitle("Blog");

  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeCategory = searchParams.get("category") || "All";
  const currentPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await listPublishedBlogs({
          page: currentPage,
          limit: 6,
          category: activeCategory === "All" ? "" : activeCategory
        });

        setBlogs(response.blogs || []);
        setPagination(response.pagination || defaultPagination);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load blog posts right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [activeCategory, currentPage]);

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams);

    if (category === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", category);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1);

  return (
    <div className="page-wrap space-y-8 sm:space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <SectionHeader
          eyebrow="Blog"
          title="Interview tips, resume guidance, and career advice in the same NextJob visual language"
          description="Browse published articles by category, stay inside the current theme, and jump into practical content that supports applications, interviews, and internships."
        />

        <div className="glass-panel-strong p-5 sm:p-7">
          <div className="rounded-[26px] bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-teal-200">Knowledge Hub</p>
                <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">Fresh guidance for every stage</h3>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <Newspaper className="text-teal-200" size={28} />
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-3xl font-semibold">{pagination.total}</p>
                <p className="mt-2 text-sm text-slate-200">Published articles</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-3xl font-semibold">{activeCategory}</p>
                <p className="mt-2 text-sm text-slate-200">Active category filter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold ${
                isActive
                  ? "bg-tide text-white shadow-lg shadow-tide/25"
                  : "border border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <FeedbackBanner type="error" message={error} />

      {loading ? (
        <PageLoader count={6} />
      ) : blogs.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog._id} className="glass-panel overflow-hidden">
              {blog.coverImage ? (
                <div className="aspect-[16/10] overflow-hidden bg-slate-950">
                  <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-end bg-slate-950 p-6 text-white">
                  <div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-200">
                      {blog.category}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold">{blog.title}</h3>
                  </div>
                </div>
              )}

              <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  <span className="section-kicker">{blog.category}</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">
                  {blog.title}
                </h3>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{blog.excerpt}</p>

                {blog.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {blog.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Eye size={16} />
                    {blog.views} views
                  </span>
                  <Link to={`/blog/${blog.slug}`} className="btn-primary w-full sm:w-auto">
                    Read Article <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No blog posts found for this filter"
          description="Try another category or check back after the admin publishes more articles."
        />
      )}

      {!loading && blogs.length ? (
        <div className="glass-panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Page {pagination.page} of {pagination.pages}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold ${
                  pageNumber === currentPage
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.pages}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BlogListPage;
