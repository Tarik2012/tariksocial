import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ children }) {
  const isAuthed =
    !!localStorage.getItem("accessToken") ||
    !!localStorage.getItem("refreshToken");

  // Si ya hay sesión → redirigir a Home
  if (isAuthed) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}
