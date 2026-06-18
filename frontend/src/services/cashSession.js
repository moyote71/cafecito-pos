import api from "./api";

export const getCashSessionReport = async () => {
  const res = await api.get("/cash-sessions/report");
  return res.data.data;
};

export const closeCashSession = async (closingAmount) => {
  const res = await api.post("/cash-sessions/close", {
    closingAmount
  });

  return res.data.data;
};

export const getCurrentCashSession = async () => {
  const res = await api.get("/cash-sessions/me");
  return res.data.data;
};