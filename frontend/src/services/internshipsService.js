import api from "./api";

const listInternships = async () => {
  const { data } = await api.get("/internships");
  return data;
};

const createInternship = async (payload) => {
  const { data } = await api.post("/internships", payload);
  return data;
};

const updateInternship = async (id, payload) => {
  const { data } = await api.put(`/internships/${id}`, payload);
  return data;
};

const deleteInternship = async (id) => {
  const { data } = await api.delete(`/internships/${id}`);
  return data;
};

export { listInternships, createInternship, updateInternship, deleteInternship };
