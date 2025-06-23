# SEO Audit API

A **Next.js** API for scalable, modular SEO auditing of any webpage. It fetches HTML (with SPA support via Puppeteer), parses with Cheerio, and runs configurable analyzers in parallel. Designed for extensibility, performance, and easy algorithm upgrades.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration & Environment](#configuration--environment)
5. [Usage](#usage)

   - [Endpoint](#endpoint)
   - [Request Schema](#request-schema)
   - [Response Schema](#response-schema)

6. [Analyzers](#analyzers)
7. [Extending & Algorithm Implementation](#extending--algorithm-implementation)
8. [Scalability & Performance](#scalability--performance)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- **Modular analyzers**: Add/remove checks without touching core logic
- **LRU HTML caching**: Avoid redundant fetches; TTL configurable
- **Headless browser fallback**: Puppeteer for JS-driven pages
- **Parallel execution**: All analyzers run concurrently with failure isolation
- **Detailed output**: Pass/fail, comments, values, nested data structures
- **Webhook support**: Async callback on completion

## Prerequisites

- Node.js v16+
- Next.js v13+ (App Router) with support for serverless API routes

## Installation

```bash
npm install lru-cache puppeteer cheerio
```

Copy the `app/api/seo/route.js` into your Next.js project.

## Configuration & Environment

- **Cache size & TTL**: adjust `new LRU({ max, ttl })` in `route.js`.
- **Puppeteer args**: configure launch options (headless, args) for containerized deployments.
- **Timeouts**: set fetch and analyzer timeouts via environment variables.

Example `.env`:

```
SEO_CACHE_MAX=200
SEO_CACHE_TTL=300000   # milliseconds
SEO_FETCH_TIMEOUT=10000
```

Load env in `route.js`:

```js
const htmlCache = new LRU({
  max: Number(process.env.SEO_CACHE_MAX),
  ttl: Number(process.env.SEO_CACHE_TTL),
});
```

## Usage

### Endpoint

```
POST /api/seo
```

### Request Schema

```jsonc
{
  "url": "https://example.com/page", // (string, required)
  "pdf": 0, // (integer, optional, default 0)
  "callback": "https://your.site/hook", // (string, optional)
  "targetKeyword": "coffee drinks", // (string, optional)
}
```

### Response Schema

```jsonc
{
  "success": true,
  "data": {
    "id": 1623456789012,
    "input": {
      /* echo of request */
    },
    "output": {
      /* analyzer results */
    },
  },
}
```

**Note**: On `callback`, the API immediately returns and later POSTs the full report JSON to the callback URL.

## Analyzers

Each key under `output` represents a check function in the `analyzers` map.

| Key                        | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `titleTag`                 | Checks `<title>` length (px ≤ 580)                            |
| `keywordInTitle`           | Searches for `targetKeyword` in the title                     |
| `metaDescriptionTag`       | Checks `<meta name="description">` length (px ≤ 1000)         |
| `keywordInDescription`     | Searches for `targetKeyword` in the description               |
| `serpSnippetPreview`       | Simulates SERP preview; validates snippet length              |
| `hreflangTag`              | Counts `<link rel="alternate" hreflang>` entries              |
| `langAttribute`            | Reads `<html lang>` attribute                                 |
| `h1HeaderUsage`            | Extracts and counts H1 tags                                   |
| `h2toH6Usage`              | Counts H2–H6 tags                                             |
| `keywordInH1`              | Searches for keyword in H1                                    |
| `keywordConsistency`       | Calculates keyword density (1–3% ideal)                       |
| `contentLength`            | Word count (≥ 300 words threshold)                            |
| `imageAltAttributes`       | Validates alt attributes on `<img>`                           |
| `targetKeywordInImageAlts` | Searches keyword in image alts                                |
| `canonicalTag`             | Reads `<link rel="canonical">`                                |
| `noindexTagTest`           | Ensures meta robots tag does not include `noindex`            |
| `noindexHeaderTest`        | Stub for X-Robots-Tag header test                             |
| `sslEnabled`               | Checks HTTPS URL scheme                                       |
| `httpsRedirect`            | Verifies HTTP→HTTPS redirect                                  |
| `robotsTxt`                | Fetches `/robots.txt` and checks status                       |
| `xmlSitemaps`              | Finds `/sitemap.xml` or `<link rel="sitemap">`                |
| ...                        | Add custom analyzers for schema, performance, backlinks, etc. |

## Extending & Algorithm Implementation

1. **Add analyzer stub** in `analyzers` map: key → async function
2. **Signature**: `async ({ $, url, keyword, output }) => { passed, comment, value?, data? }`
3. Use **Cheerio** to query HTML: `$('selector')`
4. For metrics requiring HTTP headers or JavaScript runtime, use **Puppeteer** or external APIs
5. Keep each analyzer focused and return minimal JSON for easier testing
6. **Unit tests**: write tests under `__tests__` that load sample HTML and assert analyzer outputs

## Scalability & Performance

- **Horizontal scaling**: Deploy multiple stateless instances behind a load balancer
- **Queue-based processing**: For heavy audits (PDF generation, full spidering), enqueue via RabbitMQ or managed queue, then callback
- **Rate limiting & retry**: Protect target sites by throttling fetch requests
- **Monitoring & Logging**: Integrate with Datadog/New Relic for analyzer latency, error rates
- **Feature toggles**: Enable/disable analyzers via config flags for progressive rollout

## Testing

- **Unit tests** for each analyzer using Jest or Mocha
- **Integration tests**: Mock HTTP fetch with `nock` and Puppeteer with `puppeteer-firefox-headless`

Example unit test for `titleTag`:

```js
import cheerio from "cheerio";
import { analyzers } from "../route";

test("titleTag passes on short title", async () => {
  const $ = cheerio.load("<html><head><title>Hi</title></head></html>");
  const result = await analyzers.titleTag({ $, url: "https://x.com" });
  expect(result.passed).toBe(true);
  expect(result.value).toBe("Hi");
});
```

## Contributing

1. Fork and clone
2. Install deps: `npm install`
3. Add tests
4. Submit PR with clear descriptions and test coverage

## License

MIT © Your Name
