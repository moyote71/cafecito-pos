import React from "react";
import { usePOS } from "../../context/POSContext";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = usePOS();

  const { product, quantity } = item;

  const stock = product.stock ?? 0;

  const increment = () => {
    if (quantity >= stock) return;
    updateQuantity(product._id, quantity + 1);
  };

  const decrement = () => {
    if (quantity <= 1) return;
    updateQuantity(product._id, quantity - 1);
  };

  return (
    <div className="cart-item">
      <div>
        <h4>{product.name}</h4>
        <p>${product.price} x {quantity}</p>
      </div>

      <div>
        <button onClick={decrement}>-</button>
        <span>{quantity}</span>
        <button onClick={increment} disabled={quantity >= stock}>+</button>
      </div>

      <button onClick={() => removeFromCart(product._id)}>🗑</button>
    </div>
  );
};

export default CartItem;