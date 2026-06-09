import { Github, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-slate-200/70 px-4 py-10 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Top row — brand + tagline */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-800 dark:text-white">
            NextJob Portal
          </p>
          <p className="mt-1">
            Helping candidates discover roles, build resumes, and prepare faster.
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3">
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:text-slate-400"
          >
            <Linkedin size={16} />
          </a>

          <a
            href="https://github.com/yourprofile"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-white dark:hover:text-white"
          >
            <Github size={16} />
          </a>

          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-pink-500 hover:text-pink-500 dark:border-slate-700 dark:text-slate-400"
          >
            <Instagram size={16} />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200/70 dark:border-slate-800" />

      {/* Bottom row — contact + copyright */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="mailto:your@email.com"
            className="inline-flex items-center gap-2 transition hover:text-slate-800 dark:hover:text-white"
          >
            <Mail size={14} />
            jobportal245@gmail.com
          </a>

          <a
            href="tel:+919999999999"
            className="inline-flex items-center gap-2 transition hover:text-slate-800 dark:hover:text-white"
          >
            <Phone size={14} />
            +91 99999 99999
          </a>
        </div>

        <p>
          © {new Date().getFullYear()} NextJob Portal. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
);

export default Footer;