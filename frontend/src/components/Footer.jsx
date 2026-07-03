import { Github, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "Internships", to: "/internships" },
  { label: "Admin Login", to: "/admin/login" }
];

const resourceLinks = [
  { label: "Resume Builder", to: "/resume-builder" },
  { label: "Resume Templates", to: "/resume-templates" },
  { label: "AI Preparation", to: "/ai-interview" }
];

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/yourprofile", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/yourprofile", icon: Github },
  { label: "Instagram", href: "https://instagram.com/yourprofile", icon: Instagram }
];

const Footer = () => (
  <footer className="border-t border-slate-200/70 px-4 py-10 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
        <div className="space-y-4">
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-white">NextJob Portal</p>
            <p className="mt-2 text-sm leading-6">
              Helping candidates discover roles, build resumes, and prepare faster.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-tide hover:text-tide dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-200 dark:hover:text-teal-200"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
            Explore
          </p>
          <div className="space-y-3">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block transition hover:text-slate-800 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
            Resources
          </p>
          <div className="space-y-3">
            {resourceLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block transition hover:text-slate-800 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
            Contact
          </p>
          <div className="space-y-3">
            <a
              href="mailto:jobportal245@gmail.com"
              className="inline-flex min-h-11 items-center justify-center gap-2 transition hover:text-slate-800 dark:hover:text-white lg:justify-start"
            >
              <Mail size={16} />
              <span className="break-all">jobportal245@gmail.com</span>
            </a>
            <a
              href="tel:+919999999999"
              className="inline-flex min-h-11 items-center justify-center gap-2 transition hover:text-slate-800 dark:hover:text-white lg:justify-start"
            >
              <Phone size={16} />
              +91 99999 99999
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200/70 pt-6 text-center dark:border-slate-800 md:flex md:items-center md:justify-between md:text-left">
        <p>Built for modern job discovery, resume creation, and interview practice.</p>
        <p className="mt-3 md:mt-0">© {new Date().getFullYear()} NextJob Portal. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
