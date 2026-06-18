import React, { useState } from "react";
import { useCash } from "../../context/CashContext";

const OpenCashModal = ({ onOpened }) => {
  const { openCash } = useCash();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = async (e) => {
    e.preventDefault();

    console.log("🔥 CLICK ABRIR CAJA");

    setError("");

    const value = Number(amount);

    if (isNaN(value) || value < 0) {
      setError("Monto inválido");
      return;
    }

    setLoading(true);

    try {
      await openCash(value);
      onOpened?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>💵 Abrir Caja</h2>

        <form
  onSubmit={(e) => {
    console.log("🔥 FORM SUBMIT");
    handleOpen(e);
  }}
>
          <input
            type="number"
            placeholder="Fondo inicial"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
  type="button"
  onClick={handleOpen}
  disabled={loading}
  style={styles.button}
>
  {loading ? "Abriendo..." : "Abrir caja"}
</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 10,
  },
};

export default OpenCashModal;