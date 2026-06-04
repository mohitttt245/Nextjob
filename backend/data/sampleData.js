const jobs = [
  {
    title: "Frontend Engineer",
    company: "NovaStack Labs",
    location: "Bengaluru, India",
    salary: "INR 12-18 LPA",
    description:
      "Build responsive product experiences, collaborate with designers, and ship polished React interfaces for a B2B SaaS platform.",
    skills: ["React", "Tailwind CSS", "REST APIs", "Testing"],
    lastDate: "2026-07-15",
    applyUrl: "https://www.linkedin.com/jobs/",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    featured: true
  },
  {
    title: "Backend Developer",
    company: "CloudHarbor Systems",
    location: "Remote",
    salary: "INR 10-16 LPA",
    description:
      "Own Express services, data pipelines, and API integrations for a hiring analytics product used by global teams.",
    skills: ["Node.js", "Express.js", "MongoDB", "System Design"],
    lastDate: "2026-07-22",
    applyUrl: "https://careers.example.com/backend-role",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    featured: true
  },
  {
    title: "Full Stack MERN Developer",
    company: "BrightLoop Digital",
    location: "Hyderabad, India",
    salary: "INR 8-14 LPA",
    description:
      "Work across React, Node, and MongoDB to deliver internal tools and customer-facing workflow automation features.",
    skills: ["MongoDB", "Express.js", "React", "Node.js"],
    lastDate: "2026-08-01",
    applyUrl: "https://www.indeed.com/",
    employmentType: "Full-time",
    experienceLevel: "2-4 Years",
    featured: false
  }
];

const internships = [
  {
    title: "UI Engineering Intern",
    company: "OrbitPixel Studio",
    location: "Pune, India",
    salary: "INR 25,000 / month",
    description:
      "Partner with senior engineers to ship marketing pages, design systems, and reusable React components.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    lastDate: "2026-06-30",
    applyUrl: "https://internshala.com/",
    employmentType: "Internship",
    experienceLevel: "Student / Fresher",
    featured: true
  },
  {
    title: "Data Analyst Intern",
    company: "SignalSpring",
    location: "Remote",
    salary: "INR 20,000 / month",
    description:
      "Support reporting, dashboards, and experiment analysis for a fast-moving product and growth team.",
    skills: ["Excel", "SQL", "Data Visualization", "Statistics"],
    lastDate: "2026-07-08",
    applyUrl: "https://careers.example.com/data-intern",
    employmentType: "Internship",
    experienceLevel: "Student / Fresher",
    featured: false
  }
];

const interviewCategories = [
  {
    name: "Software Engineering",
    description: "Core technical interviews for frontend, backend, and full-stack roles.",
    hrPrompt: "Focus on ownership, communication, collaboration, and delivery under deadlines.",
    technicalFocus: "JavaScript, React, Node.js, APIs, databases, testing, debugging, and scalability.",
    aptitudeFocus: "Logical problem solving, prioritization, and root-cause analysis.",
    sampleRoles: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    isActive: true
  },
  {
    name: "Data & Analytics",
    description: "Interview tracks for analyst, BI, and data operations roles.",
    hrPrompt: "Assess stakeholder management, reporting discipline, and communication of insights.",
    technicalFocus: "SQL, spreadsheets, statistics, experimentation, and dashboard design.",
    aptitudeFocus: "Numbers, patterns, interpretation, and decision quality.",
    sampleRoles: ["Data Analyst", "Business Analyst", "Operations Analyst"],
    isActive: true
  },
  {
    name: "Product & Operations",
    description: "Interview prep for PM, ops, and cross-functional coordination roles.",
    hrPrompt: "Evaluate prioritization, ownership, ambiguity handling, and decision-making.",
    technicalFocus: "Execution frameworks, metrics, stakeholder alignment, and process design.",
    aptitudeFocus: "Trade-offs, prioritization, and structured thinking.",
    sampleRoles: ["Product Manager", "Operations Associate", "Program Manager"],
    isActive: true
  }
];

const resumeTemplates = [
  {
    title: "ATS Modern",
    category: "Software",
    description: "Single-column resume layout designed to stay ATS-friendly while keeping a polished visual rhythm.",
    fileName: "ats-modern-template.svg",
    fileUrl: "/uploads/templates/ats-modern-template.svg",
    fileType: "image/svg+xml",
    size: 2148,
    isFeatured: true
  },
  {
    title: "Minimal Impact",
    category: "General",
    description: "A clean, recruiter-friendly template with strong section hierarchy for internships and early-career roles.",
    fileName: "minimal-impact-template.svg",
    fileUrl: "/uploads/templates/minimal-impact-template.svg",
    fileType: "image/svg+xml",
    size: 1984,
    isFeatured: false
  }
];

export { jobs, internships, interviewCategories, resumeTemplates };
