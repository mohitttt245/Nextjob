import { Download, Eye, Pencil, Trash2, Upload } from "lucide-react";
import AdminSectionPanel from "./AdminSectionPanel";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

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

const ResumeTemplateManager = ({
  templates,
  form,
  onChange,
  onFileChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  onPreview,
  busy
}) => (
  <AdminSectionPanel
    title="Resume Templates"
    description="Upload downloadable resume templates that users can preview and save."
  >
    <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <InputField
          label="Template Title"
          value={form.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="ATS Modern"
          required
        />
        <InputField
          label="Category"
          value={form.category}
          onChange={(event) => onChange("category", event.target.value)}
          placeholder="Software / General / Freshers"
        />
        <TextAreaField
          label="Description"
          rows={4}
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="What kind of candidate should use this template?"
        />

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Template File
          </span>
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-950/40">
            <input
              type="file"
              onChange={onFileChange}
              className="field cursor-pointer border-none bg-transparent px-0 py-0 shadow-none"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Upload PDF, DOC, DOCX, PNG, JPG, or SVG files. Existing file stays unless you replace it.
            </p>
          </div>
        </label>

        <InputField
          label="Or paste Cloudinary URL"
          value={form.fileUrl || ""}
          onChange={(event) => onChange("fileUrl", event.target.value)}
          placeholder="https://res.cloudinary.com/your-cloud/raw/upload/..."
        />

        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => onChange("isFeatured", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-tide focus:ring-tide"
          />
          Feature this template
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
            <Upload size={16} />
            {busy ? "Saving..." : form.id ? "Update Template" : "Upload Template"}
          </button>
          {form.id ? (
            <button type="button" className="btn-secondary w-full sm:w-auto" onClick={onCancel}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        {templates.length ? (
          templates.map((template) => {
            const fileUrl = template.fileUrl;

            return (
              <article
                key={template._id}
                className="rounded-[24px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="text-lg font-semibold text-slate-950 dark:text-white">{template.title}</h4>
                    <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">
                      {template.category}
                    </p>
                  </div>
                  <div className="flex self-start gap-2">
                    <button
                      type="button"
                      onClick={() => onPreview(template)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(template)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(template._id)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="mt-3 break-words text-sm text-slate-600 dark:text-slate-300">{template.description}</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full sm:w-auto">
                    <Eye size={16} /> Preview
                  </a>
                  <button
                    type="button"
                    className="btn-primary w-full sm:w-auto"
                    onClick={() => handleDownload(fileUrl, template.title)}
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No templates uploaded yet.
          </div>
        )}
      </div>
    </div>
  </AdminSectionPanel>
);

export default ResumeTemplateManager;
