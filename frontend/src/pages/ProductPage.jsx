import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/ui/Loader";
import { unwrapProducts } from "../services/unwrapResponse";
import "./ProductPage.css";

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD
  // =========================
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      const list = unwrapProducts(res);
      setProducts(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // 🔄 REFRESH STOCK GLOBAL
  // =========================
  useEffect(() => {
    const handler = () => {
      loadProducts();
    };

    window.addEventListener("products:update", handler);

    return () => {
      window.removeEventListener("products:update", handler);
    };
  }, []);

  // =========================
  // FORM HANDLERS
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // =========================
  // SAVE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      loadProducts();
    } catch (err) {
      setError("Error guardando producto");
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (p) => {
    setForm(p);
    setEditingId(p._id);
    setShowForm(true);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    await api.delete(`/products/${id}`);
    loadProducts();
  };

  // =========================
  // UI
  // =========================
  if (loading) return <Loader size="large" />;

  return (
    <div className="products-page">

      {/* HEADER */}
      <div className="products-header">

        <div>
          <h2>📦 Productos</h2>
          <p>Gestión de inventario y stock</p>
        </div>

        <div className="products-actions">

          <button
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            ⬅ Volver
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            + Nuevo producto
          </button>

        </div>

      </div>

      {/* MODAL */}
      {showForm && (
        <div className="products-modal">

          <div className="products-modal-content">

            <div className="modal-header">
              <h3>
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h3>

              <button onClick={resetForm}>✕</button>
            </div>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>

              <input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="price"
                type="number"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Descripción"
                value={form.description}
                onChange={handleChange}
              />

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

      {/* TABLE */}
      <div className="products-table">

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(products) && products.map((p) => (
              <tr key={p._id}>

                <td>
                  <strong>{p.name}</strong>
                  <div className="muted">{p.description}</div>
                </td>

                <td>${p.price}</td>

                {/* 🔥 FIX VISUAL STOCK */}
                <td>
                  <span
                    style={{
                      color:
                        p.stock <= 0
                          ? "#ef4444"
                          : p.stock <= 5
                          ? "#f59e0b"
                          : "inherit",
                      fontWeight: 700,
                    }}
                  >
                    {p.stock}
                    {p.stock <= 0 && " (Agotado)"}
                  </span>
                </td>

                <td className="actions">

                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Eliminar
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ProductsPage;