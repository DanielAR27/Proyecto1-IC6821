import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";

function SearchView({ userId }) {
  console.log(" SearchView.js está renderizando");

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "es");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("language", language);
  }, [darkMode, language]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
    localStorage.setItem("language", language === "es" ? "en" : "es");
  };

  const handleSearch = async (newPage = 1) => {
    if (!searchQuery.trim() && !genre && !year && !rating) return;

    console.log(" handleSearch() se ejecutó con los siguientes filtros:");
    console.log(" Título:", searchQuery);
    console.log(" Género:", genre);
    console.log(" Año:", year);
    console.log(" Rating mínimo:", rating);
    console.log(" Página:", newPage);

    let url = "";
    let options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
        }
    };

    try {
        let movies = [];
        let total_pages = 1;

        if (searchQuery.trim()) {
            // Buscar por título primero
            url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&include_adult=false&language=en-US&page=${newPage}`;
            console.log(" URL generada para búsqueda por título:", url);

            let res = await fetch(url, options);
            let json = await res.json();
            movies = json.results || [];
            total_pages = json.total_pages || 1; 
        }

        // Aplicar filtros manualmente sobre los resultados obtenidos
        if (movies.length > 0) {
            console.log(" Películas encontradas antes de filtrar:", movies.length);
            movies = movies.filter(movie => {
                return (!genre || movie.genre_ids.includes(parseInt(genre))) &&
                       (!year || movie.release_date?.startsWith(year)) &&
                       (!rating || movie.vote_average >= rating);
            });
            console.log(" Películas después de aplicar filtros:", movies.length);
        } else {
            // Si no hay resultados por título, buscar solo usando discover/movie con filtros
            url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${newPage}`;
            if (genre) url += `&with_genres=${encodeURIComponent(genre)}`;
            if (year) url += `&primary_release_year=${year}`;
            if (rating) url += `&vote_average.gte=${rating}`;

            console.log(" URL generada para búsqueda por filtros:", url);
            let res = await fetch(url, options);
            let json = await res.json();
            movies = json.results || [];
            total_pages = json.total_pages || 1;
        }

        setMovies(movies);
        setPage(newPage);
        setTotalPages(total_pages); 
    } catch (error) {
        console.error(" Error al buscar películas:", error);
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

      {/* Input de búsqueda y filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
        <input
          type="text"
          placeholder={language === "es" ? "Ingrese el nombre de la película" : "Enter movie name"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "200px" }}
        />

        {/* Filtro de género */}
        <select onChange={(e) => setGenre(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
          <option value="">{language === "es" ? "Género" : "Genre"}</option>
          <option value="28">Acción</option>
          <option value="35">Comedia</option>
          <option value="18">Drama</option>
          <option value="27">Terror</option>
          <option value="878">Ciencia Ficción</option>
        </select>

        {/* Filtro de año */}
        <input type="number" placeholder="Año" onChange={(e) => setYear(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100px" }} />

        {/* Filtro de rating */}
        <input type="number" step="0.1" min="0" max="10" placeholder="IMDB Min" onChange={(e) => setRating(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100px" }} />

        <button
          onClick={() => {
            console.log("🖱 Se hizo click en el botón de búsqueda");
            handleSearch(1);
          }}
          style={{
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#81a5b8",
            color: "white",
            cursor: "pointer"
          }}>
          {language === "es" ? "Buscar" : "Search"}
        </button>

      </div>
      {/* Lista de películas */}
      {movies !== null && <MovieList movies={movies} language={language} darkMode={darkMode} />}

      
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
