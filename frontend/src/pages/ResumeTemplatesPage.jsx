import { Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import PageLoader from "../components/PageLoader";
import PreviewModal from "../components/PreviewModal";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { listResumeTemplates } from "../services/resumeTemplatesService";

const getPdfThumbnail = (fileUrl) => {
  if (!fileUrl?.includes("cloudinary.com")) return null;
  return fileUrl
    .replace("/raw/upload/", "/image/upload/f_jpg,pg_1/")
    .replace(/\.pdf$/i, ".jpg");
};

const handleDownload = async (fileUrl, title) => {
  try {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const params = new URLSearchParams({
      url: fileUrl,
      filename: `${title}.pdf`
    });
    const downloadUrl = `${apiBase}/download?${params.toString()}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.open(fileUrl, "_blank");
  }
};

const ResumeTemplatesPage = () => {
  useDocumentTitle("Resume Templates");

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewItem, setPreviewItem] = useState(null);
  const [failedThumbnails, setFailedThumbnails] = useState(new Set());

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        setError("");
        setTemplates(await listResumeTemplates());
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load resume templates.");
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleThumbnailError = (id) => {
    setFailedThumbnails((prev) => new Set([...prev, id]));
  };

  return (
    <div className="page-wrap space-y-8">
      <SectionHeader
        eyebrow="Resume Templates"
        title="Preview and download curated resume layouts"
        description="The admin uploads templates here so public users can compare styles before customizing their own resume."
      />

      <FeedbackBanner type="error" message={error} />

      {loading ? (
        <PageLoader count={4} />
      ) : templates.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => {
            const fileUrl = template.fileUrl;
            const isPdf = template.fileType?.includes("pdf");
            const isImage = template.fileType?.startsWith("image/");
            const thumbnailUrl = isPdf ? getPdfThumbnail(fileUrl) : null;
            const showFallback = failedThumbnails.has(template._id);

            return (
              <article key={template._id} className="glass-panel flex flex-col p-6">
                <div className="rounded-[24px] border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={template.title}
                      className="h-56 w-full rounded-[18px] object-cover object-top"
                    />
                  ) : isPdf && thumbnailUrl && !showFallback ? (
                    <img
                      src={thumbnailUrl}
                      alt={template.title}
                      className="h-56 w-full rounded-[18px] object-cover object-top"
                      onError={() => handleThumbnailError(template._id)}
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center rounded-[18px] bg-white text-center text-sm font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                      Preview available in modal
                    </div>
                  )}
                </div>

                <div className="mt-5 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                        {template.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {template.category}
                      </p>
                    </div>
                    {template.isFeatured ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                    {template.description}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={() => setPreviewItem(template)}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    type="button"
                    className="btn-primary flex-1"
                    onClick={() => handleDownload(fileUrl, template.title)}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No templates uploaded yet"
          description="The admin can upload resume template files from the dashboard, and they will appear here for preview and download."
        />
      )}

      <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
};

export default ResumeTemplatesPage;