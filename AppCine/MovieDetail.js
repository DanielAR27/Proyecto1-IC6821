import React from 'react';
import { ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MovieDetail({ movie, isDarkMode, onBack, language }) {
  return (
    <ScrollView style={[styles.detailContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      {movie.Poster && movie.Poster !== 'N/A' && (
        <Image source={{ uri: movie.Poster }} style={styles.detailPoster} />
      )}
      <Text style={[styles.detailTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{movie.Title}</Text>
      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>{movie.Plot}</Text>
      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>
        {language === 'es' ? 'Año:' : 'Year:'} {movie.Year}
      </Text>
      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>
        {language === 'es' ? 'Género:' : 'Genre:'} {movie.Genre}
      </Text>
      {/* Puedes agregar más detalles según lo que devuelva la API */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{language === 'es' ? 'Volver' : 'Back'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    padding: 10,
  },
  detailPoster: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#ADD8E6',
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
