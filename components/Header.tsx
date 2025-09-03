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
    // Check if user is logged in by making a request to a protected endpoint
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        if (response.status === 200) {
          // User is authenticated, we can get user info from the response
          // For now, we'll just set a basic user object
          setUser(response.data);
        }
      } catch (error) {
        // User is not authenticated
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
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-gray-300">
            MovieStream
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            {user && (
              <>
                <Link href="/favorites" className="hover:text-gray-300">
                  Favorites
                </Link>
                <Link href="/watch-later" className="hover:text-gray-300">
                  Watch Later
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.email}</span>
                <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/signin" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2 pt-4">
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
              {user && (
                <>
                  <Link href="/favorites" className="hover:text-gray-300">
                    Favorites
                  </Link>
                  <Link href="/watch-later" className="hover:text-gray-300">
                    Watch Later
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
