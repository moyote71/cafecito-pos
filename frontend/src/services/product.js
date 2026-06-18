import api from "./api";

const normalize = (res) => res?.data?.data || [];

export const getProducts = async (q = "") => {
  const res = await api.get(`/products?q=${q}`);
  return normalize(res);
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res?.data?.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res?.data?.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res?.data;
};