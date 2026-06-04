import api from "./api";

const listResumeTemplates = async () => {
  const { data } = await api.get("/resume-templates");
  return data;
};

const createResumeTemplate = async (formData) => {
  const { data } = await api.post("/resume-templates", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

const updateResumeTemplate = async (id, formData) => {
  const { data } = await api.put(`/resume-templates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

const deleteResumeTemplate = async (id) => {
  const { data } = await api.delete(`/resume-templates/${id}`);
  return data;
};

export {
  listResumeTemplates,
  createResumeTemplate,
  updateResumeTemplate,
  deleteResumeTemplate
};
