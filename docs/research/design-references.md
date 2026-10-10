# Design references: craft research for the xTrain landing rebuild

Captured 2026-10-10 with headless Chrome (Playwright, 1440x900). Each site got hero and scroll frames, an intro-frame burst (8 frames about 140 ms apart from first paint), a CSS census of every stylesheet (cubic-bezier counts, durations, keyframe names, tracking), a `document.getAnimations()` snapshot, computed transitions, GSAP tween dumps where GSAP was on `window`, and targeted DOM probes. Raw captures live in `research/craft/<slug>/`. The synesdj teardown exists separately and is not repeated here.

**Sites captured (20).** Product craft: Linear, Raycast, Family, Cosmos, Arc, Dia, Rive, Luma, Vercel Ship '26, Nothing, Teenage Engineering. Sport and performance: On (LightSpray launch page), WHOOP, McLaren Racing, Oracle Red Bull Racing, Williams Grand Prix Technologies, and from the Awwwards Sports category (Jul–Sep 2026): **The Immortals** (World Cup history), **The Last Tango** (Messi tribute), **United in Football** (2026 World Cup), **Lacoste Ace Breaker** (Site of the Day), **The Performance Lab**.

Cookie and newsletter overlays were hidden with injected CSS. Nothing was accepted, submitted or signed up for.

---

## 0. The short version

1. **The best pages use the product as the illustration.** Linear, Raycast, Dia, Family and Luma build real UI in HTML (or play screen recordings inside device frames) and let it run: timers tick, "Working…" shimmers, prompts type. Nobody uses a stock 3D blob. For xTrain the equivalent is a live session card plus a pitch diagram that draws itself.
2. **Sites that feel expensive use fewer words.** Words on the home page: Last Tango 45, Teenage Engineering 153, Cosmos 230, Immortals 237, Vercel Ship 352, Nothing 362, United 411, Luma 521, Dia 588. The busy pages run 1,100–1,760 words: WHOOP 1,129, McLaren 1,221, Linear 1,508, Family 1,744, Raycast 1,759. **Target: 300–450 words** for the whole page.
3. **They use one accent and spend it rarely.** Linear's marketing chrome is fully monochrome; colour shows up only inside product UI and two testimonial cards. Williams puts `#0042FF` only on its single primary CTA and the 6 px label squares. Dia uses yellow only for the hero wash and the CTA glow.
4. **Labels replace sentences.** Typical patterns: "Host / Winner" (Immortals), "Athlete / Route / Time / PB Improvement" (On), "FIG 0.1" (Linear), "01 / 02 / 03" (Dia). A grey label at 11–13 px (usually mono) sits over a value at 16–24 px.
5. **Motion is mostly ease-out, short on interaction and long on reveal.** Hovers run 100–200 ms. State changes run about 300 ms. Reveals run 600–1000 ms on expo or quint ease-out curves. Ambient loops run 1.1–2.8 s and marquees 56–78 s. None of the 20 sites put a bouncy spring on text.
6. **Scroll stays native at the best product sites.** Linear, Raycast, Family and Luma use no smooth-scroll library. Lenis appears only on the editorial and campaign builds (Vercel Ship, Nothing, Dia, Rive, Last Tango, Perf Lab, United).

---

## 1. Site-by-site teardown

### Linear (linear.app)
- **Signature moment.** The hero copy resolves from blur, then the product window fades up underneath it, already doing something. A Linear Agent panel types "Thinking…" and a "Working…" badge carries a sweeping hairline shimmer.
  - Measured on the subtitle: opacity 0→1 and `filter: blur(10px)→0` over about 1000 ms with CSS `ease`. Lines are staggered about 140 ms apart.
  - Images load in with a mask wipe, `animation: .8s both load`, which animates `mask: linear-gradient(to right,#000 25%,#000000e6 50%,#0000) 150% 0/400% → 0 0/400%`.
  - The "Working…" badge is an `::after` pseudo-element at hairline thickness. It uses `mask-composite: exclude` with `background-size:120px 72px` and runs `2s linear -.08s infinite` from `background-position 0` to `120px`. Label text gets its own sweep, also 2 s linear.
  - The 5×5 SVG dot-matrix loaders use `steps(1)` opacity 0.3↔1 keyframes ("upDown" 2800 ms, "pong" 1600 ms). They are tiny LED-style indicators.
- **Type.** Inter Variable for display: h1 64 px / 510 / −0.022em / line-height 1.0. Berkeley Mono for code and figure labels. Tracking tightens with size: −.022em display, −.012em subheads, −.003em body.
- **Colour.** Page `#08090A`, text `#F7F8F8`, muted `#8A8F98` and `#62666D`, lines `rgba(255,255,255,.08)`. Accents (pink `#F79CE0`, peach `#F7BF8B`, periwinkle `#8FA6FF`) appear only as status colours inside the product UI. Testimonial cards are the only full-colour blocks (lavender and acid lime).
- **Density.** Every section pairs a two-line title ("Intake / and integrations"), a 2–3 line paragraph and a large product crop that bleeds off the grid, plus a quiet "Features" link list. Isometric line drawings carry "FIG 0.1 / 0.2 / 0.3" captions, like a technical manual.
- **Micro-interactions.**
  - Link colour changes in 100 ms `ease`.
  - Buttons transition background and filter over 160 ms with `cubic-bezier(.25,.46,.45,.94)`.
  - Drawer and sheet motion uses `cubic-bezier(.32,.72,0,1)`, the iOS sheet curve, which appears 11 times in their CSS.
  - The cursor is unchanged.
- **Cheap risk.** At 1,508 words the page is long. The lower half becomes a feature index.

### Raycast (raycast.com)
- **Signature moment.** A WebGL hero of diagonal red glass slats with a specular highlight that sweeps across them and a cyan rim light. It loops slowly behind centred copy on a 1200×967 webgl2 canvas at DPR 2. Further down, the product window (clipboard history, AI chat) is built in DOM.
- **Type.** Inter 64 / 600, centred. Small UI text uses *positive* tracking: +.2 px appears 123 times and +.1 px 53 times. GeistMono and JetBrains Mono handle "Install via Homebrew" style meta.
- **Colour.** Near-black, white at 100/60/40% opacity, and brand red only in the hero glass and small icons.
- **Density.** A "feature wall" of keyboard tiles ("Fast. Think in milliseconds."). Each bold lead-in runs straight into grey continuation text.
- **Micro-interactions.**
  - The primary button behaves like a key-cap: `box-shadow: 0 0 0 2px rgba(0,0,0,.5), 0 0 14px rgba(255,255,255,.19), inset 0 -1px .4px rgba(0,0,0,.2), inset 0 1px .4px #fff`. Hover takes the background from `#E6E6E6` to `#FFF`.
  - Their dominant curve is `cubic-bezier(.23,1,.32,1)` (easeOutQuint, 21 uses), followed by `(.165,.84,.44,1)` (easeOutQuart) and `(.16,1,.3,1)`.
  - Carousel progress bars run 5 s linear. Caret blinks run 1.1 s linear.
- **Cheap risk.** 1,759 words and very long. Several sections use "big card plus logo wall" filler.

### Family (family.co)
- **Signature moment.** Phone screen recordings inside device frames: send, receive, swap, nft, watch, activity and others. Each clip is 2.7–6.0 s, `muted playsinline`, with no autoplay attribute; JS plays them when they scroll into view. The three smaller ones play once and the three large ones loop. "Details that matter" uses live micro-components on grey tiles, such as an "Analyzing Transaction" pill and a swap card.
- **Type.** Custom "Family" face, h1 68 / 500 / −0.02em / 1.1. Eyebrows are small and blue ("Monitor In Real-Time").
- **Motion.** Reveals use `transform 1000ms cubic-bezier(.19,1,.22,1)` (expo-out). Press feedback is `transform .22s cubic-bezier(.19,1,.22,1)`. Framer-motion springs sit at stiffness 200–280.
- **Cheap risk.** 1,744 words. The tweet-card testimonial grid and the FAQ accordion are generic.

### Cosmos (cosmos.so)
- **Signature moment.** The hero is a field of small, rotated image tiles drifting at different depths. Far tiles are blurred and pale. It is drawn on a full-viewport canvas whose context was not reachable from the page (likely moved to an OffscreenCanvas in a worker). A brand list ("Bottega Veneta / LOEWE / Alexander Wang…") shows one name in black and the rest in grey, cycling.
- **Type.** cosmosOracle (ABC Oracle) h1 72 / 700 / −0.04em / 1.0. basisMono for meta.
- **Colour.** Pure greyscale. All colour comes from the images.
- **Motion.** Transitions run `.4s cubic-bezier(0,0,.2,1)` on transform and `.7s` on filter and scale. Marquees run 56 s per loop. The search placeholder has a shimmer mask (1.3 s). Keyframes include `snake-border` and `dot-wave`.
- **Density.** 230 words in total.

### Arc / Dia (arc.net, diabrowser.com)
- **Signature moment (Dia).**
  - **Sunrise dock.** A huge ellipse is anchored to the bottom of the viewport: `width: max(141vw, …)`, `aspect-ratio: 2034/978`, `border-radius: 50%`, background `#FBFAF6`. Behind it sits a blurred glow blob, `#FFE48C` at `blur(40px)`. The ellipse's `scaleY` is bound to a scroll-driven CSS variable `--dock-arc`, so the curve flattens as you scroll. The "Download Dia for free" pill rides on the horizon throughout the page.
  - **Sticky step list.** The left column is `sticky; top: 20vh`. Steps are numbered "01/02/03" in ABC Favorit Mono 11 px, with titles in Exposure VAR (a variable serif) at 24 px. Inactive titles sit at `rgba(0,0,0,.45)` and the active one at `.85`, transitioning over `.3s cubic-bezier(.4,0,.2,1)`. The right column swaps the product view.
- **Type.** Exposure VAR serif for display, ABC Oracle for text, ABC Favorit Mono for labels. Arc uses Marlin Soft plus EB Garamond.
- **Colour.** Warm paper `#FBFAF6`, ink at 85% opacity, a yellow wash (`#FFDC5C`, `#FFE48C`), and the accent only in the hero and the glow.
- **Motion.** `(.77,0,.175,1)` (easeInOutQuart) and `(.87,0,.13,1)` (easeInOutExpo) for large moves. Lenis smooth scroll is on.

### Rive (rive.app)
- **Signature moment.** The left column runs a vertical stack of category video cards (Product UI, Game UI, Mobile apps, Film+TV) as a slow vertical marquee. A CLI install snippet card sits beside the headline.
- **Type.** Orbitron 900 caps, Tomorrow, PragmataPro.
- **Cheap risk.** Orbitron and Tomorrow read as an esports or "AI-gamer" template. Everything is uppercase and the testimonial wall has 12 cards. **Avoid this type direction.**

### Luma (lumalabs.ai)
- **Signature moment.** A full-bleed, fast-cut video montage hero dimmed to about 50%, with "Brand Exploration • Generating" pills overlaid. A prompt box docks at the bottom edge of the hero ("What's due this week?") and its placeholder types and deletes a rotating list of real prompts. On scroll the box rises to the top and the page turns white.
- **Type.** Graphik 52 / 500 / −0.04em, with PP Editorial serif in places.
- **Motion.** `(.22,.8,.28,1)`, `(.19,1,.22,1)`, 150 ms micro transitions.
- **Density.** Section changes are marked by a full switch between a white and a black page.

### Vercel Ship '26 (vercel.com/ship)
- **Signature moment.** Sixteen pixel-art mascots stand in a 1-3-5-6 pyramid and change pose in sync: hop, blink, turn. The headline "Ship what's next" is set in **GeistPixelCircle**, a dot-matrix font made of circles, at 96 px / 500 / −0.06em. A countdown ticks live ("4D.16H.26M.28S"). The ticket button has **stepped pixel corners**, cut with a `clip-path` polygon.
- **Colour.** Pure greyscale: `#EDEDED` on `#000`, with black-and-white photography.
- **Labels.** Geist Mono in uppercase at 12–13 px.
- **Motion.** `(.32,.72,0,1)` and `(.4,0,.2,1)`. Marquees run 70 s. Lenis is on.

### Nothing (us.nothing.tech)
- **Signature moment.**
  - The whole page sits on a faint dot-grid background (dots on `#F2F2F2`).
  - Nav and footer labels use **Ndot**, the brand's dot-matrix face.
  - Headlines use NType82, a serif, at 48 px.
  - Micro labels use LatteraMono in caps.
  - Product naming follows a parenthesis convention: "HEADPHONE (1) PRO".
- **Colour.** Greyscale with product colour (pink, yellow) on grey plinths.

### Teenage Engineering (teenage.engineering)
- **Signature moment.** Black-and-white photography plus a nav row in which each item is a pictogram, a word and three tiny sub-labels. 153 words. Custom te-20 and te-40 type.
- **Lesson.** The confidence comes from almost nothing being on the page.

### On, LightSpray launch page (on.com/en-us/lightspray)
- **Signature moment.** Editorial, asymmetric image layout on white. Each photo carries a spec caption instead of copy ("Athlete: Joe Klecker / Route: Boston 2026 / Time: 2:05:56 / PB Improvement: 4:41"). A sticky spec panel uses label-over-value rows ("Athlete — Hellen Obiri", "Time — 1:21:42"). Quotes are set in Suisse Works serif.
- **Type.** On (custom) 49.6 / 700 / −0.01em. On Semi Mono for meta.

### WHOOP (whoop.com)
- **Signature moment.** Data overlaid on athletic photography: a translucent dark-green disc of particle dots reading "45.8 WHOOP AGE" floats next to a trail runner. The carousel cards carry ring nodes ("88%, 65%").
- **Type.** Proxima Nova.
- **Motion.** GSAP with ScrollTrigger and framer-motion. `(.16,1,.3,1)` and expo/power4. A sticky CTA appears after 500 ms.
- **Cheap risk.** "JOIN NOW" pills float over content, plus a cookie bar, a promo strip and repeated CTAs. That is conversion clutter.

### McLaren Racing and Red Bull Racing
- **McLaren.** Papaya `#FF8000` for arrows, progress bars and the Racing Club button. Condensed uppercase news headlines.
- **Red Bull.** "RB22" set huge, with the car layered *in front of* the numerals so the type gets depth. Driver cards tilt in 3D.
- **Cheap risk (both).** News-portal density, carousels with arrow buttons, and the accent spread across too many elements.

### Williams Grand Prix Technologies (williamsgptech.com)
- **Signature moment.** **Scramble-decode eyebrow labels.** GSAP `ScrambleTextPlugin` is confirmed on `window` alongside SplitText and 16 ScrollTriggers, on GSAP 3.15. Sampling "SECTORS WE WORK IN" every 70 ms showed random uppercase letters resolving left to right in about 800 ms. The labels are 13.5 px uppercase Williams Grotesk with a 6 px blue square bullet.
- **Paragraphs.** Two-tone: the lead clause is white and the rest is 60% white.
- **Stats.** "05 / Decades of motorsport engineering pedigree" at 88 px / −0.03em.
- **Colour.** Navy `#000A20`, white, and a single electric blue `#0042FF` used only on the primary CTA tile and the label squares.
- **Motion.** `power1.out` at 0.3 s for small fades. `cubic-bezier(.625,.05,0,1)` for strong pulls. CSS `fade-up` and `blur-animation` at 600 ms.

### The Immortals (theimmortals.world). Awwwards HM, Aug 2026
- **Signature moment.** The page is a WebGL scene on one full-viewport webgl2 canvas, built with OGL. Its scroll is virtual, so the document is only 900 px tall.
  - The intro is a year counter: "19 — The story begins — 30", then the year rolls forward to 2026.
  - Wheel input rotates a **curved, cylinder-mapped image carousel** that wraps around a 3D World Cup trophy. The centre image is flat and the side images bend away and fade.
  - Each stop shows "Host / Winner" label pairs on the left, the year on the right and a 2–4 word chapter title at the bottom ("The Hand and the Crown", "Against All Odds").
- **Type.** Bricolage Grotesque only. The year is 75 px / 400 / −0.08em (−6 px).
- **Colour.** `#EFEFEF` and `#121212`. All colour comes from the photographs.
- **Words.** 237.

### The Last Tango (thelasttango.com). Awwwards HM, Sep 2026
- **Signature moment.** Messi rebuilt as a **three.js point cloud**: thousands of points sampled from a photo, so the figure crumbles into particles at the edges. A gold circular "ENTER" button. A custom cursor (a dark disc with orbiting gold stars) follows the pointer.
- **Type.** Cormorant Garamond in caps ("THE / LAST / TANGO", staggered across the figure), DM Sans for text, Darker Grotesque 900 for buttons.
- **Colour.** Midnight `#030C1C` and gold `#D2B55D`.
- **Words.** 45.

### United in Football (unitedinfootball.tilljanek.com). Awwwards No-code Honors
- **Signature moment.** Two moves.
  - **Text over text.** A serif paragraph about the World Cup is overprinted by a heavy yellow display line, "ONE GAME. ONE WORLD." (Boldonse in `#F4C518`, on cream `#EFEAE0`).
  - **Scatter to centre.** On black, about 12 tilted snapshots converge from the edges onto a central photo, which then scales to full-bleed behind "FOOTBALL NEEDS NO TRANSLATION." (Instrument Serif, condensed caps).
- **Build.** Framer scroll transforms with Lenis.

### Lacoste Ace Breaker. Awwwards Site of the Day
- **Signature moment.** The preloader is a glowing tennis ball above a filling yellow progress bar. The hero pairs a "LACOSTE" serif with "ACE BREAKER" in **Mona Sans** at about 140 px.
- **Colour.** Bottle green `#082415`, cream `#F3F2E1`, ball yellow `#FCD757`.
- **Product.** A browser game in three.js.

### The Performance Lab (theperformancelab.ca). Awwwards HM
- **Signature moment.** Giant uppercase display type (205 px / −0.04em) cropped by the viewport. Cards carry crosshair "+" registration marks at their corners. A single orange-red `#FF350D` is used for CTAs, the marks and a 4-arc target glyph.
- **Cheap risk.** At the time of capture a modal, a cookie bar and a floating CTA all stacked on top of each other. Cropping words ("UNLOC…") stops feeling clever when it happens in every section.

---

## 2. Cross-site numbers

| Site | Words | Display face | h1 size / weight / tracking | Accent use |
|---|---|---|---|---|
| Last Tango | 45 | Cormorant Garamond | spaced caps, not a DOM h1 | gold, ENTER button only |
| Cosmos | 230 | ABC Oracle | 72 / 700 / −0.04em | none (images) |
| Immortals | 237 | Bricolage Grotesque | 75 / 400 / −0.08em (years) | none (images) |
| Vercel Ship | 352 | GeistPixelCircle | 96 / 500 / −0.06em | none (greyscale) |
| United | 411 | Instrument Serif + Boldonse | 64 / 400 / −0.01em | yellow, one overprint line |
| Luma | 521 | Graphik | 52 / 500 / −0.04em | none |
| Dia | 588 | Exposure VAR | h1 38.8 / 500 / −0.04em (big "Dia" is a wordmark) | yellow hero wash + CTA glow |
| Williams | 656 | Williams Grotesk | 48 / 400; stat 88 / −0.03em | blue: CTA + label squares |
| Linear | 1508 | Inter Variable | 64 / 510 / −0.022em | none in chrome |
| Family | 1744 | Family | 68 / 500 / −0.02em | blue eyebrows |
| Raycast | 1759 | Inter | 64 / 600 / 0 | red, hero only |

**Easing curves that recur in the CSS:**

| Curve | Name | Where it appears |
|---|---|---|
| `cubic-bezier(.23,1,.32,1)` | easeOutQuint | Raycast 21×, Dia |
| `cubic-bezier(.19,1,.22,1)` | easeOutExpo | Family 1000 ms reveals, Luma, Linear |
| `cubic-bezier(.165,.84,.44,1)` | easeOutQuart | Raycast 10×, Williams 5×, Linear filter hovers |
| `cubic-bezier(.16,1,.3,1)` / `(.22,1,.36,1)` | expo/quint variants | Raycast 9×, WHOOP, Cosmos, Dia |
| `cubic-bezier(.32,.72,0,1)` | iOS sheet | Linear 11×, Vercel 6× (panels, drawers) |
| `cubic-bezier(.4,0,.2,1)` | Material/Tailwind standard | Dia 16×, WHOOP 17×, Vercel, Luma (colour and opacity only) |
| `cubic-bezier(.77,0,.175,1)` / `(.87,0,.13,1)` | in-out quart / expo | Dia (large positional moves) |

**Durations seen:**

| Motion | Duration | Examples |
|---|---|---|
| Hover / colour | 100–200 ms | Linear .10/.12/.16 s, Vercel .15 s, Dia .2 s |
| State change | 300 ms | Dia steps, Raycast |
| Small reveal | 600 ms | Williams |
| Large reveal | 800–1000 ms | Linear mask .8 s and blur-in about 1 s; Family transform 1 s |
| Ambient loops | 1.1–2.8 s linear | Raycast blink 1.1 s; Linear dots 1.6 / 2.8 s; Linear shimmer 2 s |
| Autoplay progress | 5 s linear | Raycast, WHOOP |
| Marquees | 56–78 s per loop | Cosmos 56 s, Vercel 70 s, Arc 78 s |

**Libraries detected:**
- GSAP + ScrollTrigger: Williams (3.15, plus SplitText and ScrambleText), WHOOP.
- framer-motion: Family, Cosmos, Luma, Dia, Arc, Vercel, Rive, Williams.
- Lenis: Vercel Ship, Nothing, Dia, Rive, Last Tango, Perf Lab, United.
- WebGL: Raycast (hero), Immortals (OGL), Last Tango and Lacoste (three.js), Cosmos (canvas).
- **No site used CSS scroll-driven animations (`animation-timeline`).**

---

## 3. Fifteen techniques to emulate, translated for xTrain

Each technique gives the source, how to build it, why it reads as premium, and the soccer translation.

### 1. Blur-to-sharp staggered hero entrance (Linear)
- **Build.** Split the headline into lines with GSAP SplitText (`type:"lines", mask:"lines"`), or wrap each line by hand.
  ```js
  gsap.from(lines, { opacity:0, filter:"blur(10px)", y:12, duration:1.0, ease:"expo.out", stagger:0.12 })
  ```
  Bring the subhead in at +0.25 s and the product visual at +0.45 s using Linear's mask wipe: `mask: linear-gradient(90deg,#000 25%,#000e 50%,#0000) 150% 0/400%` animated to `0 0/400%` over .8 s.
- **Why it reads premium.** It feels like a camera finding focus, not a slide-in. Nothing bounces, and it finishes before you have read the second line.
- **xTrain.** Headline lines blur in, then the pitch board below is revealed with a left-to-right wipe, like a groundskeeper's line marker.

### 2. The product is the hero visual, built in DOM and cropped by the fold (Linear, Raycast, Dia)
- **Build.** An HTML/SVG replica of the real session screen, not a PNG.
  - A live `mm:ss` timer ticks.
  - The current drill ("Wall passes · 4 × 45 s · weak foot") shows a rep counter that increments.
  - The bottom 30% is cropped by the viewport, and a 1 px `rgba(255,255,255,.08)` frame plus a soft top highlight make it look like glass.
- **Why it reads premium.** It proves the product exists and it's crisp at any DPR.
- **xTrain.** The session screen *is* the hero image. Players see exactly what they will use.

### 3. Pitch diagram that assembles as you scroll (Linear "FIG" drawings, Raycast iso objects)
- **Build.** Pin a 100vh section for 200vh with ScrollTrigger (`scrub: 0.6`).
  - Cones drop in: `from {scale:0, y:-12}`, stagger 0.06, `back.out(1.4)` on the cones only, never on text.
  - Ball paths draw with DrawSVG, or with `stroke-dashoffset` from `length` to 0.
  - A player dot travels the path with MotionPathPlugin.
  - Caption it like a manual: "FIG. 02 — WALL PASS, 2 CONES, 5 m".
- **Why it reads premium.** It works like a technical drawing. The illustration explains the drill, so the copy can stay short.
- **xTrain.** Each drill type gets its own figure. Swapping the "kit" chips (ball, wall, cone) redraws the diagram.

### 4. Typed prompt that the AI answers (Luma's docked prompt box)
- **Build.** A pill input docked to the bottom of the hero. It types at about 45 ms per character, holds 1.6 s and deletes at about 20 ms per character, cycling 3–4 real inputs. On "submit", a plan card builds underneath: three rows stagger in at 80 ms each, `expo.out`, .6 s.
- **Why it reads premium.** It shows the AI's input and output with no explainer copy.
- **xTrain.** Kit chips appear one by one: `ball` `wall` `2 cones` `20 min` `weak: left foot`, followed by "Here's today's session".

### 5. "Building…" hairline shimmer border (Linear agent badge)
- **Build.**
  - On the element's `::after`, set `inset:-1px; padding:1px; border-radius:inherit`.
  - Mask it into a ring with `mask: linear-gradient(#000,#000) content-box, linear-gradient(#000,#000); mask-composite: exclude`.
  - Give it `background: linear-gradient(90deg, transparent, accent 50%, transparent) 0/120px 100% repeat-x` and animate `background-position` from 0 to 120 px, `2s linear infinite`.
  - Run a matching text sweep on the label.
- **Why it reads premium.** It's a quiet "AI is working" signal and avoids sparkle emoji or gradient blobs.
- **xTrain.** The plan card's border shimmers for about 1.2 s while the session is generated, then settles to a solid hairline.

### 6. LED dot-matrix numerals and loaders (Nothing Ndot, Vercel GeistPixelCircle, Linear 5×5 dots)
- **Build.**
  - Set timers, reps and scores in **Doto**, a variable dot-matrix font on Google Fonts. Use it for numbers only.
  - For a loader, draw a 5×5 SVG grid of `<circle r=1.5>` and run `steps(1)` opacity keyframes between 0.3 and 1. Copy Linear's 1.6 s "pong" pattern, but draw a ball bouncing.
- **Why it reads premium.** It's a brand texture that also does a job.
- **xTrain.** The soccer-native reference is the **fourth official's LED substitution board**. Use it for "+3:00", "REPS 12/20" and the countdown. An optional fun beat, after Vercel Ship's mascot pyramid: a 1-4-3-3 formation of tiny dot-matrix players juggling in sync.

### 7. Sticky step list with dimmed inactive steps (Dia; Cosmos brand list)
- **Build.**
  - Two columns. The left column is `position: sticky; top: 20vh`.
  - Each step is a mono number (11 px), a serif or display title (24 px) and one line of body text.
  - Inactive steps sit at `opacity: .45`, the active one at `.85`, transitioning over `.3s cubic-bezier(.4,0,.2,1)`.
  - A ScrollTrigger per step toggles the active state. The right column crossfades, or uses Flip between product states.
- **Why it reads premium.** Only one idea is on screen at a time, with no carousel arrows.
- **xTrain.** The four steps: "01 Tell it your kit / 02 Get today's session / 03 Train with the coach voice / 04 See your week".

### 8. Curved "sunrise" dock for the CTA (Dia)
- **Build.**
  - Create a fixed or sticky bottom element containing an ellipse: `width: max(141vw, 2034px); aspect-ratio: 2034/978; border-radius: 50%`, coloured like the page.
  - Put a glow blob behind it (`filter: blur(40px)`, accent at about 60% opacity).
  - Map ellipse `scaleY` to scroll progress through a CSS variable (`--dock-arc`, 1 at the hero and about 0.6 later).
  - Keep the CTA pill on the arc for the whole page.
- **Why it reads premium.** The CTA is always there but never shouts. It reads as part of the landscape rather than a sticky bar.
- **xTrain.** The arc is the **centre circle or the "D" of the penalty box** drawn in chalk white, with floodlight glow behind it. CTA: "Build my first session".

### 9. Real screen recordings in device frames, played when in view (Family)
- **Build.** Clips of 2.5–6 s, H.264 and VP9/AV1, under 1 MB each, `muted playsinline preload="metadata"`. An IntersectionObserver at `threshold: .6` plays and pauses them. Hero-adjacent clips loop; detail clips play once and hold the last frame.
- **Why it reads premium.** Real motion of the real UI, and nothing autoplays off-screen.
- **xTrain.** Show the coach-voice moment, the rep counter, and the plan adapting after "too easy". Rive or canvas recreations also work if no recordings exist yet.

### 10. Spec-sheet captions instead of sentences (On LightSpray, Immortals, Williams stats)
- **Build.** A grid of `dl` rows: the label is mono 11–12 px uppercase at 55% opacity, the value is 16–24 px at 100%. No full stops.
- **Why it reads premium.** It's dense with facts and light on reading, like sports media.
- **xTrain.** "Player — Maya, 14 / Kit — ball, wall / Time — 18:00 / Weak-foot touches — +212 this week".

### 11. Live data overlaid on athletic photography (WHOOP)
- **Build.**
  - A translucent disc over a full-bleed photo: `backdrop-filter: blur(6px)`, background `color-mix(accent 18%, transparent)`.
  - Inside it, a canvas or SVG of 150–250 dots on a ring, slowly orbiting, `1 rotation / 40s linear`.
  - A big number counts up when in view: `gsap.to(obj,{v:38, duration:1.2, ease:"expo.out", snap:{v:1}})`.
- **Why it reads premium.** It joins the emotional photo and the product data in one frame.
- **xTrain.** A player striking against a garage wall, with a ring reading "LEFT FOOT 38% ▲ +11".

### 12. Scatter-to-centre collage zoom (United in Football)
- **Build.**
  - Pin a section for 150vh with 8–12 photo cards at random `rotate(±8°)` and edge positions.
  - Scrubbed: cards translate toward the centre and fade, while the hero photo scales from 0.35 to 1 and its `border-radius` goes from 12 px to 0.
  - The headline stays centred, with `mix-blend-mode: difference` or a text shadow for legibility.
- **Why it reads premium.** It's documentary and shows the human side without a paragraph.
- **xTrain.** Scattered snapshots of kids training alone (park walls, garages, a cone in a car park) collapse into one full-bleed shot under "Every great player trained alone first."

### 13. Week as a curved carousel (The Immortals)
- **Build.** The full version is OGL planes bent on a cylinder (a vertex shader offsets `z` by `cos(x*k)`). The light version: 7 cards on a CSS 3D ring (`perspective:1200px`, each card `rotateY(i*18deg) translateZ(-900px)`), with ScrollTrigger rotating the ring and a day counter rolling MON→SUN.
- **Why it reads premium.** Spatial, calm, and it advances one chapter per scroll.
- **xTrain.** The weekly plan: each card is a session with a 2–3 word title ("Weak-Foot Wednesday", "First Touch"), plus "Focus / Minutes" label pairs.

### 14. Dot-cloud athlete that assembles (The Last Tango)
- **Build.** Skip three.js. Sample a high-contrast player silhouette PNG on a 2D canvas into about 4,000 points. Tween each point from a random start to its target over 1.2 s with `expo.out` and a distance-based stagger. Add a mouse repel effect (radius 80 px, ease back at 0.08 lerp). Cap the frame budget and draw a static PNG under `prefers-reduced-motion`.
- **Why it reads premium.** The signature "how did they do that" moment, built on a light stack.
- **xTrain.** A striker made of chalk-white dots. The ball stays solid and in the accent colour, so it's the only coloured thing in the hero.

### 15. Scramble-decode eyebrows plus stepped-corner CTA (Williams, Vercel Ship)
- **Build.**
  - `gsap.to(el,{duration:.8, scrambleText:{text:el.dataset.text, chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", revealDelay:.15, speed:.6}})` on enter. Use it only on labels of 25 characters or fewer.
  - For the CTA: `clip-path: polygon(0 6px,6px 6px,6px 0,calc(100% - 6px) 0,calc(100% - 6px) 6px,100% 6px,100% calc(100% - 6px),calc(100% - 6px) calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,6px calc(100% - 6px),0 calc(100% - 6px))`.
- **Why it reads premium.** A scoreboard-flip feel, kept to micro-labels.
- **xTrain.** "FIG. 03 — FIRST TOUCH" decodes as each figure enters. The primary CTA has scoreboard-pixel corners.

### Also worth stealing
- **Raycast's key-cap button shadow stack** (values in §1) for the primary CTA, with press `scale(.97)` over 120 ms and release over 220 ms on `cubic-bezier(.19,1,.22,1)`, after Family.
- **Perf Lab's "+" registration marks** at card corners (a 9 px cross, 1 px stroke) give a lab or tactics-board feel.
- **Nothing's dot-grid page background.** `background: radial-gradient(circle, rgba(0,0,0,.08) 1px, transparent 1.2px) 0 0/24px 24px` reads as faint pitch-marking chalk.

---

## 4. Typography recommendations

**Avoid as the primary face:**
- AI and template defaults: Inter, Space Grotesk, Satoshi, Clash Display, Geist Sans.
- Instrument Serif, which has become the default "editorial" serif in vibe-coded sites.
- Generic sports condensed faces: Bebas Neue, Anton, Oswald, Barlow Condensed.
- Sci-fi faces: Orbitron, Tomorrow (Rive shows how these read).

### A. "Kit Number": Mona Sans + Martian Mono (+ Doto for digits)
- **Mona Sans** (GitHub, OFL, on Google Fonts) is variable on weight 200–900 *and* width 75–125. One family covers display and text:
  - Headlines at `wdth 112–125, wght 600–700`, tracking −0.03em.
  - Big numerals and drill names at `wdth 75, wght 800`, which gives a shirt-number feel without switching to a condensed cliché.
  - Body at `wdth 100, wght 400`.
  - Lacoste's Ace Breaker (Site of the Day) sets its hero in Mona Sans at about 140 px.
- **Martian Mono** (Evil Martians, OFL, variable width) for labels at 11–12 px, uppercase, +0.04em.
- **Doto** (OFL, dot matrix) only for timers and reps.

### B. "Matchday Programme": Newsreader + Switzer + JetBrains Mono
- **Newsreader** (Google, optical size 6–72) for one emotive line per section, at 40–72 px with `opsz` matched to size and tracking −0.02em.
- **Switzer** (Fontshare, free commercial licence, Swiss neo-grotesk) for UI and body.
- JetBrains Mono for micro labels.
- This mirrors the serif-plus-grotesk pairings at Dia (Exposure + Oracle), On (Suisse Works + On) and Luma (PP Editorial + Graphik), using free equivalents. It reads like a match programme or a magazine.

### C. "Substitution Board": Bricolage Grotesque + Doto + Fragment Mono
- **Bricolage Grotesque** (Google, optical size 12–96, width 75–100) has character at display sizes and goes neutral in text. The Immortals sets its whole football site in it (years at 75 px / −0.08em).
- **Doto** carries the LED-board identity for numbers.
- **Fragment Mono** (Google) for labels.
- This is the most tech-forward of the three and pairs best with palette 2 (Floodlight).

**Type rules for every pairing:**
- Display tracking −0.02 to −0.04em; body 0; small caps labels +0.04 to +0.08em. This follows Linear's tracking scale and Raycast's positive tracking on small text.
- Line-height 1.0–1.05 on display and 1.5 on body.
- At most two weights per family on the page.

---

## 5. Palette directions (one accent each)

### 1. Chalk & Card (light, editorial)
- **Tokens.** Page `#F3F2EE` (chalk), surface `#FFFFFF`, ink `#121212`, muted `#72736C`, hairline `#DEDCD5`, accent **card yellow `#F5C400`**.
- **Where the accent lives.** The ball in every pitch diagram, the active-step dot, and the primary CTA fill (with ink text). That's all.
- **References.** United in Football's `#F4C518` on cream, Lacoste's ball yellow, Nothing's grey plinths.

### 2. Floodlight (dark, cinematic; not navy)
- **Tokens.** Page `#0C0D0C` (warm black), raised `#161716`, line `rgba(255,255,255,.08)`, text `#EDEDE8`, muted `#8A8B85`, accent **hi-vis orange `#FF5A1F`** (the winter match ball and steward bibs).
- **Where the accent lives.** "Live" things only: the generating shimmer, Doto timer digits while running, and the ball trail in diagrams.
- **References.** Linear's monochrome chrome, Perf Lab's single orange-red.

### 3. Tactics Cobalt (cool paper, technical)
- **Tokens.** Page `#F4F4F1`, surface `#FFFFFF`, ink `#0B0C0E`, muted `#6E7076`, grid `rgba(11,12,14,.06)` dots, accent **magnet cobalt `#2340FF`**.
- **Where the accent lives.** The "you" token on the tactics board (the player dot and its path), focus rings and the primary CTA.
- **References.** Williams' `#0042FF` and Arc's `#3139FB`, both used with discipline. Tactics-board magnets are red and blue, and here only the blue one appears.

**In all three:** photography supplies the remaining colour (Immortals, Cosmos, Vercel). Use no gradients except the accent glow behind the dock.

---

## 6. Motion rules

**Curves (use these four only):**
- `--ease-out: cubic-bezier(.23,1,.32,1)` for hovers, small reveals and state changes (Raycast's main curve).
- `--ease-expo: cubic-bezier(.19,1,.22,1)` for large reveals and press release (Family, Luma). The GSAP equivalent is `expo.out`.
- `--ease-sheet: cubic-bezier(.32,.72,0,1)` for panels, drawers and the prompt box rising (Linear, Vercel).
- `--ease-inout: cubic-bezier(.77,0,.175,1)` for large positional moves such as the carousel snap or section handoffs (Dia).
- Use `linear` only for loops, marquees and scrubbed scroll.

**Durations:**

| Use | Duration |
|---|---|
| Hover / colour | 120–180 ms |
| Press | 100–120 ms down, 220 ms release |
| State change | 300 ms |
| Element reveal | 600–800 ms |
| Hero entrance | 900–1100 ms total per element, whole hero settled by 1.4 s |
| Shimmer / loader | 1.6–2.0 s linear |
| Autoplay progress | 5 s |
| Marquee | 60 s or slower |

**Stagger:**
- Text lines 100–140 ms.
- Grid items 60–80 ms.
- Diagram cones 60 ms.
- Cap any stagger chain at about 600 ms total.

**Never:**
- Spring overshoot on text. None of the 20 sites does it; keep `back.out(≤1.4)` for small objects such as cones.
- Parallax on everything. One depth effect per section at most.
- Hijacking the wheel on long pages. The Immortals' virtual scroll works only because the whole site is a single scene. Use native scroll, or Lenis with `lerp: .1` if anything.
- Autoplay video off-screen.
- More than one looping element in view at once.
- Scroll-triggered reveals that hide content when JS fails. Default to the visible state and add the `from` state in JS.
- Ignoring `prefers-reduced-motion`. Under reduced motion, crossfade at 200 ms and drop blur, scale and scrub.

**Interruptibility:** use CSS transitions for hover so effects reverse mid-flight. In GSAP, use `overwrite: "auto"` and `quickTo` for cursor-driven values.

---

## 7. Libraries: cost and benefit for a static page

| Package | Approx. size (min+gz) | Benefit | Cost / note |
|---|---|---|---|
| **GSAP core** | about 28 KB | Timelines, the stagger maths and the eases above. All plugins are free since 3.13; Williams runs 3.15 | Worth it as the backbone |
| **ScrollTrigger** | about 12–17 KB | Pinning, scrub, sticky steps (techniques 3, 7, 12, 13) | Essential if you pin anything |
| **SplitText** | about 6 KB | Line splitting with masks for technique 1; handles resize re-splitting | Only on 2–3 headlines |
| **ScrambleText** | about 3 KB | Technique 15 | Labels only |
| **DrawSVG + MotionPath** | about 2 KB + 8 KB | Ball paths and the player dot (technique 3) | High value for the pitch board |
| **Flip** | about 8 KB | Sticky-step visual swaps and kit-chip reordering | Optional |
| **Lenis** | about 4 KB | Smooth wheel feel for editorial pages | Top product sites skip it. Optional, `lerp .1`, never with snap |
| **OGL** | about 10–25 KB (modular) | Lightweight WebGL for the curved carousel or a dot cloud | Shader work. Use only for the one signature moment |
| **three.js** | about 150 KB+ | Full 3D (Last Tango, Lacoste) | Too heavy for a landing page unless 3D is the whole idea |
| **Rive** (`@rive-app/canvas-lite`) | about 100 KB+ including WASM | Interactive, state-machine illustrations (a player that reacts to hover) at tiny file sizes | Needs the Rive editor. Very good for the coach-voice or juggling loop |
| **Lottie** | about 60 KB | — | Heavy for what it does. Prefer Rive or SVG |
| **Motion (motion.dev)** | 2.5–18 KB | A small `animate()` and `inView()` if you skip GSAP | No pinning or scrub matching ScrollTrigger |
| **CSS scroll-driven animations** | 0 KB | Progress bars, the dock arc variable, simple reveals | None of the 20 sites used them; browser support still uneven (check Firefox), keep a fallback |

**Recommended stack:** GSAP + ScrollTrigger + SplitText + DrawSVG/MotionPath (about 55–60 KB total), with Lenis optional. Pick **one** heavy moment: either a canvas-2D dot athlete (0 KB library) or OGL for the curved week carousel, not both. Use Rive only if an interactive character is part of the brand.

---

## 8. What reads as cheap or "AI template" (avoid)

- Esports or sci-fi fonts (Orbitron, Tomorrow) and all-caps everywhere (Rive).
- Tweet-card testimonial grids, 12-card testimonial walls, grey logo walls as filler (Family, Rive).
- Repeated floating "JOIN NOW" pills over content, stacked cookie bar plus modal plus promo strip (WHOOP, Perf Lab).
- Carousels with arrow buttons, 3D-tilted cards, news-portal density (McLaren, Red Bull).
- Cropping a word with the viewport in every section (Perf Lab). Do it once, if at all.
- Three-icon "why us" rows with line icons (Nothing's store footer) and FAQ accordions above the fold.
- Volt-green on black, navy plus turf green, purple-to-blue AI gradients, sparkle emoji as the "AI" signifier.
- Any section heading longer than about 8 words. Best-in-class headings run 2–6 words ("Planning and monitoring", "Built for how you actually work", "The Hand and the Crown").

---

## Appendix: capture artifacts

- `research/craft/<slug>/`: `00-hero.png`, `NN-scroll.png`, `_sheet*.png` contact sheets, `info.json`, `text.txt`.
- `research/craft/<slug>/probe/`: intro-burst frames, `probe.json` (CSS census, animations, transitions, GSAP).
- Recaptures with overlays hidden: `nothing3`, `onls`, `immortals2`, `lasttango2`, `williams2`, `perflab2`, `redbull`.
- `research/craft/linear/all.css` and `all.early.json`: full Linear CSS and early animation keyframes.
- Tools in `scratchpad/tools/`:
  - `shoot.mjs`, the base capture.
  - `shoot2.mjs`, for overlay-hidden or virtual-scroll sites.
  - `probe.mjs`, the motion census.
  - `cssdump.mjs`, which dumps all CSS.
  - `sample.mjs`, which samples computed style over time.
  - `evaljs.mjs`, which evaluates JS on a page.
  - `sheet.py`, which builds contact sheets.
