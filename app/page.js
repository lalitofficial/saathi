"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
export default function Home() {
  const { user } = useUser();
  const checkUser = async () => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
        userName: user?.fullName,
      }),
    });
  };

  useEffect(() => {
    if (user) checkUser();
  }, [user]);
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-start justify-center gap-8 px-6 py-12">
      <div className="flex w-full items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Saathi
        </div>
        <UserButton />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white md:text-5xl">
          Your SEO co-pilot for PDFs and editorial work.
        </h1>
        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Upload PDFs, craft content in a focused editor, and run SEO checks
          without leaving your workspace.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-sky-600 text-white hover:bg-sky-500">
          <Link href="/dashboard">Open Dashboard</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Link href="/workspace">Explore Workspace</Link>
        </Button>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            title: "PDF Uploads",
            detail: "Store and organize reference documents in Convex.",
          },
          {
            title: "Live Editing",
            detail: "TipTap editor with formatting and table support.",
          },
          {
            title: "SEO Review",
            detail: "Audit titles and metadata with the analyzer API.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/70"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {card.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
