import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";

function SearchView({ userId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");

  // Obtener userId de localStorage si no se pasa como prop
  const storedUserId = userId || localStorage.getItem("userId");

  // Guardar userId en localStorage solo si viene de props y no está guardado aún
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  // Guardar darkMode y language cuando cambian
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("language", language);
  }, [darkMode, language]);

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

  const handleSearch = async (newPage = 1) => {
    if (!searchQuery.trim()) return;

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&include_adult=false&language=en-US&page=${newPage}`;
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
      setMovies(json.results || []);
      setPage(newPage);
      setTotalPages(json.total_pages);
    } catch (error) {
      console.error("Error al buscar películas:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
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
        activeSection="search" 
      />
      
      <h1>{language === "es" ? "Buscar Películas" : "Search Movies"}</h1>
      
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <input 
          type="text" 
          placeholder={language === "es" ? "Ingrese el nombre de la película" : "Enter movie name"} 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "250px", fontSize: "16px" }}
        />
        <button 
          onClick={() => handleSearch(1)} 
          style={{ padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#81a5b8", color: "white", cursor: "pointer", fontSize: "16px" }}>
          {language === "es" ? "Buscar" : "Search"}
        </button>
      </div>
      
      {movies !== null && <MovieList movies={movies} language={language} darkMode={darkMode} />}
      
      {/* Botones de paginación */}
      {movies && movies.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", width: "60%", marginTop: "20px" }}>
          <div style={{ flex: 1, textAlign: "left" }}>
            {page > 1 && (
              <button 
                onClick={() => handleSearch(page - 1)} 
                style={{ padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#81a5b8", color: "white", cursor: "pointer", fontSize: "16px" }}>
                {language === "es" ? "Anterior" : "Previous"}
              </button>
            )}
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            {page < totalPages && (
              <button 
                onClick={() => handleSearch(page + 1)} 
                style={{ padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#81a5b8", color: "white", cursor: "pointer", fontSize: "16px" }}>
                {language === "es" ? "Siguiente" : "Next"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchView;
