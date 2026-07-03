const AdminSectionPanel = ({ title, description, children }) => (
  <section className="glass-panel-strong p-5 sm:p-6 lg:p-8">
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
    {children}
  </section>
);

export default AdminSectionPanel;
