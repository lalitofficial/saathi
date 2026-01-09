import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

const DEFAULT_PDF_URL = process.env.PDF_LOADER_URL || "";
const FETCH_TIMEOUT_MS = 15000;

function parsePdfUrl(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") || DEFAULT_PDF_URL;
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
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
  const pdfUrl = parsePdfUrl(request);
  if (!pdfUrl) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid PDF URL." },
      { status: 400 }
    );
  }

  try {
    const response = await fetchWithTimeout(pdfUrl);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch PDF." },
        { status: 502 }
      );
    }

    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();
    const pdfTextContent = docs.map((d) => d.pageContent).join("\n");
    const sections = parseResume(pdfTextContent);

    return NextResponse.json({ success: true, sections });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "PDF parse failed." },
      { status: 500 }
    );
  }
}
