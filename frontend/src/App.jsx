import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import UserInfo from "./components/UserInfo";
import Login from "./components/Login";
import Register from "./pages/Register"; // ✅ importa tu nuevo componente
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />{" "}
          {/* ✅ nueva ruta */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
