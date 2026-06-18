import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCash } from "../context/CashContext";
import Loader from "../components/ui/Loader";

const CashSessionGuard = () => {
  const { isCashOpen, loading } = useCash();

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-app)" }}>
        <Loader size="large" />
      </div>
    );
  }

  return isCashOpen ? <Outlet /> : <Navigate to="/caja" replace />;
};

export default CashSessionGuard;
