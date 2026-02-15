# PRD: v7 Landing Page Conversion Optimization

## Introduction

Improve the v7.html landing page to increase email signup conversion rate and clarify what jo does. The current page has strong visual design but suffers from two core problems: (1) visitors don't immediately understand jo's value proposition, and (2) the email signup flow has friction that reduces conversions. This PRD addresses both through clearer messaging, an interactive demo, and optimized signup UX.

## Goals

- Increase email signup conversion rate from 1% to 10% (10x improvement)
- Reduce time-to-understanding (visitors should "get it" within 5 seconds)
- Create an interactive demo that shows jo in action (replacing the placeholder)
- Reduce signup friction with inline form validation and clearer CTAs
- Maintain the existing visual design language and dark aesthetic

## User Stories

### US-001: Clarify hero headline and value proposition
**Description:** As a visitor, I want to immediately understand what jo does so I can decide if it's relevant to me.

**Acceptance Criteria:**
- [ ] Hero headline communicates the core value in <10 words
- [ ] Subheadline explains HOW jo delivers that value
- [ ] App logos section is simplified or moved below the fold
- [ ] "jo remembers everything" is replaced with outcome-focused language
- [ ] A/B test 2-3 headline variants if analytics are available
- [ ] Verify in browser that new copy renders correctly on desktop and mobile

---

### US-002: Build interactive demo replacing placeholder
**Status: DEFERRED** - Will revisit after analytics baseline is established.

See Appendix for demo script when ready to implement.

---

### US-002a: Set up PostHog analytics
**Description:** As the product team, we need analytics to measure conversion improvements and understand user behavior before making changes.

**Acceptance Criteria:**
- [ ] Add PostHog JS snippet to v7.html (via CDN)
- [ ] Track pageviews automatically
- [ ] Track email form submissions as custom event (`waitlist_signup`)
- [ ] Track scroll depth (25%, 50%, 75%, 100%)
- [ ] Track clicks on key CTAs (`cta_hero`, `cta_bottom`, `see_how_it_works`)
- [ ] Track time on page
- [ ] Verify events appear in PostHog dashboard
- [ ] Establish 1-week baseline before implementing other changes

---

### US-003: Optimize email signup form UX
**Description:** As a visitor ready to sign up, I want a frictionless signup experience so I can join the waitlist quickly.

**Acceptance Criteria:**
- [ ] Add inline email validation (shows checkmark when valid, error when invalid)
- [ ] Button text changes contextually on hover/focus for better feedback
- [ ] Add subtle micro-interaction on button hover (scale + glow)
- [ ] Form submits via redirect to Fillout (no AJAX for now)
- [ ] Mobile: form inputs are large enough for thumb tapping (min 48px height)
- [ ] Reduce form field count to just email (no name, no company)
- [ ] Verify in browser using dev-browser skill

---

### US-004: Add "What is jo?" explainer section
**Description:** As a confused visitor, I want a simple explanation of what jo is so I understand the product category.

**Acceptance Criteria:**
- [ ] Add new section between hero and "Why jo" section
- [ ] Section title: "jo is your second brain" or similar metaphor
- [ ] 3-column layout with simple icons:
  - Column 1: "Connects to your apps" (Notes, Mail, Photos, Calendar)
  - Column 2: "Remembers everything" (indexes locally, builds context)
  - Column 3: "Answers like a friend who knows you" (natural language, pulls from multiple sources)
- [ ] Each column: icon + 5-word headline + 1-sentence description
- [ ] Section is scannable in <5 seconds
- [ ] Verify in browser using dev-browser skill

---

### US-005: Improve "Try asking jo" section with interaction
**Description:** As a visitor, I want to click on example prompts and see jo's responses so I understand the depth of jo's capabilities.

**Acceptance Criteria:**
- [ ] Each feature card becomes clickable/tappable
- [ ] Clicking a card expands it to show the full jo response (currently truncated)
- [ ] Add 1-2 more example prompts that show different use cases
- [ ] Consider: clicking a prompt scrolls to demo and plays that specific query
- [ ] Hover state indicates cards are interactive
- [ ] Verify in browser using dev-browser skill

---

### US-006: Add sticky CTA on scroll
**Description:** As a visitor scrolling through the page, I want an easy way to sign up without scrolling back to the top.

**Acceptance Criteria:**
- [ ] Sticky header appears after scrolling past hero section
- [ ] Sticky header contains: jo logo (left), compact email form (right)
- [ ] Sticky header is subtle (semi-transparent, thin) - doesn't block content
- [ ] Header hides when scrolling down quickly, shows when scrolling up
- [ ] On mobile: sticky header shows just "Get Early Access" button (no form)
- [ ] Clicking mobile button smooth-scrolls to bottom CTA section
- [ ] Verify in browser using dev-browser skill

---

### US-007: Improve social proof specificity
**Description:** As a skeptical visitor, I want to see credible social proof so I trust that jo is legitimate.

**Acceptance Criteria:**
- [ ] Replace generic "Early Beta User" with more specific (but still anonymous) descriptors
- [ ] Add company types or industries: "Consultant at a Fortune 500" or "Freelance Writer, 10+ years"
- [ ] If real testimonials exist, use first names and photos
- [ ] **Remove "Featured in" section entirely** (current logos are placeholders, fake logos hurt trust)
- [ ] Add a "live" waitlist counter that feels dynamic (even if static, format as "1,369 people" not "1369")
- [ ] Verify in browser using dev-browser skill

---

### US-008: Reduce hero visual clutter
**Description:** As a visitor, I want a clean hero section so the core message isn't lost in visual noise.

**Acceptance Criteria:**
- [ ] Reduce app logos from 8 to 4-5 most recognizable (Notes, Photos, Mail, Calendar, + 1 other)
- [ ] Move or remove the demo window from hero (it's placeholder anyway)
- [ ] Consolidate trust badges - pick 2 strongest, remove rest
- [ ] Increase whitespace between headline and form
- [ ] Test hero without video background on mobile (currently disabled, confirm this is best)
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Interactive demo must play automatically when scrolled into view (Intersection Observer)
- FR-2: Demo typing animation must use realistic timing (40-80ms per character, variable)
- FR-3: Email form must validate format client-side before submission
- FR-4: Email form submits via redirect to Fillout (standard form submission)
- FR-5: Sticky header must use CSS `position: sticky` with JS scroll direction detection
- FR-6: All animations must respect `prefers-reduced-motion` media query
- FR-7: Interactive elements must be keyboard accessible (focusable, Enter to activate)
- FR-8: Page must maintain <3s Largest Contentful Paint on 4G connection

## Non-Goals

- No changes to pricing model or copy
- No backend/server-side changes (static site only)
- No A/B testing infrastructure (manual variant files are fine)
- No changes to other variant pages (v2-v6, v8)
- No new branding or logo changes
- No mobile app or native features

## Design Considerations

- Maintain existing color palette: cyan `#0099ff`, purple `rgb(159, 117, 255)`, dark bg `#0c0a12`
- Use existing font stack: DM Serif Display (headlines), Outfit (body)
- Demo should feel like a native Mac app (existing `.demo-window` styling)
- Micro-interactions should be subtle, not flashy (this is a productivity tool, not a game)
- Reference: Linear's landing page for inspiration on clean SaaS demo presentation

## Technical Considerations

- **Analytics: PostHog**
  - Use PostHog JS SDK via CDN
  - Auto-capture enabled for pageviews
  - Custom events for form submissions and CTA clicks
  - Scroll depth tracking via custom implementation
- **Libraries (CDN):**
  - PostHog JS (~20KB gzipped)
  - Typed.js or similar for typing animation (~5KB) - when demo is implemented
- **No heavy dependencies:** Avoid GSAP/Lenis unless already loaded
- **Performance budget:** Total JS for new features <50KB gzipped
- **Accessibility:** All interactive elements need ARIA labels, focus states

## Success Metrics

- **Primary: Email signup conversion rate increases from 1% to 10%** (10x improvement)
- Bounce rate on hero section decreases (measured via scroll depth)
- Time on page increases by 15%+ (indicates engagement with demo)
- "What is jo?" section has >50% scroll visibility (people see it)
- Demo plays to completion for >60% of viewers who scroll to it

## Open Questions

1. ~~Do we have access to Fillout API for AJAX submission, or must we use their hosted form?~~ **ANSWERED: Redirect only for now**
2. ~~Are the "Featured in" logos based on real coverage? If not, should we remove them entirely?~~ **ANSWERED: Placeholders - remove them**
3. ~~What's the current baseline conversion rate?~~ **ANSWERED: 1% current, 10% target**
4. ~~Should the demo use a real AI response, or is scripted/fake acceptable for MVP?~~ **DEFERRED: Demo deprioritized**
5. ~~Is there existing analytics (Plausible, GA, etc.) we can use for scroll tracking?~~ **ANSWERED: Will set up PostHog**

---

## Appendix: Demo Script Variations

### Variation A: Memory/Personal (Current in PRD)
> "What did Sarah say about the Henderson project timeline?"

### Variation B: Photo Search
> "Find that photo of the sunset from our Hawaii trip"
> jo finds: Photos (3 matches) → Shows thumbnail grid → "Found 3 sunset photos from Maui, June 2023"

### Variation C: Life Admin
> "When does my car registration expire?"
> jo finds: Mail (DMV notice) → Calendar (reminder) → "Your registration expires March 15. I found the DMV renewal notice from January."

### Variation D: Work Context
> "Prep me for my call with Acme Corp"
> jo finds: Mail (5 threads), Notes (2 docs), Calendar (meeting details) → Synthesized briefing

**Recommendation:** Start with Variation A (most relatable), test others based on target audience feedback.
