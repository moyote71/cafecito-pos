import React, { useEffect, useState } from "react";
import { getSales, getSaleById } from "../../../services/sale";
import "./SalesHistory.css";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadSales = async () => {
    setLoading(true);

    try {
      const res = await getSales({
        page: 1,
        limit: 20,
      });

      setSales(res?.data || res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const openTicket = async (id) => {
    const sale = await getSaleById(id);

    setSelectedTicket(sale);
    printTicket(sale);
  };

  const printTicket = (ticket) => {
    const w = window.open("", "_blank", "width=400,height=600");

    const change = ticket.change ?? 0;

    const itemsHTML = (ticket.items || [])
      .map(
        (item) => `
          <tr>
            <td>${item.quantity}x</td>
            <td>${item.productNameSnapshot || item.name}</td>
            <td>$${item.lineTotal}</td>
          </tr>
        `
      )
      .join("");

    w.document.write(`
      <html>
      <body>
      <h3>${ticket.ticketNumber}</h3>
      <table>${itemsHTML}</table>
      </body>
      </html>
    `);

    w.document.close();
    w.print();
  };

  return (
    <div className="sales-history-page">

      <div className="sales-header">
        <h2>🧾 Historial de Ventas</h2>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="sales-table-wrapper">

          <table className="sales-table">

            <thead>
              <tr>
                <th>Ticket</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Cliente</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {sales.map((s) => (
                <tr key={s._id}>
                  <td>{s.ticketNumber}</td>
                  <td>${s.total}</td>
                  <td>{s.paymentMethod}</td>
                  <td>{s.customerId?.name || "—"}</td>

                  <td>
                    <button
                      className="btn-reprint"
                      onClick={() => openTicket(s._id)}
                    >
                      Reimprimir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

      {selectedTicket && (
        <div className="last-ticket">
          Último ticket: <b>{selectedTicket.ticketNumber}</b>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;