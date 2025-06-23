// app/page.js
"use client";

import { useRef, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarRight } from "@/components/ui/sidebar-right";
import "./styles.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SideBar from "./_components/SideBar";
import { api } from "../../convex/_generated/api";

export default function Page({ children }) {
  const searchParams = useSearchParams();
  const articleID = searchParams.get("key");
  const article = useQuery(
    api.article.getArticleByID,
    articleID ? { id: articleID } : null
  );

  const containerRef = useRef(null);
  const rightRef = useRef(null);

  // only track right sidebar width
  const [rightWidth, setRightWidth] = useState(300);

  // drag state
  const dragging = useRef(false);
  const startX = useRef(0);
  const startRight = useRef(0);

  // global mouse handlers
  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current) return;
      const dx = e.clientX - startX.current;
      let newRight = startRight.current - dx;

      // get available space
      const total = containerRef.current.clientWidth;
      const minMain = 100;
      const minRight = 100;
      const maxRight = total - minMain;
      newRight = Math.max(minRight, Math.min(newRight, maxRight));

      setRightWidth(newRight);
    }

    function onMouseUp() {
      dragging.current = false;
      document.body.style.userSelect = "";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function handleMouseDown(e) {
    dragging.current = true;
    startX.current = e.clientX;
    startRight.current = rightRef.current.getBoundingClientRect().width;
    document.body.style.userSelect = "none";
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-1 h-[100vh] overflow-hidden" ref={containerRef}>
        {/* MAIN: flex‐fills, never collapses */}
        <div className="flex-1 flex flex-col overflow-auto min-w-[450px]">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Articles
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {article === undefined
                          ? "Loading..."
                          : article === null
                            ? "Not Found"
                            : article.articleName}
                      </BreadcrumbPage>{" "}
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            {children}
          </SidebarInset>
        </div>

        {/* DIVIDER */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-gray-300 hover:bg-gray-400 cursor-col-resize"
          style={{ width: 3, zIndex: 10 }}
        />

        {/* RIGHT SIDEBAR */}
        <div
          ref={rightRef}
          className="flex p-3 flex-col overflow-auto min-w-[380px]"
          style={{ width: rightWidth }}
        >
          <SideBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
