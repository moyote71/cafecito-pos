import React, { useState } from "react";

const CashGate = ({ onOpen }) => {
  const [amount, setAmount] = useState("");

  const handleOpen = () => {
    const value = Number(amount);

    if (isNaN(value) || value < 0) {
      alert("Monto inválido");
      return;
    }

    onOpen(value);
  };

  return (
    <div className="cash-gate">
      <h2>💵 Caja cerrada</h2>
      <p>Debes abrir la caja para comenzar ventas</p>

      <input
        type="number"
        placeholder="Monto inicial"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleOpen}>
        Abrir caja
      </button>
    </div>
  );
};

export default CashGate;