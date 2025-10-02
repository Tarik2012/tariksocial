// src/components/UserInfo.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function UserInfo() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel del Usuario</h1>

      {user ? (
        <div className="bg-gray-100 p-6 rounded shadow flex items-center gap-6">
          {/* Avatar */}
          <div>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-24 h-24 rounded-full border object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-500">
                Sin foto
              </div>
            )}
          </div>

          {/* Datos */}
          <div>
            <p>
              <strong>Nombre:</strong> {user.name || "-"}
            </p>
            <p>
              <strong>Apellido:</strong> {user.last_name || "-"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <Link
              to="/profile/edit"
              className="inline-block mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Cargando usuario...</p>
      )}
    </div>
  );
}

export default UserInfo;
