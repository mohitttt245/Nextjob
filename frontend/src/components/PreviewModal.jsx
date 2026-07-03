import { ExternalLink, X } from "lucide-react";

const PreviewModal = ({ item, onClose }) => {
  if (!item) {
    return null;
  }

  const fileUrl = item.fileUrl;
  const isPdf = item.fileType?.includes("pdf");
  const isImage = item.fileType?.startsWith("image/");

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 p-3 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex h-full w-full max-w-5xl items-end sm:items-center">
        <div className="glass-panel-strong relative flex max-h-[92vh] w-full flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-4 py-4 dark:border-slate-800 sm:px-6">
            <div className="min-w-0">
              <h3 className="break-words text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto px-4 pb-4 pt-4 sm:px-6">
            <div className="h-[48vh] min-h-[18rem] overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 sm:h-[68vh]">
              {isPdf ? <iframe title={item.title} src={fileUrl} className="h-full w-full" /> : null}
              {isImage ? (
                <img src={fileUrl} alt={item.title} className="h-full w-full object-contain" />
              ) : null}
              {!isPdf && !isImage ? (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  This file type does not support inline preview in every browser. Use the open button to
                  inspect or download it directly.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200/70 px-4 py-4 dark:border-slate-800 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
            <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-primary w-full sm:w-auto">
              Open File <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
