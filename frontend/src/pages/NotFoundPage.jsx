import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Not Found");

  return (
    <div className="page-wrap">
      <div className="glass-panel-strong px-5 py-12 text-center sm:px-6 sm:py-16">
        <SectionHeader
          eyebrow="404"
          title="That page does not exist"
          description="Use the main navigation to jump back into jobs, internships, resume tools, or the admin dashboard."
          align="center"
        />
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            Go Home
          </Link>
          <Link to="/jobs" className="btn-secondary w-full sm:w-auto">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
