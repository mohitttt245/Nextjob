const DashboardTabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex flex-wrap gap-3">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        onClick={() => onChange(tab.value)}
        className={`rounded-full px-4 py-2 text-sm font-semibold ${
          activeTab === tab.value
            ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
            : "border border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default DashboardTabs;
