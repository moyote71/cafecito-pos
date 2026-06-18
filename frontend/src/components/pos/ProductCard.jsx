import React from "react";
import usePOS from "../../hooks/usePOS";

const ProductCard = ({ product }) => {
  const { addToCart, cart } = usePOS();

  const cartItem = cart.find(
    (item) => item.product._id === product._id
  );

  const cartQty = cartItem ? cartItem.quantity : 0;

  const stock = Number(product.stock || 0);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isMaxInCart = cartQty >= stock;

  const handleAdd = () => {
    if (isOutOfStock || isMaxInCart) return;
    addToCart(product);
  };

  return (
  <div
    className={`product-card ${isOutOfStock ? "out" : ""}`}
    style={{
      opacity: isOutOfStock ? 0.6 : 1,
      border: isOutOfStock
        ? "2px solid #ef4444"
        : "1px solid #ddd",
      padding: "12px",
      borderRadius: "10px"
    }}
  >
    <h4>{product.name}</h4>

    <p>
      Stock: {stock} | En carrito: {cartQty}
    </p>

    {isOutOfStock && (
      <div
        style={{
          background: "#ef4444",
          color: "white",
          padding: "4px 8px",
          borderRadius: "6px",
          marginBottom: "10px",
          display: "inline-block"
        }}
      >
        SIN STOCK
      </div>
    )}

    <button
      onClick={handleAdd}
      disabled={isOutOfStock || isMaxInCart}
    >
      {isOutOfStock
        ? "Sin stock"
        : isMaxInCart
        ? "Límite"
        : "Agregar"}
    </button>
  </div>
);
};

export default ProductCard;