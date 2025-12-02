// App.js
// Componente principal con configuración de React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MovieProvider } from './src/context/MovieContext';
import Home from './src/screens/Home';
import Favorites from './src/screens/Favorites';

const Stack = createNativeStackNavigator();

/**
 * Componente principal de la aplicación
 * Configura React Navigation y envuelve con MovieProvider
 */
export default function App() {
  return (
    <MovieProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }}
        >
          {/* Pantalla Home */}
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              title: '🎬 MovieApp - Práctica 3',
              headerRight: () => (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => navigation.navigate('Favorites')}
                >
                  <Text style={styles.navButtonText}>❤️</Text>
                  <Text style={styles.navButtonLabel}>Favoritos</Text>
                </TouchableOpacity>
              ),
            })}
          />

          {/* Pantalla Favorites */}
          <Stack.Screen
            name="Favorites"
            component={Favorites}
            options={({ navigation }) => ({
              title: '❤️ Mis Favoritos',
              headerRight: () => (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.navButtonText}>🏠</Text>
                  <Text style={styles.navButtonLabel}>Inicio</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MovieProvider>
  );
}

const styles = StyleSheet.create({
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  navButtonText: {
    fontSize: 16,
    marginRight: 4,
  },
  navButtonLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
