import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleButton from "./components/GoogleButton";
import SearchView from "./SearchView";
import MovieDetailView from "./MovieDetailView";
import FavoriteMovies from "./FavoriteMovies";
import RecommendedMovies from "./RecommendedMovies";

const CLIENT_ID = "953538209212-2altfrvcjc8fm8o0lpotraqadg742g60.apps.googleusercontent.com";

function LoginPage({ darkMode, language, toggleDarkMode, toggleLanguage, setUserId }) {
  const navigate = useNavigate();
  localStorage.removeItem("userId"); //Limpiar el ID del usuario.

  const handleUserAuth = async (userId, name) => {
    try {
      const res = await fetch("https://proyecto1-ic6821.onrender.com/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleId: userId, name, favoriteMovies: [] })
      });
      const data = await res.json();
      console.log("🔹 Usuario autenticado o creado:", data);
    } catch (error) {
      console.error("❌ Error al autenticar usuario:", error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: darkMode ? "#1a1a1a" : "#f3f4f6", position: "relative" }}>
      <div style={{ width: "420px", backgroundColor: darkMode ? "#333" : "#f9f9f9", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", textAlign: "center", paddingBottom: "20px" }}>
        
        {/* Encabezado celeste */}
        <div style={{ backgroundColor: "#00bfff", color: "white", padding: "15px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
          <h2>{language === "es" ? "Iniciar Sesión" : "Sign In"}</h2>
        </div>

        {/* Cuerpo con el botón de Google */}
        <div style={{ padding: "30px", display: "flex", justifyContent: "center" }}>
          <GoogleButton language={language} navigate={navigate} setUserId={async (id, name) => {
            setUserId(id);
            await handleUserAuth(id, name);
          }} />
        </div>
      </div>

      {/* Opciones en la esquina inferior derecha */}
      <div style={{ 
        position: "absolute", 
        bottom: "10px", 
        right: "10px", 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        gap: "10px" 
      }}>
        <button 
          onClick={toggleDarkMode} 
          style={{ 
            padding: "10px 20px", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer", 
            backgroundColor: darkMode ? "#666" : "#ddd",
            color: darkMode ? "white" : "black"
          }}>
          {darkMode 
            ? (language === "es" ? "☀️ Modo Claro" : "☀️ Light Mode") 
            : (language === "es" ? "🌙 Modo Oscuro" : "🌙 Dark Mode")
          }
        </button>
        <button 
          onClick={toggleLanguage} 
          style={{ 
            padding: "10px 20px", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer", 
            backgroundColor: darkMode ? "#666" : "#ddd",
            color: darkMode ? "white" : "black"
          }}
        >
          {language === "es" ? "Cambiar a Inglés" : "Switch to Spanish"}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "es";
  });

  const [userId, setUserId] = useState(null);

  /* Esto se repite, intentar cambiarlo más adelante */
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const handleToggleLanguage = () => {
    const newLanguage = language === "es" ? "en" : "es";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage darkMode={darkMode} language={language} toggleDarkMode={handleToggleDarkMode} toggleLanguage={handleToggleLanguage} setUserId={setUserId} />} />
          <Route path="/search-view" element={<SearchView userId={userId}/>} />
          <Route path="/movie" element={<MovieDetailView />} />
          <Route path="/favorites" element={<FavoriteMovies />} />
          <Route path="/recommended" element={<RecommendedMovies />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
