"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { useToast } from "@/components/ToastProvider";
import { MovieDetail } from "../movie/[id]/page";
import { fetchFavorites, fetchWatchLater } from "@/lib/pageFetches";

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading favorites...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                {error.includes("sign in") && (
                  <a
                    href="/signin"
                    className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Sign In
                  </a>
                )}
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤍</div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start adding movies to your favorites to see them here
                </p>
                <a
                  href="/"
                  className="inline-block px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Browse Movies
                </a>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Favorites</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {favorites.length} {favorites.length === 1 ? "movie" : "movies"} in your favorites
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((movie) => (
                    <div key={`favorite-${movie.id}`} className="relative">
                      <MovieCard
                        movie={movie}
                        isFavorite={true}
                        isWatchLater={watchLater.some((m) => m.id === movie.id)}
                      />
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
