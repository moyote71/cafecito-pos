import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { getCustomers, createCustomer } from "../../services/customerService";
import { usePOS } from "../../context/POSContext";
import Loader from "../ui/Loader";
import "./CustomerSearch.css";

const CustomerSearch = () => {
  const { setCustomer } = usePOS();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");

  const debounced = useDebounce(searchTerm, 300);

  // =========================
  // SEARCH (debounced)
  // =========================
  useEffect(() => {
    if (!debounced || debounced.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    searchCustomers(debounced);
  }, [debounced]);

  // =========================
  // LOAD INIT (solo una vez FIXED)
  // =========================
  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================
  // LOAD ALL
  // =========================
  const loadCustomers = async () => {
    setLoading(true);

    try {
      const list = await getCustomers("");
        setResults(list); // ❌ estabas duplicando setResults
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const searchCustomers = async (q) => {
    setLoading(true);

    try {
      const list = await getCustomers(q);
      setResults(list);

      setShowDropdown(true);
    } catch (err) {
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SELECT CUSTOMER (POS CORE)
  // =========================
  const selectCustomer = (c) => {
    setSelectedCustomer(c);
    setCustomer(c); // 🔥 POS GLOBAL LINK

    setSearchTerm("");
    setResults([]);
    setShowDropdown(false);
  };

  // =========================
  // CREATE CUSTOMER
  // =========================
  const create = async (e) => {
    e.preventDefault();

    try {
      const created = await createCustomer({
        name: newName,
        phoneOrEmail: newContact,
      }); 

      selectCustomer(created);

      setShowAddModal(false);
      setNewName("");
      setNewContact("");
    } catch (err) {
      console.error(err);
      alert("Error creando cliente");
    }
  };

  return (
    <div className="pos-customer-search">

      {selectedCustomer ? (
        <div className="selected-customer-card">
          <strong>{selectedCustomer.name}</strong>
          <p>{selectedCustomer.phoneOrEmail}</p>

          <button
            onClick={() => {
              setSelectedCustomer(null);
              setCustomer(null);
            }}
          >
            Quitar
          </button>
        </div>
      ) : (
        <div className="search-wrapper">
          <input
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => results.length && setShowDropdown(true)}
          />

          <button type="button" onClick={() => setShowAddModal(true)}>
            ➕
          </button>

          {showDropdown && (
            <div className="dropdown">
              {loading ? (
                <Loader size="small" />
              ) : results.length === 0 ? (
                <p>Sin resultados</p>
              ) : (
                results.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => selectCustomer(c)}
                    className="dropdown-item"
                  >
                    <strong>{c.name}</strong>
                    <small>{c.phoneOrEmail}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={create}>
              <h3>Nuevo cliente</h3>

              <input
                placeholder="Nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <input
                placeholder="Email o teléfono"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />

              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;