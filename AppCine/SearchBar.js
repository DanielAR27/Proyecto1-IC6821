import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isDarkMode,
  language,
  genre,
  setGenre,
  year,
  setYear,
  rating,
  setRating,
}) {
  return (
    <View style={styles.container}>
      {/* 🎬 Título */}
      <TextInput
        style={[
          styles.input,
          {
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#fff' : '#999',
          },
        ]}
        placeholder={language === 'es' ? "Título de la película" : "Movie title"}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 🎞️ Género */}
      <View style={[styles.pickerContainer, { borderColor: isDarkMode ? '#fff' : '#999' }]}>
        <Picker
          selectedValue={genre}
          onValueChange={setGenre}
          style={{ color: isDarkMode ? '#fff' : '#000' }}
          dropdownIconColor={isDarkMode ? '#fff' : '#000'}
        >
          <Picker.Item label={language === 'es' ? 'Género' : 'Genre'} value="" />
          <Picker.Item label="Acción" value="28" />
          <Picker.Item label="Comedia" value="35" />
          <Picker.Item label="Drama" value="18" />
          <Picker.Item label="Terror" value="27" />
          <Picker.Item label="Ciencia Ficción" value="878" />
        </Picker>
      </View>

      {/* 📅 Año */}
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Año" : "Year"}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />

      {/* ⭐ Rating mínimo */}
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Calificación mínima" : "Min rating"}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />

      {/* 🔍 Botón buscar */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Buscar' : 'Search'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#81a5b8',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
