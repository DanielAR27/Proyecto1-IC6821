import React from 'react';
import { FlatList, TouchableOpacity, Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function MovieList({ movies, moviesLoading, isDarkMode, onPressMovie }) {
  if (moviesLoading) {
    return <ActivityIndicator size="large" color="#888" />;
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPressMovie(item.id)}
          style={[
            styles.movieItem,
            { backgroundColor: isDarkMode ? '#808080' : '#f9f9f9' },
          ]}
        >
          {item.poster_path && (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
          )}
          <View style={styles.movieInfo}>
            <Text style={[styles.movieTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              {item.title}
            </Text>
            <Text style={[styles.movieYear, { color: isDarkMode ? '#fff' : '#666' }]}>
              {item.release_date?.substring(0, 4)}
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
