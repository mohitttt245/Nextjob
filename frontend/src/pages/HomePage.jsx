import { ArrowRight, FileText, Sparkles, Telescope } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OpportunityCard from "../components/OpportunityCard";
import PageLoader from "../components/PageLoader";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import FeedbackBanner from "../components/FeedbackBanner";
import { listInternships } from "../services/internshipsService";
import { listJobs } from "../services/jobsService";
import useDocumentTitle from "../hooks/useDocumentTitle";

const HomePage = () => {
  useDocumentTitle("Home");

  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsData, internshipData] = await Promise.all([listJobs(), listInternships()]);
        setJobs(jobsData);
        setInternships(internshipData);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load homepage data right now.");
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 2);
  const featuredInternships = internships.filter((item) => item.featured).slice(0, 2);

  return (
    <div className="page-wrap space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="animate-fade-up">
          <span className="section-kicker">Modern hiring portal</span>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold text-slate-950 dark:text-white sm:text-6xl">
            Discover jobs, build stronger resumes, and practice interviews in one polished flow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            NextJob combines curated opportunities, external apply links, ATS-friendly resume
            support, downloadable templates, and AI-powered interview preparation without asking
            users to create an account.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/jobs" className="btn-primary">
              Explore Jobs <ArrowRight size={16} />
            </Link>
            <Link to="/resume-builder" className="btn-secondary">
              Build Resume <FileText size={16} />
            </Link>
          </div>
        </div>

        <div className="glass-panel-strong animate-float p-6 sm:p-8">
          <div className="rounded-[26px] bg-slate-950 px-6 py-7 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-teal-200">Hiring Snapshot</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-3xl font-semibold">{jobs.length}</p>
                <p className="mt-2 text-sm text-slate-200">Live job openings</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-3xl font-semibold">{internships.length}</p>
                <p className="mt-2 text-sm text-slate-200">Internship listings</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-amber-50 p-5 dark:bg-amber-500/10">
              <Telescope className="text-amber-600 dark:text-amber-200" size={22} />
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                External apply links for real hiring portals
              </p>
            </div>
            <div className="rounded-3xl bg-teal-50 p-5 dark:bg-teal-500/10">
              <FileText className="text-tide dark:text-teal-200" size={22} />
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                ATS-friendly resume builder with downloadable PDF
              </p>
            </div>
            <div className="rounded-3xl bg-sky-50 p-5 dark:bg-sky-500/10">
              <Sparkles className="text-sky-600 dark:text-sky-200" size={22} />
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                AI interview prep for HR, technical, and aptitude rounds
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard value={`${jobs.length}+`} label="Open job roles from the admin dashboard" accent="text-tide dark:text-teal-200" />
        <StatCard value={`${internships.length}+`} label="Internship opportunities with external apply links" accent="text-amber-600 dark:text-amber-200" />
        <StatCard value="24/7" label="Self-serve resume and interview prep access" accent="text-sky-600 dark:text-sky-200" />
      </section>

      <FeedbackBanner type="error" message={error} />

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Featured jobs"
          title="Priority roles people can act on today"
          description="Clean, scannable cards highlight the essentials: company, location, compensation, skills, deadline, and direct apply link."
        />

        {loading ? (
          <PageLoader count={2} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {(featuredJobs.length ? featuredJobs : jobs.slice(0, 2)).map((job) => (
              <OpportunityCard key={job._id} item={job} type="Job" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Internships"
          title="Early-career opportunities that are still easy to browse"
          description="Internships use the same polished structure as jobs so students and freshers can compare options quickly."
        />

        {loading ? (
          <PageLoader count={2} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {(featuredInternships.length ? featuredInternships : internships.slice(0, 2)).map((item) => (
              <OpportunityCard key={item._id} item={item} type="Internship" />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel p-6">
          <p className="section-kicker">Resume Builder</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Turn your raw experience into a neat ATS-ready PDF.
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Enter your skills, education, projects, and experience in a focused form, then
            download a clean recruiter-friendly layout.
          </p>
          <Link to="/resume-builder" className="btn-primary mt-6">
            Start Building <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-panel p-6">
          <p className="section-kicker">Templates</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Browse admin-uploaded resume templates with preview and download.
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Keep a few design directions available for different audiences like software, general,
            and internship applications.
          </p>
          <Link to="/resume-templates" className="btn-primary mt-6">
            View Templates <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-panel p-6">
          <p className="section-kicker">AI Interview Prep</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Practice HR, technical, and aptitude rounds by role and difficulty.
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            The backend can generate tailored questions through the OpenAI API while still
            providing a graceful fallback during setup.
          </p>
          <Link to="/ai-interview" className="btn-primary mt-6">
            Generate Questions <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
