import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isDarkMode,
  language,
}) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={[
          styles.searchInput,
          { color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#fff' : '#000' },
        ]}
        placeholder={language === 'es' ? "Iniciar búsqueda..." : "Start search..."}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>
          {language === 'es' ? 'Buscar' : 'Search'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#ADD8E6',
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
