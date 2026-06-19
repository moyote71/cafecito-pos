import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import POSPage from "../pages/pos/POSPage";
import ProductPage from "../pages/ProductPage";

import Customers from "../pages/Customers";
import Reports from "../pages/Reports";

import MainLayout from "../layouts/MainLayout";
import POSLayout from "../layouts/POSLayout";

import ProtectedRoute from "../routes/ProtectedRoute";

import CashClosing from "../pages/pos/sales/CashClosing";
import SalesHistory from "../pages/pos/sales/SalesHistory";

// =========================
// ADMIN ROUTE
// =========================
const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/pos" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* POS */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POSLayout>
              <POSPage />
            </POSLayout>
          </ProtectedRoute>
        }
      />

      {/* CAJA */}
      <Route
        path="/caja"
        element={
          <ProtectedRoute>
              <MainLayout>
                <CashClosing />
              </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* VENTAS */}
      <Route
        path="/ventas"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <MainLayout>
                <SalesHistory />
              </MainLayout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* PRODUCTOS */}
      <Route
        path="/productos"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <MainLayout>
                <ProductPage />
              </MainLayout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* CLIENTES REAL */}
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* REPORTES REAL */}
      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>404 - Página no encontrada</div>} />

    </Routes>
  );
};

export default AppRoutes;