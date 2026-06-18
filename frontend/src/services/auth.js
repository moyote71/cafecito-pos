import API from "./api";

export const login = async (email, password) => {
  return await API.post("/auth/login", {
    email,
    password,
  });
};

export const logout = async () => {
  return await API.post("/auth/logout");
};