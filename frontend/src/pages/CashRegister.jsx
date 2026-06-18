import React, { useState } from "react";
import { useCash } from "../context/CashContext";
import Loader from "../components/ui/Loader";
import "./CashRegister.css";

const CashRegister = () => {
  const { isCashOpen, currentSession, openSession, closeSession, loading } = useCash();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [closeSummary, setCloseSummary] = useState(null);

  const handleOpen = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setCloseSummary(null);

  const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setError("Por favor ingresa un monto válido (mayor o igual a 0).");
      return;
    }

    try {
      await openSession(parsedAmount);
      setSuccessMsg("¡Caja abierta con éxito! Ya puedes operar el POS.");
      setAmount("");
    } catch (err) {
      setError(err.message || "Error al intentar abrir la caja.");
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setError("Por favor ingresa el monto de cierre contado en caja.");
      return;
    }

    if (!window.confirm("¿Estás seguro de que deseas cerrar la caja? Esta acción finalizará el turno.")) {
      return;
    }

    try {
      const summary = await closeSession(parsedAmount);
      // summary: { sessionId, openingAmount, closingAmount, totalSales, expectedAmount, difference, totalTransactions }
      setCloseSummary(summary);
      setSuccessMsg("Caja cerrada exitosamente.");
      setAmount("");
    } catch (err) {
      setError(err.message || "Error al intentar cerrar la caja.");
    }
  };

  return (
    <div className="cash-register-page">
      <div className="cash-register-wrapper animate-fade-in">
        
        {/* Alerts */}
        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {!isCashOpen ? (
          /* Caja Cerrada - Formulario de Apertura */
          <div className="register-card card-open glass">
            <div className="card-icon">🔓</div>
            <h3>Apertura de Caja</h3>
            <p className="card-desc">Registra el fondo inicial para comenzar a operar las ventas del día.</p>
            
            <form onSubmit={handleOpen} className="register-form">
              <div className="form-group-cash">
                <label htmlFor="openingAmount">Monto Inicial en Efectivo ($)</label>
                <div className="input-with-symbol">
                  <span className="currency-symbol">$</span>
                  <input
                    id="openingAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-register-action btn-open" disabled={loading}>
                {loading ? <Loader size="small" color="white" /> : "Abrir Turno de Caja"}
              </button>
            </form>
          </div>
        ) : (
          /* Caja Abierta - Formulario de Cierre */
          <div className="register-card card-close glass">
            <div className="card-icon">🔒</div>
            <h3>Turno de Caja Activo</h3>
            
            <div className="session-details">
              <div className="detail-row">
                <span>Iniciado por:</span>
                <strong>Tú</strong>
              </div>
              <div className="detail-row">
                <span>Fecha/Hora de Apertura:</span>
                <strong>{currentSession?.openedAt ? new Date(currentSession.openedAt).toLocaleString() : "N/A"}</strong>
              </div>
              <div className="detail-row">
                <span>Monto Inicial:</span>
                <strong className="text-primary">${currentSession?.openingAmount?.toFixed(2) || "0.00"}</strong>
              </div>
            </div>

            <hr className="divider" />
            
            <p className="card-desc">Introduce la cantidad total de efectivo actualmente en el cajón para realizar el arqueo.</p>

            <form onSubmit={handleClose} className="register-form">
              <div className="form-group-cash">
                <label htmlFor="closingAmount">Efectivo Contado al Cierre ($)</label>
                <div className="input-with-symbol">
                  <span className="currency-symbol">$</span>
                  <input
                    id="closingAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-register-action btn-close" disabled={loading}>
                {loading ? <Loader size="small" color="white" /> : "Cerrar Turno de Caja"}
              </button>
            </form>
          </div>
        )}

        {/* Resumen del Cierre de Caja (Se muestra tras un arqueo exitoso) */}
        {closeSummary && (
          <div className="close-summary-card glass animate-fade-in">
            <h4>Resumen de Cierre de Caja</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span>Monto de Apertura</span>
                <strong>${closeSummary.openingAmount?.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Total Ventas en Turno</span>
                <strong>${closeSummary.totalSales?.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Efectivo Esperado</span>
                <strong>${closeSummary.expectedAmount?.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Efectivo Entregado (Cierre)</span>
                <strong>${closeSummary.closingAmount?.toFixed(2)}</strong>
              </div>
              <div className="summary-item highlight">
                <span>Diferencia (Descuadre)</span>
                <strong className={closeSummary.difference < 0 ? "negative" : closeSummary.difference > 0 ? "positive" : "zero"}>
                  {closeSummary.difference > 0 ? "+" : ""}
                  ${closeSummary.difference?.toFixed(2)}
                </strong>
              </div>
              <div className="summary-item">
                <span>Transacciones Realizadas</span>
                <strong>{closeSummary.totalTransactions}</strong>
              </div>
            </div>
            
            {closeSummary.difference !== 0 && (
              <div className={`summary-alert ${closeSummary.difference < 0 ? "deficit" : "surplus"}`}>
                {closeSummary.difference < 0 
                  ? "⚠️ Hay un faltante en caja. Revisa los recibos físicos y formas de pago."
                  : "💰 Hay un excedente en caja. Asegúrate de haber registrado todas las ventas."
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashRegister;
