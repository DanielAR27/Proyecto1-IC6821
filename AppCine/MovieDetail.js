import React from 'react';
import { ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MovieDetail({ movie, isDarkMode, onBack, language }) {
  return (
    <ScrollView style={[styles.detailContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      {movie.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.detailPoster}
        />
      )}
      <Text style={[styles.detailTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
        {movie.title}
      </Text>
      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>
        {movie.overview}
      </Text>
      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>
        {language === 'es' ? 'Fecha de estreno:' : 'Release Date:'} {movie.release_date}
      </Text>
      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>
        {language === 'es' ? 'Puntuación:' : 'Rating:'} {movie.vote_average}
      </Text>

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
