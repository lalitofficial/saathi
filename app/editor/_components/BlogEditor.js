"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export default function RichEditor() {
  // 1) Always call hooks at the top:
  const searchParams = useSearchParams();
  const articleID = searchParams.get("key");
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(Boolean(articleID));

  // Track the original HTML so we can tell if we've changed
  const [originalHtml, setOriginalHtml] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // 3) Editor setup
  const [html, setHtml] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: "Start writing here…" }),
    ],
    content: "",
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  // 4) Load existing content once fetched
  useEffect(() => {
    let isMounted = true;
    async function loadArticle() {
      if (!articleID) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/articles/${articleID}`);
        const payload = await response.json();
        if (isMounted) {
          setArticle(payload?.data ?? null);
        }
      } catch {
        if (isMounted) setArticle(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadArticle();
    return () => {
      isMounted = false;
    };
  }, [articleID]);

  useEffect(() => {
    if (article && editor) {
      editor.commands.setContent(article.articleContent);
      setHtml(article.articleContent);
      setOriginalHtml(article.articleContent);
    }
  }, [article, editor]);

  // Determine if the editor content is “dirty”
  const isDirty = html !== originalHtml;

  // 5) Early returns
  if (!articleID) return <p>No article key provided.</p>;
  if (loading) return <p>Loading…</p>;
  if (article === null) return <p>Article not found.</p>;
  if (!editor) return null;

  // 6)--- Save handler ---
  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(`/api/articles/${articleID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleContent: html }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || "Save failed");
      }
      // Once saved, reset the “original” marker
      setOriginalHtml(html);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(err?.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="prose max-w-none dark:prose-invert">
      {/* ===== Static Toolbar (always visible) ===== */}
      <div className="editor-toolbar sticky top-0 z-10 bg-white/80 pt-3 backdrop-blur dark:bg-slate-950/80">
        <button
          className={
            editor.isActive("heading", { level: 1 })
              ? "is-active shadow"
              : "shadow"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "shadow font-bold text-blue-600"
              : "shadow "
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "shadow font-bold text-blue-600"
              : "shadow"
          }
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "shadow font-bold text-blue-600"
              : "shadow "
          }
        >
          P
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={
            // saving immediately shows gray
            saving
              ? "absolute right-0 rounded bg-slate-400 px-4 py-2 text-white cursor-not-allowed transition dark:bg-slate-700"
              : // if not dirty, green (up-to-date)
                !isDirty
                ? "absolute right-0 rounded bg-emerald-500 px-4 py-2 text-white transition dark:text-slate-900"
                : // if dirty, red
                  "absolute right-0 rounded bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-400"
          }
        >
          {saving ? "Saving…" : "Save Article"}
        </button>
      </div>

      {/* ===== Inline BubbleMenu (on text selection) ===== */}
      <BubbleMenu
        editor={editor}
        className="bubble-menu"
        tippyOptions={{ duration: 100 }}
      >
        <button
          className={editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          className={editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          className={editor.isActive("underline") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          className={editor.isActive("strike") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          className={editor.isActive("highlight") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          Highlight
        </button>
        <button
          className={editor.isActive("link") ? "is-active" : ""}
          onClick={() => {
            const url = prompt("Link URL");
            if (url)
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
          }}
        >
          Link
        </button>
        <button
          className={
            !editor.isActive("link") && editor.getAttributes("link").href
              ? ""
              : ""
          }
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unlink
        </button>
      </BubbleMenu>
      {/* Save status */}
      {saveError && (
        <p className="mt-2 text-red-600">Error saving: {saveError}</p>
      )}
      {/* ===== The editable area ===== */}
      <EditorContent
        editor={editor}
        className="max-w-none rounded border border-slate-200 bg-white p-4 text-slate-900 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-100"
      />

      {/* ===== HTML payload preview ===== */}
      <h4 className="mt-6 font-semibold text-slate-700 dark:text-slate-200">
        HTML Payload:
      </h4>
      <pre className="overflow-auto rounded border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-200">
        {html}
      </pre>
    </div>
  );
}
