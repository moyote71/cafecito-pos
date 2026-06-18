import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // 🔥 SOLO redirige si user existe (sin lógica duplicada)
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/pos", { replace: true });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      const data = await login(email, password);

      const loggedUser = data?.user;

      if (!loggedUser) {
        throw new Error("Respuesta inválida del backend");
      }

      // 🔥 navegación inmediata (evita espera del useEffect)
      if (loggedUser.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/pos", { replace: true });
      }

    } catch (err) {
      setError(err?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass">

        <h1>Iniciar sesión</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? <Loader size="small" /> : "Entrar"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;