import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useMovies } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";

export default function FavoritesScreen() {
  const { favorites } = useMovies();

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
          <Text style={styles.emptyText}>
            ¡Empieza a agregar películas a tus favoritos haciendo clic en el corazón!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>❤️ Mis Películas Favoritas</Text>
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                🎬 {favorites.length} {favorites.length === 1 ? "película" : "películas"}
              </Text>
            </View>
          </View>
          <FlatList
            data={favorites}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 24,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyIcon: {
    fontSize: 96,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 300,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8b5cf6",
    marginBottom: 16,
    textAlign: "center",
  },
  counter: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#e9d5ff",
  },
  counterText: {
    color: "#7c3aed",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
