# Ranganath M — Portfolio

A fast, dependency-free portfolio: plain HTML, CSS and JavaScript. No build step.

```
index.html        page content + SEO / structured data
css/styles.css    design tokens (dark + light themes) and all styling
js/main.js        theme toggle, typing effect, architecture explorer, smart-watch simulator
assets/           favicon.svg, Ranganath_M_Resume.pdf
```

## Run it locally

Just open `index.html`, or serve the folder:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Deploy (free)

- **Vercel**: `vercel` in this folder (framework preset: *Other*), or import the folder from a GitHub repo.
- **GitHub Pages / Netlify**: publish the folder as-is.

## Things to personalise after deploying

1. **Domain / social preview** — add `<link rel="canonical">`, `og:url` and an `og:image` (1200×630) in the `<head>` of `index.html`.
2. **Google Analytics 4** — uncomment the GA4 block in `<head>` and put in your measurement ID.
3. **GitHub link** — add one next to LinkedIn in the hero (`.hero__links`) and in the contact list.
4. **Photo** — the hero uses a code card instead of a photo; add an `<img>` if you prefer one.
5. **Resume** — replace `assets/Ranganath_M_Resume.pdf` whenever you update it.
6. **Publication citation** — the "Copy citation" text (button `data-cite`) lists the chapter without author names; add the co-authors.
7. **Smart-watch simulator** — the vibration patterns and the English/Hindi/Kannada phrases are illustrative. Edit `PATTERNS` and `VOICE` at the top of the simulator section in `js/main.js` to match your device exactly.

The contact form opens the visitor's email app (`mailto:`), so no backend is needed.
