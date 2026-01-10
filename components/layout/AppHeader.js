"use client";

import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function AppHeader() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const nextTheme = storedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/70 px-6 py-4 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Saathi Workspace
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-500/60 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-300">
            Guest
          </span>
        </div>
      </div>
    </header>
  );
}
