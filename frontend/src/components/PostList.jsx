// src/components/PostList.jsx
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

function PostList({ newPost }) {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const { user } = useContext(AuthContext);

  // 🔹 Estado para edición
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);

  // 🔹 Estado para eliminar
  const [deletingPost, setDeletingPost] = useState(null);

  // 🔹 Cargar posts
  useEffect(() => {
    axiosInstance
      .get("/posts/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("❌ Error al cargar publicaciones:", err));
  }, []);

  // 🔹 Añadir nuevo post dinámicamente
  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  // 🔹 Expandir/colapsar contenido largo
  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // 🗑️ Confirmar eliminación
  const confirmDelete = async () => {
    if (!deletingPost) return;

    try {
      await axiosInstance.delete(`/posts/${deletingPost.id}/`);
      setPosts((prev) => prev.filter((post) => post.id !== deletingPost.id));
      setDeletingPost(null); // cerrar modal
      console.log("✅ Post eliminado:", deletingPost.id);
    } catch (err) {
      console.error("❌ Error al eliminar el post:", err);
    }
  };

  // ✏️ Abrir modal de edición
  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditImage(null);
  };

  // 💾 Guardar cambios de edición
  const handleUpdate = async () => {
    if (!editingPost) return;

    const formData = new FormData();
    formData.append("content", editContent);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const res = await axiosInstance.patch(
        `/posts/${editingPost.id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? res.data : p))
      );

      setEditingPost(null); // cerrar modal
      console.log("✅ Post actualizado:", res.data);
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
    }
  };

  // 👍 Dar o quitar like
  const handleLike = async (postId) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/like/`);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes_count: res.data.likes_count,
                is_liked: res.data.liked,
              }
            : p
        )
      );
    } catch (err) {
      console.error("❌ Error al dar like:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPosts[post.id];
        const shouldTruncate = post.content.length > 100;

        return (
          <div
            key={post.id}
            className="bg-white shadow rounded-xl p-4 border border-gray-200"
          >
            {/* Cabecera con autor + fecha */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {post.author?.avatar_url && (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                )}
                <p className="font-semibold text-gray-800">
                  {post.author
                    ? `${post.author.name} ${post.author.last_name}`
                    : "Anónimo"}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>

            {/* Contenido con “ver más” */}
            <p className="text-gray-700 mb-2">
              {isExpanded || !shouldTruncate
                ? post.content
                : post.content.slice(0, 100) + "..."}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => toggleExpand(post.id)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {isExpanded ? "Ver menos" : "Ver más"}
              </button>
            )}

            {/* Imagen */}
            {post.image && (
              <div className="relative w-full sm:w-4/5 aspect-video mt-2 mx-auto">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            {/* 👍 Likes */}
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => handleLike(post.id)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  post.is_liked
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                👍 {post.is_liked ? "Te gusta" : "Like"}
              </button>
              <span className="text-gray-600 text-sm">
                {post.likes_count} likes
              </span>
            </div>

            {/* Botones de edición/eliminación solo si es el autor */}
            {user?.id === post.author?.id && (
              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => handleEditClick(post)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeletingPost(post)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal edición */}
      {editingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ✏️ Editar publicación
            </h2>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Escribe algo..."
            />

            {editingPost.image && !editImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Imagen actual:</p>
                <img
                  src={editingPost.image}
                  alt="Post"
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
              </div>
            )}

            {editImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Nueva imagen:</p>
                <img
                  src={URL.createObjectURL(editImage)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
              </div>
            )}

            <label className="block mb-4">
              <span className="text-sm text-gray-600">Cambiar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {deletingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ⚠️ Eliminar publicación
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta publicación? Esta
              acción <span className="font-semibold">no se puede deshacer</span>
              .
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingPost(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:from-red-600 hover:to-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostList;
