import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function MovieDetailView({ userId }) {
  const [movie, setMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");
  
  // Obtener ID de la película desde la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("id");

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
      <Navbar toggleDarkMode = {handleToggleDarkMode} toggleLanguage = {handleToggleLanguage} language={language} darkMode={darkMode} activeSection="movie" />

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
        </div>
      ) : (
        <p>{language === "es" ? "Cargando información de la película..." : "Loading movie details..."}</p>
      )}
    </div>
  );
}
