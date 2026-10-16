# Odd One Outs - Poster Stall

A static website for the Odd One Outs poster stall (Vandre fest, IIT Jodhpur, 23-24 Oct).
No build step and no dependencies. Plain HTML, CSS and JavaScript.

## Folder structure

```
index.html            page structure
css/style.css         all styling
js/config.js          team names, logo path, text shown in the poster viewer
js/posters-data.js    the poster list (ids, titles, image paths, order, removed)
js/app.js             gallery logic: search, pages, viewer, intro animation
images/logo.png       site logo
images/posters/       one image file per poster (r1.jpg, e12.jpg, ...)
.nojekyll             tells GitHub Pages to serve files as they are
```

## Run it on your computer

Double-click `index.html`. That is all.

## Put it online with GitHub Pages

1. Create a new repository on GitHub (for example `odd-one-outs`), set to **Public**.
2. Upload everything in this folder to the repository root, so that `index.html` sits at the top level.
   * Git: `git init`, `git add .`, `git commit -m "first version"`, `git branch -M main`,
     `git remote add origin <your-repo-url>`, `git push -u origin main`
   * Or GitHub Desktop: add the folder as a repository and publish it.
   * Or the website's **Add file > Upload files**. The website accepts about 100 files per upload,
     so upload `images/posters/` in 3 batches.
3. In the repository go to **Settings > Pages**.
4. Under **Build and deployment** choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then **Save**.
5. After a minute or two the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Common edits

**Change team names or roles** - edit `TEAM` in `js/config.js`.

**Change the three bullet points in the poster viewer** - edit `POINTS` in `js/config.js`.

**Add a poster**
1. Put the image in `images/posters/`, for example `images/posters/new1.jpg`.
2. Add a line to the `MORE` list in `js/posters-data.js`:
   `{id:"new1",title:"My Poster",best:false,img:"images/posters/new1.jpg"},`
3. Optional: add `"new1"` to `ORDER` to choose its position. Posters not listed in `ORDER` appear at the end.
4. Set `best:true` to show it large on page 1.

**Hide a poster** - add its id to `REMOVED` in `js/posters-data.js`.

**Change colours and fonts** - edit the variables at the top of `css/style.css` (`:root`).

Keep file names lowercase and without spaces. GitHub Pages is case-sensitive.
