import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfileEdit() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("last_name", lastName);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      await updateUser(formData);
      navigate("/user-info"); // ✅ ir directo al perfil sin alert
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err);
      setError("No se pudo actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {user?.avatar_url && (
          <div className="mb-3">
            <p className="font-medium">Avatar actual:</p>
            <img
              src={user.avatar_url}
              alt="Avatar actual"
              className="w-20 h-20 rounded-full border mt-2"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block font-medium">Nuevo Avatar</label>
          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default ProfileEdit;
