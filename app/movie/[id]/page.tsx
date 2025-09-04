"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { useToast } from "@/components/ToastProvider";
import { MovieDetail } from "./types";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
      checkUserInteractions();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${movieId}`);
      setMovie(response.data);
    } catch (error: any) {
      console.error("Error fetching movie details:", error);
      const msg = error?.response?.data?.error || "Failed to load movie details";
      setError(msg);
      show(msg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserInteractions = async () => {
    try {
      // Check if movie is in favorites
      const favoritesResponse = await axios.get("/api/user/favorites");
      const isInFavorites = favoritesResponse.data.some((fav: any) => fav.movieId === parseInt(movieId));
      setIsFavorite(isInFavorites);

      // Check if movie is in watch later
      const watchLaterResponse = await axios.get("/api/user/watch-later");
      const isInWatchLater = watchLaterResponse.data.some((wl: any) => wl.movieId === parseInt(movieId));
      setIsWatchLater(isInWatchLater);

      // Check user rating
      const ratingsResponse = await axios.get("/api/user/ratings");
      const userRatingData = ratingsResponse.data.find((rating: any) => rating.movieId === parseInt(movieId));
      setUserRating(userRatingData?.score || 0);
    } catch (error) {
      // User is not authenticated, which is fine
      // no toast here to avoid noise
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/user/favorites?movieId=${movieId}`);
        setIsFavorite(false);
      } else {
        await axios.post("/api/user/favorites", { movieId: parseInt(movieId) });
        setIsFavorite(true);
      }
    } catch (error: any) {
      console.error("Favorite error:", error);
      show(error?.response?.data?.error || "Failed to update favorites", { variant: "error" });
    }
  };

  const handleWatchLater = async () => {
    try {
      if (isWatchLater) {
        await axios.delete(`/api/user/watch-later?movieId=${movieId}`);
        setIsWatchLater(false);
      } else {
        await axios.post("/api/user/watch-later", { movieId: parseInt(movieId) });
        setIsWatchLater(true);
      }
    } catch (error: any) {
      console.error("Watch later error:", error);
      show(error?.response?.data?.error || "Failed to update watch later", { variant: "error" });
    }
  };

  const handleRating = async (score: number) => {
    try {
      await axios.post("/api/user/ratings", { movieId: parseInt(movieId), score });
      setUserRating(score);
    } catch (error: any) {
      console.error("Rating error:", error);
      show(error?.response?.data?.error || "Failed to submit rating", { variant: "error" });
    }
  };

  const trailer = movie?.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error || "Movie not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "/placeholder-backdrop.jpg";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-poster.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0d1a] to-red-700">
      <Header />

      <main>
        {/* Hero Section with Backdrop */}
        <div className="relative h-96 md:h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
            <div className="absolute inset-0 bg-gray bg-opacity-50"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8 h-full flex items:end">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <img src={posterUrl} alt={movie.title} className="w-48 h-72 object-cover rounded-lg shadow-lg" />
 
             <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-4 h-50 flex items-end bg-[#0a0d1a]/80 rounded-xl shadow-lg border border-red-700">
             <div className="w-full text-white text-sm md:text-base lg:text-lg">
              <div className="text-red-700 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex flex-wrap text-black gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="px-3 py-1 bg-blue-100 bg-opacity-20 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleFavorite}
                    className={`px-5 py-1 rounded-lg transition-colors ${
                      isFavorite
                        ? "bg-red-700 text-white hover:bg-red-800"
                        : "bg-blue-100 bg-opacity-20 text-black hover:bg-opacity-30"
                    }`}
                  >
                    {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
                  </button>

                  <button
                    onClick={handleWatchLater}
                    className={`px-5 py-1 rounded-lg transition-colors ${
                      isWatchLater
                        ? "bg-blue-700 text-white hover:bg-blue-800"
                        : "bg-blue-100 bg-opacity-20 text-black hover:bg-opacity-30"
                    }`}
                  >
                    {isWatchLater ? "📺 Watch Later" : "⏰ Watch Later"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>  
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-[#0a0d1a] rounded-xl shadow-lg p-6 border border-red-700">
                <h2 className="text-2xl font-bold mb-4 text-gray-300">Overview</h2>
                <p className="text-gray-500 dark:text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Rating */}
              <div className="bg-[#0a0d1a] rounded-xl shadow-lg p-6 border border-red-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-300 dark:text-white">Your Rating</h3>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className={`text-2xl ${
                        userRating >= star ? "text-yellow-500" : "text-gray-300"
                      } hover:text-yellow-500`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userRating > 0 ? `You rated this movie ${userRating}/5` : "Rate this movie"}
                </p>
              </div>

              {/* Movie Info */}
              <div className="bg-[#0a0d1a] rounded-xl shadow-lg p-6 border border-red-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-300 dark:text-white">Movie Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-400">Release Date:</span>
                    <span className="text-gray-500 dark:text-white">
                      {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-400">Runtime:</span>
                    <span className="text-gray-500 dark:text-white">{movie.runtime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-400">TMDB Rating:</span>
                    <span className="text-gray-500 dark:text-white">⭐ {movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
