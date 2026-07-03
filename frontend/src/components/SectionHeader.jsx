const SectionHeader = ({ eyebrow, title, description, align = "left" }) => (
  <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
    <h2 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl lg:text-4xl xl:text-5xl">
      {title}
    </h2>
    {description ? (
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base lg:text-lg">
        {description}
      </p>
    ) : null}
  </div>
);

export default SectionHeader;
