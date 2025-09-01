"use client";

import { useState, useEffect, useCallback } from "react";
import axios, { type AxiosResponse } from "axios";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { useToast } from "@/components/ToastProvider";
import { MovieDetail } from "../movie/[id]/page";
import { fetchWatchLater } from "../watch-later/page";

export interface FavoriteMovie {
  id: string;
  movieId: number;
  createdAt: string;
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
}

export const fetchFavorites = async (
  stateSetter: Function,
  loadingSetter: Function,
  errorSetter: Function,
  toastShow: Function
) => {
  try {
    const response = await axios.get("/api/user/favorites");
    const favoritesPromises: Promise<AxiosResponse<MovieDetail>>[] = [] as Promise<AxiosResponse<MovieDetail>>[];

    response.data.forEach((favorite: FavoriteMovie) => {
      favoritesPromises.push(axios.get(`/api/movies/${favorite.movieId}`));
    });

    const responses = await Promise.all(favoritesPromises);

    stateSetter(responses.map((res) => res.data));
  } catch (error: any) {
    if (error.response?.status === 401) {
      errorSetter("Please sign in to view your favorites");
      toastShow("Please sign in to view your favorites", { variant: "error" });
    } else {
      const msg = error?.response?.data?.error || "Failed to load favorites";
      errorSetter(msg);
      toastShow(msg, { variant: "error" });
    }
  } finally {
    loadingSetter(false);
  }
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<MovieDetail[]>([]);
  const [watchLater, setWatchLater] = useState<MovieDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { show } = useToast();

  useEffect(() => {
    fetchFavorites(setFavorites, setIsLoading, setError, show);
    fetchWatchLater(setWatchLater, setIsLoading, setError, show);
  }, [show]);

  const handleRemoveFavorite = useCallback(
    async (movieId: number) => {
      try {
        await axios.delete(`/api/user/favorites?movieId=${movieId}`);
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
      } catch (error: any) {
        console.error("Error removing favorite:", error);
        show(error?.response?.data?.error || "Failed to remove favorite", { variant: "error" });
      }
    },
    [show]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            {error.includes("sign in") && (
              <a
                href="/signin"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"} in your favorites
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding movies to your favorites to see them here
            </p>
            <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Browse Movies
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <div key={`favorite-${movie.id}`} className="relative">
                <MovieCard movie={movie} isFavorite={true} isWatchLater={watchLater.some((m) => m.id === movie.id)} />
                <button
                  onClick={() => handleRemoveFavorite(movie.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  title="Remove from favorites"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
