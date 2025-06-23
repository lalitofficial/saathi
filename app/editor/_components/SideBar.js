import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function SideBar({ children }) {
  // Meta specifications state
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [canonicalResult, setCanonicalResult] = useState("");

  // Page Quality state
  const [wordCount, setWordCount] = useState(0);
  const [stopWords, setStopWords] = useState(0);
  const [qualityResult, setQualityResult] = useState("");

  // Page Structure state
  const [h1Count, setH1Count] = useState(0);
  const [headingOutline, setHeadingOutline] = useState([]);
  const [structureResult, setStructureResult] = useState("");

  // Link Structure state
  const [internalLinks, setInternalLinks] = useState(0);
  const [externalLinks, setExternalLinks] = useState(0);
  const [nofollowCount, setNofollowCount] = useState(0);
  const [linkResult, setLinkResult] = useState("");

  // Server Configuration state
  const [httpStatus, setHttpStatus] = useState("");
  const [isHttps, setIsHttps] = useState(false);
  const [serverResult, setServerResult] = useState("");

  // External Factors state
  const [backlinks, setBacklinks] = useState(0);
  const [refDomains, setRefDomains] = useState(0);
  const [socialShares, setSocialShares] = useState(0);
  const [externalResult, setExternalResult] = useState("");

  // Dummy handlers
  const handleMetaTitleChange = (e) => setMetaTitle(e.target.value);
  const handleMetaDescChange = (e) => setMetaDesc(e.target.value);
  const handleCanonicalTest = () =>
    setCanonicalResult(
      canonicalUrl ? "✔️ Valid canonical URL" : "⚠️ Please enter a URL"
    );

  const analyzePageQuality = () => {
    setWordCount(1024);
    setStopWords(34);
    setQualityResult("✅ Page quality OK");
  };

  const analyzePageStructure = () => {
    setH1Count(1);
    setHeadingOutline([
      "H1: Title",
      "H2: Meta Specs",
      "H2: Page Quality",
      "H2: Page Structure",
    ]);
    setStructureResult("✅ Structure OK");
  };

  const analyzeLinkStructure = () => {
    setInternalLinks(12);
    setExternalLinks(5);
    setNofollowCount(2);
    setLinkResult("✅ Links OK");
  };

  const checkServerConfiguration = () => {
    setHttpStatus("200 OK");
    setIsHttps(true);
    setServerResult("✅ Server config OK");
  };

  const analyzeExternalFactors = () => {
    setBacklinks(27);
    setRefDomains(4);
    setSocialShares(8);
    setExternalResult("✅ External factors OK");
  };

  fetch("/api/seo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Types of Coffee Drinks Explained",
      description:
        "Learn about lattes, espressos, and more in this beginner guide.",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data.comments));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 space-y-6">
      {/* Meta Specifications */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">
          Meta Specifications
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Title
            </label>
            <input
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter title..."
              value={metaTitle}
              onChange={handleMetaTitleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter description..."
              value={metaDesc}
              onChange={handleMetaDescChange}
            />
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/page"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />
            </div>
            <button
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
              onClick={handleCanonicalTest}
            >
              Test
            </button>
          </div>
          {canonicalResult && (
            <p className="text-sm mt-1 text-green-500">{canonicalResult}</p>
          )}
        </div>
      </section>

      {/* Page Quality */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Page Quality
          </h2>
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            onClick={analyzePageQuality}
          >
            Analyze
          </button>
        </div>
        <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            Word count: <span className="font-medium">{wordCount}</span>
          </p>
          <p>
            Stop-word %: <span className="font-medium">{stopWords}%</span>
          </p>
          {qualityResult && (
            <p>
              Result:{" "}
              <span className="font-medium text-green-500">
                {qualityResult}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* Page Structure */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Page Structure
          </h2>
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            onClick={analyzePageStructure}
          >
            Analyze
          </button>
        </div>
        <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            H1 count: <span className="font-medium">{h1Count}</span>
          </p>
          <div>
            <p className="font-medium">Headings:</p>
            <ul className="list-disc ml-5">
              {headingOutline.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          {structureResult && (
            <p>
              Result:{" "}
              <span className="font-medium text-green-500">
                {structureResult}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* Link Structure */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Link Structure
          </h2>
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            onClick={analyzeLinkStructure}
          >
            Analyze
          </button>
        </div>
        <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            Internal links: <span className="font-medium">{internalLinks}</span>
          </p>
          <p>
            External links: <span className="font-medium">{externalLinks}</span>
          </p>
          <p>
            nofollow count: <span className="font-medium">{nofollowCount}</span>
          </p>
          {linkResult && (
            <p>
              Result:{" "}
              <span className="font-medium text-green-500">{linkResult}</span>
            </p>
          )}
        </div>
      </section>

      {/* Server Configuration */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Server Configuration
          </h2>
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            onClick={checkServerConfiguration}
          >
            Check
          </button>
        </div>
        <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            HTTP Status: <span className="font-medium">{httpStatus}</span>
          </p>
          <p>
            HTTPS:{" "}
            <span className="font-medium">
              {isHttps ? "Enabled" : "Disabled"}
            </span>
          </p>
          {serverResult && (
            <p>
              Result:{" "}
              <span className="font-medium text-green-500">{serverResult}</span>
            </p>
          )}
        </div>
      </section>

      {/* External Factors */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            External Factors
          </h2>
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            onClick={analyzeExternalFactors}
          >
            Analyze
          </button>
        </div>
        <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <p>
            Backlinks: <span className="font-medium">{backlinks}</span>
          </p>
          <p>
            Referring domains: <span className="font-medium">{refDomains}</span>
          </p>
          <p>
            Social shares: <span className="font-medium">{socialShares}</span>
          </p>
          {externalResult && (
            <p>
              Result:{" "}
              <span className="font-medium text-green-500">
                {externalResult}
              </span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
