"use client";
import Link from "next/link";

function Dashboard() {
  return (
    <div className="m-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-slate-900 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Workspace Tools
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Launch analyzers and utilities for content optimization.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-black/30 dark:hover:border-slate-700">
          <Link
            className="text-base font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
            href="/workspace/title-analyzer"
          >
            Title Analyzer
          </Link>
          <div className="my-3 h-px bg-slate-200 dark:bg-slate-800/80" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Evaluate headline strength and balance.
          </p>
        </li>
        <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-black/30 dark:hover:border-slate-700">
          <span className="text-base font-semibold text-slate-900 dark:text-slate-200">
            Keyword Analyzer
          </span>
          <div className="my-3 h-px bg-slate-200 dark:bg-slate-800/80" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Coming soon.
          </p>
        </li>
        <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-black/30 dark:hover:border-slate-700">
          <span className="text-base font-semibold text-slate-900 dark:text-slate-200">
            Description Analyzer
          </span>
          <div className="my-3 h-px bg-slate-200 dark:bg-slate-800/80" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Coming soon.
          </p>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
