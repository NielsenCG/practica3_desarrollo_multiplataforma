import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MovieCard from "../components/MovieCard";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debug: verificar API key
  useEffect(() => {
    console.log("=== DEBUG INFO ===");
    console.log("TMDB_API_KEY:", TMDB_API_KEY ? `${TMDB_API_KEY.substring(0, 10)}...` : "NO ENCONTRADO");
    console.log("TMDB_BASE_URL:", TMDB_BASE_URL);
  }, []);

  useEffect(() => {
    fetchPopularMovies(1);
  }, []);

  const fetchPopularMovies = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      // Verificar que la API key existe
      if (!TMDB_API_KEY) {
        throw new Error("API Key no configurada");
      }

      let url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`;
      
      if (selectedYear) {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&sort_by=${sortBy}&page=${page}&primary_release_year=${selectedYear}`;
      } else if (selectedGenre) {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&sort_by=${sortBy}&page=${page}&with_genres=${selectedGenre}`;
      } else if (sortBy !== "popularity.desc") {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&sort_by=${sortBy}&page=${page}`;
      }

      if (selectedYear && selectedGenre) {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&sort_by=${sortBy}&page=${page}&primary_release_year=${selectedYear}&with_genres=${selectedGenre}`;
      }

      if (sortBy.includes("vote_average")) {
        const sep = url.includes("?") ? "&" : "?";
        url = `${url}${sep}vote_count.gte=50`;
      }
      
      console.log("Fetching URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        throw new Error(`Error ${response.status}: ${errorData.status_message || "Error al cargar películas"}`);
      }
      
      const data = await response.json();
      console.log("Movies loaded:", data.results?.length);
      
      if (data.results && Array.isArray(data.results)) {
        setMovies(data.results);
        setCurrentPage(data.page ?? page);
        setTotalPages(data.total_pages ?? 1);
      } else {
        throw new Error("Respuesta inválida de la API");
      }
    } catch (err) {
      console.error("Full error:", err);
      const errorMessage = err instanceof Error ? err.message : "Error de red. Verifica tu conexión a internet.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchPopularMovies(1);
    }
  }, [selectedYear, selectedGenre, sortBy]);

  const performSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      fetchPopularMovies(page);
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (!TMDB_API_KEY) {
        throw new Error("API Key no configurada");
      }

      let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(
        searchQuery
      )}&page=${page}`;
      
      if (selectedYear) {
        url += `&primary_release_year=${selectedYear}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        throw new Error(`Error en la búsqueda: ${errorData.status_message || "Error"}`);
      }
      const data = await response.json();
      
      let filteredResults = data.results;
      if (selectedGenre) {
        filteredResults = data.results.filter((movie: Movie) => 
          movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
        );
      }

      if (sortBy.includes("vote_average")) {
        filteredResults = filteredResults.filter((movie: Movie) => movie.vote_count >= 50);
      }

      setMovies(filteredResults);
      setCurrentPage(data.page ?? page);
      setTotalPages(data.total_pages ?? 1);
      if (filteredResults.length === 0) {
        setError("No se encontraron películas con esos criterios.");
      }
    } catch (err) {
      setError("Error al buscar películas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedYear("");
    setSelectedGenre("");
    setSortBy("popularity.desc");
    setCurrentPage(1);
    fetchPopularMovies(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="🔍 Buscar películas..."
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>🎯 Filtros Avanzados</Text>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>📅 Año</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                style={styles.picker}
              >
                <Picker.Item label="Todos los años" value="" />
                {years.map((year) => (
                  <Picker.Item key={year} label={String(year)} value={String(year)} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>🎬 Género</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGenre}
                onValueChange={setSelectedGenre}
                style={styles.picker}
              >
                <Picker.Item label="Todos los géneros" value="" />
                <Picker.Item label="Acción" value="28" />
                <Picker.Item label="Aventura" value="12" />
                <Picker.Item label="Animación" value="16" />
                <Picker.Item label="Comedia" value="35" />
                <Picker.Item label="Crimen" value="80" />
                <Picker.Item label="Documental" value="99" />
                <Picker.Item label="Drama" value="18" />
                <Picker.Item label="Familiar" value="10751" />
                <Picker.Item label="Fantasía" value="14" />
                <Picker.Item label="Terror" value="27" />
                <Picker.Item label="Romance" value="10749" />
                <Picker.Item label="Ciencia Ficción" value="878" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>📊 Ordenar</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sortBy}
                onValueChange={setSortBy}
                style={styles.picker}
              >
                <Picker.Item label="Más populares" value="popularity.desc" />
                <Picker.Item label="Mejor valoradas" value="vote_average.desc" />
                <Picker.Item label="Más recientes" value="release_date.desc" />
                <Picker.Item label="Más antiguas" value="release_date.asc" />
              </Picker>
            </View>
          </View>
          
          {(searchQuery || selectedYear || selectedGenre || sortBy !== "popularity.desc") && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>🔄 Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {searchQuery ? `Resultados: "${searchQuery}"` : 
           selectedYear || selectedGenre ? "🎯 Filtrados" : 
           "🎬 Películas Populares"}
        </Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && movies.length > 0 && (
          <>
            <FlatList
              data={movies}
              renderItem={({ item }) => <MovieCard movie={item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              scrollEnabled={true}
            />

            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={() => {
                  const prev = Math.max(1, currentPage - 1);
                  searchQuery ? performSearch(prev) : fetchPopularMovies(prev);
                }}
                disabled={currentPage <= 1}
                style={[styles.paginationButton, currentPage <= 1 && styles.paginationButtonDisabled]}
              >
                <Text style={styles.paginationButtonText}>◀ Anterior</Text>
              </TouchableOpacity>

              <View style={styles.pageIndicator}>
                <Text style={styles.pageText}>
                  Página {currentPage} de {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  const next = Math.min(totalPages, currentPage + 1);
                  searchQuery ? performSearch(next) : fetchPopularMovies(next);
                }}
                disabled={currentPage >= totalPages}
                style={[styles.paginationButton, currentPage >= totalPages && styles.paginationButtonDisabled]}
              >
                <Text style={styles.paginationButtonText}>Siguiente ▶</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!loading && movies.length === 0 && !error && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyText}>No se encontraron películas.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  searchButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  clearButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  clearButtonText: {
    color: "#374151",
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8b5cf6",
    textAlign: "center",
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fca5a5",
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    color: "#991b1b",
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  paginationButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  pageIndicator: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pageText: {
    color: "#374151",
    fontWeight: "600",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "600",
  },
});
