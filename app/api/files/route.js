import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileNameInput = formData.get("fileName");
    const createdBy = formData.get("createdBy") || null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "File is required." },
        { status: 400 }
      );
    }

    const originalName = file.name || "upload.pdf";
    const extension = path.extname(originalName) || ".pdf";
    const storageId = `${crypto.randomUUID()}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, storageId), fileBuffer);

    const fileName =
      typeof fileNameInput === "string" && fileNameInput.trim()
        ? fileNameInput.trim()
        : originalName;
    const fileUrl = `/uploads/${storageId}`;
    const fileId = crypto.randomUUID();

    const saved = await prisma.pdfFile.create({
      data: {
        fileId,
        storageId,
        fileName,
        fileUrl,
        createdBy: createdBy ? String(createdBy) : null,
      },
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed." },
      { status: 500 }
    );
  }
}
