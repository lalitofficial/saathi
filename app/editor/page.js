// page.js or page.tsx (App Router)
"use client";

import dynamic from "next/dynamic";
import "./styles.scss";
// Adjust the path so it matches your folder structure
const BlogEditor = dynamic(() => import("./_components/BlogEditor"), {
  ssr: false,
});
export default function Page() {
  // const BlogEditor = dynamic(() => import("./_components/BlogEditor"), {
  //   ssr: false, // disable server-side rendering
  // });
  return (
    <div className="flex tiptap-content flex-1 flex-col gap-4 p-4 pt-0">
      <div className="editor-wrapper min-h-[100vh] flex-1 rounded-2xl border border-slate-200 bg-white md:min-h-min dark:border-slate-800/60 dark:bg-slate-950/70">
        <BlogEditor />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800/60 dark:bg-slate-900/60" />
        <div className="aspect-video rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800/60 dark:bg-slate-900/60" />
        <div className="aspect-video rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800/60 dark:bg-slate-900/60" />
      </div>
    </div>
  );
}
