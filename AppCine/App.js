import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
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
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      setMoviesLoading(false);
      setSearchError(
        language === 'es'
          ? "Ingrese un término de búsqueda"
          : "Enter a search term"
      );
      return;
    }
    setMoviesLoading(true);
    setSearchError('');
    fetch(
      `https://www.omdbapi.com/?apikey=a073feea&s=${encodeURIComponent(
        searchQuery
      )}&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === 'True') {
          setMovies(data.Search);
          setTotalResults(parseInt(data.totalResults, 10));
        } else {
          setSearchError(
            data.Error === "Too many results."
              ? language === 'es'
                ? "Hay muchas coincidencias, sea específico en su búsqueda"
                : "Too many results, be specific in your search"
              : data.Error
          );
          setMovies([]);
          setTotalResults(0);
        }
        setMoviesLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSearchError(
          language === 'es'
            ? "Error al conectar con la API"
            : "Error connecting to the API"
        );
        setMoviesLoading(false);
      });
  };

  // Función para obtener detalles de una película
  const fetchMovieDetails = (imdbID) => {
    setMovieDetailLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=a073feea&i=${imdbID}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === 'True') {
          setSelectedMovie(data);
        } else {
          Alert.alert("Error", data.Error);
        }
        setMovieDetailLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "Error al conectar con la API");
        setMovieDetailLoading(false);
      });
  };

  // Se llama a la búsqueda al cambiar la página
  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError(
        language === 'es'
          ? "Ingrese un término de búsqueda"
          : "Enter a search term"
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
