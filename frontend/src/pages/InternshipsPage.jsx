import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import OpportunityCard from "../components/OpportunityCard";
import PageLoader from "../components/PageLoader";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { listInternships } from "../services/internshipsService";

const InternshipsPage = () => {
  useDocumentTitle("Internships");

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const loadInternshipsData = async () => {
      try {
        setLoading(true);
        setError("");
        setInternships(await listInternships());
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load internships.");
      } finally {
        setLoading(false);
      }
    };

    loadInternshipsData();
  }, []);

  const filteredInternships = internships.filter((item) => {
    const haystack = [item.title, item.company, item.location, ...(item.skills || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(deferredQuery.toLowerCase());
  });

  return (
    <div className="page-wrap space-y-8">
      <SectionHeader
        eyebrow="Internships"
        title="Discover internship opportunities without signing in"
        description="Students and freshers can review stipend, deadline, location, and required skills before jumping to the external application link."
      />

      <div className="glass-panel flex items-center gap-3 px-4 py-3 sm:px-5">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search internships by role, company, location, or skill"
          aria-label="Search internships"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>

      <FeedbackBanner type="error" message={error} />

      {loading ? (
        <PageLoader count={6} />
      ) : filteredInternships.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredInternships.map((item) => (
            <OpportunityCard key={item._id} item={item} type="Internship" />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No internships matched that search"
          description="Try a broader keyword or come back after the admin adds more listings."
        />
      )}
    </div>
  );
};

export default InternshipsPage;
