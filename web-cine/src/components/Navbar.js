import React, { useState, useEffect } from "react";

export default function Navbar({ toggleDarkMode, toggleLanguage, language, darkMode, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "15px 20px", 
      backgroundColor: "#ADD8E6", 
      color: "white", 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      zIndex: 1000
    }}>
      {/* Título de la App */}
      <h2 style={{ margin: 0, fontWeight: "bold", color: "black" }}>🎬 Cinema App</h2>
      
      {/* Navegación */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <button style={{ 
          background: activeSection === "search" ? "#81a5b8" : "none", 
          border: "none", 
          color: activeSection === "search" ? "white" : "black", 
          fontSize: "16px", 
          cursor: "pointer", 
          padding: "8px 12px", 
          borderRadius: "5px", 
          transition: "background 0.3s ease, color 0.3s ease", 
          fontWeight: "bold",
          outline: "none"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = activeSection === "search" ? "#81a5b8" : (darkMode ? "#777" : "#ddd")}
        onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === "search" ? "#81a5b8" : "transparent"}
        >
          {language === "es" ? "Buscar películas" : "Search Movies"}
        </button>

        <button style={{ 
          background: activeSection === "my-movies" ? "81a5b8" : "none", 
          border: "none", 
          color: activeSection === "my-movies" ? "white" : "black", 
          fontSize: "16px", 
          cursor: "pointer", 
          padding: "8px 12px", 
          borderRadius: "5px", 
          transition: "background 0.3s ease, color 0.3s ease", 
          fontWeight: "bold",
          outline: "none"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = activeSection === "my-movies" ? "#81a5b8" : (darkMode ? "#777" : "#ddd")}
        onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === "my-movies" ? "#81a5b8" : "transparent"}
        >
          {language === "es" ? "Ver mis películas" : "My Movies"}
        </button>
        
        {/* Botón del menú ⋮ */}
        <div className="menu-container" style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "black", 
              fontSize: "24px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginRight: "30px"
            }}
          >
            &#8942;
          </button>
  
          {/* Menú desplegable */}
          {menuOpen && (
            <div style={{ 
              position: "absolute", 
              right: 0, 
              top: "46px",
              background: darkMode ? "#555" : "white",
              color: darkMode ? "white" : "black", 
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)", 
              borderRadius: "5px", 
              overflow: "hidden", 
              minWidth: "150px"
            }}>
              <button onClick={() => { toggleLanguage(); setMenuOpen(false); }} 
                style={{ 
                  display: "block", 
                  width: "100%", 
                  padding: "10px 15px", 
                  border: "none", 
                  background: "none", 
                  cursor: "pointer", 
                  textAlign: "left", 
                  color: darkMode ? "white" : "black"
                }}>
                {language === "es" ? "Cambiar a Inglés" : "Switch to Spanish"}
              </button>
              <button onClick={() => { toggleDarkMode(); setMenuOpen(false); }} 
                style={{ 
                  display: "block", 
                  width: "100%", 
                  padding: "10px 15px", 
                  border: "none", 
                  background: "none", 
                  cursor: "pointer", 
                  textAlign: "left", 
                  color: darkMode ? "white" : "black"
                }}>
                  {darkMode 
                    ? (language === "es" ? "☀️ Modo Claro" : "☀️ Light Mode") 
                    : (language === "es" ? "🌙 Modo Oscuro" : "🌙 Dark Mode")
                  }
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
