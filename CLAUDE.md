# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for "jo" - a local AI assistant for Mac. Pure HTML/CSS/JavaScript with no build process or dependencies.

## Development

**No build/test/lint commands** - this is a static site served directly from the repository.

- Edit HTML/CSS/JS files directly
- Test by opening HTML files in browser
- Deploy via `git push` to main (GitHub Pages auto-deploys)

## Architecture

### File Structure
- `index.html` - Main landing page (production)
- `v2.html` through `v8.html` - A/B testing variants with different messaging angles
- `v4-lead-magnet.html` - Interactive AI Time Tax Calculator
- `v4-proactive.html` - "jo acts for you" positioning with video hero
- `v4-scrolling.html`, `v4-scrolling-alive.html` - Scroll-scrubbed narrative prototypes using GSAP/Lenis
- `styles.css` - Centralized stylesheet
- `og-image.html`, `og-image-v3.html` - Templates for generating OG images

### Design System (styles.css)
- **Fonts**: Fraunces (headlines), Outfit (body), Sora (secondary) via Google Fonts
- **Colors**: Cyan `#0099ff`, Purple `rgb(159, 117, 255)`, gradient combinations
- **CSS Custom Properties**: `--space-*`, `--radius-*`, `--shadow-*`, `--font-*` for consistency
- **Dark mode**: Full support via `@media (prefers-color-scheme: dark)`

### JavaScript Patterns
- Vanilla JS only, no frameworks (except CDN libs for specific variants)
- Scroll animations use Intersection Observer API
- Scroll-scrubbed variants use Lenis (smooth scroll) + GSAP ScrollTrigger
- Interactive elements (calculator) use direct DOM manipulation

## Key Conventions

- **A/B variants are separate HTML files** - changes may need to apply across multiple variants
- **Centralized styling** - use styles.css and CSS custom properties, not inline styles
- **Animation pattern** - add `animate-on-scroll` class, Intersection Observer handles visibility
- **Video backgrounds** - separate mobile/desktop versions for performance (`hero-bg-mobile.mp4`, `hero-bg-desktop.mp4`)

## OG Image Generation

Use Chrome headless to screenshot OG image templates:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --screenshot="og-image.png" --window-size=1200,630 --hide-scrollbars "file://$(pwd)/og-image.html"
```

## Design Guidance

Avoid generic "AI slop" aesthetics. Make creative, distinctive frontends that surprise and delight:

- **Typography**: Choose beautiful, unique fonts. Avoid generic fonts like Arial, Inter, Roboto.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables. Dominant colors with sharp accents outperform timid palettes.
- **Motion**: Focus on high-impact moments—one well-orchestrated page load with staggered reveals (`animation-delay`) over scattered micro-interactions. Prioritize CSS-only solutions.
- **Backgrounds**: Create atmosphere and depth rather than solid colors. Layer CSS gradients, geometric patterns, or contextual effects.

Avoid: overused font families, clichéd color schemes (purple gradients on white), predictable layouts, cookie-cutter patterns. Make unexpected choices that feel genuinely designed for the context.
