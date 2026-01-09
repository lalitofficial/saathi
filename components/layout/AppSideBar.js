import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Layout, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import NewArticleDialog from "@/components/dialogs/NewArticleDialog";

export default function AppSideBar() {
  return (
    <div className="shadow-lg h-screen p-7">
      <Image src={"/logo.svg"} alt="logo" width="170" height="170" />
      <div className="mt-10">
        <NewArticleDialog>
          <Button className="w-full cursor-pointer">+ New Article</Button>
        </NewArticleDialog>
        <div className="flex gap-2 items-center p-3 mt-3 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Layout />
          <h2>
            <a href="/workspace">Workspace</a>
          </h2>
        </div>
        <div className="flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Shield />
          <h2>
            <a href="/dashboard">Dashboard</a>
          </h2>
        </div>
      </div>
      <div className="absolute bottom-20 w-[80%]">
        <Progress value={33} />
        <p className="text-sm mt-2">2 out of 5 Pdf Uploaded</p>
        <p className="text-xs text-gray-400 mt-1">
          Upgrade to uplad more PDF
        </p>
      </div>
    </div>
  );
}
