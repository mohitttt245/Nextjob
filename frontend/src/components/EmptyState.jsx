const EmptyState = ({ title, description }) => (
  <div className="glass-panel px-6 py-16 text-center">
    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
    <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
  </div>
);

export default EmptyState;
