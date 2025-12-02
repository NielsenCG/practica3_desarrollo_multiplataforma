import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NavBar = ({ navigation, currentScreen }) => {
  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🎬 MovieApp</Text>
      </View>
      <View style={styles.navLinks}>
        <TouchableOpacity
          style={[styles.navLink, currentScreen === 'Home' && styles.activeLink]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.navLinkText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navLink, currentScreen === 'Favorites' && styles.activeLink]}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.navLinkText}>❤️ Favoritos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    color: '#e50914',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navLinks: {
    flexDirection: 'row',
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 20,
  },
  activeLink: {
    backgroundColor: '#e50914',
  },
  navLinkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NavBar;