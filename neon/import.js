const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client } = require('pg');
const fs = require('fs');

// Load the cleaned JSON data from the parent directory
const jsonPath = path.join(__dirname, '../cleaned_data.json');
const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Connection String from environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Error: DATABASE_URL not found in .env file.');
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // Try matching loose SSL requirements if verifying fails
    },
    connectionTimeoutMillis: 60000, // Increase to 60s
});

async function importData() {
    try {
        await client.connect();
        console.log('✅ Connected to Neon database.');

        // Create Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title TEXT,
                slug TEXT UNIQUE,
                status TEXT,
                type TEXT,
                featured BOOLEAN,
                html TEXT,
                excerpt TEXT,
                published_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE,
                updated_at TIMESTAMP WITH TIME ZONE,
                feature_image_url TEXT,
                tags JSONB,
                author TEXT
            );
        `);
        console.log('✅ Table "posts" ensured.');

        // Insert Data
        for (const post of posts) {
            const query = `
                INSERT INTO posts (title, slug, status, type, featured, html, excerpt, published_at, created_at, updated_at, feature_image_url, tags, author)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (slug) DO NOTHING;
            `;
            const values = [
                post.title,
                post.slug,
                post.status,
                post.type,
                post.featured,
                post.html,
                post.excerpt,
                post.published_at,
                post.created_at,
                post.updated_at,
                post.feature_image_url,
                JSON.stringify(post.tags), // Cast array to JSON string for JSONB
                post.author
            ];

            await client.query(query, values);
            process.stdout.write('.');
        }
        console.log(`\n✅ Imported ${posts.length} posts successfully!`);

    } catch (err) {
        console.error('❌ Error importing data:', err);
    } finally {
        await client.end();
    }
}

importData();
