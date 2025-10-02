// src/pages/Home.jsx
import React, { useState } from "react";
import NewPostForm from "../components/NewPostForm";
import PostList from "../components/PostList";
import ProfileCard from "../components/ProfileCard";

function Home() {
  const [newPost, setNewPost] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto p-4">
      <ProfileCard />
      <main className="col-span-2 space-y-6">
        <NewPostForm onPostCreated={(post) => setNewPost(post)} />
        <PostList newPost={newPost} />
      </main>
      <aside className="hidden md:block col-span-1 bg-white shadow rounded-xl p-4">
        <h2 className="font-bold text-lg mb-2">Noticias</h2>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>📢 Nueva versión de TariSocial 1.0</li>
          <li>🚀 Django 5.0 ya disponible</li>
          <li>💼 Tips para entrevistas técnicas</li>
          <li>💼 Tips para entrevistas técnicas</li>
        </ul>
      </aside>
    </div>
  );
}
export default Home;
