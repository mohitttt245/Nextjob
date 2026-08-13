import DOMPurify from "dompurify";
import { ArrowLeft, CalendarDays, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getBlogBySlug } from "../services/blogsService";
import { formatDate } from "../utils/formatters";

const BlogPostPage = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle(blog?.metaTitle || blog?.title || "Blog");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");
        setBlog(await getBlogBySlug(slug));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load this article.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  useEffect(() => {
    const metaDescriptionTag =
      document.querySelector('meta[name="description"]') || document.createElement("meta");
    const createdTag = !metaDescriptionTag.parentNode;
    const previousDescription = metaDescriptionTag.getAttribute("content") || "";

    if (createdTag) {
      metaDescriptionTag.setAttribute("name", "description");
      document.head.appendChild(metaDescriptionTag);
    }

    metaDescriptionTag.setAttribute(
      "content",
      blog?.metaDescription || blog?.excerpt || "Read the latest article on NextJob."
    );

    return () => {
      if (createdTag) {
        metaDescriptionTag.remove();
        return;
      }

      metaDescriptionTag.setAttribute("content", previousDescription);
    };
  }, [blog]);

  const sanitizedContent = DOMPurify.sanitize(blog?.content || "");

  return (
    <div className="page-wrap space-y-8 sm:space-y-10">
      <div>
        <Link to="/blog" className="btn-secondary w-full sm:w-auto">
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
      </div>

      {loading ? (
        <div className="glass-panel-strong p-8 text-sm text-slate-500 dark:text-slate-400">
          Loading article...
        </div>
      ) : error ? (
        <>
          <FeedbackBanner type="error" message={error} />
          <EmptyState
            title="This article is unavailable"
            description="It may still be a draft, the slug may have changed, or the post may have been removed."
          />
        </>
      ) : blog ? (
        <article className="space-y-8">
          <SectionHeader eyebrow={blog.category} title={blog.title} description={blog.excerpt} />

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              Published {formatDate(blog.createdAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye size={16} />
              {blog.views} views
            </span>
          </div>

          {blog.coverImage ? (
            <div className="glass-panel-strong overflow-hidden">
              <img src={blog.coverImage} alt={blog.title} className="max-h-[32rem] w-full object-cover" />
            </div>
          ) : null}

          <div className="glass-panel-strong p-5 sm:p-8">
            <div
              className="text-sm text-slate-700 dark:text-slate-200 sm:text-base [&_a]:text-tide [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-tide/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:rounded-[24px] [&_img]:shadow-ambient [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-slate-950 dark:[&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

          {blog.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      ) : null}
    </div>
  );
};

export default BlogPostPage;
