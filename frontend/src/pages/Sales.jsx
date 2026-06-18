import React, { useState, useEffect } from "react";
import { getSales, getSaleById } from "../services/sale";
import ReceiptModal from "../components/pos/ReceiptModal";
import Loader from "../components/ui/Loader";
import "./Sales.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
  setLoading(true);

  try {
    const res = await getSales();

    setSales(res?.data?.data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleViewTicket = async (sale) => {
    setModalLoading(true);
    try {
      const detailedSale = await getSaleById(sale._id);
      // Map populated sale model to the ticket envelope structure
      const ticket = {
        header: {
          businessName: "☕ Cafecito Feliz",
          ticketNumber: detailedSale.ticketNumber,
          saleId: detailedSale.saleId,
          date: detailedSale.createdAt
        },
        customer: detailedSale.customerId
          ? {
              name: detailedSale.customerId.name,
              purchasesCount: detailedSale.customerId.purchasesCount,
              discountLevel: `${detailedSale.discountPercent}%`
            }
          : null,
        items: detailedSale.items.map((item) => ({
          name: item.productNameSnapshot,
          quantity: item.quantity,
          unitPrice: item.unitPriceSnapshot,
          lineTotal: item.lineTotal
        })),
        summary: {
          subtotal: detailedSale.subtotal,
          discountPercent: detailedSale.discountPercent,
          automaticDiscount: 0,
          discountAmount: detailedSale.discountAmount,
          total: detailedSale.total,
          paymentMethod: detailedSale.paymentMethod
        },
        footer: {
          message: "¡Gracias por tu compra!",
          poweredBy: "Cafecito Feliz POS"
        }
      };
      setSelectedTicket(ticket);
    } catch (error) {
      alert("Error al cargar detalles de la venta: " + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "cash": return "💵 Efectivo";
      case "card": return "💳 Tarjeta";
      case "transfer": return "📱 Transferencia";
      default: return method;
    }
  };

  return (
    <div className="sales-page animate-fade-in">
      <div className="sales-actions-bar">
        <button onClick={fetchSales} className="btn-refresh-sales">
          🔄 Actualizar Lista
        </button>
      </div>

      {loading || modalLoading ? (
        <div className="sales-loading">
          <Loader size="large" />
        </div>
      ) : (
        <div className="sales-list-container glass">
          {sales.length === 0 ? (
            <div className="empty-state">
              <p>No se han registrado ventas en el sistema.</p>
            </div>
          ) : (
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>ID Venta</th>
                  <th>Fecha/Hora</th>
                  <th>Cliente</th>
                  <th>Método Pago</th>
                  <th>Total</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>
                      <strong className="ticket-badge">#{sale.ticketNumber}</strong>
                    </td>
                    <td className="sale-id-text">{sale.saleId}</td>
                    <td>{new Date(sale.createdAt).toLocaleString()}</td>
                    <td>{sale.customerId?.name || <span className="text-muted">General</span>}</td>
                    <td>
                      <span className="payment-method-pill">
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </span>
                    </td>
                    <td className="sale-total-text">${sale.total?.toFixed(2)}</td>
                    <td className="text-center">
                      <button onClick={() => handleViewTicket(sale)} className="btn-view-ticket">
                        📄 Ver Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Reused ReceiptModal */}
      {selectedTicket && (
        <ReceiptModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default Sales;
