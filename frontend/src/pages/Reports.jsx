import React, { useState, useEffect } from "react";
import { getDashboard } from "../services/report";
import Loader from "../components/ui/Loader";
import "./Reports.css";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const res = await getDashboard();
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader size="large" />;
  if (!data) return null;

  return (
    <div className="reports-page">

      <div className="report-cards">

        <div className="report-card">
          <span>Total Ventas</span>
          <h2>{data.summary.totalSalesCount}</h2>
        </div>

        <div className="report-card">
          <span>Ingresos</span>
          <h2>${Number(data.summary.totalRevenue || 0).toFixed(2)}</h2>
        </div>

        <div className="report-card">
          <span>Ticket Promedio</span>
          <h2>${Number(data.summary.averageTicket || 0).toFixed(2)}</h2>
        </div>

      </div>

      <div className="reports-grid">

        <div className="report-panel">
          <div className="report-panel-header">
            <h3>🔥 Productos más vendidos</h3>
          </div>

          <div className="report-panel-content">
            {data.topProducts.map((p) => (
              <div key={p._id} className="report-row">
                <span>{p.name}</span>
                <strong>{p.quantitySold}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="report-panel">
          <div className="report-panel-header">
            <h3>👥 Clientes frecuentes</h3>
          </div>

          <div className="report-panel-content">
            {data.topCustomers.map((c) => (
              <div key={c._id} className="report-row">
                <span>{c.name}</span>
                <strong>{c.purchasesCount}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;