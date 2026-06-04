import { Download, Eye, Pencil, Trash2, Upload } from "lucide-react";
import AdminSectionPanel from "./AdminSectionPanel";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

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
  assetBaseUrl,
  busy
}) => (
  <AdminSectionPanel
    title="Resume Templates"
    description="Upload downloadable resume templates that users can preview and save."
  >
    <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
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
            <input type="file" onChange={onFileChange} className="field cursor-pointer border-none bg-transparent px-0 py-0 shadow-none" />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Upload PDF, DOC, DOCX, PNG, JPG, or SVG files. Existing file stays unless you replace it.
            </p>
          </div>
        </label>
        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => onChange("isFeatured", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-tide focus:ring-tide"
          />
          Feature this template
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={busy}>
            <Upload size={16} />
            {busy ? "Saving..." : form.id ? "Update Template" : "Upload Template"}
          </button>
          {form.id ? (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        {templates.map((template) => {
          const fileUrl = template.fileUrl?.startsWith("http")
            ? template.fileUrl
            : `${assetBaseUrl || ""}${template.fileUrl}`;

          return (
            <article key={template._id} className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-950 dark:text-white">{template.title}</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{template.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onPreview(template)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(template)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(template._id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{template.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                  <Eye size={16} /> Preview
                </a>
                <a href={fileUrl} download className="btn-primary">
                  <Download size={16} /> Download
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </AdminSectionPanel>
);

export default ResumeTemplateManager;
