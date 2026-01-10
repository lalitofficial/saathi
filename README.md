<p align="center">
  <img src="public/readme-banner.svg" alt="Saathi banner" width="100%" />
</p>

# Saathi

Saathi is an AI powered SEO workspace for PDF-based content and article editing. It combines a Next.js UI, a rich text editor, and a PostgreSQL-backed data layer to streamline content creation and SEO review.

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
  - [Install](#install)
  - [Configure Environment](#configure-environment)
  - [No PostgreSQL Installed?](#no-postgresql-installed)
  - [Initialize the Database (Prisma)](#initialize-the-database-prisma)
  - [Run Locally](#run-locally)
  - [Start and Use the App](#start-and-use-the-app)
- [Full Setup Paths](#full-setup-paths)
  - [Path A: Local PostgreSQL Installed](#path-a-local-postgresql-installed)
  - [Path B: Docker PostgreSQL](#path-b-docker-postgresql)
  - [Path C: Hosted PostgreSQL](#path-c-hosted-postgresql)
- [App Health Checks](#app-health-checks)
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
- Work inside a Next.js App Router UI.

## Key Features

- PDF upload flow with stored metadata and local file storage.
- Rich text editing with TipTap.
- Explorer-style dashboard with folder tree, search, filters, drag + drop, and context menus (rename/delete).
- SEO analyzer API with HTML parsing and Puppeteer fallback.
- Modular UI components for dashboard and workspace.
- Prisma schema for users, articles, and PDF files.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- PostgreSQL + Prisma
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
   PostgreSQL         DATABASE_URL        Database URL       localhost  Workspace
```

### Visual Checklist

Use this checklist to confirm your setup is complete:

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] PostgreSQL running (`psql --version`)
- [ ] `DATABASE_URL` points to a working database
- [ ] Prisma migration ran successfully
- [ ] App running at `http://localhost:3000`

### Quickstart (Copy/Paste)

If you already have Node.js and Postgres:

```bash
npm install
# create .env.local with DATABASE_URL
npx prisma migrate dev --name init
npm run dev
```

### Default Local Setup (Fresh Machine)

Use this when you have nothing installed yet and want a full, local setup.

Step 1: Install Node.js (macOS/Linux via nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 18
nvm use 18
```

Step 2: Install PostgreSQL (choose your OS)

macOS (Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
```

Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Windows (Chocolatey):
```powershell
choco install postgresql --version=16.0
```

Step 3: Create a database and user (local install)
```bash
psql -U $USER
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

Step 4: Create `.env.local` in the project root
```bash
DATABASE_URL=postgresql://saathi_user:saathi_password@localhost:5432/saathi?schema=public
PDF_LOADER_URL=
```

Step 5: Install dependencies and initialize the database
```bash
npm install
npx prisma migrate dev --name init
```

Step 6: Run the app
```bash
npm run dev
```

Open `http://localhost:3000`.

### Default Setup (Docker Postgres)

Use this if you do not want to install Postgres natively.

Step 1: Start Postgres in Docker
```bash
docker run --name saathi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saathi \
  -p 5432:5432 \
  -d postgres:16
```

Step 2: Create `.env.local`
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saathi?schema=public
PDF_LOADER_URL=
```

Step 3: Install dependencies, migrate, and run
```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

## Getting Started

### Prerequisites

Core:
- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn, but npm is assumed below)
- PostgreSQL 14+ (local or hosted)

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

If you see `zsh: command not found: psql`, add Postgres to your PATH:

macOS (Homebrew):
```bash
brew --prefix postgresql@16
echo 'export PATH="$(brew --prefix postgresql@16)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
psql --version
```

Docker alternative (no PATH needed):
```bash
docker exec -it saathi-postgres psql -U postgres
```

Default user note:
- For local installs, your default Postgres user is often your OS user.
- Use `$USER` to connect if `postgres` does not exist:
  ```bash
  psql -U $USER
  ```

Create a database and user (local install):

```bash
psql -U postgres
```

Inside the `psql` shell:
```sql
CREATE USER saathi_user WITH PASSWORD 'saathi_password' CREATEDB;
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

Why CREATEDB?
- `prisma migrate dev` uses a shadow database and needs permission to create it.

If you already created the user without `CREATEDB`, fix it:
```bash
psql -U postgres -c "ALTER ROLE saathi_user CREATEDB;"
```

If you get `FATAL: database "<your_user>" does not exist` when running `psql -U $USER`,
connect to the default `postgres` database instead:
```bash
psql -U $USER -d postgres
```
Then create the `saathi` database as shown above.

If you see `FATAL: role "postgres" does not exist`:

Option A (use your OS user):
```bash
psql -U $USER
```

Option B (create a postgres superuser role):
```bash
createuser -s postgres
psql -U postgres
```

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
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PDF_LOADER_URL=
```

Where to place this file:
- Create `.env.local` in the project root (same folder as `package.json`).

Notes:
- `PDF_LOADER_URL` is optional and used as a default for `/api/pdf-loader`.
- `DATABASE_URL` must point to a running Postgres database.

Important:
- Prisma CLI reads `.env` by default.
- Next.js reads `.env.local` by default.

Recommended: put `DATABASE_URL` in both `.env` and `.env.local`.

If you see `Environment variable not found: DATABASE_URL`, copy `DATABASE_URL`
into `.env`:
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
```

Variable-by-variable:
- `DATABASE_URL`: Postgres connection string used by Prisma.
- `PDF_LOADER_URL`: optional default PDF URL for `/api/pdf-loader`.

Example `.env.local` (local Postgres):
```bash
DATABASE_URL=postgresql://saathi_user:saathi_password@localhost:5432/saathi?schema=public
PDF_LOADER_URL=
```

If you cannot grant `CREATEDB` to your user, use `prisma db push` instead of
`prisma migrate dev` to initialize the schema:
```bash
npx prisma db push
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

If you get `P3014` (permission denied to create database), grant the user
`CREATEDB` or run:
```bash
npx prisma db push
```

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

1. Open the Dashboard to view your articles list.
2. Click **+ New Article** to create an article.
3. Double-click an article to open it in the editor.
4. Use **Upload PDF** to attach and store PDFs locally.
5. Use the Workspace tools (like the title analyzer) to review content quality.

Explorer interactions:
- Right-click a folder or article to open, rename, or delete it.
- Deleting a folder moves its contents to the parent folder.

## Full Setup Paths

Follow one of these complete paths end-to-end. Each path includes every step
required to get the app running.

### Path A: Local PostgreSQL Installed

1. Install Node.js (if missing):
   ```bash
   node -v || (curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && source ~/.nvm/nvm.sh && nvm install 18 && nvm use 18)
   ```
2. Install PostgreSQL (macOS example):
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```
3. Create DB + user:
   ```bash
   psql -U $USER
   ```
   ```sql
   CREATE USER saathi_user WITH PASSWORD 'saathi_password' CREATEDB;
   CREATE DATABASE saathi OWNER saathi_user;
   GRANT ALL PRIVILEGES ON DATABASE saathi TO saathi_user;
   ```
4. Create `.env.local` and `.env`:
   ```bash
   DATABASE_URL=postgresql://saathi_user:saathi_password@localhost:5432/saathi?schema=public
   PDF_LOADER_URL=
   ```
5. Install deps and migrate:
   ```bash
   npm install
   npx prisma migrate dev --name init
   ```
6. Run the app:
   ```bash
   npm run dev
   ```

### Path B: Docker PostgreSQL

1. Start Postgres:
   ```bash
   docker run --name saathi-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=saathi \
     -p 5432:5432 \
     -d postgres:16
   ```
2. Create `.env.local` and `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saathi?schema=public
   PDF_LOADER_URL=
   ```
3. Install deps and migrate:
   ```bash
   npm install
   npx prisma migrate dev --name init
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

### Path C: Hosted PostgreSQL

1. Create a database on Neon, Supabase, or Railway.
2. Copy the connection string from the provider.
3. Create `.env.local` and `.env`:
   ```bash
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public
   PDF_LOADER_URL=
   ```
4. Install deps and migrate:
   ```bash
   npm install
   npx prisma migrate dev --name init
   ```
5. Run the app:
   ```bash
   npm run dev
   ```

## App Health Checks

After `npm run dev`:

1. Open `http://localhost:3000`.
2. Open `http://localhost:3000/api/articles` (should return JSON).
3. Create a new article in the Dashboard.
4. Open the article and save changes in the editor.

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

- `Environment variable not found: DATABASE_URL`
  - Add `DATABASE_URL` to `.env` (Prisma CLI reads `.env` by default).
  - Restart the dev server and rerun migrations.

- `Error: DATABASE_URL is not set`
  - Ensure `.env.local` exists and includes `DATABASE_URL`.
  - Restart the dev server after editing environment variables.

- `GET /api/articles 500`
  - Ensure the database is running and migrations applied.
  - Verify `DATABASE_URL` points to the correct database.

- `P1001: Can't reach database server`
  - Verify Postgres is running.
  - Check host/port in `DATABASE_URL`.
  - If using Docker, confirm port 5432 is published.

- `P3014: Prisma Migrate could not create the shadow database`
  - Grant `CREATEDB` to the database user.
  - Or use `npx prisma db push` for a dev-only sync.
  - Example fix: `psql -U postgres -c "ALTER ROLE saathi_user CREATEDB;"`

- `Prisma migrate` errors
  - Ensure the database user has create table privileges.
  - Delete `prisma/migrations` only if you want a fresh start and the DB is disposable.

- `zsh: command not found: psql`
  - Postgres is not installed or not on your PATH.
  - If installed via Homebrew, run:
    ```bash
    brew --prefix postgresql@16
    echo 'export PATH="$(brew --prefix postgresql@16)/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
    psql --version
    ```
  - If using Docker, run `docker exec -it saathi-postgres psql -U postgres`.

- `FATAL: role "postgres" does not exist`
  - Your local Postgres user is not `postgres`.
  - Use your OS user: `psql -U $USER`
  - Or create the role: `createuser -s postgres`, then `psql -U postgres`

## License

Not specified.
