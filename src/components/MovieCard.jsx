// src/components/MovieCard.jsx
// Componente de tarjeta individual de película
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useMovieContext } from '../context/MovieContext';  
import { getImageUrl } from '../services/api';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columnas con margen

const MovieCard = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useMovieContext();
  const favorite = isFavorite(movie.id);

  // Extraer año de la fecha de lanzamiento
  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  // URL del póster o imagen placeholder
  const posterUrl = getImageUrl(movie.poster_path) || 
    'https://via.placeholder.com/500x750?text=Sin+Imagen';

  return (
    <View style={styles.card}>
      {/* Imagen del póster */}
      <Image
        source={{ uri: posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />
      
      {/* Overlay con botón de favoritos */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(movie)}
          activeOpacity={0.7}
        >
          <Text style={styles.heartIcon}>
            {favorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Información de la película */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{year}</Text>
        {movie.vote_average > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5, // Aspecto 2:3
    backgroundColor: '#2a2a2a',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 8,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 20,
  },
  info: {
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    minHeight: 36,
  },
  year: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  ratingContainer: {
    marginTop: 4,
  },
  rating: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MovieCard;
