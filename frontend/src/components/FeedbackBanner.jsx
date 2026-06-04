const toneClasses = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  error:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200",
  info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200"
};

const FeedbackBanner = ({ type = "info", message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${toneClasses[type]}`}>
      {message}
    </div>
  );
};

export default FeedbackBanner;
