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
        fetchWatchLater(setWatchLater, setIsLoading, show).catch(() => {});
        fetchFavorites(setFavorites, setIsLoading, show).catch(() => {});
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50 bg-gradient-to-bl from-red-950 to-black">
      <Header />

      <main className="container mx-auto px-4 py-10">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="flex-1 px-4 py-2 border border-red-400 rounded-l-lg focus:outline-none focus:ring-[1px] focus:ring-red-500 dark:bg-[rgba(0,0,0,0.1)] dark:border-red-500 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Genres */}
          <aside className="lg:w-64">
            <div className="bg-white dark:bg-[rgba(0,0,0,0.1)] border-2 border-red-700 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Genres</h2>
              <div className="space-y-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors bg-[rgba(255,255,255,0.05)] ${
                      selectedGenre === genre.id
                        ? "bg-red-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-orange-800"
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
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
                  {searchQuery && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Search: "{searchQuery}"</span>}
                  {selectedGenre && (
                    <span className="bg-green-100 text-orange-800 px-2 py-1 rounded text-sm">
                      Genre: {genres.find((g) => g.id === selectedGenre)?.name}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedGenre(null);
                      setCurrentPage(1);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Movies Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading movies...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button onClick={fetchMovies} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Try Again
                </button>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400">No movies found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                      className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-700 dark:text-gray-300 dark:hover:bg-red-600"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-700 dark:text-gray-300 dark:hover:bg-red-600"
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
