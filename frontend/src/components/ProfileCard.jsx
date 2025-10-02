// src/components/ProfileCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 👈 Importar Link
import axiosInstance from "../api/axiosInstance";

export default function ProfileCard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/users/me/")
      .then((res) => setMe(res.data))
      .catch((err) => console.error("❌ Error /users/me:", err));
  }, []);

  if (!me) {
    return (
      <aside className="hidden md:block col-span-1 bg-white shadow rounded-xl p-4">
        <p className="text-sm text-gray-500">Cargando perfil…</p>
      </aside>
    );
  }

  const fullName = [me.name, me.last_name].filter(Boolean).join(" ");

  return (
    <aside className="hidden md:block col-span-1 bg-white shadow rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        {me.avatar ? (
          <img
            src={me.avatar}
            alt={fullName || me.email}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
            {me.name?.[0]?.toUpperCase() || me.email?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold">{fullName || me.email}</p>
          <p className="text-xs text-gray-500">{me.email}</p>
        </div>
      </div>

      {/* 👇 Enlace a edición de perfil */}
      <Link
        to="/user-info"
        className="block text-center mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
      >
        Editar perfil
      </Link>
    </aside>
  );
}
