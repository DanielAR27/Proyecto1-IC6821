import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";

export default function RecommendedMovies() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "es");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        let moviesToShow = [];

        if (userId) {
          const userFavoritesRes = await fetch(`http://localhost:5000/favorites/${userId}`);
          const userFavoritesJson = await userFavoritesRes.json();
          const favoriteMovieIds = userFavoritesJson.favoriteMovies || [];

          if (favoriteMovieIds.length > 0) {
            const recommendations = await Promise.all(
              favoriteMovieIds.map(async (movieId) => {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=${language}`, {
                  headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
                  }
                });
                const json = await res.json();
                return json.results || [];
              })
            );

            const allRecommendedMovies = recommendations.flat();
            const uniqueMovies = Array.from(new Map(allRecommendedMovies.map(movie => [movie.id, movie])).values());
            moviesToShow = uniqueMovies.sort((a, b) => b.popularity - a.popularity).slice(0, 20);
          }
        }

        if (moviesToShow.length === 0) {
          const popularRes = await fetch(`https://api.themoviedb.org/3/movie/popular?language=${language}`, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
            }
          });
          const popularJson = await popularRes.json();
          moviesToShow = popularJson.results || [];
        }

        setRecommendedMovies(moviesToShow);
      } catch (error) {
        console.error("Error al obtener películas recomendadas:", error);
      }
    };

    fetchRecommendedMovies();
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
        activeSection="recommended" 
      />

      <h1>{language === "es" ? "Películas Recomendadas" : "Recommended Movies"}</h1>

      {recommendedMovies.length === 0 ? (
        <p>{language === "es" ? "No hay recomendaciones disponibles" : "No recommendations available"}</p>
      ) : (
        <MovieList movies={recommendedMovies} language={language} darkMode={darkMode} />
      )}
    </div>
  );
}
