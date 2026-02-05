# Ghost Data Cleaner & SQL Importer

A simple tool to clean, normalize, and export your Ghost CMS content for import into other systems like **Directus**, **Neon (PostgreSQL)**, or any SQL database.

## What it does

1.  **Cleans**: Takes a raw `ghost.json` export and strips out the noise.
2.  **Normalizes**: Formats dates, booleans, and extracts useful relationships (tags, authors) into a flat, usable structure.
3.  **Exports**: Generates a generic `cleaned_data.json` ready for use.
4.  **Generates SQL**: Optionally converts that JSON into standard SQL `INSERT` statements.

## Quick Start

### 1. Setup

```bash
# Clone the repo
git clone <your-repo>
cd ghost-data-cleaner

# Install dependencies
npm install

# Setup Environment (for Neon/Postgres import)
cp .env.example .env
# Edit .env with your DATABASE_URL if using Neon/Postgres
```

### 2. Export from Ghost

1.  Go to Ghost Admin -> Settings -> Export.
2.  Export content as JSON.
3.  Save the file as `ghost.json` in this project folder.

### 3. Clean the Data

Run the cleaner script:

```bash
node clean.js
```

This generates `cleaned_data.json`.

## Supported Destinations

### 🐘 Neon / PostgreSQL

You can import data directly into a Neon or PostgreSQL database.

**Option A: Direct Import (Fastest)**
Imports strictly using the `cleaned_data.json` via Node.js.

```bash
node neon/import.js
```

**Option B: Generate SQL**
Generates a `neon/import.sql` file you can copy-paste into any SQL editor.

```bash
node neon/json-to-sql.js
```

### 🐰 Directus

For instructions on importing into Directus:
👉 [Read the Directus Import Guide](directus/README.md)

### 🛠️ Generic Usage

The `cleaned_data.json` contains an array of objects with standard fields (`title`, `slug`, `html`, `tags`, etc.). You can write your own simple script to import this into any CMS, Static Site Generator (Hugo/Astro), or Database.