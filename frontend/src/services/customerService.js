import api from "./api";

export const getCustomers = async (q = "") => {
  const res = await api.get(`/customers?q=${q}`);
  return res?.data?.data?.data ?? [];
};

export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res?.data?.data;
};

export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res?.data?.data;
};