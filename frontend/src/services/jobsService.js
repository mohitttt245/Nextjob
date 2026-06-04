import api from "./api";

const listJobs = async () => {
  const { data } = await api.get("/jobs");
  return data;
};

const createJob = async (payload) => {
  const { data } = await api.post("/jobs", payload);
  return data;
};

const updateJob = async (id, payload) => {
  const { data } = await api.put(`/jobs/${id}`, payload);
  return data;
};

const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};

export { listJobs, createJob, updateJob, deleteJob };
