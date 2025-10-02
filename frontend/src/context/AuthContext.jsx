// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Función para obtener el perfil del usuario (/users/me/)
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/users/me/");
      setUser(res.data);
      console.log("✅ Perfil cargado:", res.data);
    } catch (err) {
      console.error("❌ Error al obtener el perfil:", err);
      setUser(null);
    }
  };

  // 🔐 Función login completa (tokens + perfil)
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      setIsAuthenticated(true);
      await fetchUser();
    } catch (err) {
      console.error("❌ Error en login:", err);
      throw err;
    }
  };

  // ✨ Nueva función para actualizar perfil
  const updateUser = async (formData) => {
    try {
      const res = await axiosInstance.patch("/users/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // necesario para avatar
        },
      });

      setUser(res.data); // ✅ refresca el usuario en contexto
      console.log("✅ Perfil actualizado:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err);
      throw err;
    }
  };

  // 🔓 Logout y limpieza de estado
  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await axiosInstance.post("/logout/", { refresh: refreshToken });
      } catch (err) {
        console.error("❌ Error al hacer logout:", err);
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  // ✅ Al montar, revisar si hay token y cargar perfil
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      fetchUser();
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser, // 👈 ahora disponible en toda la app
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 👇 Custom hook para consumir el contexto sin repetir código
export const useAuth = () => {
  return useContext(AuthContext);
};
