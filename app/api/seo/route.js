// File: app/api/seo/route.js
import { NextResponse } from "next/server";
import LRU from "lru-cache";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

// LRU cache for HTML content to reduce network overhead
const htmlCache = new LRU({ max: 100, ttl: 1000 * 60 * 5 }); // 5 minutes TTL
const FETCH_TIMEOUT_MS = 15000;
const PUPPETEER_TIMEOUT_MS = 20000;
const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);
const BLOCKED_HOST_SUFFIXES = [".local", ".internal"];
const PRIVATE_HOST_PATTERNS = [
  /^10\./,
  /^127\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  try {
    const parsed = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    const host = parsed.hostname;
    if (BLOCKED_HOSTS.has(host)) return null;
    if (BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
      return null;
    }
    if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Fetch HTML, with Puppeteer fallback for dynamic pages
async function fetchHtml(url) {
  if (htmlCache.has(url)) return htmlCache.get(url);
  let html = "";
  try {
    const res = await fetchWithTimeout(url);
    if (
      res.ok &&
      res.headers.get("content-type")?.includes("text/html")
    ) {
      html = await res.text();
    } else {
      throw new Error("Non-HTML response");
    }
  } catch {
    // Fallback: headless browser
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(PUPPETEER_TIMEOUT_MS);
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: PUPPETEER_TIMEOUT_MS,
      });
      html = await page.content();
    } finally {
      await browser.close();
    }
  }
  htmlCache.set(url, html);
  return html;
}

// Standard analyzer signature: async ({ $, url, keyword }) => result
const analyzers = {
  titleTag: async ({ $ }) => {
    const title = $("head > title").text().trim();
    const lengthPx = title.length * 7;
    return {
      passed: lengthPx <= 580,
      value: title,
      comment: `Title length: ${lengthPx}px`,
    };
  },
  keywordInTitle: async ({ output, keyword }) => {
    if (!keyword) {
      return { passed: false, comment: "No target keyword provided" };
    }
    const present = output.titleTag.value
      .toLowerCase()
      .includes(keyword.toLowerCase());
    return {
      passed: present,
      comment: present ? "Keyword in title" : "Keyword missing in title",
    };
  },
  metaDescriptionTag: async ({ $ }) => {
    const desc = $('meta[name="description"]').attr("content") || "";
    const lengthPx = desc.length * 7;
    return {
      passed: lengthPx <= 1000,
      value: desc,
      comment: `Meta description length: ${lengthPx}px`,
    };
  },
  keywordInDescription: async ({ output, keyword }) => {
    if (!keyword) {
      return { passed: false, comment: "No target keyword provided" };
    }
    const present = output.metaDescriptionTag.value
      .toLowerCase()
      .includes(keyword.toLowerCase());
    return {
      passed: present,
      comment: present
        ? "Keyword in description"
        : "Keyword missing in description",
    };
  },
  serpSnippetPreview: async ({ output }) => {
    const snippet = `${output.titleTag.value} - ${output.metaDescriptionTag.value}`;
    return {
      passed: snippet.length < 160,
      value: snippet,
      comment: `Preview length: ${snippet.length}`,
    };
  },
  hreflangTag: async ({ $ }) => {
    const count = $('link[rel="alternate"][hreflang]').length;
    return {
      passed: count > 0,
      count,
      comment: `${count} hreflang tags found`,
    };
  },
  langAttribute: async ({ $ }) => {
    const lang = $("html").attr("lang") || "";
    return { passed: Boolean(lang), value: lang, comment: `lang="${lang}"` };
  },
  h1HeaderUsage: async ({ $ }) => {
    const h1 = $("h1")
      .map((i, el) => $(el).text().trim())
      .get();
    return {
      passed: h1.length === 1,
      data: h1,
      comment: `${h1.length} H1 tags found`,
    };
  },
  h2toH6Usage: async ({ $ }) => {
    const counts = {};
    for (let i = 2; i <= 6; i++) counts[`h${i}`] = $(`h${i}`).length;
    return { passed: true, data: counts, comment: "Counts for H2–H6" };
  },
  keywordInH1: async ({ output, keyword }) => {
    if (!keyword) {
      return { passed: false, comment: "No target keyword provided" };
    }
    const found = output.h1HeaderUsage.data.some((text) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    return {
      passed: found,
      comment: found ? "Keyword in H1" : "Keyword missing in H1",
    };
  },
  keywordConsistency: async ({ $, keyword }) => {
    if (!keyword) {
      return { passed: false, comment: "No target keyword provided" };
    }
    const text = $("body").text().toLowerCase();
    const safeKeyword = escapeRegExp(keyword.toLowerCase());
    const count = (text.match(new RegExp(safeKeyword, "g")) || [])
      .length;
    const words = text.split(/\s+/).filter(Boolean).length;
    const density = ((count / words) * 100).toFixed(2);
    const passed = density >= 1 && density <= 3;
    return { passed, comment: `Density: ${density}%` };
  },
  contentLength: async ({ $ }) => {
    const words = $("body").text().trim().split(/\s+/).filter(Boolean).length;
    return {
      passed: words >= 300,
      wordCount: words,
      comment: `Word count: ${words}`,
    };
  },
  imageAltAttributes: async ({ $ }) => {
    const images = $("img");
    const missing = images.filter((i, el) => !$(el).attr("alt")).length;
    return {
      passed: missing === 0,
      total: images.length,
      missing,
      comment: `${missing} images missing alt`,
    };
  },
  targetKeywordInImageAlts: async ({ $, keyword }) => {
    const present = $("img[alt]").filter((i, el) =>
      $(el).attr("alt").toLowerCase().includes(keyword.toLowerCase())
    ).length;
    return {
      passed: present > 0,
      count: present,
      comment: `${present} images contain keyword`,
    };
  },
  canonicalTag: async ({ $, url }) => {
    const canon = $('link[rel="canonical"]').attr("href") || url;
    return { passed: true, value: canon, comment: "" };
  },
  noindexTagTest: async ({ $ }) => {
    const robotsMeta = $('meta[name="robots"]').attr("content") || "";
    return { passed: !robotsMeta.includes("noindex"), comment: robotsMeta };
  },
  noindexHeaderTest: async () => {
    // Assuming server header access not possible in Next.js Serverless
    return { passed: true, comment: "Header unavailable in this context" };
  },
  sslEnabled: async ({ url }) => ({ passed: url.startsWith("https://") }),
  httpsRedirect: async ({ url }) => {
    try {
      const res = await fetchWithTimeout(url.replace(/^https?:/, "http:"));
      return { passed: res.url.startsWith("https://") };
    } catch {
      return { passed: false };
    }
  },
  robotsTxt: async ({ url }) => {
    try {
      const res = await fetchWithTimeout(new URL("/robots.txt", url).href);
      return { passed: res.ok, path: "/robots.txt" };
    } catch {
      return { passed: false, path: "" };
    }
  },
  xmlSitemaps: async ({ $, url }) => {
    const sitemaps = $('link[rel="sitemap"]')
      .map((i, el) => $(el).attr("href"))
      .get();
    if (!sitemaps.length) sitemaps.push(new URL("/sitemap.xml", url).href);
    return { passed: sitemaps.length > 0, paths: sitemaps, comment: "" };
  },
  // Add additional analyzers as needed...
};

export async function POST(request) {
  try {
    const {
      url,
      pdf = 0,
      callback = "",
      targetKeyword = "",
    } = await request.json();
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) throw new Error("Invalid or unsafe URL");

    const html = await fetchHtml(normalizedUrl);
    const $ = cheerio.load(html);

    // Collect results
    const output = {};
    for (const [key, fn] of Object.entries(analyzers)) {
      try {
        output[key] = await fn({ $, url, keyword: targetKeyword, output });
      } catch (e) {
        output[key] = { passed: false, error: e.message };
      }
    }

    const report = {
      success: true,
      data: {
        id: Date.now(),
        input: { url: normalizedUrl, pdf, callback, targetKeyword },
        output,
      },
    };
    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
