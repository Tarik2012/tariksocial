import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function NewPostForm({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onPostCreated) {
        onPostCreated(res.data);
      }

      // resetear formulario
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("❌ Error al crear publicación:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // 🔥 preview de la imagen
    } else {
      setPreview(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-4 border border-gray-200 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Crear publicación</h2>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-lg p-2"
        required
      />

      <textarea
        placeholder="¿Qué estás pensando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-lg p-2"
        rows="3"
        required
      />

      {/* 📷 campo de imagen */}
      <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 transition w-fit">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4-4 4 4m0 0l4-4 4 4M4 8h16"
          />
        </svg>
        <span className="text-sm font-medium">Añadir contenido</span>
      </label>

      {/* 🔥 preview con estilo LinkedIn */}
      {preview && (
        <div className="relative w-full aspect-video mt-2">
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}

export default NewPostForm;
