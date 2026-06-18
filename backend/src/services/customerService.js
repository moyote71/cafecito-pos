import api from "./api";

export const getCustomers = async (q = "") => {
  const res = await api.get("/customers", {
    params: { q }
  });

  console.log("GET CUSTOMERS RESPONSE");
  console.log(res.data);

  return res?.data?.data?.data || [];
};

export const createCustomer = async (data) => {
  const payload = {
    name: data.name?.trim(),
    phoneOrEmail: data.phoneOrEmail?.trim()
  };

  console.log("POST CUSTOMER PAYLOAD");
  console.log(payload);

  const res = await api.post("/customers", payload);

  console.log("POST CUSTOMER RESPONSE");
  console.log(res.data);

  return res?.data?.data;
};