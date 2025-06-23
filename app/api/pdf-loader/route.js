import { NextResponse } from "next/server";
import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

const pdfPath =
  "https://cautious-gnat-501.convex.cloud/api/storage/65ac2f09-3914-4fa8-998d-cc1e49513aa4";
function parseResume(raw) {
  // 1. split into non-empty lines
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const result = {};
  let current = "HEADER";
  result[current] = [];

  for (const line of lines) {
    // 2. all-caps (and >=3 chars) = new section
    if (/^[A-Z0-9 &\-]{3,}$/.test(line)) {
      current = line;
      result[current] = [];
    } else {
      result[current].push(line);
    }
  }

  // 3. join each section’s lines
  return Object.fromEntries(
    Object.entries(result).map(([section, arr]) => [section, arr.join(" ")])
  );
}

export async function GET(request) {
  const response = await fetch(pdfPath);
  const data = await response.blob();

  const loader = new WebPDFLoader(data);

  const docs = await loader.load();
  const pdfTextContent = docs.map((d) => d.pageContent).join("\n");

  // parse into sections
  const sections = parseResume(pdfTextContent);
  // pretty-print with 2-space indentation
  const body = JSON.stringify({ sections }, null, 2);

  return new NextResponse(body, {
    headers: { "Content-Type": "application/json" },
  });
}
