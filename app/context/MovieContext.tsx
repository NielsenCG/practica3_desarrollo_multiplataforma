import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

interface MovieContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Cargar favoritos desde AsyncStorage al iniciar
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("movieFavorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  };

  // Guardar favoritos en AsyncStorage cuando cambien
  useEffect(() => {
    saveFavorites();
  }, [favorites]);

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem("movieFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error al guardar favoritos:", error);
    }
  };

  const addToFavorites = (movie: Movie) => {
    setFavorites((prev) => [...prev, movie]);
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}
