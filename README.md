
# Ghost JSON to Directus SQL

This is a tool to convert Ghost JSON data to Directus SQL.

Ghost is great for its simplicity, but I'm ready to upgrade. 

Problem is, Ghost's JSON export is a bit of a mess. It's not a flat file, but a nested file with a lot of extra data that we don't need..

Ghost is giving me a big ol' JSON file with all my content, and I need to get that into Directus (and maybe some other SQL databases I'm not sure, the data seems pretty straightforward in the final result).

> If you're scared to run this on your precious Ghost content, try it with the attached ghost.json file!

Simply run the script, and it will create a new file called directus_import.json in the same directory as your ghost.json file.

Should spit out a bunch of posts with a format something like this:

```json
[
  {
    "title": "Coming soon",
    "slug": "coming-soon",
    "status": "published",
    "type": "post",
    "featured": false,
    "excerpt": "This is headless, a brand new site...",
    "html": "<p>This is headless...</p>",
    "published_at": "2026-02-04T04:40:19.000Z",
    "created_at": "2026-02-04T04:40:19.000Z",
    "updated_at": "2026-02-04T08:04:12.000Z",
    "feature_image_url": "https://static.ghost.org/v4.0.0/images/feature-image.jpg",
    "tags": ["News", "site-template"],
    "author": "JOHn"
  },
```


### Introducing ghostjson-to-directusSQL

The name could use some work but it is descriptive. 

We're gonna take that JSON file that Ghost gives us on the export options and we're gonna turn it into SQL that Directus can use in its own GUI "Import" button. 

### First, Directus.

Directus needs to have a table to import this data into.

You can set it up by going to Data-model ---> Add New

And set a new collection in the following manner:

| Display Name | Key (Field Name) | Type | Note |
| :--- | :--- | :--- | :--- |
| Title | title | Input (String) | |
| Slug | slug | Input (String) | |
| Status | status | Dropdown | Options: `published`, `draft`. |
| Type | type | Dropdown | Options: `post`, `page`. |
| Featured | featured | Boolean | |
| Content | html | WYSIWYG | Select "WYSIWYG" so the HTML renders correctly. |
| Excerpt | excerpt | Text Area | |
| Published Date | published_at | DateTime | |
| Created Date | created_at | DateTime | |
| Updated Date | updated_at | DateTime | |
| Feature Image | feature_image | Image | This creates a relation to Directus Files. |
| Tags | tags | Tags (CSV) | Or JSON depending on import config. |
| Author | author | Input (String) | Or relation to Users collection if setup. |
| Ghost ID | ghost_id | Input (String) | Optional: Helps prevent duplicates if you run it twice. |


### Next, Ghost.

Real simple.

Just go to settings ---> Export ---> Export Content as JSON.

### Then, run the script

Move that JSON file that ghost gave you into the same directory as your script.

Navigate to this directory via terminal and run:

```
node clean.js
```

> WARNING: DO NOT RUN THIS SCRIPT IN ANYWHERE EXCEPT THE DIRECTORY THAT CONTAINS THE JSON FILE.
> It's gonna look for all json files in that directory and try to convert them. 
> 
> You've been warned. 

### Then, import it into Directus.

Go to Data-model ---> Import ---> Import from JSON ---> Select the file you just created (should be called directus_import.json).

### And that's it!

You should have your content in Directus now.

Let me know if you run into any errors or have questions.

##### p.s. be careful running this multiple times, especially if you've renamed the file that you're going to upload to Directus. Your files can easily be overwritten. 