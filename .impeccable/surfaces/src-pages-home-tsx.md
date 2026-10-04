---
version: 1
slug: "src-pages-home-tsx"
primary_target: "src/pages/Home.tsx"
related_targets: ["src/App.tsx","src/pages/Plan.tsx","src/pages/Drills.tsx","src/pages/DrillDetail.tsx","src/pages/Session.tsx","src/pages/Progress.tsx","src/pages/Achievements.tsx","src/pages/Coach.tsx","src/pages/Profile.tsx","src/pages/Onboarding.tsx"]
---

# Surface brief: xTrain app shell (Home first, then Plan, Drills, Drill detail, Session, Progress, Achievements, Coach, Profile, Onboarding)

## Scope and mode
Operate. The player's working product: plan, train, browse drills, read progress. The landing page is a separate Persuade brief that inherits this world.

## Audience, job, action, proof, constraints
- Audience: US players 13-18 training alone; also 12-year-olds like Bella. Desktop and phone; phone propped at a distance during sessions.
- Job: see what to do today and start it; re-cut the week when life changes; find a drill; see honest progress.
- Primary action per surface: Home = Start today's session. Plan = move/swap/regenerate a session. Drills = open a drill. Session = next drill / finish. Progress = read ratings trend.
- Proof and content: synthetic demo player (Alex, 16, winger, intermediate), 4-week Course AI plan, 24+ authored drills, ratings 0-100, badges with % unlocked. All labeled synthetic in code and data files, never claimed as real.
- Constraints: heavy, purposeful motion required by the brief, with a complete reduced-motion path; 44px targets; contrast 4.5:1 on tinted dark ground; no fabricated prices, user counts, testimonials, or Coach AI capabilities.

## Direction contract

THESIS: xTrain cuts a training plan the way a skill-edit cuts a highlight reel: every week is a filmstrip of clips, today sits under a playhead, and the player re-cuts the reel by dragging clips. It refuses the category default of a dark dashboard with glowing green stat tiles and a chatbot bubble.

OWN-WORLD: Floodlit-pitch ink ground tinted green-teal (never neutral gray), on an eleven-step tonal ramp. Teal-and-orange grade: signal orange only for the primary action and the playhead ("now"); mint-teal for Course AI voice and data series; warm floodlight white for content. Type is Archivo variable, width 125 for display, width 62 uppercase heavy for captions, normal width for UI; Geist Mono for timecodes and ratings in tabular figures. Components: letterboxed 16:9 clip cards with timecode duration badges (45:00); filmstrip rails whose clip width equals minutes; a 2px orange playhead with diamond head; a load waveform under each week; condensed-caps captions with a hairline stroke on media; 8px radius everywhere, pill chips only. Motion: hard cuts for navigation and frequent toggles; speed-ramp easing for authored moments; pointer scrubbing wherever a timeline exists; freeze-frame on completion.

Raises, named for their donors:
- TONAL RAMP (exposure-record zone sheets): the eleven ramp steps are the only surface and text tones.
- ACTION-ONLY ORANGE (warm consumer app surface): orange means pressable or "now"; nothing decorative is orange.
- DURATION-AS-LENGTH (labanotation score): on every timeline a clip's width is exactly its minutes.
- HARD CUTS (manual acetate tab board): tabs, filters, and route changes switch instantly; eased motion is spent only on authored moments.
- FOCUS DIMMING (streaming title-card wall): in library rails the focused tile expands and reveals metadata while siblings dim.
- MINUTES EVERYWHERE (terminal yellow wayfinding): every next step carries its cost in minutes; Home shows only the next decision.

STORY: The player understands that Course AI cut this plan from their own specs, sees today's clip and presses Start; they believe the plan is theirs because they can drag any clip and the AI explains every cut in one sentence; over weeks their season reel (ratings) grows and they come back to watch it.

FIRST VIEWPORT (Home, 1440 wide): left icon rail 76px (Home, Plan, Drills, Progress, Coach; profile at bottom). Top strip: "Week 2 · Day 3" in condensed caps, player name, streak chip. Main left two-thirds: Today's session as a letterboxed clip card, caption "TECHNICAL · FINISHING · 45:00", chapter markers for its 5 drills along a playhead bar, orange Start session button bottom-left inside the card, "Why this session" one-liner from Course AI in teal below. Right third: ratings block (five skills 0-100 as horizontal bars with deltas, tabular mono) and the week's load. Below the fold: the week filmstrip (7 clips, widths = minutes, playhead on today, waveform of load under it), then a "Keep sharp" drill rail. Mobile 390: bottom tab bar, clip card full width, filmstrip horizontal scroll, Start button sticky above the tab bar.

FORM: Skill-edit highlight-reel video grammar; position 3 on the ordered grounded list (FIFA rating cards, boot design language, highlight reel, broadcast stat graphics, coach's tactics board, stadium LED boards, street-cage culture); seed key c29c2075; mode operate.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Memorable moment
Dragging a session clip along the week filmstrip and watching the load waveform re-balance while Course AI's one-line reason rewrites itself.

## Unresolved
Mascot/coach persona (not designed; Course AI speaks as text). Real drill video (none; diagrams authored as SVG pitch plans, labeled). Pricing (not shown).
