import React, { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/product";
import Loader from "../components/ui/Loader";
import useProductRefresh from "../hooks/useProductRefresh";
import "./Products.css";

const safeNumber = (value) => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (query = "") => {
    setLoading(true);

    try {
      const res = await getProducts(query);
      const list = res?.data?.products || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts("");
  }, [fetchProducts]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchProducts(value);
  };

  useProductRefresh(() => {
    fetchProducts(search);
  });

  return (
    <div className="products-page">

      <div className="products-actions">
        <input
          className="input"
          placeholder="Buscar producto..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="products-loading">
          <Loader size="large" />
        </div>
      ) : products.length === 0 ? (
        <div className="card">
          No hay productos registrados.
        </div>
      ) : (
        <div className="products-list-container">

          <table className="products-table">

            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id}>

                  <td>
                    <strong className="product-table-name">
                      {p.name}
                    </strong>
                  </td>

                  <td>
                    <span className="product-table-price">
                      ${safeNumber(p.price).toFixed(2)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`product-table-stock ${
                        safeNumber(p.stock) <= 5 ? "low" : "ok"
                      }`}
                    >
                      {safeNumber(p.stock)}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
};

export default Products;