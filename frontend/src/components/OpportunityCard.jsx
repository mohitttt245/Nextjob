import { ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, MapPin, Wallet } from "lucide-react";
import { formatDate } from "../utils/formatters";

const OpportunityCard = ({ item, type = "Job" }) => (
  <article className="glass-panel flex h-full flex-col p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="tag-pill">{type}</span>
        <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2">
            <Building2 size={16} /> {item.company}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} /> {item.location}
          </span>
        </div>
      </div>
      {item.featured ? (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
          Featured
        </span>
      ) : null}
    </div>

    <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-tide dark:text-teal-200">
      <Wallet size={16} /> {item.salary}
    </p>
    <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>

    <div className="mt-5 flex flex-wrap gap-2">
      {item.skills?.map((skill) => (
        <span key={skill} className="tag-pill">
          {skill}
        </span>
      ))}
    </div>

    <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <CalendarDays size={16} />
      Apply before {formatDate(item.lastDate)}
    </div>

    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-5 dark:border-slate-800">
      <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <BriefcaseBusiness size={16} />
        {item.employmentType || type}
      </div>
      <a
        href={item.applyUrl}
        target="_blank"
        rel="noreferrer"
        className="btn-primary"
      >
        Apply Now <ArrowUpRight size={16} />
      </a>
    </div>
  </article>
);

export default OpportunityCard;
