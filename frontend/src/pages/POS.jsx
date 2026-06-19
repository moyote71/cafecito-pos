import React, { useState, useEffect } from "react";
import { getProducts } from "../services/product";
import usePOS from "../hooks/usePOS";
import useDebounce from "../hooks/useDebounce";
import ProductCard from "../components/pos/ProductCard";
import CartItem from "../components/pos/CartItem";
import CustomerSearch from "../components/pos/CustomerSearch";
import PaymentModal from "../components/pos/PaymentModal";
import ReceiptModal from "../components/pos/ReceiptModal";
import Loader from "../components/ui/Loader";
import "./POS.css";

const POS = () => {
  const { cart, totals, manualDiscount, setManualDiscount, discountPercent, automaticDiscount } = usePOS();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  const fetchProducts = async (query = "") => {
    setLoading(true);
    try {
      const data = await getProducts({ q: query });
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualDiscountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 100) {
      setManualDiscount(value);
    }
  };

  const handleCheckoutSuccess = (ticket) => {
    setShowPaymentModal(false);
    setActiveTicket(ticket);
    fetchProducts(debouncedSearch);
  };

  return (
    <div className="pos-page-container">
      {/* 1. Left Column: Catalogue Search & Grid */}
      <div className="pos-catalogue-panel">
        <div className="catalogue-search-bar">
          <span className="search-glass-pos">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="btn-clear-search">
              Limpiar
            </button>
          )}
        </div>

        {loading ? (
          <div className="catalogue-loading">
            <Loader size="large" />
          </div>
        ) : products.length === 0 ? (
          <div className="catalogue-empty">
            <span className="empty-coffee-icon">☕💤</span>
            <p>No se encontraron productos disponibles.</p>
          </div>
        ) : (
          <div className="catalogue-grid-wrapper">
            <div className="catalogue-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Right Column: Shopping Cart Sidebar */}
      <div className="pos-cart-panel glass">
        <div className="cart-header">
          <h3>Detalle de Venta</h3>
          <span className="item-count-pill">{cart.reduce((acc, item) => acc + item.quantity, 0)} ítems</span>
        </div>

        {/* Customer selector search */}
        <div className="cart-customer-section">
          <CustomerSearch />
        </div>

        {/* Scrollable list of items */}
        <div className="cart-items-wrapper">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <span className="cart-empty-icon">🛒</span>
              <p>El carrito está vacío.</p>
              <span>Agrega productos haciendo clic en el catálogo.</span>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Cart totals & check out footer */}
        <div className="cart-footer">
          {/* Discount controls */}
          <div className="discount-controls-row">
            <div className="manual-discount-input">
              <label htmlFor="manual-discount">Desc. Manual (%):</label>
              <input
                id="manual-discount"
                type="number"
                min="0"
                max="100"
                value={manualDiscount || ""}
                placeholder="0"
                onChange={handleManualDiscountChange}
              />
            </div>
            {discountPercent > 0 && (
              <div className="effective-discount-badge">
                Activo: -{discountPercent}% 
                {automaticDiscount > manualDiscount && " (Fidelidad)"}
              </div>
            )}
          </div>

          <hr className="footer-divider" />

          {/* Totals Breakdown */}
          <div className="totals-breakdown">
            <div className="total-row-item">
              <span>Subtotal:</span>
              <strong>${totals.subtotal.toFixed(2)}</strong>
            </div>
            {totals.discountAmount > 0 && (
              <div className="total-row-item discount-amount-text">
                <span>Descuento aplicado:</span>
                <strong>-${totals.discountAmount.toFixed(2)}</strong>
              </div>
            )}
            <div className="total-row-item checkout-total">
              <span>TOTAL A PAGAR:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className={`btn-trigger-checkout ${cart.length === 0 ? "disabled" : ""}`}
            disabled={cart.length === 0}
          >
            💰 Cobrar Venta
          </button>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Receipt Thermal Modal */}
      {activeTicket && (
        <ReceiptModal
          ticket={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
};

export default POS;
