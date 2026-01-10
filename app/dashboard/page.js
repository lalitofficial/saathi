"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  FilePlus,
  Folder,
  Plus,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ROOT_LABEL = "Saathi Explorer";
const INITIAL_TREE = [
  {
    id: "clients",
    name: "Clients",
    children: [
      {
        id: "client-a",
        name: "Client A",
        children: [
          {
            id: "ai-series",
            name: "AI Series",
            children: [{ id: "drafts", name: "Drafts", children: [] }],
          },
        ],
      },
    ],
  },
  { id: "personal", name: "Personal", children: [] },
  {
    id: "side-projects",
    name: "Side Projects",
    children: [{ id: "saathi", name: "Saathi", children: [] }],
  },
];
const INITIAL_EXPANDED = INITIAL_TREE.map((node) => node.id);

const createFolderId = (name) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

const renameFolderInTree = (nodes, targetId, nextName) => {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return { ...node, name: nextName };
    }
    if (!node.children?.length) {
      return node;
    }
    return {
      ...node,
      children: renameFolderInTree(node.children, targetId, nextName),
    };
  });
};

const getArticleStatus = (article) => {
  const contentLength = article.articleContent?.trim().length ?? 0;
  return contentLength < 80 ? "Draft" : "Active";
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
};

const MENU_OPTIONS = {
  folder: [
    { label: "Open", action: "open" },
    { label: "Rename", action: "rename" },
    { label: "New folder inside", action: "new-folder" },
    { label: "New article", action: "new-article" },
  ],
  file: [
    { label: "Open in editor", action: "open" },
    { label: "Rename", action: "rename" },
  ],
  empty: [
    { label: "New folder", action: "new-folder" },
    { label: "New article", action: "new-article" },
  ],
};

const flattenFolders = (nodes, parentPath = []) => {
  return nodes.flatMap((node) => {
    const entry = {
      id: node.id,
      name: node.name,
      path: [...parentPath, node.id],
    };
    return [
      entry,
      ...flattenFolders(node.children || [], [...parentPath, node.id]),
    ];
  });
};

const findNodeByPath = (nodes, pathIds) => {
  let current = { children: nodes };
  for (const id of pathIds) {
    const next = (current.children || []).find((node) => node.id === id);
    if (!next) return null;
    current = next;
  }
  return current;
};

const addFolderToPath = (nodes, pathIds, newNode) => {
  if (pathIds.length === 0) {
    return [...nodes, newNode];
  }
  const [currentId, ...rest] = pathIds;
  return nodes.map((node) => {
    if (node.id !== currentId) return node;
    if (rest.length === 0) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }
    return {
      ...node,
      children: addFolderToPath(node.children || [], rest, newNode),
    };
  });
};

function Dashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderTree, setFolderTree] = useState(INITIAL_TREE);
  const [expandedNodes, setExpandedNodes] = useState(INITIAL_EXPANDED);
  const [historyStack, setHistoryStack] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [folderInput, setFolderInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("newest");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

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

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  const pathStack = useMemo(
    () => historyStack[historyIndex],
    [historyIndex, historyStack]
  );
  const isRoot = pathStack.length === 0;
  const currentNode = useMemo(
    () => findNodeByPath(folderTree, pathStack),
    [folderTree, pathStack]
  );
  const currentFolder = currentNode?.name || ROOT_LABEL;
  const currentChildren = currentNode?.children || folderTree;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStack.length - 1;

  const visibleFolders = useMemo(() => {
    if (!normalizedSearch) return currentChildren;
    return currentChildren.filter((node) =>
      node.name.toLowerCase().includes(normalizedSearch)
    );
  }, [currentChildren, normalizedSearch]);

  const folderStats = useMemo(() => {
    const stats = new Map();
    const flatFolders = flattenFolders(folderTree);
    flatFolders.forEach((folder) => {
      const keyword = folder.name.replace(/\s+/g, "").toLowerCase();
      const matching = articles.filter((article) =>
        article.articleName?.toLowerCase().includes(keyword)
      );
      const totalLength = matching.reduce(
        (sum, article) => sum + (article.articleContent?.length ?? 0),
        0
      );
      const latest = matching.reduce((maxDate, article) => {
        const candidate = article.updatedAt || article.creationDate;
        if (!candidate) return maxDate;
        const time = new Date(candidate).getTime();
        return time > maxDate ? time : maxDate;
      }, 0);
      stats.set(folder.id, {
        count: matching.length,
        size:
          totalLength > 0
            ? `${Math.max(1, Math.round(totalLength / 1024))} KB`
            : "—",
        updated: latest ? formatDate(latest) : "—",
        status: matching.length ? "Active" : "Draft",
      });
    });
    return stats;
  }, [articles, folderTree]);

  const handleNewFolder = () => {
    if (!folderInput.trim()) return;
    const newNode = {
      id: createFolderId(folderInput.trim()),
      name: folderInput.trim(),
      children: [],
    };
    setFolderTree((prev) => addFolderToPath(prev, pathStack, newNode));
    setExpandedNodes((prev) =>
      prev.includes(newNode.id) ? prev : [...prev, newNode.id]
    );
    setFolderInput("");
    setShowNewFolder(false);
  };

  const navigateToPath = (nextPath) => {
    const nextKey = nextPath.join("/");
    const currentKey = pathStack.join("/");
    if (nextKey === currentKey) return;
    setHistoryStack((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, nextPath];
    });
    setHistoryIndex((prev) => prev + 1);
    setExpandedNodes((prev) =>
      Array.from(new Set([...prev, ...nextPath]))
    );
    setSelectedIds([]);
    setSelectedNodeId(null);
    setSearchTerm("");
  };

  const handleFolderDoubleClick = (folderId) => {
    navigateToPath([...pathStack, folderId]);
  };

  const handleNewArticle = async () => {
    const title = `Untitled Article ${new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleName: title,
          articleContent: "",
          createdBy: "guest",
        }),
      });
      const payload = await response.json();
      if (response.ok && payload?.data) {
        setArticles((prev) => [payload.data, ...prev]);
        router.push(`/editor?key=${payload.data.id}`);
      }
    } catch (error) {
      console.error("Failed to create article", error);
    }
  };

  const handleBackToRoot = () => {
    navigateToPath([]);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    setHistoryIndex((prev) => prev - 1);
    setSelectedIds([]);
    setSelectedNodeId(null);
    setSearchTerm("");
  };

  const handleForward = () => {
    if (!canGoForward) return;
    setHistoryIndex((prev) => prev + 1);
    setSelectedIds([]);
    setSelectedNodeId(null);
    setSearchTerm("");
  };

  const rowArticles = useMemo(() => {
    if (isRoot) {
      return [...articles]
        .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
        .slice(0, 8);
    }
    const keyword = currentFolder?.replace(/\s+/g, "").toLowerCase();
    return articles.filter((article) => {
      if (!article.articleName) return false;
      return article.articleName.toLowerCase().includes(keyword || "");
    });
  }, [articles, currentFolder, isRoot]);

  const filteredArticles = useMemo(() => {
    if (!normalizedSearch) return rowArticles;
    return rowArticles.filter((article) =>
      article.articleName?.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, rowArticles]);

  const tableRows = useMemo(() => {
    const folderRows = visibleFolders
      .map((folder) => {
        const stats = folderStats.get(folder.id) || {};
        return {
          id: folder.id,
          name: folder.name,
          type: "Folder",
          size: stats.size || "—",
          updated: stats.updated || "—",
          status: stats.status || "Draft",
          kind: "folder",
          path: [...pathStack, folder.id],
        };
      })
      .sort((a, b) =>
        sortKey === "alphabetical"
          ? a.name.localeCompare(b.name)
          : 0
      );

    const articleRows = [...filteredArticles]
      .sort((a, b) => {
        if (sortKey === "alphabetical") {
          return a.articleName.localeCompare(b.articleName);
        }
        return new Date(b.updatedAt || b.creationDate) -
          new Date(a.updatedAt || a.creationDate);
      })
      .map((article) => ({
        id: article.id,
        name: article.articleName,
        type: "Article",
        size:
          article.articleContent?.length > 0
            ? `${Math.max(
                1,
                Math.round(article.articleContent.length / 180)
              )} KB`
            : "—",
        updated: formatDate(article.updatedAt || article.creationDate),
        status: getArticleStatus(article),
        kind: "file",
      }));

    return [...folderRows, ...articleRows];
  }, [filteredArticles, folderStats, pathStack, sortKey, visibleFolders]);

  const sortLabel = useMemo(() => {
    if (sortKey === "alphabetical") return "A - Z";
    return "Newest";
  }, [sortKey]);

  const tableRowIds = useMemo(
    () => tableRows.map((row) => row.id),
    [tableRows]
  );

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => tableRowIds.includes(id))
    );
  }, [tableRowIds]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const tagName = target?.tagName;
      const isEditable =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isEditable) return;
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "a"
      ) {
        event.preventDefault();
        setSelectedIds(tableRowIds);
        setLastSelectedIndex(
          tableRowIds.length ? tableRowIds.length - 1 : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tableRowIds]);

  const handleRowSelect = (event, row, index) => {
    const isMeta = event.metaKey || event.ctrlKey;
    const isShift = event.shiftKey;
    setSelectedIds((prev) => {
      if (isShift && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        const rangeIds = tableRows
          .slice(start, end + 1)
          .map((item) => item.id);
        if (isMeta) {
          return Array.from(new Set([...prev, ...rangeIds]));
        }
        return rangeIds;
      }
      if (isMeta) {
        if (prev.includes(row.id)) {
          return prev.filter((id) => id !== row.id);
        }
        return [...prev, row.id];
      }
      return [row.id];
    });
    setLastSelectedIndex(index);
  };

  const handleToggleRow = (event, row, index) => {
    event.stopPropagation();
    setSelectedIds((prev) => {
      if (prev.includes(row.id)) {
        return prev.filter((id) => id !== row.id);
      }
      return [...prev, row.id];
    });
    setLastSelectedIndex(index);
  };

  const handleToggleAll = (event) => {
    event.stopPropagation();
    if (tableRowIds.length === 0) return;
    if (selectedIds.length === tableRowIds.length) {
      setSelectedIds([]);
      setLastSelectedIndex(null);
    } else {
      setSelectedIds(tableRowIds);
      setLastSelectedIndex(tableRowIds.length - 1);
    }
  };

  const openContextMenu = (event, payload) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      ...payload,
    });
    if (
      (payload.kind === "file" || payload.kind === "folder") &&
      payload.source !== "tree"
    ) {
      setSelectedIds([payload.id]);
    }
    if (payload.source === "tree") {
      setSelectedNodeId(payload.id);
    }
    if (typeof payload.index === "number") {
      setLastSelectedIndex(payload.index);
    }
  };

  const handleContextAction = async (action) => {
    if (!contextMenu) return;
    if (action === "open") {
      if (contextMenu.kind === "folder") {
        navigateToPath(contextMenu.path || []);
      }
      if (contextMenu.kind === "file") {
        router.push(`/editor?key=${contextMenu.id}`);
      }
    }
    if (action === "new-folder") {
      setShowNewFolder(true);
    }
    if (action === "new-article") {
      await handleNewArticle();
    }
    if (action === "rename" && contextMenu.name) {
      const nextName = window.prompt("Rename", contextMenu.name);
      if (nextName?.trim()) {
        if (contextMenu.kind === "folder") {
          setFolderTree((prev) =>
            renameFolderInTree(prev, contextMenu.id, nextName.trim())
          );
        }
        if (contextMenu.kind === "file") {
          try {
            const response = await fetch(`/api/articles/${contextMenu.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ articleName: nextName.trim() }),
            });
            const payload = await response.json();
            if (response.ok && payload?.data) {
              setArticles((prev) =>
                prev.map((article) =>
                  article.id === contextMenu.id
                    ? payload.data
                    : article
                )
              );
            }
          } catch (error) {
            console.error("Rename failed", error);
          }
        }
      }
    }
    setContextMenu(null);
  };

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ name: "Home", path: [] }];
    let nodes = folderTree;
    let path = [];
    for (const id of pathStack) {
      const next = nodes.find((node) => node.id === id);
      if (!next) break;
      path = [...path, id];
      crumbs.push({ name: next.name, path });
      nodes = next.children || [];
    }
    return crumbs;
  }, [folderTree, pathStack]);

  const toggleExpanded = (id) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderTree = (nodes, depth = 0, parentPath = []) => {
    return nodes.map((node) => {
      const nodePath = [...parentPath, node.id];
      const isExpanded = expandedNodes.includes(node.id);
      const hasChildren = (node.children || []).length > 0;
      const isActive = pathStack[pathStack.length - 1] === node.id;
      const isSelected = selectedNodeId === node.id;
      return (
        <div key={node.id}>
          <div
            onContextMenu={(event) =>
              openContextMenu(event, {
                kind: "folder",
                source: "tree",
                id: node.id,
                name: node.name,
                path: nodePath,
              })
            }
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
              isActive || isSelected
                ? "bg-white/10 text-white"
                : "text-slate-300"
            }`}
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
          >
            <button
              type="button"
              onClick={() => hasChildren && toggleExpanded(node.id)}
              className={`flex h-4 w-4 items-center justify-center text-slate-400 ${
                hasChildren ? "opacity-100" : "opacity-30"
              }`}
            >
              <ChevronRight
                size={12}
                className={`${isExpanded ? "rotate-90" : ""} transition`}
              />
            </button>
            <button
              type="button"
              onClick={() => setSelectedNodeId(node.id)}
              onDoubleClick={() => navigateToPath(nodePath)}
              className="flex flex-1 items-center gap-2 text-left"
            >
              <Folder size={14} className="text-amber-400" />
              <span className="truncate">{node.name}</span>
            </button>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderTree(node.children || [], depth + 1, nodePath)}</div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Loading files...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-6 text-slate-200">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400">
                Folder Tree
              </p>
              <button
                onClick={handleBackToRoot}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Home
              </button>
            </div>
            <button
              type="button"
              onDoubleClick={() => navigateToPath([])}
              onClick={() => setSelectedNodeId("root")}
              className={`mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs ${
                isRoot || selectedNodeId === "root"
                  ? "bg-white/10 text-white"
                  : "text-slate-300"
              }`}
            >
              <Folder size={14} className="text-amber-400" />
              <span className="truncate">{ROOT_LABEL}</span>
            </button>
            <div>{renderTree(folderTree)}</div>
          </aside>

          <main>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">All Files</p>
                <h1 className="text-2xl font-semibold text-white">
                  {currentFolder}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  disabled={!canGoBack}
                  className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                    canGoBack
                      ? "border-white/20 text-slate-200 hover:border-white/50"
                      : "border-white/10 text-slate-500"
                  }`}
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={handleForward}
                  disabled={!canGoForward}
                  className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                    canGoForward
                      ? "border-white/20 text-slate-200 hover:border-white/50"
                      : "border-white/10 text-slate-500"
                  }`}
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {breadcrumbs.map((crumb, index) => (
                <button
                  key={`${crumb.name}-${index}`}
                  onClick={() => navigateToPath(crumb.path)}
                  className="flex items-center gap-1 hover:text-white"
                >
                  {crumb.name}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight size={12} className="text-slate-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="h-9 w-full rounded-lg border border-white/10 bg-slate-950/40 px-10 text-xs text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-tight text-slate-400">
                <ArrowUpDown size={14} />
                Sort By
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="bg-transparent text-white outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="alphabetical">A - Z</option>
                </select>
                • {sortLabel}
              </div>
              <button
                onClick={handleNewArticle}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-slate-200"
              >
                <FilePlus size={14} />
                New Article
              </button>
              <button
                onClick={() => setShowNewFolder((prev) => !prev)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-slate-200"
              >
                <Plus size={14} />
                New Folder
              </button>
            </div>

            {showNewFolder && (
              <div className="mb-3 flex gap-2">
                <input
                  value={folderInput}
                  onChange={(e) => setFolderInput(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
                />
                <button
                  onClick={handleNewFolder}
                  className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-400"
                >
                  Create
                </button>
              </div>
            )}

            <div
              onContextMenu={(event) =>
                openContextMenu(event, { kind: "empty" })
              }
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40"
            >
              <div className="grid grid-cols-[0.35fr_2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.5fr] gap-2 border-b border-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-tight text-slate-400">
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      tableRowIds.length > 0 &&
                      selectedIds.length === tableRowIds.length
                    }
                    onChange={handleToggleAll}
                    className="h-3 w-3 rounded border-white/30 bg-slate-900"
                  />
                </span>
                <span>Name</span>
                <span>File Type</span>
                <span>File Size</span>
                <span>Last Modification</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              <div className="divide-y divide-white/5">
                {tableRows.map((row, index) => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <div
                      key={row.id}
                      onClick={(event) =>
                        handleRowSelect(event, row, index)
                      }
                      onContextMenu={(event) =>
                        openContextMenu(event, {
                          kind: row.kind,
                          id: row.id,
                          name: row.name,
                          path: row.path,
                          index,
                        })
                      }
                      onDoubleClick={() => {
                        if (row.kind === "folder") {
                          navigateToPath(row.path);
                        } else {
                          router.push(`/editor?key=${row.id}`);
                        }
                      }}
                      className={`grid grid-cols-[0.35fr_2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.5fr] items-center gap-2 px-3 py-2 text-xs text-slate-100 transition hover:bg-white/5 ${
                        isSelected ? "bg-white/5" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(event) =>
                          handleToggleRow(event, row, index)
                        }
                        className="h-3 w-3 rounded border-white/30 bg-slate-900"
                      />
                      <div className="flex items-center gap-2">
                        {row.kind === "folder" ? (
                          <Folder className="text-amber-400" size={16} />
                        ) : (
                          <FileText className="text-sky-400" size={16} />
                        )}
                        <span className="font-semibold text-white">
                          {row.name}
                        </span>
                      </div>
                      <span className="text-slate-400">{row.type}</span>
                      <span className="text-slate-400">{row.size}</span>
                      <span className="text-slate-400">{row.updated}</span>
                      <span>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                          {row.status}
                        </span>
                      </span>
                      <button className="flex items-center justify-center rounded-md border border-white/10 px-2 py-1 text-[11px] font-semibold text-white transition hover:border-slate-200">
                        <Eye size={12} />
                        View
                      </button>
                    </div>
                  );
                })}
                {tableRows.length === 0 && (
                  <div className="px-3 py-5 text-center text-xs text-slate-400">
                    No files in this folder yet.
                  </div>
                )}
              </div>
            </div>

            {contextMenu && (
              <div
                style={{ top: contextMenu.y, left: contextMenu.x }}
                className="fixed z-50 w-48 rounded-lg border border-white/10 bg-slate-950/95 p-1 text-xs text-slate-200 shadow-lg"
              >
                {(MENU_OPTIONS[contextMenu.kind] ||
                  MENU_OPTIONS.empty
                ).map((item) => (
                  <button
                    key={item.action}
                    onClick={() => handleContextAction(item.action)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-slate-200 transition hover:bg-white/10"
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={12} className="text-slate-500" />
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
