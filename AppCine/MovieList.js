import React from 'react';
import { FlatList, TouchableOpacity, Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function MovieList({ movies, moviesLoading, isDarkMode, onPressMovie }) {
  if (moviesLoading) {
    return <ActivityIndicator size="large" color="#888" />;
  }
  
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.imdbID}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPressMovie(item.imdbID)}
          style={[
            styles.movieItem,
            { backgroundColor: isDarkMode ? '#808080' : '#f9f9f9' },
          ]}
        >
          {item.Poster && item.Poster !== 'N/A' && (
            <Image source={{ uri: item.Poster }} style={styles.poster} />
          )}
          <View style={styles.movieInfo}>
            <Text style={[styles.movieTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              {item.Title}
            </Text>
            <Text style={[styles.movieYear, { color: isDarkMode ? '#fff' : '#666' }]}>
              {item.Year}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  movieItem: {
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  poster: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  movieInfo: {
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  movieYear: {
    fontSize: 14,
  },
});
