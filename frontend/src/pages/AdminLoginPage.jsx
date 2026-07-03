import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FeedbackBanner from "../components/FeedbackBanner";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const AdminLoginPage = () => {
  useDocumentTitle("Admin Login");

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await login(form);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Admin login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5">
          <span className="section-kicker">Admin access</span>
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Sign in to manage the hiring portal.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Public users still browse jobs, internships, templates, and interview prep without accounts.
            Only the admin dashboard requires authentication.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-panel p-5">
              <ShieldCheck className="text-tide dark:text-teal-200" size={22} />
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                Protects dashboard CRUD actions
              </p>
            </div>
            <div className="glass-panel p-5">
              <LockKeyhole className="text-amber-600 dark:text-amber-200" size={22} />
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                Session restored from a signed JWT
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel-strong p-5 sm:p-8">
          <SectionHeader
            eyebrow="Admin Login"
            title="Use your configured admin credentials"
            description="These credentials come from the backend environment variables, not from public user registration."
          />

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <FeedbackBanner type="error" message={error} />
            <InputField
              label="Admin Email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="admin@example.com"
              required
            />
            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Enter your admin password"
              required
            />
            <button type="submit" className="btn-primary mt-2 w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
