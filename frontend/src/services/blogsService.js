import api from "./api";

const listPublishedBlogs = async ({ page = 1, limit = 6, category = "" } = {}) => {
  const { data } = await api.get("/blogs", {
    params: {
      page,
      limit,
      ...(category ? { category } : {})
    }
  });
  return data;
};

const getBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data;
};

const listBlogsAdmin = async () => {
  const { data } = await api.get("/blogs/admin");
  return data;
};

const getBlogByIdAdmin = async (id) => {
  const { data } = await api.get(`/blogs/admin/${id}`);
  return data;
};

const createBlog = async (payload) => {
  const { data } = await api.post("/blogs", payload);
  return data;
};

const updateBlog = async (id, payload) => {
  const { data } = await api.put(`/blogs/admin/${id}`, payload);
  return data;
};

const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/admin/${id}`);
  return data;
};

export {
  listPublishedBlogs,
  getBlogBySlug,
  listBlogsAdmin,
  getBlogByIdAdmin,
  createBlog,
  updateBlog,
  deleteBlog
};
