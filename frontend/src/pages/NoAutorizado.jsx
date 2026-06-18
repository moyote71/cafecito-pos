import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./NoAutorizado.css";

const NoAutorizado = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/pos", { replace: true });
    }
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card glass animate-fade-in">
        <div className="unauthorized-icon">🚫</div>
        <h1 className="text-gradient">Acceso Denegado</h1>
        <p className="unauthorized-subtitle">No tienes permisos para ver esta sección.</p>
        <p className="unauthorized-desc">
          Esta página está reservada exclusivamente para administradores. Si crees que esto es un error, por favor contacta al soporte técnico.
        </p>
        <button onClick={handleGoHome} className="btn-unauthorized-back">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default NoAutorizado;
