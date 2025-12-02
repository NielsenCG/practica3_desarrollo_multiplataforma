// src/services/api.js
// Servicio para la API de The Movie Database (TMDB)
import axios from 'axios';

// Configuración de la API
const API_KEY = 'bcc1e78f94b554e384d5aa147c4dbe31'; // API Key de TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Instancia de axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES', // Idioma español
  },
});

/**
 * Obtener películas populares
 * @returns {Promise<Array>} Lista de películas populares
 */
export const getPopularMovies = async () => {
  try {
    const response = await api.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

/**
 * Buscar películas por título
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de películas encontradas
 */
export const searchMovies = async (query) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Obtener URL completa de la imagen
 * @param {string} path - Ruta de la imagen
 * @returns {string|null} URL completa o null
 */
export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};

export default api;