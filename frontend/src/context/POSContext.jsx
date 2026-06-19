import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const POSContext = createContext();

export const POSProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // =========================
  // STOCK VALIDATION (GLOBAL)
  // =========================
  const getStock = (product) => Number(product?.stock || 0);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    const stock = getStock(product);

    if (stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product._id === product._id
      );

      if (existing) {
        if (existing.quantity >= stock) return prev;

        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  // =========================
  // REMOVE
  // =========================
  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((i) => i.product._id !== id)
    );
  };

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = (id, qty) => {
    const quantity = Number(qty);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return removeFromCart(id);
    }

    setCart((prev) =>
      prev.map((i) => {
        if (i.product._id !== id) return i;

        const stock = getStock(i.product);

        if (quantity > stock) return i;

        return { ...i, quantity };
      })
    );
  };

  const clearCart = () => setCart([]);

  // =========================
  // TOTALS
  // =========================
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, i) => acc + Number(i.product.price || 0) * i.quantity,
      0
    );

    let discountPercent = 0;

    if (customer?.purchasesCount >= 15) discountPercent = 15;
    else if (customer?.purchasesCount >= 10) discountPercent = 10;
    else if (customer?.purchasesCount >= 5) discountPercent = 5;

    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    return {
      subtotal,
      discountPercent,
      discountAmount,
      total,
    };
  }, [cart, customer]);

  // =========================
  // CHECKOUT VALIDATION
  // =========================
  const validateStockBeforeCheckout = () => {
    for (const item of cart) {
      const stock = getStock(item.product);
      if (item.quantity > stock) return false;
    }
    return true;
  };

  // =========================
  // CHECKOUT
  // =========================
  const checkout = async ({ paymentMethod, receivedAmount = 0 }) => {
    if (!cart.length) {
      throw new Error("No hay productos en el carrito");
    }

    if (!validateStockBeforeCheckout()) {
      throw new Error("Stock insuficiente en el carrito");
    }

    setLoadingCheckout(true);

    try {
      const payload = {
        paymentMethod,
        receivedAmount:
          paymentMethod === "cash"
            ? Number(receivedAmount)
            : 0,

        customerId: customer?._id || null,

        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),

        discountPercent: totals.discountPercent,
      };

      const res = await api.post("/sales", payload);

      const ticket = res?.data?.data?.ticket;

      if (!ticket) {
        throw new Error("Ticket no recibido del servidor");
      }

      setCheckoutResult(ticket);

      window.dispatchEvent(new Event("products:update"));

      clearCart();

      return ticket;
    } catch (error) {
      throw error;
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <POSContext.Provider
      value={{
        cart,
        customer,
        setCustomer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totals,
        checkout,
        checkoutResult,
        loadingCheckout,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => useContext(POSContext);