const fs = require('fs');
const path = require('path');

// Load the cleaned JSON data from the parent directory
const jsonPath = path.join(__dirname, '../cleaned_data.json');
const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// SQL Header: Create Table
let sqlInfo = `
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

`;

// Helper to escape single quotes for SQL text
const escapeSql = (str) => {
    if (str === null || str === undefined) return 'NULL';
    // Replace single quote with two single quotes
    return "'" + String(str).replace(/'/g, "''") + "'";
};

// Helper to format timestamps
const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'NULL';
    return "'" + dateStr + "'";
};

// Helper for JSONB
const formatJsonb = (data) => {
    if (!data) return "'[]'";
    // JSON stringify and then escape quotes
    return "'" + JSON.stringify(data).replace(/'/g, "''") + "'";
};

posts.forEach(post => {
    const values = [
        escapeSql(post.title),
        escapeSql(post.slug),
        escapeSql(post.status),
        escapeSql(post.type),
        post.featured ? 'TRUE' : 'FALSE',
        escapeSql(post.html),
        escapeSql(post.excerpt),
        formatTimestamp(post.published_at),
        formatTimestamp(post.created_at),
        formatTimestamp(post.updated_at),
        escapeSql(post.feature_image_url),
        formatJsonb(post.tags),
        escapeSql(post.author)
    ];

    sqlInfo += `INSERT INTO posts (title, slug, status, type, featured, html, excerpt, published_at, created_at, updated_at, feature_image_url, tags, author) VALUES (${values.join(', ')});\n`;
});

fs.writeFileSync('import.sql', sqlInfo);

console.log(`✅ SQL Generated! Saved to 'import.sql' with ${posts.length} inserts.`);
console.log("👉 Copy the contents of 'import.sql' and paste it into the Neon SQL Editor.");
