import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Navbar({ onTitlePress, onMenuPress, isDarkMode, title }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onTitlePress}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Text style={[styles.menuButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
    paddingHorizontal: 15,
    paddingVertical: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  menuButton: {
    padding: 25,
    marginTop: 5,
  },
  menuButtonText: {
    fontSize: 24,
  },
});
