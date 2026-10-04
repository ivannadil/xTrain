---
version: 1
slug: "src-pages-landing-tsx"
primary_target: "src/pages/Landing.tsx"
related_targets: []
---

# Surface brief: xTrain landing page (/)

## Scope and mode
Persuade. The marketing front door for the app. Inherits the highlight-reel world from the app brief (src/pages/Home.tsx); the world may own this page.

## Audience, job, action, proof, constraints
- Audience: players 13-18 (and parents/coaches peeking) who found xTrain and want to know what it is in seconds.
- Action: "Build my plan" (starts onboarding at /start?fresh=1). Secondary: "Open the demo" (/app, the synthetic demo player).
- Proof: the real product components run live on the page: the hero drill clip with a scrubber, the demo week filmstrip, a scroll-driven re-cut demo built on the real plan operations, the drill rail, the radar, and a working mini session player. No testimonials, user counts, prices, or Coach AI claims; the roadmap section states what is real now.
- Constraints: hero fits one viewport with CTA visible; no eyebrow labels, no em-dashes, no scroll cues; reduced-motion path for the sticky scroll demo (stage chips).

## Direction contract

THESIS: the landing page is a reel of the product doing its job: scrub a drill, watch a week re-cut itself, read the coach note change. It refuses the category default of a centered headline over a phone mockup with three feature cards.

OWN-WORLD: same tokens as the app (floodlit-pitch ink ramp, orange for action and the playhead, teal for Course AI and data, Archivo wide display, Geist Mono timecodes, letterboxed clip frames). Sections are separated by hairlines, not color flips; the close is a letterboxed title card in display-wide caps.

STORY: in one viewport the visitor understands "my training, cut like a highlight reel", sees the clip and the week, and can press Build my plan. Scrolling, they see what the plan is cut from, that they can re-cut it (the differentiator no competitor has), that drills are drawn and explained, that ratings are earned, and that the player works on a propped phone. They leave knowing what is real today.

FIRST VIEWPORT (1440): sticky top bar with wordmark, four section links, "Open the demo" ghost and "Build my plan" orange. Left: headline in two or three lines of wide Archivo, one 20-word sub, two buttons. Right: the letterboxed Cut Inside & Finish clip with caption, timecode badge and chapter bar; a scrubber under it; the demo week filmstrip with playhead and load bars below. Mobile: stacked, headline first, clip second, buttons above the fold.

FORM: highlight-reel grammar carried to the Persuade surface; same seed key c29c2075 (the world was rolled for the app; this surface inherits it).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Memorable moment
The re-cut section: as you scroll, Saturday's clip slides to Sunday, the load bars re-draw, and the coach note rewrites itself.

## Unresolved
Real photography or video of players training would strengthen the hero and the "On the pitch" section; none exists yet, so the page uses the product's own authored diagrams.
