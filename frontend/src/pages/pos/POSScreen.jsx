import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

import { usePOS } from "../../context/POSContext";
import { useCash } from "../../context/CashContext";

import ProductCard from "../../components/pos/ProductCard";
import CartItem from "../../components/pos/CartItem";
import CustomerSearch from "../../components/pos/CustomerSearch";
import PaymentModal from "../../components/pos/PaymentModal";
import ReceiptModal from "../../components/pos/ReceiptModal";

import "./POSScreen.css";

const POSScreen = () => {
  const { cart, totals } = usePOS();
  const { currentSession, openCash, loading, refreshSession } = useCash();

  const [products, setProducts] = useState([]);
  const [openingAmount, setOpeningAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setPageLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res?.data?.data?.products || []);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const handler = () => loadProducts();
    window.addEventListener("products:update", handler);
    return () => window.removeEventListener("products:update", handler);
  }, [loadProducts]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Cargando caja...
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🟤 Abrir Caja</h2>

        <input
          className="input"
          placeholder="Monto inicial"
          value={openingAmount}
          onChange={(e) => setOpeningAmount(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={async () => {
            await openCash(openingAmount);
            refreshSession();
          }}
          style={{ marginTop: 10 }}
        >
          Abrir caja
        </button>
      </div>
    );
  }

  return (
    <>
      {/* POS GRID */}
      <div className="pos-grid">

        <div className="pos-section">
          <h3>Productos</h3>

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>

        <div className="pos-section">
          <h3>Carrito</h3>

          <div className="cart-list">
            {cart.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          <div className="cart-total">
            <h2>Total: ${totals.total.toFixed(2)}</h2>

            <button
              className="btn btn-primary"
              onClick={() => setShowPayment(true)}
            >
              Cobrar
            </button>
          </div>
        </div>

        <div className="pos-section">
          <h3>Cliente</h3>

          <CustomerSearch />

          <div style={{ marginTop: 20 }}>
            <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
            <p>Descuento: ${totals.discountAmount.toFixed(2)}</p>
          </div>
        </div>

      </div>

      {/* MODALES FUERA DEL GRID (IMPORTANTE) */}
      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={(t) => {
            setTicket(t);
            setShowPayment(false);
          }}
        />
      )}

      {/* 🔥 FIX PRINCIPAL: ticket no debe empujar layout */}
      {ticket && (
        <div className="receipt-overlay">
          <div className="receipt-wrapper">
            <ReceiptModal
              ticket={ticket}
              onClose={() => setTicket(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default POSScreen;