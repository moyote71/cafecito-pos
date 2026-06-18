import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CashContext = createContext();

export const CashProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCashOpen = !!currentSession;

  const getSession = async () => {
    try {
      const res = await api.get("/cash-sessions/me");
      setCurrentSession(res.data.data);
    } catch (err) {
      setCurrentSession(null);
    } finally {
      setLoading(false);
    }
  };

  const openCash = async (amount) => {
  console.log("🟢 OPEN CASH START", amount);

  const res = await api.post("/cash-sessions/open", {
    openingAmount: Number(amount),
  });

  console.log("🟢 OPEN CASH RESPONSE", res);

  setCurrentSession(res.data.data);

  return res.data.data;
};

  const closeCash = async (amount) => {
    const res = await api.post("/cash-sessions/close", {
      closingAmount: Number(amount),
    });

    setCurrentSession(null);
    return res.data.data;
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <CashContext.Provider
      value={{
        currentSession,
        isCashOpen,
        loading,
        openCash,
        closeCash,
        refreshSession: getSession,
      }}
    >
      {children}
    </CashContext.Provider>
  );
};

export const useCash = () => useContext(CashContext);