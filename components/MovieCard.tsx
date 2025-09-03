"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/ToastProvider";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  isWatchLater?: boolean;
  userRating?: number;
}

function MovieCard({ movie, isFavorite = false, isWatchLater = false, userRating }: MovieCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [watchLater, setWatchLater] = useState(isWatchLater);
  const [rating, setRating] = useState(userRating || 0);
  const [poster] = useState(
    movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder-poster.jpg"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { show } = useToast();

  // Sync internal state with props to prevent flickering
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    setWatchLater(isWatchLater);
  }, [isWatchLater]);

  useEffect(() => {
    setRating(userRating || 0);
  }, [userRating]);

  const handleFavorite = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (favorite) {
        await axios.delete(`/api/user/favorites?movieId=${movie.id}`);
        setFavorite(false);
      } else {
        await axios.post("/api/user/favorites", { movieId: movie.id });
        setFavorite(true);
      }
    } catch (error: any) {
      console.error("Favorite error:", error);
      const msg = error?.response?.data?.error || "Failed to update favorites";
      show(msg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchLater = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (watchLater) {
        await axios.delete(`/api/user/watch-later?movieId=${movie.id}`);
        setWatchLater(false);
      } else {
        await axios.post("/api/user/watch-later", { movieId: movie.id });
        setWatchLater(true);
      }
    } catch (error: any) {
      console.error("Watch later error:", error);
      const msg = error?.response?.data?.error || "Failed to update watch later";
      show(msg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (score: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await axios.post("/api/user/ratings", { movieId: movie.id, score });
      setRating(score);
    } catch (error: any) {
      console.error("Rating error:", error);
      const msg = error?.response?.data?.error || "Failed to submit rating";
      show(msg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative">
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-poster.jpg";
            }}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400">{movie.title}</h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{movie.overview}</p>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
        </div>

        {/* User Rating */}
        <div className="mb-3">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={isLoading}
                className={`text-lg ${rating >= star ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-500`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              favorite
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {favorite ? "❤️ Favorited" : "🤍 Favorite"}
          </button>

          <button
            onClick={handleWatchLater}
            disabled={isLoading}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              watchLater
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {watchLater ? "📺 Watch Later" : "⏰ Watch Later"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCard);
