// src/screens/Home.jsx
// Pantalla principal: búsqueda y películas populares
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Keyboard,
} from 'react-native';
import { getPopularMovies, searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  // useState: Gestión de estados
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect: Cargar películas populares al montar
  useEffect(() => {
    loadPopularMovies();
  }, []);

  /**
   * Cargar películas populares desde la API
   */
  const loadPopularMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPopularMovies();
      setMovies(data);
    } catch (err) {
      setError('Error al cargar películas. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar películas por título
   */
  const handleSearch = async () => {
    Keyboard.dismiss();
    
    if (!searchQuery.trim()) {
      loadPopularMovies();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(searchQuery);
      setMovies(data);
      if (data.length === 0) {
        setError('No se encontraron películas con ese título');
      }
    } catch (err) {
      setError('Error en la búsqueda. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar búsqueda y volver a películas populares
   */
  const handleClearSearch = () => {
    setSearchQuery('');
    setError(null);
    loadPopularMovies();
  };

  /**
   * Renderizar cada película
   */
  const renderMovie = ({ item }) => <MovieCard movie={item} />;

  /**
   * Renderizar lista vacía
   */
  const renderEmptyList = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎬</Text>
        <Text style={styles.emptyText}>
          {error || 'No hay películas para mostrar'}
        </Text>
        {error && (
          <TouchableOpacity style={styles.retryButton} onPress={loadPopularMovies}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /**
   * Renderizar indicador de carga
   */
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Cargando películas...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar películas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearIcon} 
              onPress={handleClearSearch}
            >
              <Text style={styles.clearIconText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Grid de películas */}
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearIcon: {
    padding: 4,
  },
  clearIconText: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#e50914',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#e50914',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    marginTop: 12,
    fontSize: 14,
  },
});

export default Home;
