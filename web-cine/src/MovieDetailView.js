import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function MovieDetailView() {
  const [movie, setMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");
  const [isFavorite, setIsFavorite] = useState(false);

  // Obtener ID de la película desde la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("id");

  const userId = localStorage.getItem("userId");

  console.log("User ID:", userId);
  console.log("Movie ID:", movieId);

  // Función para alternar modo oscuro
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  // Función para alternar idioma
  const handleToggleLanguage = () => {
    const newLanguage = language === "es" ? "en" : "es";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Obtener detalles de la película
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;

      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=${language}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
        }
      };

      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setMovie(json);
      } catch (error) {
        console.error("Error al obtener detalles de la película:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId, language]);

  // Verificar si la película está en favoritos
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!userId || !movieId) return;

      try {
        const res = await fetch(`http://localhost:5000/is-favorite?userId=${userId}&movieId=${movieId}`);
        const json = await res.json();
        setIsFavorite(json.isFavorite);
      } catch (error) {
        console.error("Error al verificar favoritos:", error);
      }
    };

    checkFavoriteStatus();
  }, [userId, movieId]);

  // Agregar o quitar de favoritos
  const handleFavoriteToggle = async () => {
    if (!userId) {
      alert(language === "es" ? "Debes iniciar sesión para agregar favoritos" : "You must log in to add favorites");
      return;
    }

    const url = `http://localhost:5000/${isFavorite ? "remove-favorite" : "add-favorite"}`;
    const method = isFavorite ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, movieId })
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Error al actualizar favoritos");
      }
    } catch (error) {
      console.error("Error en la solicitud de favoritos:", error);
    }
  };

  return (
    <div style={{ 
      textAlign: "center", 
      minHeight: "100vh", 
      backgroundColor: darkMode ? "#1a1a1a" : "#f3f4f6", 
      color: darkMode ? "white" : "black", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      paddingTop: "80px" 
    }}>
      <Navbar 
        toggleDarkMode={handleToggleDarkMode} 
        toggleLanguage={handleToggleLanguage} 
        language={language} 
        darkMode={darkMode} 
        activeSection="movie" 
      />

      {movie ? (
        <div style={{ width: "80%", maxWidth: "800px", textAlign: "center", marginTop: "20px" }}>
          <h1>{movie.title}</h1>
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://i.ibb.co/jvCxyMkq/poster-not-available.png"} 
            alt={movie.title} 
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <p style={{ marginTop: "20px", fontSize: "18px" }}>{movie.overview}</p>
          <p><strong>{language === "es" ? "Géneros" : "Genres"}:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
          <p><strong>{language === "es" ? "Fecha de lanzamiento" : "Release Date"}:</strong> {movie.release_date}</p>
          <p><strong>{language === "es" ? "Calificación" : "Rating"}:</strong> {movie.vote_average}</p>

          {/* Botón de favoritos fijo en la esquina inferior derecha */}
          <div 
            style={{ 
              position: "fixed", 
              bottom: "20px", 
              right: "20px", 
              zIndex: 1000 
            }}>
            <button 
              onClick={handleFavoriteToggle}
              style={{ 
                padding: "10px 20px", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer", 
                backgroundColor: isFavorite ? "#e74c3c" : "#2ecc71", 
                color: "white",
                fontSize: "16px"
              }}>
              {isFavorite ? "❌" : "➕"} {language === "es" ? (isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos") : (isFavorite ? "Remove from Favorites" : "Add to Favorites")}
            </button>
          </div>

        </div>
      ) : (
        <p>{language === "es" ? "Cargando información de la película..." : "Loading movie details..."}</p>
      )}
    </div>
  );
}
