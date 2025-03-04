import React from "react";
import { useNavigate } from "react-router-dom";

export default function MovieList({ movies, language, darkMode }) {
  const navigate = useNavigate(); // Hook para la navegación

  if (movies === null) return null; // No mostrar nada antes de la primera búsqueda

  return (
    <div style={{ 
      marginTop: "20px", 
      width: "90%", 
      display: "flex", 
      flexWrap: "wrap", 
      justifyContent: "center", 
      gap: "30px", 
      backgroundColor: darkMode ? "#1a1a1a" : "#f3f4f6", 
      padding: "10px", 
      borderRadius: "10px" 
    }}>
      {movies.length === 0 ? (
        <p style={{ color: darkMode ? "white" : "black" }}>
          {language === "es" ? "No hay resultados" : "No results found"}
        </p>
      ) : (
        movies.map((movie) => (
          <div 
            key={movie.id} 
            onClick={() => navigate(`/movie?id=${movie.id}`)} // Redirección al hacer clic
            style={{ 
              width: "200px", 
              backgroundColor: darkMode ? "#444" : "#fff", 
              padding: "10px", 
              borderRadius: "5px", 
              textAlign: "center",
              cursor: "pointer", //  Indica que es interactivo
              transition: "transform 0.3s ease, box-shadow 0.3s ease", 
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)"; 
              e.currentTarget.style.boxShadow = "0px 6px 15px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"; 
              e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : "https://i.ibb.co/jvCxyMkq/poster-not-available.png"} 
              alt={movie.title} 
              style={{ width: "100%", borderRadius: "5px" }}
            />
            <h3 style={{ 
              fontSize: "16px", 
              marginTop: "10px", 
              color: darkMode ? "white" : "black",
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap",
            }}>
              {movie.title}
            </h3>
          </div>
        ))
      )}
    </div>
  );
}
