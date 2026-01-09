"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      try {
        const response = await fetch("/api/articles");
        const payload = await response.json();
        if (isMounted) {
          setArticles(payload?.data || []);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="m-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-slate-900 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Articles
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review, edit, and manage your content workspace.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <li
            key={article.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-black/30 dark:hover:border-slate-700"
          >
            <Link
              className="text-base font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
              href={`/editor?key=${article.id}`}
            >
              {article.articleName}
            </Link>
            <div className="my-3 h-px bg-slate-200 dark:bg-slate-800/80" />
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">
              Article ID
            </p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">
              {article.id}
            </p>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">
              Owner
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {article.createdBy}
            </p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              {new Date(article.creationDate).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
