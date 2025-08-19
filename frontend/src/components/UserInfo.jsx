// src/components/UserInfo.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function UserInfo() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel del Usuario</h1>

      {user ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p>
            <strong>Nombre:</strong> {user.name || user.email}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* Puedes agregar más campos si los tienes */}
        </div>
      ) : (
        <p className="text-gray-500">Cargando usuario...</p>
      )}
    </div>
  );
}

export default UserInfo;
