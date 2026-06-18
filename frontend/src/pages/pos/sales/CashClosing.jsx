import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useCash } from "../../../context/CashContext";
import "./CashClosing.css";

const CashClosing = () => {
  const { closeCash } = useCash();

  const [report, setReport] = useState(null);
  const [closingAmount, setClosingAmount] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [closing, setClosing] = useState(false);

  const loadReport = async () => {
    try {
      const res = await api.get("/cash-sessions/report");
      setReport(res?.data?.data ?? null);
    } catch {
      setReport(null);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleClose = async () => {
    setError("");

    const amount = Number(closingAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      setError("Monto inválido");
      return;
    }

    try {
      setClosing(true);

      const data = await closeCash(amount);
      setResult(data);
      setReport(null);
    } catch (e) {
      setError(e?.message || "Error cerrando caja");
    } finally {
      setClosing(false);
    }
  };

  if (!report) {
    return (
      <div className="cash-page">

        <div className="cash-card">
          <h2>💵 Caja Cerrada</h2>

          {result && (
            <div className="cash-result">

              <div className="cash-stat">
                <span>Apertura</span>
                <strong>${result.openingAmount}</strong>
              </div>

              <div className="cash-stat">
                <span>Ventas</span>
                <strong>${result.totalSales}</strong>
              </div>

              <div className="cash-stat">
                <span>Esperado</span>
                <strong>${result.expectedAmount}</strong>
              </div>

              <div className="cash-stat">
                <span>Cierre</span>
                <strong>${result.closingAmount}</strong>
              </div>

              <div className="cash-stat">
                <span>Diferencia</span>
                <strong>${result.difference}</strong>
              </div>

            </div>
          )}

          <p>No hay sesión activa.</p>
        </div>

      </div>
    );
  }

  return (
    <div className="cash-page">

      <div className="cash-grid">

        <div className="cash-card">
          <h3>🧾 Resumen</h3>

          <div className="cash-stat">
            <span>Ventas</span>
            <strong>${report.totalSales}</strong>
          </div>

          <div className="cash-stat">
            <span>Tickets</span>
            <strong>{report.tickets}</strong>
          </div>

          <div className="cash-stat">
            <span>Promedio</span>
            <strong>
              ${Number(report.averageTicket || 0).toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="cash-card">

          <h3>💵 Cerrar Caja</h3>

          <input
            className="cash-input"
            type="number"
            placeholder="Monto final contado"
            value={closingAmount}
            onChange={(e) => setClosingAmount(e.target.value)}
          />

          {error && (
            <div className="cash-error">
              {error}
            </div>
          )}

          <button
            className="btn-close-cash"
            onClick={handleClose}
            disabled={closing}
          >
            {closing ? "Cerrando..." : "Cerrar Caja"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default CashClosing;