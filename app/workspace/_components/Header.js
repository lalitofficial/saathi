"use client";

import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  // 1. Default to light; we'll read the real value on mount
  const [theme, setTheme] = useState("light");

  // 2. On mount only (browser!), read from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  // 3. Whenever `theme` changes, apply <html> class + persist
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  // 4. Flip-flop
  const swapTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center ml-2 md:mr-24">
            <span className="text-xl font-semibold sm:text-2xl dark:text-white">
              WieDigital
            </span>
          </a>

          {/* Theme toggle + user button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={swapTheme}
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 
                         focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 
                         rounded-lg text-sm p-2.5"
            >
              {theme === "dark" ? (
                // Sun icon (light mode)
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm-7 9a7 7 0 1114 0 7 7 0 01-14 0z"
                  />
                </svg>
              ) : (
                // Moon icon (dark mode)
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
