# xTrain — Visual + Motion Design Reference Research

Date: 2026-10-03
Scope: marketing sites and product UIs of AI/data-driven sports & fitness products, plus award-level "futuristic AI product" sites studied for motion language only.
Method note: Hex values, type scales, easing curves and durations below come from (a) live-CSS token extractions published by webdesignhot.com / shadcn.io / design.hagicode.com "design.md" indexes, (b) agency case studies, (c) screen-by-screen UX teardowns (screensdesign.com), (d) Awwwards entry pages, and (e) direct fetches of the marketing sites. Treat tokens as "exact-ish": they are measured from production CSS by third parties, not published brand books. Where a site blocked fetching (whoop.com, web.meetcleo.com) I relied on the token extraction + case study + press.

---

## Part 1 — Reference captures

### A. AI / data-driven sports & fitness products

#### 1. WHOOP (whoop.com + app)
1. **Hero**: Full-bleed black band, 160px vertical padding, 72px/800 uppercase headline ("OPTIMISE EVERY EFFORT"), 18px sub-copy, lime CTA + white-outline secondary. Site redesign by Basic Agency: "Motion was a major component of the new experience," with "progressive disclosure used to help audiences dig deeper without being overwhelmed." Three audience segments (elite athletes, professionals, everyday optimizers) each get tailored journeys; all content modular via Contentful.
2. **Color**: Canvas `#000000`, card lift `#0a0a0a`, `#141414`, `#1f1f1f`. Single brand "voltage" lime `#a0d10b` (hover `#88b609`, active `#739707`), black text on lime (13.6:1). Recovery bands: green `#16ec06` (67–100%), yellow `#ffde00` (34–66%), red `#ff0026` (0–33%). Strain blue `#0093e7`, sleep blue `#7eb8d9`, HRV purple `#9c7ed9`. Lime glow `0 0 24px rgba(160,209,11,0.25)` on featured/hover only.
3. **Type**: Inter throughout, weights 400–900. Score display 96px/800 `-3px` tracking with `tnum`; hero 72/800 uppercase `ss01`; eyebrows 11px/700 uppercase `+0.18em`; score labels 11/700 `+0.16em`. Principle: "Heavy 700–800 weights signal conviction (opposite of Oura's 300 whisper)… uppercase everywhere except body."
4. **Signature motion**: Recovery ring `stroke-dashoffset` 0→score over **1500ms** with "precise" ease `cubic-bezier(0.65,0,0.35,1)` plus numeric count-up; Strain arc 0→strain/21 same curve; sparkline draw 1200ms on viewport intersect; CTA hover scale 1.02 / press 0.98 at 150ms; card hover border `#141414→#2e2e2e` + lime-glow fade 240ms. Reduced motion: fills instant, opacity only.
5. **Personalization / AI**: WHOOP Coach (GPT-4, launched Sept 2023) is "a text input box on the main Whoop screen" that returns conversational answers from the member's own biometrics; "the more data you share… the more effective and pointed WHOOP Coach becomes." No elaborate generation theatre; the AI lives inside the data screens.
6. **Dashboard**: Recovery ring card (`#0a0a0a`, 8px radius, 240px ring, 14px stroke, bg `#1f1f1f`), Strain semi-circular arc card, metric tiles (label 11/700 uppercase, 18/600 tnum value, 24px sparkline, variance caption). Empty state copy: "Wear your strap for 4 nights to see your first Recovery score."
7. **Plan editor**: n/a (WHOOP doesn't plan sessions).
8. **Library**: n/a.
9. **Premium tells**: "8px radius parity between buttons AND cards" = athlete-equipment utility; one accent only; tabular numerals on every metric; shadows reserved for hover/modal; everything else tonal. Voice: "the sport scientist on the team's training staff."

#### 2. Oura (ouraring.com + app, Nov 2025 redesign)
1. **Hero**: Two versions exist in the wild. Storefront (shadcn/webdesignhot capture): warm sandstone canvas `#f7f1e8`, 96px/500 negative-tracked h1, serif-italic phrase flip. Instrument's redesign case study: "progressive disclosure… leveraging layers of information, animation, and micro-interactions to help people understand the big picture," mixing in-app UI, data viz components, lifestyle photography and CGI ring renders; micro-interactions "anchor important conversion moments."
2. **Color**: Dark system: canvas `#000000`, card `#0d0d0d`, `#1a1a1a`, champagne gold accent `#d6c283` (hover `#c4ae6a`), gold glow `rgba(214,194,131,0.2)`. Score ring hues: readiness `#84d97e`, sleep `#7eb8d9`, activity `#d9b67e`, stress `#d97e84`, resilience `#9c7ed9`. Brand guide adds Helsinki Blue `#2F4A73` and Skin Tone `#E6DED3`. Light storefront: sandstone `#f7f1e8`.
3. **Type**: Storefront: Editorial New (high-contrast serif) for headings, AkkuratLL sans for body; "once per heading, a single phrase flips to Editorial New serif italic — that one swap is the entire brand-voice signature." Dark system: Inter 300–600; hero 80px/**300** `-2.5px`; score display 96/300 `-3px` tnum; eyebrow 11/500 `+0.2em`.
4. **Signature motion**: Score ring stroke 0→score% **1200ms** precise ease; product 360° rotate 8000ms loop; carousel 480ms; card hover 320ms; gold-glow halo on hover. Easing set: standard `(0.4,0,0.2,1)`, emphasized `(0.2,0,0,1)`, precise `(0.65,0,0.35,1)`.
5. **Personalization / AI**: Oura Advisor (2025) "helps you understand the *why* behind your body's signals," now reads sleep trends, activity, Meals; can "create a plan to reach targeted health goals." New app uses "color strategically to signal your body's different states according to your biometrics, giving you an immediate visual signal."
6. **Dashboard**: "One big thing" — Today tab surfaces "the most important score or insight you need right now" plus "any unusual key metrics." Tabs: Today / Vitals (anchored to "your unique, personalized baselines") / My Health (long-term visualizations of strengths, trends, opportunity areas). New Habits & Routines links behaviours to metrics.
7. **Plan editor**: n/a.
8. **Library**: n/a.
9. **Premium tells**: Weight-300 whispers at 96px; one metal accent; AAA contrast; `role="meter"` on rings; the serif-italic flip. Explicitly rejects "neon-green heart-rate gradient… dashboard mockup behind glass… slate-and-cyan dark canvas."

#### 3. Strava (web + Athlete Intelligence)
1. **Hero**: White "fresh-GPS-screen" canvas, 64px/700 Inter `ss01` headlines, map overlays with orange route lines on every activity card.
2. **Color**: Canvas `#ffffff`, band `#f7f7fa`, ink `#242428`, single Strava Orange `#fc4c02` (hover `#e04401`, active `#c33b00`) used for wordmark, every CTA, kudos thumb, map route, focus ring. Achievement gold `#fdb515`. Brand glow `0 0 16px rgba(252,76,2,0.25)` on PR/achievements only.
3. **Type**: Inter display + body; Strava Sans Rounded wordmark only. Metric display 32/700 tnum; metric label 11/600 uppercase `+0.08em`; CTA 14/700 uppercase `+0.04em` ("broadcast-graphic discipline").
4. **Signature motion**: Map route draw `stroke-dasharray` 0→100% **1200ms** on mount; kudos burst (thumb rotates −15°→0°, scale 1→1.3→1, orange ripple) 400ms with energetic `cubic-bezier(0.34,1.56,0.64,1)`; PR celebration fade+scale 0.8→1 + glow 400ms; page transitions 320ms.
5. **Personalization / AI**: Athlete Intelligence (beta, 2024→) "presents your activity data in a conversational format" as in-app messages in the You tab, e.g. "you're nailing endurance with most of your workouts in Zone 2. Dabbling more in zone 3 could bring some exciting gains." Detects 30-day trends and milestones. This is the cleanest example of "because you did X → try Y" copy.
6. **Dashboard**: Activity card = avatar + title + 16:9 map + 3-column metric strip (value 32/700 tnum over 11/600 uppercase label) + social row.
7/8. n/a.
9. **Premium tells**: One orange, tabular numerals, rectangular 8px CTAs vs pill kudos as "signature social atom," subtle neutral shadows with glow only on celebrations.

#### 4. Peloton
1. **Hero**: Hardware-commerce page "dressed as an editorial fitness brand"; photography of Bike+/Tread/Row captioned by Inter. Reads "like an appliance store that happens to sell hardware you sweat on" rather than gradient-banner fitness.
2. **Color**: Two captures disagree on the exact red (`#df1c2f` on white chrome per shadcn; `#cb1e4e` on `#0d0d0d` studio-dim canvas per webdesignhot). Either way: one red, reserved for primary purchase CTA and the live indicator; gold `#ffc300` for PRs.
3. **Type**: Inter, display 72px/800 `-2px`, metric display 56px/**900** tnum, CTA 16/700 uppercase.
4. **Signature motion**: Live indicator 8×8 red dot infinite pulse; class card live-indicator 1200ms opacity loop; CTA hover scale 1.02/active 0.97; celebration bucket **600ms**; energetic easing `(0.34,1.56,0.64,1)`.
6. **Dashboard**: Leaderboard rows 18/800 tabular rank, user's own row tinted brand-soft.
8. **Library**: Class card 12px radius, 16:9 thumbnail, instructor, pulsing live dot.
9. **Premium tells**: Photography does the work; UI chrome is restrained; a single pulse animation carries "live."

#### 5. Fitbod (fitbod.me + app)
1. **Hero**: "LESS PLANNING. MORE PROGRESS." + "Fitbod creates a personalized workout plan that updates with your body, recovery, and progress." Apple Editor's Choice badge, 4.8★/250k reviews/15M downloads as proof row. Pink accent stars.
2–3. Light marketing site; app is dark with coral/pink accent (not token-extracted).
4. **Signature motion**: Post-workout confetti (teardown calls it "generic"); contextual tooltips during first workout.
5. **Personalization / AI** — the best "why" model in the set: a **muscle-recovery body map** "shows which muscles are fresh or fatigued, explaining the logic behind the day's workout"; the daily workout card "shows target muscle groups, estimated difficulty, and a 'why this today' explainer"; post-exercise **Exertion Rating** "makes users an active participant in the personalization process"; "adaptive AI learns from your edits." Onboarding: 14 steps, "incredibly detailed" equipment selection, "tangible strength gain projections" shown before signup; paywall appears "after the first workout is created but before it's started."
6. **Dashboard**: Today's workout card + body heat map + Gym Profiles switcher.
7. **Plan editor**: swap/replace exercises; the engine "behaves more like a load-balancing system for strength training."
9. **Premium tells**: The product explains itself through a visual (body map), not a paragraph. Weak spot: in-workout UI "clean but dense with information."

#### 6. Freeletics
1. **Hero**: "Personalized fitness in the palm of your hand" → "Start your plan now." Proof row: 450M sessions, "4 trillion workout combinations," 700+ exercises.
2–3. Light `#F5F8FA`-ish canvas, dark text, photography-led; Dribbble shots show dark in-app Training Journeys with bold condensed numerals.
5. **Personalization / AI**: Coach collects goals, schedule, days, location; Coach+ (LLM) "supports users during onboarding, helps them select a Training Journey… answers questions." Marketing frames adaptation as lifestyle flexibility ("Busy? We got you." / "No gym? No problem.") rather than algorithm theatre.
8. **Library**: 700 exercises, six guide cards (HIIT, functional, progressive overload…).
9. Tell: huge combinatorial numbers as credibility; transformation gallery (dated pattern — avoid for xTrain).

#### 7. Runna (runna.com + app V3)
1. **Hero**: "Running made simple" over lifestyle photography, "Start Your Free Trial — First week free." Site: dark navy/charcoal sections, white text, teal/turquoise CTAs, numbered feature cards ("powered by the Runna Engine"), interactive race-time calculator.
2. App: dark theme primary, white logo on black splash, **coral-red progress bar** during generation.
4–5. **The generation moment**: 30-chapter onboarding (goal, terrain, ability, race time, weekly frequency) → "Training Preferences Summary" → "Plan Summary" → paywall → loading screen with **"Building your plan"** + coral progress bar + illustrated running-shoe loader → plan details + **coach introduction**. 2026: personalised "Workout Briefings" before/during each run; "no two users receive the same briefing."
6. **Dashboard**: Plan overview = week ahead, completed vs remaining at a glance, **total km for the week**; weekly schedule as daily rows with type, distance, completion checkbox; scroll between weeks.
7. **Plan editor** (V3 "Enhanced Training Calendar"): "reschedule workouts and move them between weeks"; workout configuration modal (time picker, Outdoor/Treadmill toggle, skip workout); **"Not Feeling 100%"** dials training load down for 3–14 days (adjusts intensity or removes pace targets). Run types visually differentiated (Easy / Steady / Tempo / Long).
9. Tell: the coach-as-human layer (named coaches, briefings) on top of the engine; confetti on subscription (skip).

#### 8. Tonal
1. **Hero**: "Get your time back. Get your strength back." dual image previews, DISCOVER / SHOP NOW, HSA/FSA badge. Sections: adaptive weight ("weight that adapts to you," 1-lb increments, real-time display), form feedback overlays, Daily Lift.
5. **Personalization / AI**: "Daily Lift" workouts built "based on your training history, muscle readiness, goals, and available time"; "automatically tracks your progress and unlocks insights about your strength" (Strength Score). Tia intelligent assistant in blog.
9. Tell: hardware photography + on-screen data overlays; black/white with a warm accent.

#### 9. Athletica (athletica.ai, 2025 "New Training Experience")
1. **Hero**: Stacked three-line headline "Train Smarter. / Finish Stronger. / Live Healthier." + "Adaptive training plans that adjust to your fitness, fatigue, and schedule." Dark canvas, white type, media-logo carousel, three product screenshots (dashboard, weekly grid with duration/load, Garmin watch).
5. **Personalization / AI**: Conversational AI Coach "trained on a curated sport science knowledge base" with "direct access to your actual training data"; crucially "**the AI Coach does not automatically modify your training**" — it suggests, you decide. Section titles: "Your training finally answers back," "Performance without panic."
6. **Dashboard**: "Today's session, upcoming target events, training phase, and current state and recovery"; left-nav: Calendar, Dashboard, Roadmap, Plan Builder, Workout Wizard, Session Analysis, AI Coach, Insights, Recovery Profile.
7. **Plan editor**: Calendar month/week; Plan Builder + Workout Wizard; session analysis "connects effort, intent, and outcome."
9. Tell: honest about AI's role (suggest vs auto-change). Visual execution is utilitarian (B2B-ish).

#### 10. Future / Ladder
- **Future** (future.co): "Personal training, reimagined," $199/mo; hero = phone video; coach video check-in notification ("Nice lift, Alex!"); "360° roadmap" personalization showcase built around a named persona (Michelle: schedule, equipment, experience, injuries, goals). Neutral palette, photography.
- **Ladder** (Apple 2025 App of the Year finalist, Editors' Choice): "your daily strength training plan," coach-led "teams," weekly 7-day plans, workout player with in-ear audio cues, **video for every movement**, PR tracking. Positioning: "not about making things look pretty but about building an interface and journey members can't live without."
- Tell for xTrain: both sell the plan through a *person* (coach) and a *persona* (profile summary) — the "because you said X" surface is literally a profile recap card.

#### 11. Zwift
1. "Indoor Cycling, Made Fun." centered hero, animated GIF product banner, three pathway cards. Copy: "Personalized training plans that adapt to your progress."
2. Rebrand: "Big Zee" logo, orange symbol, "neon-oriented" set with custom water/cloud graphics, "bolder, brighter tone." Lower-case geometric wordmark "aligning with gaming and software aesthetics."
6. Homescreen redesign puts social events front and center with consistent top nav and better filtering.
9. Tell: game-engine footage is the hero; the UI borrows from games (events, routes, drops).

#### 12. Soccer analytics & wearables — Hudl, Catapult, Playermaker
- **Hudl**: "Change the Way You See the Game." Animated collage of athletes rotating sports; floating trophies/jerseys drift across sections; embedded floating video demos; "3D View for Volleyball" callout; navy/dark canvas, white text, orange + teal accents. Product UI: film-review frames, scatterplots, **radar charts** for athlete performance; Statsbomb platform shows radar + bar + pitch scatter linked to video; Wyscout = soccer database.
- **Catapult**: "Unleash Potential," stat focal points (128+ countries, 5500+ elite teams); minimal, enterprise. Athlete-load dashboards not shown on home.
- **Playermaker** (foot-mounted sensor, soccer): "Become the Player You're Meant to Be"; club logo carousel; app UI shows **skill metrics (passing, shooting, dribbling), left/right foot usage breakdown, performance Targets, weekly drills, session reports benchmarked against academy/pro players**; "personalized Targets based on Optimal Actions," "step-level and touch-level accuracy." Light canvas, dark text.
- Tell: B2B soccer tech = navy + data density. Playermaker's *metrics taxonomy* (skills × feet × targets × drills) is the closest content model to xTrain.

#### 13. Nike / NTC, Garmin, Apple Fitness+, Arc'teryx (sport authority references)
- **Nike**: canvas `#ffffff`, ink `#111111`, soft cloud `#f5f5f5`; Nike Futura ND display 96px/500 line-height **0.9**; Helvetica Now Text body; **zero radius** on cards/tiles, 30px pills for all CTAs; filter chip inverts white→black on active; "tap collapse" press = `scale(0.5) opacity 0.5`; durations 100/200/300ms; flat (no card shadows).
- **Garmin**: Oswald display + Roboto body, black primary button with **zero radius**, accent blue `#007cc3`; motion `cubic-bezier(0.2,0,0,1)` 120/220/420ms; reduced-motion freezes carousels. Connect 2025 redesign: customizable Home, **"In Focus" swipeable panel** that shows Training Readiness *and the six factors behind it*; Competitions leaderboard on home.
- **Apple Fitness+**: In-workout screen trimmed to three items (countdown, time left, one ring) for iPhone-only users after the original "busy" three-ring overlay was found distracting; Burn Bar compares you to prior participants.
- **Arc'teryx**: "cinematic editorial spread": Elan ITC Pro uppercase 400 display at 32px floating lower-left over full-bleed photography, Helvetica Now body, charcoal `#1a1a1a` ink, essentially **0px corners** sitewide; "every band carries its own photograph or its own surface tone."
- Tell: sport authority = square corners, condensed/uppercase display, photography, one ink. Softness (big radii, pastel gradients) reads consumer-wellness, not performance.

#### 14. Onboarding & plan-editor pattern sources — Zing Coach, TrainingPeaks
- **Zing AI**: 40-step onboarding framed as a conversational consultation with coach "Jennifer" (chat bubbles, encouraging feedback after key answers); **tap-and-hold to "sign" a commitment pledge**; "every animation feels… built by the UI gurus at Apple"; full-screen exercise animations; plan editor supports **add / replace / reorder / delete exercises with gestures**; Analytics tab with body scan + muscle recovery.
- **TrainingPeaks calendar refresh**: workout cards keep a **bright compliance color band at the top** and tone down the rest for WCAG contrast ("black text on red background… not visually accessible"); consistent title/subtext/icon placement; drag-and-drop to move workouts across days.
- Tell: color-code a *strip* of the card, not the whole card.

#### 15. Soccer / sport motion sites (Awwwards 2025–2026)
- **Goals** (football game, 14islands; Awwwards SOTD + Dev + HM, CSSDA SOTD, FWA SOTD): "parallax scroll animations to make the site feel alive and deep," "Goals is about how football feels so smooth motion was of the essence."
- **Lacoste Ace Breaker** (Merci Michel; SOTD + Dev Award, Aug 3 2026): WebGL/Three.js brick-breaker, fullscreen, unusual navigation; palette dark green `#082415` + golden yellow `#FCD757`; Dev scores: Animations/Transitions **9.2/10**.
- **The Performance Lab** (.RAW; HM Aug 1 2026; "Canada's #1 sports science centre"): Three.js + Next.js; palette `#FF350D` + `#171717`; homepage scroll effects, page transitions, parallax on services, **horizontal card scrolling**, menus with scroll-state tracking, tabs with timers. Community score 8.35.
- Also on the Awwwards sports list, Jul–Sep 2026: World Cup "The Immortals" (HM), WC 2026 "Data Portraits," Williams Grand Prix Tech (HM), Cadillac F1, Radian (UNCOMMON; SOTD + Dev), ORBEA (HM), Montreal Canadiens Foundation (HM).
- Older but canonical: adidas CHILE20 by **Active Theory** (Webby nominee): garments built as WebGL meshes via Marvelous Designer → C4D polygon reduction → VDB meshing; Nike Free zoetrope WebGL (Sehsucht).
- Tell: sport sites that win do one WebGL idea tied to the sport object (bricks, ball, garment), not an abstract blob.

### B. Award-level "futuristic AI product" sites (motion language, not product)

#### 16. Linear
- Canvas `#08090a` (marketing `#010102`), levels `#0f1011` / `#141516` / `#1a1b1d`; brand indigo `#5e6ad2` **accent-only**; CTAs are near-white `#e5e5e6` pills with `#08090a` text. Inter Variable (weight **510**), display-hero 80px `-0.025em`; Berkeley Mono for shortcut chips 11px uppercase. Page width capped 1024px, "refuses stretch."
- Motion: durations **80/120/180/280ms**; button hover `translateY(-1px)` 120ms; card hover border/bg only, **no transform**; modal slide 8px 280ms emphasized; page transition opacity 200ms; reduced-motion converts transforms to opacity. Sticky header `rgba(8,9,10,0.72)` + `blur(12px) saturate(180%)` — the only glass on the site.
- Premium tells: tonal layering instead of shadows; shadows only on floating UI; focus ring as box-shadow not outline; shortcut chips in mono.

#### 17. Vercel
- White `#ffffff` + `#171717`; workflow accents Ship red `#ff5b4f`, Preview pink `#de1d8d`, Develop blue `#0a72ef`. Geist Sans with **aggressive negative tracking (−2.4 to −2.88px at 48px)** "like code that's been minified for production"; Geist Mono. **Shadow-as-border**: `box-shadow: 0 0 0 1px rgba(0,0,0,0.08)` everywhere; multi-layer shadow stacks never exceed 0.1 opacity.
- Tell: "gallery-like emptiness where every element earns its pixel."

#### 18. Raycast
- Canvas `#07080a` ("blue-shifted, not pure black… pure black breaks aesthetic"); surface `#101111`; brand red `#FF6363`; interactive blue `#55b3ff`. Inter with `ss03`, **positive** letter-spacing +0.2–0.4px on body "to compensate for dark backgrounds"; GeistMono code. Hero: diagonal red stripe pattern; actual macOS window chrome as content.
- Depth: 5-layer keycap shadow stacks (gradient + 3 insets) and double-ring card containment; hover = opacity 0.6, not color swaps. No noise texture; "glass effect achieved via shadow layering."

#### 19. Resend
- Void black `#000000`, near-white `#f0f0f0`; signature **frost border** `rgba(214,235,253,0.19)` and ring `rgba(176,199,217,0.145) 0 0 0 1px` replace shadows. Domaine Display serif 96px/400 hero, ABC Favorit 56px `-2.8px` sections, Inter body, Commit Mono. Extraction notes "no 3D effects, particles, or gradients in core system" — the famous hero cube is a one-off set piece, not the system.
- Tell: "theater-like experience where content performs on a void stage."

#### 20. Cursor
- Warm cream `#f2f1ed`, warm near-black `#26251e`, orange `#f54e00`. Three-font hierarchy: CursorGothic 72px/400 `-2.16px`, jjannon serif body 19.2px, Berkeley Mono. **Agent timeline step colors**: Thinking `#dfa88f`, Grep `#9fc9a2`, Read `#9fbbe0`, Edit `#c0a8dd` — a reusable pattern for color-coding "what the AI is doing right now." Card shadow 28–70px blur diffused; color transitions 150ms, shadow 200ms.

#### 21. Perplexity
- Cream `#fbf9f5`, charcoal `#272520`, Tropic cyan `#20808d`; pplxSans weights 400/500 only (no 700); pill composer 9999px. Motion 120/200/320/480ms, reduced-motion halves durations. **Loading copy is process-aware: "Searching sources…", "Reading 12 sources…", "Generating answer…"** — the canonical "AI thinking" state.

#### 22. ElevenLabs
- Light `#ffffff` / dark `#0a0a0a`, lime brand `#9fe870` (hover `#8ad65e`/`#b3ee85`), surface `#161616`. Waldenburg **300** display ("whisper-thin titles") with InterDisplay fallback, Inter body +0.14–0.18px tracking, JetBrains Mono. Studio glow `0 0 60px rgba(159,232,112,0.18)` on the audio widget only. Motion: 80/150/220/320/480ms, waveform 600ms, spring `(0.34,1.56,0.64,1)`.

#### 23. Runway
- Pure black/`#030303`/`#1a1a1a`; cool slate `#767d88` secondary; **no interface gradients, zero shadows** — "depth comes from lighting, focus, and composition." abcNormal single typeface 48px/400 `-1.2px` line-height 1.0 ("film-title density"); weight 450 micro-labels; uppercase captions `+0.35px`. Full-viewport video with dark overlays; "cinematic photography IS the design."

#### 24. 2026 Awwwards AI SOTDs — Cleo AI (OddCommon, May 23), Sidewave (May 22), Serve Robotics (June 11)
- Cleo AI: video-driven hero + scroll animation, "Heart Motion," character-led money chatbot (site blocked fetch; Awwwards tags: hero animation, scroll animation).
- Serve Robotics: "The future is here" with **fragmented/split headline across the viewport**, 3D delivery robot as centerpiece, scroll-driven reveals, dark charcoal + white, "minimalist kinetic design: staggered text reveals, smooth image transitions, measured scroll responsiveness… rather than aggressive animations."
- Lusion (studio): "3D visual storytelling," 120fps liquid-glass benchmark site; clients Oryzo AI, Devin AI, Atlas Motion, Porsche Dream Machine; scroll-prompted ("CONTINUE TO SCROLL") narrative.

---

## Part 2 — Cross-cutting patterns (what the premium set shares)

**Token-level**
- Canvas is near-black with a tint, not `#000`: Linear `#08090a`, Raycast `#07080a`, Peloton `#0d0d0d`, Runway `#030303`. The two that use true black (WHOOP, Oura dark, Resend) compensate with a single warm/metal accent and frost/glow borders.
- One "voltage" accent, used for CTA + focus + one data highlight, never for surfaces: WHOOP lime, Strava orange, Peloton red, ElevenLabs lime, Linear indigo (accent-only), Perplexity cyan.
- Lime/acid green is the de facto "AI × performance" accent (WHOOP `#a0d10b`, ElevenLabs `#9fe870`) — relevant because turf green can be pushed there.
- Inter is the body font on 9 of the sites; differentiation comes from the *display* face (Editorial New, Domaine, Futura ND, Elan ITC, Waldenburg 300, CursorGothic) and from a **mono for data labels** (Berkeley Mono, Geist Mono, JetBrains Mono, Commit Mono).
- Metrics always use `tnum`; labels are 11px uppercase with +0.08–0.2em tracking; scores are 64–96px.
- Radius: 8px parity (WHOOP), or zero (Nike, Garmin, Arc'teryx) for sport authority; pills only for chips/avatars/one CTA style.
- Depth via tonal layering and 1px hairlines (`rgba(255,255,255,0.06)`), shadows only on floating UI; glow reserved for hover/featured/celebration.

**Motion-level**
- Durations cluster at 120–320ms for UI; **1200–1500ms "precise" `cubic-bezier(0.65,0,0.35,1)` for data fills** (rings, arcs, route draws, sparklines) with simultaneous count-up; 400–600ms energetic `cubic-bezier(0.34,1.56,0.64,1)` reserved for *celebrations* (kudos, PR).
- Hover = opacity/border/1px lift. Card hover never scales (Linear). CTA press scale 0.97–0.98.
- Every token set documents `prefers-reduced-motion` → opacity-only / instant fills.
- Award sport sites: one WebGL idea tied to the sport object, parallax depth, page transitions, horizontal card rails, fragmented split headlines.

**The "AI generated your plan" moment — composite of best practice**
1. Collect inputs conversationally (Zing chat consult; Runna 30 chapters) and show a **Preferences Summary** card before generating (Runna; Future's "Michelle" persona card).
2. Generation screen uses **process-aware steps** (Perplexity) with per-step color (Cursor timeline) and a determinate bar (Runna coral bar), not a spinner.
3. Reveal follows skeleton → stream → done; layout of skeleton matches the plan grid so nothing jumps.
4. Explain *why* with a visual (Fitbod body map → for xTrain, a skill radar/weak-foot split) and one-line conversational insights ("you're nailing endurance in Zone 2…" — Strava AI).
5. Make the AI's authority explicit: suggests, doesn't silently rewrite (Athletica); learns from edits and an exertion/feel rating (Fitbod).
6. Introduce a coach/persona at the end (Runna coach intro; Ladder teams).

**Dashboard patterns**: one big thing (Oura) → today's session + readiness ring/arc (WHOOP) → week strip with completed/remaining + total volume (Runna) → swipeable "In Focus" with the factors behind the score (Garmin) → recent activity with map/metric strip (Strava) → leaderboard/competitions (Peloton, Garmin).

**Plan editor patterns**: drag across days/weeks (TrainingPeaks, Runna), compliance/intensity as a top color band not a full-card fill (TrainingPeaks), swap/replace/reorder/delete gestures (Zing), "Not feeling 100%" load dial for N days (Runna), regenerate with the AI suggesting rather than overwriting (Athletica), per-session config modal with time picker + skip (Runna).

**Library patterns**: filter chips that invert on active (Nike), card with 16:9 preview + live/new state dot (Peloton), video for every movement (Ladder), difficulty + equipment metadata (Fitbod gym profiles), radar/scatter linked to video (Hudl).

---

## Part 3 — Design direction brief for xTrain

### 3.0 Verdict on the existing dark navy + turf green
Keep the *instinct*, replace the *values*. Evidence: navy + saturated grass green is the palette of B2B soccer tooling (Hudl, Catapult) and betting/club-admin products; every consumer site in the research that reads "futuristic" sits on a blue-shifted near-black (`#07080a`–`#0d0d0d`), and the two most "AI × performance" accents are acid limes (WHOOP, ElevenLabs), not turf. So: push navy down to a blue-black stage, push green up to a volt lime used as a single voltage accent, and keep the *pitch* as a line/texture device rather than a fill color. Add one cool and one warm data hue so charts aren't monochrome green.

### 3.1 Three candidate directions

**Direction A — "Pitchside Lab" (evolve navy + green) — RECOMMENDED**
- Mood: a sports-science lab at night, under floodlights: the data glows, the pitch is drawn in light.
- Palette: canvas `#070B10`; surface-1 `#0D131B`; surface-2 `#131B25`; popover `#1A2430`; hairline `rgba(255,255,255,0.06)`; border-strong `#26303C`; text `#F2F5F7` / secondary `#AAB4BF` / tertiary `#6B7682`. Accent "Volt" `#B6FF3B` (hover `#A3EC2B`, press `#8FD426`, on-accent text `#06110B`, glow `0 0 24px rgba(182,255,59,0.22)`). Data pair: Sprint cyan `#38D6FF`, Load amber `#FFB347`. Semantic: good `#5CE08A`, warn `#FFB347`, danger `#FF4D5E`. Intensity ramp for the calendar strip: Rest = outline only; Light `#2F5A3A`; Moderate `#4E9C4B`; Hard `#8FE03A`; Max `#B6FF3B`; over-load flag amber.
- Type (Google Fonts): Display **Geist** 600, tracking −0.03em at ≥48px (Vercel's font, now on Google Fonts; fallback `Inter, system-ui`); Body **Inter** 400/500 (variable with `opsz`; fallback `system-ui`); Data/labels **Geist Mono** 500 `tnum` (fallback `JetBrains Mono, ui-monospace`). Scores 72–96px/600 tnum; eyebrows 11px uppercase +0.14em in mono.
- Motion language: Linear durations for UI (120/180/280ms), WHOOP/Oura "precise" 1200–1500ms fills for data, Strava energetic 400ms for milestones only; one WebGL set piece (pitch particle field) on marketing; drawn SVG pitch lines as the loading/transition motif; glow only on hover/featured.
- Surface devices: 2–3% film-grain noise on canvas; faint pitch-marking SVG at 4–6% white behind heroes and empty states; frost hairline `rgba(214,235,253,0.12)` (Resend) on featured cards instead of shadows.

**Direction B — "Broadcast Black"**
- Mood: match-day broadcast graphics for your own training; loud, uppercase, kinetic.
- Palette: canvas `#000000`; surfaces `#0A0A0A` / `#141414` / `#1F1F1F`; accent "Hi-Vis" `#F2FF3F` (referee-kit yellow; hover `#E0EE2A`; on-accent `#0A0A0A`); recovery bands green `#16EC06` / yellow `#FFDE00` / red `#FF0026` (WHOOP); cyan `#0093E7` for load; text `#FFFFFF` / `#B5B5B5`.
- Type: Display **Big Shoulders Display** 800 uppercase, line-height 0.9 (fallback `Anton, Impact`); Body **Inter**; Data **IBM Plex Mono** 500 `tnum`.
- Motion: hard cuts 150–240ms, SplitText line-mask reveals, number slams with overshoot, stat marquees, Peloton pulse dots, scale 1.02/0.98 CTAs.
- Risk: it is one accent away from a WHOOP/Peloton clone, and heavy uppercase fatigues in a daily-use plan editor.

**Direction C — "Editorial Turf" (light)**
- Mood: a performance magazine that happens to coach you (Oura storefront × Cursor × Arc'teryx).
- Palette: canvas `#F4F1EA`; surface `#FFFFFF`; ink `#14201A`; secondary `#5E6A63`; hairline `rgba(20,32,26,0.10)`; accent deep turf `#146B3A` (hover `#0F5530`) with Volt `#B6FF3B` only for the "AI is working" state; data cyan `#1E8FB5`, amber `#D98B1F`.
- Type: Display **Inter** 500 tight with one phrase per headline flipped to **Instrument Serif** italic (fallback `Fraunces, Georgia`); Body Inter; Data **JetBrains Mono**.
- Motion: slow and spacious, 320–480ms emphasized `cubic-bezier(0.2,0,0,1)`, progressive disclosure, photographic parallax, zero-radius imagery, square corners.
- Risk: founders asked for "almost futuristic, very very animated"; light editorial reads calm and premium but not futuristic, and glow/WebGL set pieces read weaker on cream. Best kept as a light-mode theme or for long-form editorial pages.

**Recommendation: Direction A.** It satisfies the brief (futuristic, heavily animated) because dark blue-black is the only canvas where glow, rings, particles and WebGL read as premium (Linear, Raycast, Runway, WHOOP, Peloton all sit there); it preserves the team's navy/green equity and the soccer semantics (pitch, floodlight, kit volt) while fixing the "corporate dashboard" read; it leaves room to differentiate from WHOOP (Geist + mono + cyan/amber data pair + pitch-line motif instead of Inter-heavy uppercase lime); and it degrades well to a light theme using Direction C's values if ever needed.

### 3.2 Fifteen prioritized animations / interactions for xTrain

| # | Interaction | Page | Source reference | Implementation | Spec notes |
|---|---|---|---|---|---|
| 1 | **Plan-generation sequence** ("Reading your profile → Weighting your weak foot → Balancing load across 4 days → Writing week 1"): full-screen stepper, each step a mono line that checks off with a Cursor-style step color; behind it a pitch-line SVG draws itself and a determinate bar fills; ends on a count-up ("4 sessions · 2h 40m · 3 focus skills") | Onboarding → Plan | Perplexity process copy; Runna "Building your plan" bar; Cursor timeline colors; Strava 1200ms route draw | GSAP timeline + DrawSVGPlugin (free since Webflow acquisition) + Motion for React (`motion/react`) for step list; TextPlugin for count-up | Steps are real backend phases streamed via SSE, not fake timers; min 1.8s, max = real time; reduced-motion = static list that checks off |
| 2 | **Plan reveal with "because you said" chips**: skeleton grid matching the week layout → cards stagger in (40ms) → intensity strip on each card fills → 3–5 chips typewriter in ("because you said: 3 days/week", "weak left foot", "no partner") | Plan (first view) | AI skeleton→stream→done pattern; Future's persona card; Fitbod "why this today" | Motion `AnimatePresence` + `layoutId` from the generation screen; CSS shimmer skeleton; GSAP SplitText (chars) for chips | Skeleton line widths varied; shimmer slow (1.6s) and low contrast |
| 3 | **Skill radar** (passing / shooting / dribbling / first touch / fitness / weak foot) grows from center with per-axis stagger, values count up, hover an axis to see the drills feeding it | Dashboard, Progress | Hudl Statsbomb radars; WHOOP/Oura ring timing | SVG polygon + GSAP (attr tween on points) or Motion `animate`; D3 scales | 1200ms `cubic-bezier(0.65,0,0.35,1)`; axis labels in Geist Mono 11px uppercase; `role="img"` + text table fallback |
| 4 | **Readiness ring + load arc on Today card** with threshold color bands and tnum count-up | Dashboard | WHOOP recovery ring (1500ms) / strain arc; Oura score ring | SVG `stroke-dashoffset` via WAAPI or CSS `@property` | `role="meter"` + `aria-valuenow`; bands: Volt / amber / danger |
| 5 | **Marketing hero: floodlit pitch particle field** — an instanced point cloud resolves into pitch markings, then on scroll morphs into a skill radar / week grid; headline split-line mask reveal over it | Landing | Lusion/Active Theory set-piece logic; Goals (14islands) "smooth motion of the essence"; Serve Robotics fragmented headline | React Three Fiber + drei, GSAP ScrollTrigger scrub for morph; SplitText lines for headline | ≤1.5 MB total; poster image fallback; pause offscreen; cap DPR 1.5 |
| 6 | **Pinned "How xTrain builds your week"**: left copy pinned, right device frame swaps profile → generation → plan as you scroll | Landing | Linear/Vercel product-as-content; Oura/Instrument progressive disclosure; The Performance Lab pinned scroll | GSAP ScrollTrigger `pin` + Flip between three states | Three states max; mobile = stacked with autoplay video |
| 7 | **Calendar drag-to-reorder / move across weeks** with spring settle, ghost placeholder, live intensity recompute, and a "Swap session" sheet on long-press | Plan editor | Runna V3 move-between-weeks; TrainingPeaks drag-drop + top compliance band; Zing reorder gestures | dnd-kit for logic + Motion layout animations (spring stiffness 500, damping 40) | Intensity shown as a 3px top strip per card (TrainingPeaks lesson), never a full-card fill |
| 8 | **Regenerate week**: current cards flip out (rotateY 90°, 180ms, stagger 30ms) → matched skeletons → new cards stream in; changed sessions get a Volt hairline + one-line "what changed and why"; AI proposes, user confirms | Plan editor | Athletica "AI does not automatically modify"; Fitbod learns from edits; skeleton→stream pattern | Motion `AnimatePresence` + `layoutId`; diff computed server-side | Undo toast 280ms slide (Linear toast spec) |
| 9 | **"Not feeling 100%" load dial**: radial slider recolors the week live (intensity ramp shifts down) for N days | Plan editor | Runna "Not Feeling 100%" 3–14 days; Garmin In Focus factors | Motion drag + CSS custom properties driving the intensity ramp | Shows the factors it will change (volume, intensity, rest) as Garmin does |
| 10 | **Coach insight stream**: AI messages stream token-by-token into "insight cards" with a metric chip ("Left-foot passes +18% this week") and a one-tap "Add drill" | Dashboard, Progress, Chat | Strava Athlete Intelligence conversational insights; WHOOP Coach inline; Perplexity citations-as-type | SSE streaming + Motion for card entrance; no typewriter on body text (stream real tokens) | Typing indicator = 3-dot pulse 1200ms (Peloton live-dot cadence) |
| 11 | **Library hover-video + filter reflow**: card shows poster, hover/focus scrubs a muted 3s loop; filter chips invert on active; cards reflow with layout animation | Drill library | Ladder video-for-every-movement; Peloton class card; Nike filter chip invert | `<video muted playsinline preload="metadata">` with IntersectionObserver; Motion `layout` on grid | Difficulty 1–5 as segmented bar; equipment as mono icon chips |
| 12 | **Drill detail 3D scene**: the existing passing/shooting/dribbling 3D visualizations embedded with scroll-scrubbed camera and numbered step markers | Drill page | adidas CHILE20 (Active Theory) product-as-3D; Hudl 3D View | R3F + GSAP ScrollTrigger scrub on camera; drei `ScrollControls` alternative | This is xTrain's unique asset; keep it the only heavy 3D in-app |
| 13 | **Today card "live" state**: Volt pulse dot when a session is due, magnetic primary CTA (±6px cursor pull), glow halo on hover | Dashboard | Peloton live indicator; WHOOP lime glow; Raycast opacity hovers | CSS keyframes + small pointer-move handler (or GSAP quickTo) | Magnetic effect desktop-only; disabled under reduced motion |
| 14 | **Streak + weekly progress**: segmented bar fills with 60ms stagger; milestone (first full week, PR) = scale 0.8→1 + glow 400ms energetic ease; no confetti | Dashboard, Progress | Strava PR celebration + kudos burst; Fitbod/Runna confetti noted as generic | CSS/WAAPI | `cubic-bezier(0.34,1.56,0.64,1)` used here only |
| 15 | **Page + shared-element transitions**: drill card → drill page morphs the thumbnail; route changes crossfade 200ms | All | Linear 200ms opacity page transition; The Performance Lab page transitions | View Transitions API (`@view-transition`, `view-transition-name`) with Motion `layoutId` fallback | Never exceed 280ms for navigation |

Optional add-ons once the fifteen ship: stat marquee / number tickers on marketing (Linear/Vercel), tap-and-hold "commit to the plan" pledge (Zing), Rive state-machine coach avatar for idle/thinking/celebrating (prefer Rive over Lottie for interactive states; Lottie for icon-level micro-states).

### 3.3 Patterns to avoid (with evidence from the research)

1. **Purple→pink "AI" gradients and gradient surfaces.** None of the premium references use them: Runway "no interface gradients," Resend "no 3D effects, particles, or gradients in core system," Raycast's only gradient is a keycap, Linear keeps indigo accent-only. Oura's capture explicitly lists "neon-green heart-rate gradient" as a rejected cliché.
2. **Glassmorphism everywhere.** Linear uses backdrop blur on exactly one element (sticky header); Raycast simulates glass with shadow layering, not blur; Oura rejects "dashboard mockup behind glass." Use frost hairlines (Resend `rgba(214,235,253,0.19)`) instead.
3. **Pure `#000` with grey cards and heavy drop shadows.** Raycast: "pure black breaks aesthetic"; Linear and ElevenLabs studio cards use tonal layering; Runway has zero shadows. Shadows belong to popovers/modals only.
4. **Abstract 3D blobs, orbs, "neural network" node graphics.** Winning sport/AI sites tie their one 3D idea to a real object: Lacoste bricks, Serve's robot, Raycast keycaps, adidas garments, Nike zoetrope. For xTrain that means ball, pitch markings, boot/sensor, cones.
5. **Spinner-only or fake-timer "generating" screens.** AI UX guidance: skeleton → stream → done; Perplexity's process-aware copy; Runna's determinate bar. Steps should map to real pipeline phases.
6. **Confetti and generic celebration.** Fitbod's confetti is called "generic" in its teardown; Runna fires it on subscription. Strava's kudos burst and PR glow are the model: small, physical, brand-colored.
7. **Multiple accent colors.** Strava, Peloton, WHOOP, ElevenLabs, Perplexity each run one voltage color; Linear's indigo is accent-only. Keep Volt as the only accent; cyan/amber are *data* hues, never CTA colors.
8. **Full-card intensity fills.** TrainingPeaks had to retreat from black-on-red cards for accessibility; the fix was a color band at the top with a toned-down body.
9. **Bouncy, transform-heavy hover states and long UI durations.** Linear: card hover changes border/bg only, no transform; UI durations 80–280ms across Linear, Nike, Garmin, Perplexity. Reserve overshoot easing for milestones.
10. **Rounded-everything.** WHOOP's "8px radius parity" and the zero-radius geometry of Nike, Garmin, Arc'teryx are what make sport UI read equipment-grade; pills only for chips, avatars and one CTA style.
11. **Dense "everything dashboard."** Oura's redesign is organised around "one big thing"; Apple Fitness+ cut the in-workout screen to three items after the three-ring overlay was found distracting; Fitbod's in-workout screen is criticised as "dense." Today = one session, one ring, one insight.
12. **WHOOP cosplay.** Inter-heavy uppercase + lime on black is now WHOOP's silhouette. Direction A deliberately swaps in Geist + a mono data face, a cyan/amber pair and pitch-line geometry to stay distinct.
13. **Transformation galleries / before-after bodies** (Freeletics) and generic lifestyle stock of "people high-fiving" — dated for a youth soccer product; use drill footage and data overlays (Hudl floating video, Runway full-bleed).
14. **Ignoring `prefers-reduced-motion`.** Every token set in the research documents it (opacity-only, instant fills, frozen carousels). Ship it from day one or the "very animated" brief turns into an accessibility problem.
15. **Navy `#0B1F3A` + grass green `#2E8B57` as fills.** Reads as club-admin / B2B analytics (Hudl, Catapult) or betting; consumer-premium sits on blue-black with a volt accent.

### 3.4 Implementation stack notes
- **GSAP 3.13+** is free for commercial use including ScrollTrigger, SplitText (rewritten, 50% smaller, screen-reader aware), Flip, DrawSVG, MorphSVG, MotionPath (Webflow acquisition). Use it for scroll choreography, SVG drawing and text splitting.
- **Motion** (formerly Framer Motion; npm `motion`, import from `motion/react`) for React layout/presence animations, drag and springs in the app shell.
- **React Three Fiber + drei** for the two 3D moments (hero particle pitch, drill scenes). Keep everything else DOM/SVG.
- **View Transitions API** for route and shared-element transitions, Motion `layoutId` as fallback.
- **Rive** for the coach avatar state machine; **Lottie** only for small icon states.
- Tokens: adopt the shared easing set found across references — standard `cubic-bezier(0.4,0,0.2,1)`, emphasized `cubic-bezier(0.2,0,0,1)`, precise `cubic-bezier(0.65,0,0.35,1)` for data, energetic `cubic-bezier(0.34,1.56,0.64,1)` for milestones; durations 120 / 180 / 280 / 1200–1500ms.

---

## Sources

Sports & fitness
- WHOOP tokens: https://www.webdesignhot.com/design.md/whoop/ · Basic Agency case study: https://basicagency.com/case-studies/whoop · WHOOP Coach: https://www.whoop.com/eu/en/thelocker/whoop-unveils-the-new-whoop-coach-powered-by-openai · https://www.wareable.com/wearable-tech/whoop-launches-gpt-4-ai-coach
- Oura tokens: https://www.webdesignhot.com/design.md/oura/ · https://www.shadcn.io/design/oura · Instrument case study: https://instrument.com/work/oura-smart-ring · Brand guidelines: https://static.ouraring.com/pdfs/Oura_BrandGuidelines_v1.pdf · New app: https://ouraring.com/blog/new-app-design/ · https://www.droid-life.com/2025/11/13/oura-ring-app-gets-big-facelift-ai-gets-more-access-to-your-metrics/
- Strava tokens: https://www.webdesignhot.com/design.md/strava/ · Athlete Intelligence: https://t3.com/active/strava-s-new-ai-powered-feature-turns-your-workout-data-into-instant-insights · https://www.advnture.com/news/strava-launches-athlete-intelligence
- Peloton tokens: https://www.webdesignhot.com/design.md/peloton/ · https://www.shadcn.io/design/peloton
- Fitbod: https://fitbod.me/ · https://screensdesign.com/showcase/fitbod-gym-fitness-planner · https://www.techradar.com/health-fitness/fitbod-app-review · https://www.rapidnative.com/blogs/ai-fitness-apps
- Freeletics: https://www.freeletics.com/en/ · https://insider.fitt.co/press-release/freeletics-unveils-a-new-era-in-digital-fitness-with-the-launch-of-coach/
- Runna: https://www.runna.com/ · https://screensdesign.com/apps/runna-running-training-plans/ · V3: https://runningindustryalliance.com/?p=20508 · 2026 briefings: https://endurance.biz/2026/industry-news/runna-updates-beginner-and-return-to-running-training-plans/
- Tonal: https://www.tonal.com/
- Athletica: https://athletica.ai/ · https://news.athletica.ai/posts/the-new-athletica-training-experience-is-live
- Future: https://www.future.co/ · Ladder: https://www.joinladder.com/ · https://www.garagegymreviews.com/ladder-app-review
- Zwift: https://www.zwift.com/ · https://bikebiz.com/zwift-unveils-re-brand-with-bold-new-designs/ · https://zwiftinsider.com/sneak-peek-homescreen/
- Hudl: https://www.hudl.com/ · https://www.hudl.com/products/statsbomb/platform · Catapult: https://www.catapult.com/ · Playermaker: https://playermaker.com/
- Nike tokens: https://www.webdesignhot.com/design.md/nike/ · Garmin tokens: https://www.webdesignhot.com/design.md/garmin/ · Garmin Connect redesign: https://androidauthority.com/garmin-connect-redesign-3364392 · https://www.techradar.com/health-fitness/fitness-trackers/your-garmin-connect-app-is-about-to-change-forever-according-to-recent-rumors
- Apple Fitness+: https://appleinsider.com/articles/23/01/26/apple-fitness-review-two-years-later-barely-treads-water · https://support.apple.com/guide/fitness-plus/apdf8a229f34
- Arc'teryx: https://www.shadcn.io/design/arcteryx · https://appliedartsmag.com/winners/design/arc-teryx-spring-run-w236/?year=2024
- Zing AI: https://screensdesign.com/showcase/zing-ai-home-gym-workouts · https://www.techradar.com/health-fitness/zing-coach-is-an-app-that-reveals-the-true-power-of-ai-training
- TrainingPeaks: https://trainingpeaks.com/learn/articles/trainingpeaks-calendar-refresh · https://help.trainingpeaks.com/hc/en-us/articles/204072164-How-do-I-move-a-workout
- Soccer apps: Techne https://apps.apple.com/app/id1298569303 · aiScout https://mwm.ai/apps/aiscout/1508291341 · Juggernaut AI https://apppricinglab.com/app/apple/1515756471
- Sport motion sites: Goals (14islands) https://www.sanity.io/projects/goals · Lacoste Ace Breaker https://www.awwwards.com/sites/lacoste-ace-breaker · The Performance Lab https://www.awwwards.com/sites/the-performance-lab · Awwwards sports list https://www.awwwards.com/websites/sports/ · adidas CHILE20 (Active Theory) https://www.webbyawards.com/crafted-with-code/adidas-chile20/ · Nike Free WebGL https://www.dexigner.com/news/27397

Futuristic AI product sites
- Linear: https://www.webdesignhot.com/design.md/linear/ · Vercel: https://design.hagicode.com/designs/vercel/ · Raycast: https://design.hagicode.com/designs/raycast/DESIGN.md · Cursor: https://design.hagicode.com/designs/cursor/ · Resend: https://design.hagicode.com/designs/resend/ · Perplexity: https://www.webdesignhot.com/design.md/perplexity/ · ElevenLabs: https://www.webdesignhot.com/design.md/elevenlabs/ · https://www.skills.sh/deepparser/skills/design-elevenlabs · Runway: https://design.hagicode.com/designs/runwayml/DESIGN.md
- Cleo AI (OddCommon): https://www.awwwards.com/inspiration/homepage-entry-cleo-2 · Serve Robotics: https://www.serverobotics.com/ · Sidewave/Serve SOTD listing: https://www.awwwards.com/inspiration_search/sites_of_the_day/ · Lusion: https://lusion.co/ · https://awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html · Active Theory "Craft Matters": https://lbbonline.com/news/Craft-Matters-by-Active-Theory

Patterns & tooling
- AI loading states: https://vp0.com/blogs/ai-fetching-data-skeleton-loader-ui · https://skillselion.com/skills/thedaviddias/ux-patterns-for-developers/ai-loading-states
- GSAP free: https://webflow.com/updates/gsap-becomes-free · https://npmjs.com/package/gsap
- Motion (ex-Framer Motion): https://motion.dev/docs/migration · https://motion.dev/blog/introducing-motion
