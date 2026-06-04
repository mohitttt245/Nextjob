const TextAreaField = ({ label, rows = 4, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
    </span>
    <textarea {...props} rows={rows} className={`field resize-y ${props.className || ""}`} />
  </label>
);

export default TextAreaField;
