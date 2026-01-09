<p align="center">
  <img src="public/readme-banner.svg" alt="Saathi banner" width="100%" />
</p>

# Saathi

Saathi is an AI powered SEO workspace for PDF-based content and article editing. It combines a Next.js UI, a rich text editor, and a PostgreSQL-backed data layer with Clerk authentication to streamline content creation and SEO review.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Flow](#setup-flow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Prerequisites: Install Node.js](#prerequisites-install-nodejs)
  - [Prerequisites: Install PostgreSQL](#prerequisites-install-postgresql)
  - [Prerequisites: Clerk Account and Keys](#prerequisites-clerk-account-and-keys)
  - [Install](#install)
  - [Configure Environment](#configure-environment)
  - [No PostgreSQL Installed?](#no-postgresql-installed)
  - [Initialize the Database (Prisma)](#initialize-the-database-prisma)
  - [Run Locally](#run-locally)
  - [Start and Use the App](#start-and-use-the-app)
- [API](#api)
  - [POST /api/seo](#post-apiseo)
  - [GET /api/pdf-loader](#get-apipdf-loader)
- [File Uploads](#file-uploads)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

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

Visual layout:
```
saathi/
├─ app/
│  ├─ api/
│  ├─ dashboard/
│  ├─ editor/
│  └─ workspace/
├─ components/
├─ prisma/
├─ public/
├─ package.json
└─ README.md
```

## Setup Flow

```
Install Tools -> Configure Environment -> Initialize Database -> Run App -> Use UI
     |                   |                    |                 |         |
   Node.js            .env.local         Prisma migrate      next dev   Dashboard
   PostgreSQL         Clerk keys          Database URL       localhost  Workspace
```

### Visual Checklist

Use this checklist to confirm your setup is complete:

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] PostgreSQL running (`psql --version`)
- [ ] Clerk keys added to `.env.local`
- [ ] `DATABASE_URL` points to a working database
- [ ] Prisma migration ran successfully
- [ ] App running at `http://localhost:3000`

### Quickstart (Copy/Paste)

If you already have Node.js, Postgres, and Clerk keys:

```bash
npm install
# create .env.local with DATABASE_URL + Clerk keys
npx prisma migrate dev --name init
npm run dev
```

## Getting Started

### Prerequisites

Core:
- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn, but npm is assumed below)
- PostgreSQL 14+ (local or hosted)
- Clerk account (for auth keys)

Optional:
- Git (if you plan to clone/fork)
- Docker Desktop (if you want a local Postgres without installing it natively)

Verify tools are installed:
```bash
node -v
npm -v
psql --version
```

If any command fails, install that prerequisite using the sections below.

### Prerequisites: Install Node.js

Recommended (nvm, works on macOS/Linux):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 18
nvm use 18
```

Windows (official installer):
- Download from the Node.js website and install Node 18+.
- Re-open the terminal after install.

Verify:
```bash
node -v
npm -v
```

### Prerequisites: Install PostgreSQL

Choose one option:

Option A: Native install (macOS Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

Option B: Native install (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Option C: Native install (Windows Chocolatey)
```powershell
choco install postgresql --version=16.0
```

Option D: Docker (cross-platform, no local install)
```bash
docker run --name saathi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saathi \
  -p 5432:5432 \
  -d postgres:16
```

Verify:
```bash
psql --version
```

Create a database and user (local install):

```bash
psql -U postgres
```

Inside the `psql` shell:
```sql
CREATE USER saathi_user WITH PASSWORD 'saathi_password';
CREATE DATABASE saathi OWNER saathi_user;
GRANT ALL PRIVILEGES ON DATABASE saathi TO saathi_user;
```

Exit:
```sql
\q
```

Test the connection:
```bash
psql "postgresql://saathi_user:saathi_password@localhost:5432/saathi"
```

### Prerequisites: Clerk Account and Keys

1. Create a Clerk account.
2. Create a new Clerk application.
3. Copy the publishable key and secret key from your dashboard.
4. Add `http://localhost:3000` to allowed origins or redirect URLs if needed.

You will use these values in `.env.local`.

### Install

Clone or copy the project, then install dependencies:

```bash
npm install
```

What this does:
- Reads `package.json` and `package-lock.json`.
- Installs dependencies into `node_modules/`.

### Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PDF_LOADER_URL=
```

Where to place this file:
- Create `.env.local` in the project root (same folder as `package.json`).

Notes:
- `PDF_LOADER_URL` is optional and used as a default for `/api/pdf-loader`.
- Clerk variables depend on your Clerk project setup.
- `DATABASE_URL` must point to a running Postgres database.

Variable-by-variable:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: public key from Clerk dashboard.
- `CLERK_SECRET_KEY`: secret key from Clerk dashboard (server-side only).
- `DATABASE_URL`: Postgres connection string used by Prisma.
- `PDF_LOADER_URL`: optional default PDF URL for `/api/pdf-loader`.

Example `.env.local` (local Postgres):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_example
CLERK_SECRET_KEY=sk_test_example
DATABASE_URL=postgresql://saathi_user:saathi_password@localhost:5432/saathi?schema=public
PDF_LOADER_URL=
```

DATABASE_URL format (visual):
```
postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public
            |    |       |    |        |
            |    |       |    |        +-- database name
            |    |       |    +----------- port (5432 default)
            |    |       +---------------- host (localhost or provider host)
            |    +------------------------ password
            +----------------------------- username
```

### No PostgreSQL Installed?

Use one of these options:

Option A: Local Postgres via Docker

```bash
docker run --name saathi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saathi \
  -p 5432:5432 \
  -d postgres:16
```

Then set:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saathi?schema=public
```

Verify container is running:
```bash
docker ps
```

Option B: Hosted Postgres (Neon, Supabase, Railway)

1. Create a database in your provider dashboard.
2. Copy the connection string.
3. Paste it into `DATABASE_URL` in `.env.local`.
4. If your provider requires SSL, append `?sslmode=require` to the URL.

### Initialize the Database (Prisma)

This step creates the tables defined in `prisma/schema.prisma`.

```bash
npx prisma migrate dev --name init
```

What this does:
- Creates a new migration in `prisma/migrations/`.
- Applies the migration to your database.
- Generates the Prisma client.

Optional: open Prisma Studio to inspect data:
```bash
npx prisma studio
```

### Run Locally

Step-by-step:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run migrations (creates tables):
   ```bash
   npx prisma migrate dev --name init
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

All-in-one (after `npm install` is done):
```bash
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

Navigation flow (visual):
```
Home -> Dashboard -> New Article -> Editor -> Save
            |
            +-> Workspace -> Title Analyzer
```

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

## Troubleshooting

Common issues and fixes:

- `Error: DATABASE_URL is not set`
  - Ensure `.env.local` exists and includes `DATABASE_URL`.
  - Restart the dev server after editing environment variables.

- `P1001: Can't reach database server`
  - Verify Postgres is running.
  - Check host/port in `DATABASE_URL`.
  - If using Docker, confirm port 5432 is published.

- `Prisma migrate` errors
  - Ensure the database user has create table privileges.
  - Delete `prisma/migrations` only if you want a fresh start and the DB is disposable.

- Clerk auth not working
  - Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
  - Make sure `http://localhost:3000` is allowed in Clerk settings.

## License

Not specified.
