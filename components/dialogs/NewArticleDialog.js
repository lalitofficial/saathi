"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
function NewArticleDialog({ children }) {
  const [articleName, setArticleName] = useState();
  const [loading, setLoading] = useState(false);

  const onUpload = async () => {
    setLoading(true);
    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleName: articleName ?? "Untitled Article",
        articleContent: "<p>Lets Start Writing</p>",
        createdBy: null,
      }),
    });
    setLoading(false);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
            <DialogDescription asChild>
              <div className="">
                <div className="mt-2">
                  <label>File Name*</label>
                  <Input
                    onChange={(e) => setArticleName(e.target.value)}
                    placeholder="File Name"
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
              >
                Close
              </Button>
            </DialogClose>
            <Button onClick={onUpload} className="cursor-pointer">
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewArticleDialog;
