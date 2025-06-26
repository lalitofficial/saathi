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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";

function NewArticleDialog({ children }) {
  const createArticle = useMutation(api.article.createArticle);

  const [articleName, setArticleName] = useState();
  const { user } = useUser();
  // const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  // const OnFileSelect = (event) => {
  //   setFile(event.target.files[0]);
  // };
  const OnUpload = async () => {
    setLoading(true);

    const articleId = uuid4();
    // Step 3: Save the newly allocated storage id to the database
    const resp = await createArticle({
      articleID: articleId,
      articleContent: "<p>Lets Start Writing</p>",
      creationDate: Date.now(),
      articleName: articleName ?? "Untitled Article",
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log("Response ", resp);
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
            <Button onClick={OnUpload} className="cursor-pointer">
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewArticleDialog;
