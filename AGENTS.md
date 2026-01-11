# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the production landing page.
- `v2.html` through `v8.html` are A/B variants; keep messaging experiments isolated.
- `v4-*.html` files are specialized variants (e.g., scrolling prototypes, lead magnet).
- `styles.css` is the shared stylesheet; prefer updating it over adding inline styles.
- Assets live at the repo root: `hero-bg*.mp4`, `hero-bg.jpg`, `og-image*.png`, `favicon.svg`.
- OG image templates are `og-image.html` and `og-image-v3.html`.

## Build, Test, and Development Commands
This is a static site with no build or test pipeline. Edit files directly and preview locally:
- `open index.html` (macOS) to preview the main page.
- `python3 -m http.server` then visit `http://localhost:8000` if you need local routing or assets to load via HTTP.

## Coding Style & Naming Conventions
- Indentation: 4 spaces in HTML and CSS; keep formatting consistent with existing files.
- HTML/CSS/JS only; no framework or bundler.
- Keep styles centralized in `styles.css` and reuse CSS custom properties.
- Asset naming follows descriptive kebab-case, e.g., `hero-bg-desktop.mp4`, `og-image-v3.png`.
- A/B variants are separate files; avoid merging variant-specific changes into `index.html` unless intentional.

## Testing Guidelines
- No automated tests are configured.
- Manually verify in a browser, especially for layout shifts, video playback, and scroll effects.
- If you change shared styles, spot-check multiple variants (`index.html`, at least one `v4-*.html`).

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, sentence case (e.g., "Add icons back to app badges").
- PRs should include:
  - A concise description of the visual or content change.
  - Screenshots or short clips for layout or motion changes.
  - Notes on which variants were updated or intentionally left unchanged.

## Design Notes
- Aim for bold, intentional visuals; avoid generic "AI" aesthetics.
- Favor a few high-impact interactions over many small effects.
