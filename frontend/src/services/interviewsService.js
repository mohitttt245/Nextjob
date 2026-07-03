// import api from "./api";

// const listInterviewCategories = async () => {
//   const { data } = await api.get("/interviews/categories");
//   return data;
// };

// const createInterviewCategory = async (payload) => {
//   const { data } = await api.post("/interviews/categories", payload);
//   return data;
// };

// const updateInterviewCategory = async (id, payload) => {
//   const { data } = await api.put(`/interviews/categories/${id}`, payload);
//   return data;
// };

// const deleteInterviewCategory = async (id) => {
//   const { data } = await api.delete(`/interviews/categories/${id}`);
//   return data;
// };

// const generateInterviewQuestions = async (payload) => {
//   const { data } = await api.post("/interviews/generate", payload);
//   return data;
// };

// export {
//   listInterviewCategories,
//   createInterviewCategory,
//   updateInterviewCategory,
//   deleteInterviewCategory,
//   generateInterviewQuestions
// };





import api from "./api";

const listInterviewCategories = async () => {
  const { data } = await api.get("/interviews/categories");
  return data;
};

const createInterviewCategory = async (payload) => {
  const { data } = await api.post("/interviews/categories", payload);
  return data;
};

const updateInterviewCategory = async (id, payload) => {
  const { data } = await api.put(`/interviews/categories/${id}`, payload);
  return data;
};

const deleteInterviewCategory = async (id) => {
  const { data } = await api.delete(`/interviews/categories/${id}`);
  return data;
};

const generateInterviewQuestions = async (payload) => {
  const { data } = await api.post("/interviews/generate", payload);
  return data;
};

const sendInterviewChatMessage = async ({ message, categoryId, history }) => {
  const { data } = await api.post("/interviews/chat", { message, categoryId, history });
  return data;
};

export {
  listInterviewCategories,
  createInterviewCategory,
  updateInterviewCategory,
  deleteInterviewCategory,
  generateInterviewQuestions,
  sendInterviewChatMessage
};