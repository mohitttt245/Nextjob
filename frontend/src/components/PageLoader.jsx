const PageLoader = ({ count = 3 }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="glass-panel overflow-hidden p-6">
        <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-8 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 space-y-3">
          <div className="h-3 rounded-full bg-[length:200%_100%] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
          <div className="h-3 rounded-full bg-[length:200%_100%] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
          <div className="h-3 w-5/6 rounded-full bg-[length:200%_100%] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
        </div>
      </div>
    ))}
  </div>
);

export default PageLoader;
