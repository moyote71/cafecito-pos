import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useCash } from "../context/CashContext";

import "./POSLayout.css";

const POSLayout = ({ children }) => {
  const { user } = useAuth();
  const { isCashOpen, currentSession } = useCash();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user?.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/caja");
    }
  };

  return (
    <div className="pos-layout">

      {/* TOP BAR SIMPLE */}
      <header className="pos-topbar">
        <div className="pos-left">
          <button onClick={handleBack} className="btn btn-secondary">
            ⬅ Menú
          </button>

          <h3 style={{ marginLeft: 12 }}>☕ Cafecito POS</h3>
        </div>

        <div className="pos-right">
          <span className={`status ${isCashOpen ? "open" : "closed"}`}>
            {isCashOpen
              ? `Caja: $${currentSession?.openingAmount || 0}`
              : "Caja Cerrada"}
          </span>

          <span style={{ marginLeft: 10 }}>
            {user?.name}
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="pos-main">
        {children}
      </main>

    </div>
  );
};

export default POSLayout;