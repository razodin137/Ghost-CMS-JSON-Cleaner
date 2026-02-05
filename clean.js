const fs = require('fs');

try {
    // Find the first JSON file in the directory that isn't the output or package.json
    const inputFile = fs.readdirSync('.').find(file =>
        file.endsWith('.json') &&
        file !== 'directus_import.json' &&
        file !== 'package.json'
    );

    if (!inputFile) {
        throw new Error("No source JSON file found in the current directory.");
    }

    const rawData = fs.readFileSync(inputFile, 'utf8');
    const ghostFile = JSON.parse(rawData);

    // The structure is usually db -> [0] -> data -> posts
    const posts = ghostFile.

        // 4. Save the new file
        fs.writeFileSync('directus_import.json', JSON.stringify(directusReady, null, 2));

    console.log(`✅ Success! Created 'directus_import.json' with ${directusReady.length} posts.`);

} catch (error) {
    console.error("❌ Error:", error.message);
    console.log("Tip: Make sure your input file is named 'ghost.json' and is in this folder.");
}