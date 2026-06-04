import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Not Found");

  return (
    <div className="page-wrap">
      <div className="glass-panel-strong px-6 py-16 text-center">
        <SectionHeader
          eyebrow="404"
          title="That page does not exist"
          description="Use the main navigation to jump back into jobs, internships, resume tools, or the admin dashboard."
          align="center"
        />
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
          <Link to="/jobs" className="btn-secondary">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
