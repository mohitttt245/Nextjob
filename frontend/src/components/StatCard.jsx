const StatCard = ({ value, label, accent }) => (
  <div className="glass-panel animate-fade-up p-5">
    <p className={`text-3xl font-semibold ${accent}`}>{value}</p>
    <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
  </div>
);

export default StatCard;
