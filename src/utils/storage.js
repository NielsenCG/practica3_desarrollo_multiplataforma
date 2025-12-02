// src/utils/storage.js
// Utilidades para persistencia de datos con AsyncStorage (equivalente a localStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@movies_favorites';

/**
 * Guardar favoritos en AsyncStorage
 * @param {Array} favorites - Array de películas favoritas
 */
export const saveFavorites = async (favorites) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
    console.log('Favoritos guardados correctamente');
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

/**
 * Cargar favoritos desde AsyncStorage
 * @returns {Promise<Array>} Array de películas favoritas
 */
export const loadFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

/**
 * Limpiar todos los favoritos
 */
export const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    console.log('Favoritos eliminados correctamente');
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
};
