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
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";

function UploadPdfDialog({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.addFileEntryToDb);
  const convex = useConvex();

  const [fileName, setFileName] = useState();
  const { user } = useUser();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const onUpload = async () => {
    setLoading(true);

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId = uuid4();
    const fileUrl = await convex.query(api.fileStorage.getFileUrl, {
      storageId,
    });
    await addFileEntry({
      fileID: fileId,
      storageId,
      fileUrl,
      fileName: fileName ?? "Untitled File",
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    setLoading(false);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription asChild>
              <div className="">
                <h2 className="mt-5">Select a file to Upload</h2>
                <div className="border gap-2 p-3 rounded-md">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => onFileSelect(event)}
                  />
                </div>
                <div className="mt-2">
                  <label>File Name*</label>
                  <Input
                    onChange={(e) => setFileName(e.target.value)}
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

export default UploadPdfDialog;
