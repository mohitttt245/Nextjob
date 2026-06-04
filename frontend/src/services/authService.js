import api from "./api";

const loginAdmin = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

const getCurrentAdmin = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export { loginAdmin, getCurrentAdmin };
