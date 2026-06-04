const AdminSectionPanel = ({ title, description, children }) => (
  <section className="glass-panel-strong p-6 sm:p-8">
    <div className="mb-6">
      <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
    </div>
    {children}
  </section>
);

export default AdminSectionPanel;
