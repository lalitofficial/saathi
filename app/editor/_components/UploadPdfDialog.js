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
function UploadPdfDialog({ children }) {
  const [fileName, setFileName] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };
  const OnUpload = async () => {
    setLoading(true);

    if (!file) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName ?? "Untitled File");
    formData.append("createdBy", "");

    await fetch("/api/files", {
      method: "POST",
      body: formData,
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
                    onChange={(event) => OnFileSelect(event)}
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
            <Button onClick={OnUpload} className="cursor-pointer">
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadPdfDialog;
