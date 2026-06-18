import React, { useState, useEffect } from "react";
import { getDashboard } from "../services/report";
import Loader from "../components/ui/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Error cargando dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error-container">
        <div className="alert alert-danger">{error}</div>

        <button
          onClick={fetchDashboardData}
          className="btn-retry-dashboard"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const {
    summary = {},
    topProducts = [],
    topCustomers = [],
    lowStockProducts = [],
  } = data || {};

  return (
    <div className="dashboard-page animate-fade-in">

      {/* ===================== */}
      {/* STATS PRINCIPALES */}
      {/* ===================== */}
      <div className="stats-grid">

        <div className="stat-card border-revenue">
          <div className="stat-icon-wrapper revenue-icon">💰</div>
          <div className="stat-info">
            <span>Ingresos del día</span>
            <h3>${summary.totalRevenue?.toFixed(2) || "0.00"}</h3>
          </div>
        </div>

        <div className="stat-card border-sales">
          <div className="stat-icon-wrapper sales-icon">🧾</div>
          <div className="stat-info">
            <span>Ventas</span>
            <h3>{summary.totalSalesCount || 0}</h3>
          </div>
        </div>

        <div className="stat-card border-ticket">
          <div className="stat-icon-wrapper ticket-icon">📊</div>
          <div className="stat-info">
            <span>Ticket promedio</span>
            <h3>${summary.averageTicket?.toFixed(2) || "0.00"}</h3>
          </div>
        </div>

      </div>

      {/* ===================== */}
      {/* GRID DE PANELES */}
      {/* ===================== */}
      <div className="dashboard-grid">

        {/* TOP PRODUCTOS */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>🔥 Productos más vendidos</h4>
          </div>

          <div className="panel-content">
            {topProducts.length === 0 ? (
              <p className="no-data-msg">Sin datos</p>
            ) : (
              <div className="dashboard-list">
                {topProducts.map((p, i) => (
                  <div className="dashboard-list-item" key={i}>
                    <div className="item-rank-title">
                      <div className={`rank-badge rank-${i + 1}`}>
                        {i + 1}
                      </div>
                      {p.name}
                    </div>

                    <div className="item-stats-right">
                      <strong>{p.quantitySold}</strong>
                      <span>${p.revenue?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STOCK BAJO */}
        <div className="dashboard-panel alert-panel">
          <div className="panel-header">
            <h4>⚠️ Stock bajo</h4>
            <span className="badge-count count-danger">
              {lowStockProducts.length}
            </span>
          </div>

          <div className="panel-content">
            {lowStockProducts.length === 0 ? (
              <p className="no-data-msg">Todo en orden</p>
            ) : (
              <div className="dashboard-list">
                {lowStockProducts.map((p) => (
                  <div className="dashboard-list-item list-alert" key={p._id}>
                    <span className="item-title-low">{p.name}</span>

                    <span
                      className={`item-qty-low ${
                        p.stock === 0 ? "agotado" : ""
                      }`}
                    >
                      {p.stock} unidades
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CLIENTES */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4>👥 Clientes frecuentes</h4>
          </div>

          <div className="panel-content">
            {topCustomers.length === 0 ? (
              <p className="no-data-msg">Sin clientes</p>
            ) : (
              <div className="dashboard-list">
                {topCustomers.map((c, i) => (
                  <div className="dashboard-list-item" key={c._id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="customer-avatar-dashboard">
                        {c.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="dashboard-customer-info">
                        <strong>{c.name}</strong>
                        <span>{c.purchasesCount} compras</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;