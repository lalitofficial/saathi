<p align="center">
  <img src="public/readme-banner.svg" alt="Saathi banner" width="100%" />
</p>

# Saathi

Saathi is an AI powered SEO workspace for PDF-based content and article editing. It combines a Next.js UI, a rich text editor, and a PostgreSQL-backed data layer with Clerk authentication to streamline content creation and SEO review.

## Overview

- Upload PDFs and store metadata in PostgreSQL.
- Edit and manage articles with a TipTap-based editor.
- Run an SEO audit against any URL through a dedicated API route.
- Work inside a Next.js App Router UI with Clerk authentication.

## Key Features

- PDF upload flow with stored metadata and local file storage.
- Rich text editing with TipTap.
- SEO analyzer API with HTML parsing and Puppeteer fallback.
- Modular UI components for dashboard and workspace.
- Prisma schema for users, articles, and PDF files.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- PostgreSQL + Prisma
- Clerk (auth)
- TipTap editor
- Puppeteer + Cheerio (SEO analysis)
- Tailwind CSS 4

## Project Structure

- `app/` Next.js routes, pages, and API handlers
- `components/` shared UI and layout components
- `prisma/` database schema and migrations
- `public/` static assets

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database (local or hosted)

### Install

```bash
npm install
```

### Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PDF_LOADER_URL=
```

Notes:
- `PDF_LOADER_URL` is optional and used as a default for `/api/pdf-loader`.
- Clerk variables depend on your Clerk project setup.

### Run Locally

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

### Start and Use the App

Start:

1. Run migrations: `npx prisma migrate dev --name init`.
2. Run the Next.js app: `npm run dev`.
3. Open `http://localhost:3000`.

Use:

1. Sign up or sign in with Clerk.
2. Go to the Dashboard to view your articles list.
3. Click **+ New Article** to create an article.
4. Open an article to use the editor and start writing.
5. Use **Upload PDF** to attach and store PDFs locally.
6. Use the Workspace tools (like the title analyzer) to review content quality.

## API

### POST `/api/seo`

Request body:

```json
{
  "url": "https://example.com",
  "targetKeyword": "coffee"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "input": {
      "url": "https://example.com",
      "pdf": 0,
      "callback": "",
      "targetKeyword": "coffee"
    },
    "output": {}
  }
}
```

Notes:
- The API accepts `pdf` and `callback` fields but does not use them yet.
- SSRF protections block local and private hosts.
- See `app/api/seo/readme.md` for analyzer details.

### GET `/api/pdf-loader`

```bash
curl "http://localhost:3000/api/pdf-loader?url=https://example.com/file.pdf"
```

Response:

```json
{
  "success": true,
  "sections": {}
}
```

## File Uploads

PDFs uploaded through the UI are saved to `public/uploads` in local development,
and their metadata is stored in PostgreSQL. For production, swap this for a
managed object store (S3, GCS, etc).

## Scripts

- `npm run dev` start dev server
- `npm run build` build for production
- `npm run start` start production server
- `npm run lint` run Next.js lint

## Deployment

- Vercel is the recommended target for Next.js.
- Ensure your PostgreSQL database is reachable and `DATABASE_URL` is set.

## License

Not specified.
