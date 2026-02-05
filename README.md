
# Ghost JSON to Directus SQL

This is a tool to convert Ghost JSON data to Directus SQL.

Ghost is great for its simplicity, but I'm ready to upgrade. 

Ghost is giving me a big ol' JSON file with all my content, and I need to get that into Directus (and maybe some other SQL databases I'm not sure, the data seems pretty straightforward in the final result).

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
| Content | html | WYSIWYG | Select "WYSIWYG" so the HTML renders correctly. |
| Excerpt | excerpt | Text Area | |
| Published Date | published_at | DateTime | |
| Feature Image | feature_image | Image | This creates a relation to Directus Files. |
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