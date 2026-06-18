import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useCash } from "../context/CashContext";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isCashOpen, currentSession } = useCash();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      await logout();
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">☕</span>
          <span className="brand-name">Cafecito POS</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {user?.role === "admin" && (
              <li>
                <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard">
                  📊 Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link className={isActive("/pos") ? "active" : ""} to="/pos">
                ☕ POS
              </Link>
            </li>

            <li>
              <Link className={isActive("/caja") ? "active" : ""} to="/caja">
                💵 Caja
              </Link>
            </li>

            <li>
              <Link className={isActive("/clientes") ? "active" : ""} to="/clientes">
                👤 Clientes
              </Link>
            </li>

            {user?.role === "admin" && (
              <>
                <li>
                  <Link className={isActive("/productos") ? "active" : ""} to="/productos">
                    📦 Productos
                  </Link>
                </li>

                <li>
                  <Link className={isActive("/ventas") ? "active" : ""} to="/ventas">
                    🧾 Ventas
                  </Link>
                </li>

                <li>
                  <Link className={isActive("/reportes") ? "active" : ""} to="/reportes">
                    📝 Reportes
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="user-info">
              <span>{user?.name}</span>
              <small>{user?.role}</small>
            </div>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="content-container">

        {/* HEADER */}
        <header className="main-header">
          <h2 className="page-title">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/pos" && "Punto de Venta"}
            {location.pathname === "/caja" && "Caja"}
            {location.pathname === "/clientes" && "Clientes"}
            {location.pathname === "/productos" && "Productos"}
            {location.pathname === "/ventas" && "Ventas"}
            {location.pathname === "/reportes" && "Reportes"}
          </h2>

          <div className={`cash-indicator ${isCashOpen ? "open" : "closed"}`}>
            {isCashOpen
              ? `Caja: $${currentSession?.openingAmount || 0}`
              : "Caja cerrada"}
          </div>
        </header>

        {/* CONTENT */}
        <main className="main-content">
          <div className="content-inner">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;