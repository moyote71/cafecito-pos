import React, { useState, useEffect } from "react";
import {
  getCustomers,
  createCustomer,
  deleteCustomer
} from "../services/customerService";

import Loader from "../components/ui/Loader";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCustomers("");
  }, []);

  const fetchCustomers = async (q = "") => {
    setLoading(true);

    try {
      const list = await getCustomers(q);
      setCustomers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchCustomers(value);
  };

  const create = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await createCustomer({
        name,
        phoneOrEmail,
      });

      setSuccess("Cliente creado");

      setName("");
      setPhoneOrEmail("");

      fetchCustomers(search);

      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      setError(err?.message || "Error al crear cliente");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Eliminar este cliente?");
    if (!confirm) return;

    try {
      await deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cliente");
    }
  };

  return (
    <div className="customers-page">

      <div className="customers-actions">
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Buscar..."
        />

        <button onClick={() => setShowModal(true)}>
          Nuevo
        </button>
      </div>

      {loading ? (
        <Loader size="large" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Compras</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Sin clientes
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phoneOrEmail}</td>
                  <td>{c.purchasesCount ?? 0}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{ color: "red" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal">
          <form onSubmit={create}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
            />

            <input
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="Email o teléfono"
            />

            <button type="submit">Guardar</button>

            <button type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Customers;