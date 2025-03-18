import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";

export default function FavoriteMovies() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
  const [language, setLanguage] =  useState(() => {
    return localStorage.getItem("language") || "es";
  });

  // Obtener el userId del localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`https://proyecto1-ic6821.onrender.com/favorites/${userId}`);
        const json = await res.json();
        const movieIds = json.favoriteMovies || [];

        if (movieIds.length === 0) {
          setFavoriteMovies([]);
          setLoading(false);
          return;
        }

        const movieRequests = movieIds.map(id => 
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=${language}`, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
            }
          }).then(res => res.json())
        );

        const movieDetails = await Promise.all(movieRequests);
        setFavoriteMovies(movieDetails);
        
      } catch (error) {
        console.error("Error al obtener las películas favoritas:", error);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchFavorites();
  }, [userId, language]);

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
        toggleDarkMode={() => {
          const newDarkMode = !darkMode;
          setDarkMode(newDarkMode);
          localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
        }} 
        toggleLanguage={() => {
          const newLanguage = language === "es" ? "en" : "es";
          setLanguage(newLanguage);
          localStorage.setItem("language", newLanguage);
        }} 
        language={language} 
        darkMode={darkMode} 
        activeSection="my-movies" 
      />

      <h1>{language === "es" ? "Mis Películas Favoritas" : "My Favorite Movies"}</h1>

      {/* Mostrar mensaje de carga antes de verificar la lista de películas */}
      {loading ? (
        <p>{language === "es" ? "Cargando..." : "Loading..."}</p>
      ) : favoriteMovies.length === 0 ? (
        <p>{language === "es" ? "No tienes películas favoritas" : "You have no favorite movies"}</p>
      ) : (
        <MovieList movies={favoriteMovies} language={language} darkMode={darkMode} />
      )}
    </div>
  );
}
