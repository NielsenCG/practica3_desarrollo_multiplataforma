import { useState } from "react";
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useMovies } from "../context/MovieContext";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

interface MovieCardProps {
  movie: Movie;
}

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const { width } = Dimensions.get("window");

export default function MovieCard({ movie }: MovieCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const [showDetails, setShowDetails] = useState(false);
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const ratingColor = movie.vote_average >= 7 ? "#10b981" : movie.vote_average >= 5 ? "#fbbf24" : "#ef4444";

  return (
    <>
      <TouchableOpacity 
        onPress={() => setShowDetails(true)}
        style={styles.card}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
          defaultSource={require('../../assets/images/icon.png')}
        />
        
        {/* Puntuación */}
        <View style={styles.ratingBadge}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={[styles.ratingText, { color: ratingColor }]}>{rating}</Text>
        </View>

        <TouchableOpacity
          onPress={handleFavoriteClick}
          style={[styles.favoriteBadge, favorite ? styles.favoriteBadgeActive : styles.favoriteBadgeInactive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.heartIcon, favorite ? undefined : { color: '#1f2937' }]}>{favorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
        
        {/* Título y año */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          <Text style={styles.year}>📅 {year}</Text>
        </View>
      </TouchableOpacity>

      {/* Modal de detalles */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDetails(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDetails(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <ScrollView>
                  <View style={styles.modalContent}>
                {/* Imagen */}
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: posterUrl }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  
                  {/* Puntuación en el modal */}
                  <View style={styles.modalRatingBadge}>
                    <Text style={styles.modalStarIcon}>⭐</Text>
                    <Text style={[styles.modalRatingText, { color: ratingColor }]}>{rating}</Text>
                    <Text style={styles.modalRatingMax}>/10</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowDetails(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Información */}
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{movie.title}</Text>
                  
                  <View style={styles.modalBadges}>
                    <View style={styles.badgeBlue}>
                      <Text style={styles.badgeTextBlue}>📅 {year}</Text>
                    </View>
                    <View style={styles.badgePurple}>
                      <Text style={styles.badgeTextPurple}>👥 {movie.vote_count.toLocaleString()}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.synopsisTitle}>📝 Sinopsis</Text>
                  <Text style={styles.synopsisText}>
                    {movie.overview || "No hay descripción disponible para esta película."}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={handleFavoriteClick}
                    style={[
                      styles.favoriteButton,
                      favorite ? styles.favoriteButtonActive : styles.favoriteButtonInactive
                    ]}
                  >
                    <Text style={styles.favoriteButtonIcon}>{favorite ? "❤️" : "🤍"}</Text>
                    <Text style={styles.favoriteButtonText}>
                      {favorite ? "Quitar de Favoritos" : "Agregar a Favoritos"}
                    </Text>
                  </TouchableOpacity>
                </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginRight: 16,
    width: 180,
  },
  poster: {
    width: 180,
    height: 270,
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  favoriteBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ef4444",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteBadgeActive: {
    backgroundColor: "#ef4444",
  },
  favoriteBadgeInactive: {
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  heartIcon: {
    fontSize: 20,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
    color: "#6b7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: 400,
  },
  modalRatingBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalStarIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  modalRatingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalRatingMax: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#1f2937",
  },
  modalInfo: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  modalBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  badgeBlue: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeTextBlue: {
    color: "#2563eb",
    fontWeight: "600",
  },
  badgePurple: {
    backgroundColor: "#faf5ff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeTextPurple: {
    color: "#9333ea",
    fontWeight: "600",
  },
  synopsisTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },
  synopsisText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 24,
  },
  favoriteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButtonActive: {
    backgroundColor: "#ef4444",
  },
  favoriteButtonInactive: {
    backgroundColor: "#8b5cf6",
  },
  favoriteButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  favoriteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
