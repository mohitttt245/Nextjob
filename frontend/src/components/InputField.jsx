const InputField = ({ label, className = "", ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
    </span>
    <input {...props} className={`field ${className}`} />
  </label>
);

export default InputField;
