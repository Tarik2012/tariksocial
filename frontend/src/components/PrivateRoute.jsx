import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuthed =
    !!localStorage.getItem("refreshToken") ||
    !!localStorage.getItem("accessToken");

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}
