const EmptyState = ({ title, description }) => (
  <div className="glass-panel px-5 py-12 text-center sm:px-6 sm:py-16">
    <h3 className="text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">{title}</h3>
    <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
      {description}
    </p>
  </div>
);

export default EmptyState;
