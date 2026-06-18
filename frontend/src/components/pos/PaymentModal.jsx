import React, { useState } from "react";
import { usePOS } from "../../context/POSContext";
import Loader from "../ui/Loader";

const PaymentModal = ({ onClose, onSuccess }) => {
  const { totals, checkout, loadingCheckout } = usePOS();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [error, setError] = useState("");

  const total = Number(totals?.total || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let received = 0;

    if (paymentMethod === "cash") {
      received = Number(receivedAmount);
      if (!Number.isFinite(received) || received < total) {
        setError("Efectivo insuficiente");
        return;
      }
    }

    try {
      const ticket = await checkout({
        paymentMethod,
        receivedAmount: received,
      });

      onSuccess(ticket);
    } catch (err) {
      setError(err?.message || "Error al procesar pago");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          background: "white",
          width: 420,
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Pago</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
        <p>Descuento: ${totals.discountAmount.toFixed(2)}</p>
        <h3>Total: ${total.toFixed(2)}</h3>

        {/* MÉTODOS SIEMPRE VISIBLES */}
        <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
          <button onClick={() => setPaymentMethod("cash")}>
            Efectivo
          </button>

          <button onClick={() => setPaymentMethod("card")}>
            Tarjeta
          </button>

          <button onClick={() => setPaymentMethod("transfer")}>
            Transferencia
          </button>
        </div>

        {paymentMethod === "cash" && (
          <input
            type="number"
            placeholder="Efectivo recibido"
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loadingCheckout}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 12,
            background: "#111827",
            color: "white",
            borderRadius: 10,
          }}
        >
          {loadingCheckout ? <Loader size="small" /> : "Cobrar"}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;