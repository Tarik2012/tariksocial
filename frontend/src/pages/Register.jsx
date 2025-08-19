import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setMessage("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register/",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("📦 Usuario registrado:", response.data);
      setMessage("✅ Usuario registrado con éxito");

      // Redirigir al login después de registrarse
      setTimeout(() => {
        navigate("/login");
      }, 1000); // espera 1 segundo antes de redirigir
    } catch (error) {
      console.error(
        "❌ Error en el registro:",
        error.response?.data || error.message
      );
      setMessage("❌ Error al registrar el usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Crear cuenta</h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre completo"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password2"
        placeholder="Repetir contraseña"
        value={formData.password2}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Registrarse
      </button>

      {message && (
        <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
      )}
    </form>
  );
}

export default Register;
