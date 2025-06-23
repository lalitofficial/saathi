// File: app/api/seo/route.js
import { NextResponse } from "next/server";
import LRU from "lru-cache";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

// LRU cache for HTML content to reduce network overhead
const htmlCache = new LRU({ max: 100, ttl: 1000 * 60 * 5 }); // 5 minutes TTL

// Fetch HTML, with Puppeteer fallback for dynamic pages
async function fetchHtml(url) {
  if (htmlCache.has(url)) return htmlCache.get(url);
  let html = "";
  try {
    const res = await fetch(url);
    if (res.headers.get("content-type")?.includes("text/html")) {
      html = await res.text();
    } else {
      throw new Error("Non-HTML response");
    }
  } catch {
    // Fallback: headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    html = await page.content();
    await browser.close();
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
    const found = output.h1HeaderUsage.data.some((text) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    return {
      passed: found,
      comment: found ? "Keyword in H1" : "Keyword missing in H1",
    };
  },
  keywordConsistency: async ({ $, keyword }) => {
    const text = $("body").text().toLowerCase();
    const count = (text.match(new RegExp(keyword.toLowerCase(), "g")) || [])
      .length;
    const words = text.split(/\s+/).length;
    const density = ((count / words) * 100).toFixed(2);
    const passed = density >= 1 && density <= 3;
    return { passed, comment: `Density: ${density}%` };
  },
  contentLength: async ({ $ }) => {
    const words = $("body").text().trim().split(/\s+/).length;
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
      const res = await fetch(url.replace(/^https?:/, "http:"));
      return { passed: res.url.startsWith("https://") };
    } catch {
      return { passed: false };
    }
  },
  robotsTxt: async ({ url }) => {
    try {
      const res = await fetch(new URL("/robots.txt", url).href);
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
    if (!url) throw new Error("Missing URL");

    const html = await fetchHtml(url);
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
        input: { url, pdf, callback, targetKeyword },
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
