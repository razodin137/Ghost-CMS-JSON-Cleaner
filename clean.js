const fs = require('fs');

// Load your Ghost export
// Make sure the filename matches exactly
const ghostFile = JSON.parse(fs.readFileSync('./ghost.json', 'utf8'));

// Dig down to find the posts, tags, and posts_tags arrays
const rawPosts = ghostFile.db[0].data.posts;
const rawTags = ghostFile.db[0].data.tags;
const rawPostsTags = ghostFile.db[0].data.posts_tags;
const rawUsers = ghostFile.db[0].data.users;
const rawPostsAuthors = ghostFile.db[0].data.posts_authors;

// Create a helper to find tags for a post
const getTagsForPost = (postId) => {
    const postTagRelations = rawPostsTags.filter(pt => pt.post_id === postId);
    const tagIds = postTagRelations.map(pt => pt.tag_id);
    const tags = rawTags.filter(t => tagIds.includes(t.id));
    return tags.map(t => t.name); // Returning array of tag names
};

// Create a helper to find author for a post
const getAuthorForPost = (postId) => {
    const postAuthorRelation = rawPostsAuthors.find(pa => pa.post_id === postId);
    if (!postAuthorRelation) return null;
    const author = rawUsers.find(u => u.id === postAuthorRelation.author_id);
    return author ? author.name : null;
};

// Map strictly the fields we want to import
const directusReady = rawPosts.map(post => {
    return {
        title: post.title,
        slug: post.slug,
        status: post.status, // 'published' or 'draft'
        type: post.type, // 'post' or 'page'
        featured: !!post.featured, // boolean
        excerpt: post.custom_excerpt || (post.plaintext ? post.plaintext.substring(0, 150) + '...' : ''),
        html: post.html, // Maps to Directus WYSIWYG
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
        // NOTE: This will just import the text URL of the image. 
        // It will NOT upload the actual image file to Directus.
        feature_image_url: post.feature_image,
        tags: getTagsForPost(post.id),
        author: getAuthorForPost(post.id)
    };
});

// Save to a new file
fs.writeFileSync('directus_import_ready.json', JSON.stringify(directusReady, null, 2));

console.log(`✅ Ready! Created 'directus_import_ready.json' with ${directusReady.length} posts.`);