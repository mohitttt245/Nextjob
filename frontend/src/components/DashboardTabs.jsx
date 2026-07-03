const DashboardTabs = ({ tabs, activeTab, onChange }) => (
  <div className="-mx-1 overflow-x-auto px-1 pb-1">
    <div className="flex w-max min-w-full gap-3 sm:flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`min-h-11 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === tab.value
              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
              : "border border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default DashboardTabs;
