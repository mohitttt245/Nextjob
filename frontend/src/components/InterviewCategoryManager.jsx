import { Pencil, Trash2 } from "lucide-react";
import AdminSectionPanel from "./AdminSectionPanel";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

const InterviewCategoryManager = ({
  categories,
  form,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  busy
}) => (
  <AdminSectionPanel
    title="AI Interview Categories"
    description="Control the interview categories and prompts used by the AI interview preparation flow."
  >
    <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <InputField
          label="Category Name"
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Software Engineering"
          required
        />
        <TextAreaField
          label="Description"
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Short summary of what this category covers."
        />
        <TextAreaField
          label="HR Prompt"
          value={form.hrPrompt}
          onChange={(event) => onChange("hrPrompt", event.target.value)}
          placeholder="What the AI should emphasize in HR questions."
        />
        <TextAreaField
          label="Technical Focus"
          value={form.technicalFocus}
          onChange={(event) => onChange("technicalFocus", event.target.value)}
          placeholder="Technical topics or tools to include."
        />
        <TextAreaField
          label="Aptitude Focus"
          value={form.aptitudeFocus}
          onChange={(event) => onChange("aptitudeFocus", event.target.value)}
          placeholder="Logical, numerical, or case-based angles to cover."
        />
        <InputField
          label="Sample Roles"
          value={form.sampleRoles}
          onChange={(event) => onChange("sampleRoles", event.target.value)}
          placeholder="Frontend Developer, Backend Developer"
        />
        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => onChange("isActive", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-tide focus:ring-tide"
          />
          Active category
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Saving..." : form.id ? "Update Category" : "Create Category"}
          </button>
          {form.id ? (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        {categories.map((category) => (
          <article key={category._id} className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
                    {category.name}
                  </h4>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      category.isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {category.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(category)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(category._id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.sampleRoles?.map((role) => (
                <span key={role} className="tag-pill">
                  {role}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </AdminSectionPanel>
);

export default InterviewCategoryManager;
