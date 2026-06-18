import React, { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");

  const storedUser = (() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  })();

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res?.data?.data;

      if (!data?.accessToken || !data?.user) {
        throw new Error("Respuesta inválida del backend");
      }

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.accessToken);
      setUser(data.user);

      return data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);