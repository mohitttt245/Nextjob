import { Download, Wand2 } from "lucide-react";
import { useState } from "react";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import TextAreaField from "../components/TextAreaField";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { splitMultiline } from "../utils/formatters";
import downloadResumePdf from "../utils/resumePdf";

const starterResume = {
  name: "",
  skills: "",
  education: "",
  experience: "",
  projects: ""
};

const sampleResume = {
  name: "Aarav Sharma",
  skills: "React, Node.js, Express.js, MongoDB\nTailwind CSS, REST APIs, Git, AWS EC2",
  education:
    "B.Tech in Computer Science, ABC Institute of Technology (2022 - 2026)\nCGPA: 8.7/10",
  experience:
    "Frontend Intern at OrbitPixel Studio - Built reusable UI components for campaign landing pages.\nFreelance Web Developer - Delivered responsive websites for local businesses.",
  projects:
    "NextJob Portal - Full-stack job portal with admin CRUD, resume builder, and AI interview prep.\nE-commerce Dashboard - React analytics dashboard with charting and authentication."
};

const ResumeBuilderPage = () => {
  useDocumentTitle("Resume Builder");

  const [resume, setResume] = useState(starterResume);

  const updateField = (key, value) => {
    setResume((current) => ({
      ...current,
      [key]: value
    }));
  };

  return (
    <div className="page-wrap space-y-8">
      <SectionHeader
        eyebrow="Resume Builder"
        title="Create a simple ATS-friendly resume and export it as PDF"
        description="Capture only the fields that matter, keep the content skimmable, and download a recruiter-ready layout in one click."
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel-strong p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Resume Details</h3>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setResume(sampleResume)}
            >
              <Wand2 size={16} />
              Load Sample
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <InputField
              label="Full Name"
              value={resume.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Your name"
            />
            <TextAreaField
              label="Skills"
              value={resume.skills}
              onChange={(event) => updateField("skills", event.target.value)}
              placeholder="One skill or stack per line"
            />
            <TextAreaField
              label="Education"
              value={resume.education}
              onChange={(event) => updateField("education", event.target.value)}
              placeholder="One education entry per line"
            />
            <TextAreaField
              label="Experience"
              value={resume.experience}
              onChange={(event) => updateField("experience", event.target.value)}
              placeholder="One work experience point per line"
            />
            <TextAreaField
              label="Projects"
              value={resume.projects}
              onChange={(event) => updateField("projects", event.target.value)}
              placeholder="One project or impact statement per line"
            />

            <button
              type="button"
              onClick={() => downloadResumePdf(resume)}
              className="btn-primary mt-2"
            >
              <Download size={16} />
              Download PDF Resume
            </button>
          </div>
        </section>

        <section className="glass-panel-strong p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">ATS Preview</h3>
            <span className="tag-pill">Single-column format</span>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 text-slate-900 shadow-ambient dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
              <h1 className="text-3xl font-semibold">{resume.name || "Your Name"}</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Tailor this resume with strong role-specific keywords and measurable impact.
              </p>
            </div>

            {[
              { title: "Skills", value: resume.skills },
              { title: "Education", value: resume.education },
              { title: "Experience", value: resume.experience },
              { title: "Projects", value: resume.projects }
            ].map((section) => (
              <div key={section.title} className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-tide dark:text-teal-200">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {splitMultiline(section.value).length ? (
                    splitMultiline(section.value).map((line) => (
                      <p key={line} className="text-sm leading-6 text-slate-700 dark:text-slate-200">
                        • {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Add details to this section.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
