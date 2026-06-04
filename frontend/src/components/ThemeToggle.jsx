import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-lg shadow-slate-900/5 hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
      aria-label="Toggle color mode"
    >
      {theme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  );
};

export default ThemeToggle;
