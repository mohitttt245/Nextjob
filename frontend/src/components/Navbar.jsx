import { LogOut, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import brandMark from "../assets/brand-mark.svg";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const baseNavigation = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "Internships", to: "/internships" },
  { label: "AI Prepration", to: "/ai-interview" },
  { label: "Templates", to: "/resume-templates" },
  { label: "Resume Builder", to: "/resume-builder" }
  
];

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold ${
    isActive
      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-950"
      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { admin, isAuthenticated, logout } = useAuth();
  const navigation = [
    ...baseNavigation,
    {
      label: isAuthenticated ? "Admin" : "Admin Login",
      to: isAuthenticated ? "/admin" : "/admin/login"
    }
  ];

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel-strong flex items-center justify-between gap-4 px-5 py-4">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={brandMark} alt="NextJob" className="h-11 w-11 rounded-2xl" />
            <div>
              <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                NextJob
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Career Portal
              </p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 lg:inline-flex">
                <Shield size={16} />
                {admin?.name || "Admin"}
              </div>
            ) : null}
            <ThemeToggle />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 lg:inline-flex"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : null}
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="glass-panel mt-3 flex flex-col gap-2 p-3 lg:hidden">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
