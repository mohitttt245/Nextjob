import { ExternalLink, X } from "lucide-react";

const PreviewModal = ({ item, onClose, assetBaseUrl }) => {
  if (!item) {
    return null;
  }

  const fileUrl = item.fileUrl?.startsWith("http")
    ? item.fileUrl
    : `${assetBaseUrl || ""}${item.fileUrl}`;
  const isPdf = item.fileType?.includes("pdf");
  const isImage = item.fileType?.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="glass-panel-strong relative w-full max-w-5xl overflow-hidden p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 h-[70vh] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
          {isPdf ? (
            <iframe title={item.title} src={fileUrl} className="h-full w-full" />
          ) : null}
          {isImage ? (
            <img src={fileUrl} alt={item.title} className="h-full w-full object-contain" />
          ) : null}
          {!isPdf && !isImage ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-slate-500 dark:text-slate-400">
              This file type does not support inline preview in every browser. Use the open button to
              inspect or download it directly.
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex justify-end">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Open File <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
