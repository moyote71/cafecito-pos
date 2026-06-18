import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card glass animate-fade-in">
        <div className="notfound-icon">☕🔍</div>
        <h1 className="text-gradient">404 - No Encontrado</h1>
        <p className="notfound-subtitle">Esta taza está vacía.</p>
        <p className="notfound-desc">
          No pudimos encontrar la página que buscas. Tal vez el barista la movió o el enlace es incorrecto.
        </p>
        <button onClick={() => navigate(-1)} className="btn-notfound-back">
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default NotFound;
