import { Pencil, Trash2 } from "lucide-react";
import AdminSectionPanel from "./AdminSectionPanel";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

const OpportunityAdminSection = ({
  title,
  description,
  items,
  form,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  busy
}) => (
  <AdminSectionPanel title={title} description={description}>
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Title"
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Frontend Engineer"
            required
          />
          <InputField
            label="Company"
            value={form.company}
            onChange={(event) => onChange("company", event.target.value)}
            placeholder="NovaStack Labs"
            required
          />
          <InputField
            label="Location"
            value={form.location}
            onChange={(event) => onChange("location", event.target.value)}
            placeholder="Remote / Bengaluru"
            required
          />
          <InputField
            label="Salary / Stipend"
            value={form.salary}
            onChange={(event) => onChange("salary", event.target.value)}
            placeholder="INR 12-18 LPA"
            required
          />
          <InputField
            label="Employment Type"
            value={form.employmentType}
            onChange={(event) => onChange("employmentType", event.target.value)}
            placeholder="Full-time"
          />
          <InputField
            label="Experience Level"
            value={form.experienceLevel}
            onChange={(event) => onChange("experienceLevel", event.target.value)}
            placeholder="Mid-level"
          />
          <InputField
            label="Apply URL"
            value={form.applyUrl}
            onChange={(event) => onChange("applyUrl", event.target.value)}
            placeholder="https://linkedin.com/jobs/..."
            required
          />
          <InputField
            label="Last Date"
            type="date"
            value={form.lastDate}
            onChange={(event) => onChange("lastDate", event.target.value)}
            required
          />
        </div>

        <TextAreaField
          label="Description"
          rows={4}
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Describe the role, impact, and expectations..."
          required
        />

        <TextAreaField
          label="Skills"
          rows={3}
          value={form.skills}
          onChange={(event) => onChange("skills", event.target.value)}
          placeholder="React, Tailwind CSS, Node.js"
          required
        />

        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => onChange("featured", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-tide focus:ring-tide"
          />
          Mark as featured
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Saving..." : form.id ? "Update Entry" : "Create Entry"}
          </button>
          {form.id ? (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <article key={item._id} className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {item.company} • {item.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item._id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.skills?.map((skill) => (
                <span key={skill} className="tag-pill">
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </AdminSectionPanel>
);

export default OpportunityAdminSection;
