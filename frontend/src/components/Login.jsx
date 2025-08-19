// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // 🧭

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // 🧭 Hook de navegación

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password); // ✅ login completo
      navigate("/"); // 🧭 redirige al inicio
    } catch (error) {
      console.error(
        "❌ Error al iniciar sesión:",
        error.response?.data || error.message
      );
      alert("Error en el login. Revisa tus credenciales.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Iniciar sesión</h2>

      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 rounded p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="border border-gray-300 rounded p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>
    </form>
  );
}

export default Login;
