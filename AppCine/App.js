import React, { useState, useEffect } from 'react';
import { TMDB_API_KEY } from './config'; // Ajusta el path si lo pusiste en otra carpeta
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert
} from 'react-native';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail';

export default function App() {
  // Estados de la interfaz
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [themePopupVisible, setThemePopupVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  

  // Estados para búsqueda y paginación
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchError, setSearchError] = useState('');

  // Estado para la película seleccionada (detalles)
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetailLoading, setMovieDetailLoading] = useState(false);

  // Función para obtener películas (lista)
  const fetchMovies = () => {
    setMoviesLoading(true);
    setSearchError('');
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', currentPage);
    queryParams.append('language', language === 'es' ? 'es-ES' : 'en-US');
    
    let url = '';
    const useSearch = searchQuery.trim() !== '';
  
    if (useSearch) {
      // Buscar por título (y filtrar lo demás manualmente)
      queryParams.append('query', searchQuery.trim());
      url = `https://api.themoviedb.org/3/search/movie?${queryParams.toString()}`;
    } else {
      // Sin título: se pueden aplicar todos los filtros directo
      if (genre) queryParams.append('with_genres', genre);
      if (year) queryParams.append('primary_release_year', year);
      if (rating) queryParams.append('vote_average.gte', rating);
      url = `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`;
    }
  
    fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          let filteredResults = data.results;
  
          // Si se usó `search/movie`, hay que filtrar a mano
          if (useSearch) {
            if (genre) {
              filteredResults = filteredResults.filter((movie) =>
                movie.genre_ids.includes(parseInt(genre))
              );
            }
            if (year) {
              filteredResults = filteredResults.filter((movie) =>
                movie.release_date && movie.release_date.startsWith(year)
              );
            }
            if (rating) {
              filteredResults = filteredResults.filter((movie) =>
                movie.vote_average >= parseFloat(rating)
              );
            }
          }
  
          if (filteredResults.length > 0) {
            setMovies(filteredResults);
            setTotalResults(filteredResults.length);
          } else {
            setSearchError(language === 'es'
              ? 'No se encontraron resultados con esos filtros'
              : 'No results found with those filters');
            setMovies([]);
            setTotalResults(0);
          }
        } else {
          setSearchError(language === 'es'
            ? 'No se encontraron resultados'
            : 'No results found');
          setMovies([]);
          setTotalResults(0);
        }
        setMoviesLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSearchError(language === 'es'
          ? 'Error al conectar con la API'
          : 'Error connecting to the API');
        setMoviesLoading(false);
      });
  };
    
  // Función para obtener detalles de una película
  const fetchMovieDetails = (movieId) => {
    setMovieDetailLoading(true);
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=${language === 'es' ? 'es-ES' : 'en-US'}`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedMovie(data);
        setMovieDetailLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", language === 'es' ? "Error al conectar con la API" : "Error connecting to the API");
        setMovieDetailLoading(false);
      });
  };
  

  // Se llama a la búsqueda al cambiar la página
  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  // Se llama a la búsqueda a cambiar el idioma
  useEffect(() => {
    fetchMovies();
  }, [language]);
  
  // Se llama a la búsqueda a cambiar el idioma si está mostrando la info de
  // una película en específico
  useEffect(() => {
    if (selectedMovie) {
      fetchMovieDetails(selectedMovie.id); 
    }
  }, [language]);
  
  const handleSearch = () => {
    // Solo mostrar error si no se ingresó NINGÚN filtro
    if (!searchQuery.trim() && !genre && !year && !rating) {
      setSearchError(
        language === 'es'
          ? "Ingrese al menos un filtro de búsqueda"
          : "Enter at least one search filter"
      );
      return;
    }
  
    setCurrentPage(1);
    fetchMovies();
  };
  

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setThemePopupVisible(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
    setThemePopupVisible(false);
  };

  // Si hay una película seleccionada, se muestra la vista de detalles
// Dentro de App.js, en la rama cuando hay una película seleccionada:
if (selectedMovie) {
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Navbar
        title="Cinema App"
        isDarkMode={isDarkMode}
        onTitlePress={() => setSideMenuVisible(true)}
        onMenuPress={() => setThemePopupVisible(true)}
      />
      <MovieDetail
        movie={selectedMovie}
        isDarkMode={isDarkMode}
        language={language}
        onBack={() => setSelectedMovie(null)}
      />

      {/* Mismos overlays disponibles en la vista principal */}
      {sideMenuVisible && (
        <View style={styles.overlayContainer}>
          <View style={styles.sideMenu}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Cinema App</Text>
            </View>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>
                {language === 'es' ? 'OPCIÓN #1' : 'OPTION #1'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>
                {language === 'es' ? 'OPCIÓN #2' : 'OPTION #2'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={() => setSideMenuVisible(false)}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>
        </View>
      )}
      {themePopupVisible && (
        <TouchableWithoutFeedback onPress={() => setThemePopupVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.popupMenu}>
              <TouchableOpacity onPress={toggleDarkMode} style={styles.popupMenuItem}>
                <Text style={styles.popupMenuItemText}>
                  {isDarkMode
                    ? language === 'es'
                      ? 'Modo Claro ☀️'
                      : 'Light Mode ☀️'
                    : language === 'es'
                    ? 'Modo Oscuro 🌙'
                    : 'Dark Mode 🌙'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleLanguage} style={styles.popupMenuItem}>
                <Text style={styles.popupMenuItemText}>
                  {language === 'es' ? 'English' : 'Español'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

  // Vista principal con lista de películas y buscador
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Navbar
        title="Cinema App"
        isDarkMode={isDarkMode}
        onTitlePress={() => setSideMenuVisible(true)}
        onMenuPress={() => setThemePopupVisible(true)}
      />
      <View style={styles.content}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isDarkMode={isDarkMode}
          language={language}
          genre={genre}
          setGenre={setGenre}
          year={year}
          setYear={setYear}
          rating={rating}
          setRating={setRating}
        />
        {searchError ? (
          <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>
            {searchError}
          </Text>
        ) : null}
        <MovieList
          movies={movies}
          moviesLoading={moviesLoading}
          isDarkMode={isDarkMode}
          onPressMovie={fetchMovieDetails}
        />
        <View
          style={[
            styles.paginationContainer,
            { justifyContent: currentPage === 1 ? 'flex-end' : 'space-between' },
          ]}
        >
          {currentPage > 1 && (
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => setCurrentPage(currentPage - 1)}
            >
              <Text style={styles.paginationButtonText}>
                {language === 'es' ? 'Anterior' : 'Previous'}
              </Text>
            </TouchableOpacity>
          )}
          {currentPage * 10 < totalResults && (
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => setCurrentPage(currentPage + 1)}
            >
              <Text style={styles.paginationButtonText}>
                {language === 'es' ? 'Siguiente' : 'Next'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Menú lateral */}
      {sideMenuVisible && (
        <View style={styles.overlayContainer}>
          <View style={styles.sideMenu}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Cinema App</Text>
            </View>
            <View style={styles.separator} />
          </View>
          <TouchableWithoutFeedback onPress={() => setSideMenuVisible(false)}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>
        </View>
      )}

      {/* Popup de tema e idioma */}
      {themePopupVisible && (
        <TouchableWithoutFeedback onPress={() => setThemePopupVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.popupMenu}>
              <TouchableOpacity onPress={toggleDarkMode} style={styles.popupMenuItem}>
                <Text style={styles.popupMenuItemText}>
                  {isDarkMode
                    ? language === 'es'
                      ? 'Modo Claro ☀️'
                      : 'Light Mode ☀️'
                    : language === 'es'
                    ? 'Modo Oscuro 🌙'
                    : 'Dark Mode 🌙'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleLanguage} style={styles.popupMenuItem}>
                <Text style={styles.popupMenuItemText}>
                  {language === 'es' ? 'English' : 'Español'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 10 },
  errorText: { textAlign: 'center', marginBottom: 10 },
  paginationContainer: { flexDirection: 'row', marginTop: 10 },
  paginationButton: {
    backgroundColor: '#ADD8E6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  paginationButtonText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  sideMenu: {
    width: 250,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 20,
  },
  profileHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  profileTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },
  menuItem: { paddingVertical: 10, marginTop: 10 },
  menuItemText: { fontSize: 16, color: '#000' },
  overlayBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  popupMenu: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  popupMenuItem: { paddingVertical: 5 },
  popupMenuItemText: { fontSize: 16, color: '#000' },
});
