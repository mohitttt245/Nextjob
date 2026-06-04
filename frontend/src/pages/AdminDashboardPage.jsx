import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardTabs from "../components/DashboardTabs";
import FeedbackBanner from "../components/FeedbackBanner";
import InterviewCategoryManager from "../components/InterviewCategoryManager";
import OpportunityAdminSection from "../components/OpportunityAdminSection";
import PreviewModal from "../components/PreviewModal";
import ResumeTemplateManager from "../components/ResumeTemplateManager";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  createInterviewCategory,
  deleteInterviewCategory,
  listInterviewCategories,
  updateInterviewCategory
} from "../services/interviewsService";
import {
  createInternship,
  deleteInternship,
  listInternships,
  updateInternship
} from "../services/internshipsService";
import { createJob, deleteJob, listJobs, updateJob } from "../services/jobsService";
import {
  createResumeTemplate,
  deleteResumeTemplate,
  listResumeTemplates,
  updateResumeTemplate
} from "../services/resumeTemplatesService";
import { toCommaSeparated } from "../utils/formatters";

const assetBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(
  /\/api\/?$/,
  ""
);

const tabs = [
  { label: "Jobs", value: "jobs" },
  { label: "Internships", value: "internships" },
  { label: "Resume Templates", value: "templates" },
  { label: "AI Categories", value: "ai" }
];

const blankOpportunityForm = {
  id: "",
  title: "",
  company: "",
  location: "",
  salary: "",
  description: "",
  skills: "",
  lastDate: "",
  applyUrl: "",
  employmentType: "",
  experienceLevel: "",
  featured: false
};

const blankTemplateForm = {
  id: "",
  title: "",
  category: "",
  description: "",
  isFeatured: false,
  templateFile: null
};

const blankCategoryForm = {
  id: "",
  name: "",
  description: "",
  hrPrompt: "",
  technicalFocus: "",
  aptitudeFocus: "",
  sampleRoles: "",
  isActive: true
};

const AdminDashboardPage = () => {
  useDocumentTitle("Admin Dashboard");
  const { admin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("jobs");
  const [pageLoading, setPageLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState({ type: "info", message: "" });

  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);

  const [jobForm, setJobForm] = useState(blankOpportunityForm);
  const [internshipForm, setInternshipForm] = useState(blankOpportunityForm);
  const [templateForm, setTemplateForm] = useState(blankTemplateForm);
  const [categoryForm, setCategoryForm] = useState(blankCategoryForm);
  const [previewItem, setPreviewItem] = useState(null);

  const setErrorNotice = (message) => setNotice({ type: "error", message });
  const setSuccessNotice = (message) => setNotice({ type: "success", message });
  const handleAdminRequestError = (requestError, fallbackMessage) => {
    if (requestError.response?.status === 401) {
      logout();
      setErrorNotice("Your admin session expired. Please sign in again.");
      return;
    }

    setErrorNotice(requestError.response?.data?.message || fallbackMessage);
  };

  const loadAllData = async () => {
    try {
      setPageLoading(true);
      setNotice({ type: "info", message: "" });

      const [jobsData, internshipsData, templateData, categoryData] = await Promise.all([
        listJobs(),
        listInternships(),
        listResumeTemplates(),
        listInterviewCategories()
      ]);

      setJobs(jobsData);
      setInternships(internshipsData);
      setTemplates(templateData);
      setCategories(categoryData);
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to load admin dashboard data.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleJobChange = (field, value) =>
    setJobForm((current) => ({
      ...current,
      [field]: value
    }));

  const handleInternshipChange = (field, value) =>
    setInternshipForm((current) => ({
      ...current,
      [field]: value
    }));

  const handleTemplateChange = (field, value) =>
    setTemplateForm((current) => ({
      ...current,
      [field]: value
    }));

  const handleCategoryChange = (field, value) =>
    setCategoryForm((current) => ({
      ...current,
      [field]: value
    }));

  const submitJob = async (event) => {
    event.preventDefault();

    try {
      setBusy("jobs");
      if (jobForm.id) {
        await updateJob(jobForm.id, jobForm);
        setSuccessNotice("Job updated successfully.");
      } else {
        await createJob(jobForm);
        setSuccessNotice("Job created successfully.");
      }

      setJobForm(blankOpportunityForm);
      setJobs(await listJobs());
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to save job.");
    } finally {
      setBusy("");
    }
  };

  const submitInternship = async (event) => {
    event.preventDefault();

    try {
      setBusy("internships");
      if (internshipForm.id) {
        await updateInternship(internshipForm.id, internshipForm);
        setSuccessNotice("Internship updated successfully.");
      } else {
        await createInternship(internshipForm);
        setSuccessNotice("Internship created successfully.");
      }

      setInternshipForm(blankOpportunityForm);
      setInternships(await listInternships());
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to save internship.");
    } finally {
      setBusy("");
    }
  };

  const submitTemplate = async (event) => {
    event.preventDefault();

    try {
      setBusy("templates");
      const formData = new FormData();
      formData.append("title", templateForm.title);
      formData.append("category", templateForm.category);
      formData.append("description", templateForm.description);
      formData.append("isFeatured", String(templateForm.isFeatured));

      if (templateForm.templateFile) {
        formData.append("templateFile", templateForm.templateFile);
      }

      if (templateForm.id) {
        await updateResumeTemplate(templateForm.id, formData);
        setSuccessNotice("Resume template updated successfully.");
      } else {
        if (!templateForm.templateFile) {
          throw new Error("Template file is required for a new upload.");
        }

        await createResumeTemplate(formData);
        setSuccessNotice("Resume template uploaded successfully.");
      }

      setTemplateForm(blankTemplateForm);
      setTemplates(await listResumeTemplates());
    } catch (requestError) {
      handleAdminRequestError(
        requestError,
        requestError.message || "Unable to save template."
      );
    } finally {
      setBusy("");
    }
  };

  const submitCategory = async (event) => {
    event.preventDefault();

    try {
      setBusy("categories");

      if (categoryForm.id) {
        await updateInterviewCategory(categoryForm.id, categoryForm);
        setSuccessNotice("Interview category updated successfully.");
      } else {
        await createInterviewCategory(categoryForm);
        setSuccessNotice("Interview category created successfully.");
      }

      setCategoryForm(blankCategoryForm);
      setCategories(await listInterviewCategories());
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to save interview category.");
    } finally {
      setBusy("");
    }
  };

  const editOpportunity = (setter, item) =>
    setter({
      id: item._id,
      title: item.title,
      company: item.company,
      location: item.location,
      salary: item.salary,
      description: item.description,
      skills: toCommaSeparated(item.skills),
      lastDate: item.lastDate ? item.lastDate.slice(0, 10) : "",
      applyUrl: item.applyUrl,
      employmentType: item.employmentType || "",
      experienceLevel: item.experienceLevel || "",
      featured: Boolean(item.featured)
    });

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) {
      return;
    }

    try {
      setBusy("jobs");
      await deleteJob(id);
      setJobs(await listJobs());
      setSuccessNotice("Job deleted successfully.");
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to delete job.");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm("Delete this internship?")) {
      return;
    }

    try {
      setBusy("internships");
      await deleteInternship(id);
      setInternships(await listInternships());
      setSuccessNotice("Internship deleted successfully.");
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to delete internship.");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm("Delete this resume template?")) {
      return;
    }

    try {
      setBusy("templates");
      await deleteResumeTemplate(id);
      setTemplates(await listResumeTemplates());
      setSuccessNotice("Resume template deleted successfully.");
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to delete resume template.");
    } finally {
      setBusy("");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this AI interview category?")) {
      return;
    }

    try {
      setBusy("categories");
      await deleteInterviewCategory(id);
      setCategories(await listInterviewCategories());
      setSuccessNotice("Interview category deleted successfully.");
    } catch (requestError) {
      handleAdminRequestError(requestError, "Unable to delete interview category.");
    } finally {
      setBusy("");
    }
  };

  const renderActiveSection = () => {
    if (pageLoading) {
      return (
        <div className="glass-panel-strong p-8 text-sm text-slate-500 dark:text-slate-400">
          Loading dashboard data...
        </div>
      );
    }

    if (activeTab === "jobs") {
      return (
        <OpportunityAdminSection
          title="Manage Jobs"
          description="Create, edit, or remove full-time roles. Skills can be entered as comma-separated values."
          items={jobs}
          form={jobForm}
          onChange={handleJobChange}
          onSubmit={submitJob}
          onEdit={(item) => editOpportunity(setJobForm, item)}
          onDelete={handleDeleteJob}
          onCancel={() => setJobForm(blankOpportunityForm)}
          busy={busy === "jobs"}
        />
      );
    }

    if (activeTab === "internships") {
      return (
        <OpportunityAdminSection
          title="Manage Internships"
          description="Add internship listings with stipend, deadline, and external application links."
          items={internships}
          form={internshipForm}
          onChange={handleInternshipChange}
          onSubmit={submitInternship}
          onEdit={(item) => editOpportunity(setInternshipForm, item)}
          onDelete={handleDeleteInternship}
          onCancel={() => setInternshipForm(blankOpportunityForm)}
          busy={busy === "internships"}
        />
      );
    }

    if (activeTab === "templates") {
      return (
        <ResumeTemplateManager
          templates={templates}
          form={templateForm}
          onChange={handleTemplateChange}
          onFileChange={(event) => handleTemplateChange("templateFile", event.target.files?.[0] || null)}
          onSubmit={submitTemplate}
          onEdit={(item) =>
            setTemplateForm({
              id: item._id,
              title: item.title,
              category: item.category,
              description: item.description,
              isFeatured: Boolean(item.isFeatured),
              templateFile: null
            })
          }
          onDelete={handleDeleteTemplate}
          onCancel={() => setTemplateForm(blankTemplateForm)}
          onPreview={setPreviewItem}
          assetBaseUrl={assetBaseUrl}
          busy={busy === "templates"}
        />
      );
    }

    return (
      <InterviewCategoryManager
        categories={categories}
        form={categoryForm}
        onChange={handleCategoryChange}
        onSubmit={submitCategory}
        onEdit={(item) =>
          setCategoryForm({
            id: item._id,
            name: item.name,
            description: item.description,
            hrPrompt: item.hrPrompt,
            technicalFocus: item.technicalFocus,
            aptitudeFocus: item.aptitudeFocus,
            sampleRoles: toCommaSeparated(item.sampleRoles),
            isActive: Boolean(item.isActive)
          })
        }
        onDelete={handleDeleteCategory}
        onCancel={() => setCategoryForm(blankCategoryForm)}
        busy={busy === "categories"}
      />
    );
  };

  return (
    <div className="page-wrap space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Admin Dashboard"
          title="Manage jobs, internships, resume templates, and AI category prompts"
          description="Public visitors stay account-free, while the admin workspace is now protected by a dedicated login."
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100">
            Signed in as {admin?.email}
          </div>
          <button type="button" className="btn-secondary" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <FeedbackBanner type={notice.type} message={notice.message} />

      <div className="glass-panel-strong space-y-6 p-6 sm:p-8">
        <DashboardTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        {renderActiveSection()}
      </div>

      <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} assetBaseUrl={assetBaseUrl} />
    </div>
  );
};

export default AdminDashboardPage;
