import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { POSProvider } from "./context/POSContext";
import AppRoutes from "./routes/AppRoutes.jsx";
import { CashProvider } from "./context/CashContext";
import "./App.css";
import "./styles/app-layout.css"

function App() {
  return (
    <AuthProvider>
      <CashProvider>
        <POSProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </POSProvider>
      </CashProvider>
    </AuthProvider>
  );
}

export default App;