// src/context/MovieContext.jsx
// Context API para gestión global de favoritos
import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveFavorites, loadFavorites } from '../utils/storage';

// Crear el contexto
const MovieContext = createContext();

/**
 * Provider del contexto de películas
 * Gestiona el estado global de favoritos
 */
export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect: Cargar favoritos al montar el componente
  useEffect(() => {
    loadInitialFavorites();
  }, []);

  /**
   * Cargar favoritos desde AsyncStorage
   */
  const loadInitialFavorites = async () => {
    try {
      const savedFavorites = await loadFavorites();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar película a favoritos
   * @param {Object} movie - Película a agregar
   */
  const addFavorite = async (movie) => {
    try {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  /**
   * Eliminar película de favoritos
   * @param {number} movieId - ID de la película a eliminar
   */
  const removeFavorite = async (movieId) => {
    try {
      const newFavorites = favorites.filter(movie => movie.id !== movieId);
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  /**
   * Verificar si una película es favorita
   * @param {number} movieId - ID de la película
   * @returns {boolean} True si es favorita
   */
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  /**
   * Alternar estado de favorito
   * @param {Object} movie - Película a alternar
   */
  const toggleFavorite = async (movie) => {
    if (isFavorite(movie.id)) {
      await removeFavorite(movie.id);
    } else {
      await addFavorite(movie);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

/**
 * Custom hook para consumir el contexto
 * @returns {Object} Contexto de películas
 */
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};
