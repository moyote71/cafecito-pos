import React from "react";
import usePOS from "../../hooks/usePOS";
import "./ReceiptModal.css";

const ReceiptModal = ({ ticket, onClose }) => {
  const { clearCart } = usePOS();

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    clearCart();
    onClose();
  };

  if (!ticket) return null;

  const { header, customer, items, summary, footer } = ticket;

  return (
    <div className="modal-overlay receipt-modal-overlay">
      <div className="receipt-modal-wrapper">

        <div id="print-receipt-area" className="thermal-receipt">

          <div className="receipt-header">
            <h2>{header.businessName}</h2>
            <p>Ticket: #{header.ticketNumber}</p>
            <p>ID: {header.saleId}</p>
            <p>{new Date(header.date).toLocaleString()}</p>
          </div>

          <hr />

          {customer && (
            <div>
              <p>Cliente: {customer.name}</p>
              <p>Compras: {customer.purchasesCount}</p>
              {customer.discountLevel !== "0%" && (
                <p>Descuento: {customer.discountLevel}</p>
              )}
            </div>
          )}

          <hr />

          <table>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.name}</td>
                  <td>{i.quantity}</td>
                  <td>${i.unitPrice.toFixed(2)}</td>
                  <td>${i.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />

          <p>Subtotal: ${summary.subtotal.toFixed(2)}</p>
          <p>Descuento: ${summary.discountAmount.toFixed(2)}</p>
          <h3>Total: ${summary.total.toFixed(2)}</h3>
          <p>Método: {summary.paymentMethod}</p>

          <hr />

          <p>{footer.message}</p>
        </div>

        <button onClick={handlePrint}>Imprimir</button>
        <button onClick={handleNewSale}>Nueva Venta</button>
      </div>
    </div>
  );
};

export default ReceiptModal;