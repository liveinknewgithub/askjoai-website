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
- `styles.css` - Centralized stylesheet (1,900+ lines)
- `og-image.html`, `og-image-v3.html` - Templates for generating OG images

### Design System (styles.css)
- **Fonts**: Solway (headlines), Inter (body), Source Sans 3 (secondary) via Google Fonts
- **Colors**: Cyan `#0099ff`, Purple `rgb(159, 117, 255)`, gradient combinations
- **CSS Custom Properties**: `--space-*`, `--radius-*`, `--shadow-*` for consistency
- **Dark mode**: Full support via `@media (prefers-color-scheme: dark)`

### JavaScript Patterns
- Vanilla JS only, no frameworks
- Scroll animations use Intersection Observer API
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

DISTILLED_AESTHETICS_PROMPT = """
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:
 
Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
 
Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
 
Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.
 
Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.
 
Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character
 
Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
"""
