import api from "./api";

export const getSales = async ({ page = 1, limit = 20, q = "" }) => {
  const res = await api.get("/sales", {
    params: { page, limit, q },
  });

  return res.data.data;
};

export const getSaleById = async (id) => {
  const res = await api.get(`/sales/${id}`);
  return res.data.data;
};