# John and Jane Wedding Invitation

Static wedding invitation website for John Michael Oliba and Jane Namubiru.

## Files

- `index.html` is the invitation page.
- `generator.html` creates personalized guest links and `guests.js` entries.
- `guests.js` maps guest codes to display names.
- `script.js` handles personalization, countdown, WhatsApp RSVP links, and calendar actions.
- `styles.css` contains the card-inspired visual design.
- `assets/card-preview.jpg` is generated from the supplied PDF invitation.
- `assets/couple.jpg` is an optimized copy of the supplied couple photo.

## Run Locally

You can open `index.html` directly in a browser.

For a local server, run this from the project folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

## Add Guests

Open `guests.js` and add entries inside `window.WEDDING_GUESTS`:

```js
window.WEDDING_GUESTS = Object.freeze({
  "gideon-kalanzi": "Gideon Kalanzi",
  "sarah-nambi": "Sarah Nambi"
});
```

The guest code is used in the invite URL:

```text
index.html?guest=gideon-kalanzi
```

If a guest code is missing, the invitation falls back to `Guest`.

## Generate Links

Open `generator.html`.

1. Confirm the invite page URL.
2. Paste one guest name per line.
3. Click `Generate links`.
4. Copy the generated links for sharing.
5. Copy the generated entries into `guests.js`.

Example link:

```text
https://your-domain.com/index.html?guest=gideon-kalanzi
```

## Host as a Static Site

Upload the full folder to any static host, including Netlify, Vercel, Cloudflare Pages, cPanel hosting, or an ordinary web server.

Make sure these files are uploaded together:

- `index.html`
- `generator.html`
- `guests.js`
- `script.js`
- `generator.js`
- `styles.css`
- `assets/`
- `jon weds jane n.pdf`

## Host on GitHub Pages

1. Create a GitHub repository.
2. Upload this project to the repository.
3. In GitHub, go to `Settings > Pages`.
4. Set the source to `Deploy from a branch`.
5. Choose the `main` branch and `/root`.
6. Save and wait for GitHub Pages to publish the site.

Your live link will look like:

```text
https://USERNAME.github.io/REPOSITORY/
```

Personalized links will look like:

```text
https://USERNAME.github.io/REPOSITORY/index.html?guest=gideon-kalanzi
```

## Privacy Note

This is a static website. Every name stored in `guests.js` is visible to anyone who opens the site's source files. Do not put private, sensitive, or confidential guest information in `guests.js`.
