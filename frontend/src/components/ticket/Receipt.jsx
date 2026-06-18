import React, { forwardRef } from "react";

const Receipt = forwardRef(({ ticket }, ref) => {
  if (!ticket) return null;

  const { header, customer, items, summary, footer } = ticket;

  return (
    <div ref={ref} className="receipt">
      {/* HEADER */}
      <div className="receipt__header">
        <h2>{header.businessName}</h2>
        <p>{header.ticketNumber}</p>
        <p>{new Date(header.date).toLocaleString()}</p>
      </div>

      <hr />

      {/* CUSTOMER */}
      {customer && (
        <div className="receipt__customer">
          <p><strong>Cliente:</strong> {customer.name}</p>
          <p><strong>Visitas:</strong> {customer.purchasesCount}</p>
          <p><strong>Descuento:</strong> {customer.discountLevel}</p>
        </div>
      )}

      <hr />

      {/* ITEMS */}
      <div className="receipt__items">
        {items.map((item, index) => (
          <div key={index} className="receipt__item">
            <div className="item-line">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
            </div>
            <div className="item-price">
              ${item.unitPrice} → ${item.lineTotal}
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* SUMMARY */}
      <div className="receipt__summary">
        <p>Subtotal: ${summary.subtotal}</p>
        <p>Descuento: {summary.discountPercent}%</p>
        <p>Total: <strong>${summary.total}</strong></p>
        <p>Método: {summary.paymentMethod}</p>
      </div>

      <hr />

      {/* FOOTER */}
      <div className="receipt__footer">
        <p>{footer.message}</p>
        <small>{footer.poweredBy}</small>
      </div>
    </div>
  );
});

export default Receipt;