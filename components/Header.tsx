"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/ToastProvider";

interface User {
  id: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/signout");
      setUser(null);
      window.location.href = "/";
    } catch (error: any) {
      console.error("Sign out error:", error);
      const msg = error?.response?.data?.error || "Failed to sign out";
      show(msg, { variant: "error" });
    }
  };

  return (
    <header className="bg-gradient-to-br from-black to-red-950 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-800 to-orange-400 bg-clip-text text-transparent hover:from-orange-400 hover:to-red-800 transition-colors duration-300"
          >
            MovieStream
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium">
            <Link href="/" className="hover:text-red-400 transition-colors text-sm sm:text-base">
              Home
            </Link>
            {user && (
              <>
                <Link href="/favorites" className="hover:text-red-400 transition-colors text-sm sm:text-base">
                  Favorites
                </Link>
                <Link href="/watch-later" className="hover:text-red-400 transition-colors text-sm sm:text-base">
                  Watch Later
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Email only visible on md and up */}
                <span className="hidden md:block text-sm text-orange-400 truncate max-w-[150px]">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  href="/signin"
                  className="bg-transparent border-2 border-red-700 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded hover:bg-red-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col space-y-4 pt-4">
            <Link
              href="/"
              className="hover:text-red-400 transition-colors text-base px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/favorites"
                  className="hover:text-red-400 transition-colors text-base px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  href="/watch-later"
                  className="hover:text-red-400 transition-colors text-base px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Watch Later
                </Link>
              </>
            )}

            {/* Auth Buttons (Mobile only) */}
            {!user && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/signin"
                  className="border-2 border-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm text-center font-medium transition-colors shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm text-center font-medium transition-colors shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
