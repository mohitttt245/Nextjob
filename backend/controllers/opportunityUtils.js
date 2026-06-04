const parseList = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
};

const buildOpportunityPayload = (body, defaults = {}) => ({
  title: body.title?.trim() || "",
  company: body.company?.trim() || "",
  location: body.location?.trim() || "",
  salary: body.salary?.trim() || "",
  description: body.description?.trim() || "",
  skills: parseList(body.skills),
  lastDate: body.lastDate,
  applyUrl: body.applyUrl?.trim() || "",
  employmentType: body.employmentType?.trim() || defaults.employmentType || "",
  experienceLevel: body.experienceLevel?.trim() || defaults.experienceLevel || "",
  featured: parseBoolean(body.featured)
});

const validateOpportunityPayload = (payload) => {
  if (!payload.title || !payload.company || !payload.location || !payload.salary) {
    return "Title, company, location, and salary are required.";
  }

  if (!payload.description || !payload.skills.length || !payload.lastDate || !payload.applyUrl) {
    return "Description, skills, last date, and apply URL are required.";
  }

  if (Number.isNaN(new Date(payload.lastDate).getTime())) {
    return "Last date must be a valid date.";
  }

  return null;
};

export { buildOpportunityPayload, validateOpportunityPayload, parseList, parseBoolean };
