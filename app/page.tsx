"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import "@/app/index.css";
import { useToast } from "@/components/ToastProvider";
import { fetchFavorites, fetchWatchLater } from "@/lib/pageFetches";

interface User {
  id: string;
  name: string;
  email: string;
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [favorites, setFavorites] = useState<MovieDetail[]>([]);
  const [watchLater, setWatchLater] = useState<MovieDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { show } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        if (response.status === 200) setUser(response.data);
      } catch {
        setUser(null);
      }
    };

    checkAuth()
      .then(() => {
        fetchWatchLater(setWatchLater, setIsLoading, setError, show);
        fetchFavorites(setFavorites, setIsLoading, setError, show);
      })
      .catch(() => {});
    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, selectedGenre, searchQuery]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get("/api/genres");
      setGenres(response.data.genres);
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Failed to load genres";
      show(msg, { variant: "error" });
    }
  };

  const fetchMovies = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ page: currentPage.toString() });

      if (searchQuery) params.append("query", searchQuery);
      else if (selectedGenre) params.append("genreId", selectedGenre.toString());

      const response = await axios.get<MovieResponse>(`/api/movies?${params}`);
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Failed to load movies";
      setError(msg);
      show(msg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSelectedGenre(null);
  };

  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-10">
        {/* Search Bar */}
        <div className="mb-10">
          <form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto flex rounded-lg shadow-md overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors font-semibold text-white"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Genres */}
          <aside className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-red-600">Genres</h2>
              <div className="space-y-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                      selectedGenre === genre.id
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters */}
            {(searchQuery || selectedGenre) && (
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                {searchQuery && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedGenre && (
                  <span className="bg-red-200 text-red-900 px-3 py-1 rounded text-sm">
                    Genre: {genres.find((g) => g.id === selectedGenre)?.name}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre(null);
                    setCurrentPage(1);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Movies Grid */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading movies...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={fetchMovies}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                >
                  Try Again
                </button>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400">No movies found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isWatchLater={watchLater.some((wl) => wl.id === movie.id)}
                      isFavorite={favorites.some((f) => f.id === movie.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
