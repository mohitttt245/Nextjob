import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import OpportunityCard from "../components/OpportunityCard";
import PageLoader from "../components/PageLoader";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { listJobs } from "../services/jobsService";

const JobsPage = () => {
  useDocumentTitle("Jobs");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const loadJobsData = async () => {
      try {
        setLoading(true);
        setError("");
        setJobs(await listJobs());
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    loadJobsData();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const haystack = [job.title, job.company, job.location, ...(job.skills || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(deferredQuery.toLowerCase());
  });

  return (
    <div className="page-wrap space-y-8">
      <SectionHeader
        eyebrow="Jobs"
        title="Browse every full-time role posted by the admin"
        description="Search across titles, companies, locations, and skills. Every card routes users to the external application portal chosen by the admin."
      />

      <div className="glass-panel flex items-center gap-3 px-4 py-3 sm:px-5">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search jobs by role, company, location, or skill"
          aria-label="Search jobs"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>

      <FeedbackBanner type="error" message={error} />

      {loading ? (
        <PageLoader count={6} />
      ) : filteredJobs.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <OpportunityCard key={job._id} item={job} type="Job" />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs matched that search"
          description="Try a broader keyword or clear the filters to see all live roles."
        />
      )}
    </div>
  );
};

export default JobsPage;
