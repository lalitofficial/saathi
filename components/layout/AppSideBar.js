"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import NewArticleDialog from "@/components/dialogs/NewArticleDialog";

export default function AppSideBar() {
  const pathname = usePathname();
  const navItems = [
    { label: "Workspace", href: "/workspace", icon: Layout },
    { label: "Dashboard", href: "/dashboard", icon: Shield },
  ];

  return (
    <div className="relative h-screen border-r border-slate-200 bg-white p-7 text-slate-900 shadow-2xl dark:border-slate-800/70 dark:bg-slate-950/80 dark:text-slate-100">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="logo" width="46" height="46" />
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
            Saathi
          </p>
          <p className="text-lg font-semibold">Command Center</p>
        </div>
      </div>
      <div className="mt-10 space-y-4">
        <NewArticleDialog>
          <Button className="w-full cursor-pointer bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-400 dark:text-slate-900 dark:hover:bg-sky-300">
            + New Article
          </Button>
        </NewArticleDialog>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/40 dark:hover:text-white"
                }`}
              >
                <Icon size={18} className="text-sky-500 dark:text-sky-300" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-10 w-[80%]">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Storage
        </div>
        <Progress value={33} />
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          2 out of 5 PDFs uploaded
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Upgrade to upload more PDFs
        </p>
      </div>
    </div>
  );
}
