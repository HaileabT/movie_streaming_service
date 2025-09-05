"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites");
        if (!response.ok) throw new Error("Failed to fetch favorites");

        const data = await response.json();
        setFavorites(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 bg-gradient-to-bl from-red-950 to-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 bg-gradient-to-bl from-red-950 to-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            {error.includes("sign in") && (
              <a
                href="/signin"
                className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 bg-gradient-to-bl from-red-950 to-black">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-300">You have no favorite movies yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-bl from-red-950 to-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-white font-bold mb-6">Your Favorites</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded overflow-hidden shadow-lg hover:scale-105 transition-transform"
            >
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h2 className="text-white font-semibold">{movie.title}</h2>
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
}
