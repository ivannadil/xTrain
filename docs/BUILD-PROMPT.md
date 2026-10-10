# xTrain landing page: the build prompt

This is the prompt the current site was built from (2026-10-10). It is written so it can be pasted into Claude Code at the repo root and run again, or used to brief a designer. Everything it asks for is checked by the verification steps at the end.

---

## 0. The ask, in one paragraph

Build the xTrain landing page from scratch. xTrain is an AI soccer training app for players about 12 to 18 who train alone: you tell it what you have (a ball, a wall, cones, a goal, a friend, and how many minutes), it builds the session from a drill library the team wrote, runs it drill by drill, and changes the next session based on how this one felt. The page must look premium, crisp, and animation-led without ever feeling busy. Use very little text and no empty acres of whitespace. Nothing on it should read as AI-written. A visitor should be able to touch something meaningful in the first viewport and leave an email within seconds. The craft bar is https://synesdj.vercel.app. Replace everything that was in this repo and on the Vercel project before.

## 1. Non-negotiables from the owner

1. Premium and clean. If a choice is between "more" and "calmer", choose calmer and make the one thing that moves move beautifully.
2. Not text heavy, but not empty either. Space is filled with working design: diagrams, controls, the product doing its job.
3. Interactive immediately. The first viewport contains a thing to play with and the signup form.
4. No AI subtitles: no line of helper text under a heading, no kicker above it, no "Here's how it works" filler.
5. Copy that sounds like a person. Plain words a 13 year old would say out loud.
6. Animations are crisp and lean. Each one explains something (state change, cause and effect, sequence).
7. The colour scheme is part of "premium". Few colours, used with intent.
8. Sign-up is as easy as the best competitor: one field, one button, optional extras after.

## 2. Skills, in the order they run, and who wins a conflict

| Order | Skill | Used for | Wins over |
|---|---|---|---|
| 1 | `impeccable` | Context load, the direction roll (`concept-seed`), the surface brief and direction contract, the craft floor, the detector, the finish reviewer and documenter subagents | everything below on process and quality gates |
| 2 | `design-taste-frontend` | Design read and dials (variance 7, motion 7, density 4), anti-slop pre-flight list (em-dash ban, eyebrow ban, CTA wrap, hero fit) | `gpt-taste`, `high-end-visual-design` |
| 3 | `copywriting` then `humanizer` | Every visible string. Run the AI-tell self-check before shipping | any skill's sample copy |
| 4 | `gsap-*` skills, `animate`, `emil-design-eng` | Motion implementation details: ScrollTrigger pinning, SplitText masks, quickTo, interruptible tweens, press feedback | taste's generic motion advice |
| 5 | `mobile-native`, `break-ui` | Phone polish and worst-case content checks | none |

When skills disagree: the owner's words in section 1 win, then PRODUCT.md, then impeccable, then taste. Two known conflicts and their resolution:
- Taste wants every consumer page in light and dark. Impeccable says pick the theme from the scene. The scene is a 14 year old on a phone in daylight on the walk home, so the page is light only, and that is recorded.
- Taste discourages hand-drawn SVG. The drill diagrams are drawn at runtime from drill data (cones, ball, wall coordinates), which makes them charts of data, not illustrations. UI icons come from Phosphor.

## 3. Product truth and claims rules

Read `PRODUCT.md` first. The facts that matter on this page:

- Inputs: time per session, gear (ball always; wall, cones, goal, a friend), position, level. Session order is always warm-up, ball mastery, then the skill or gear drill.
- Drill names, gear, and cues come from the team's Drill Library and "5 drills" documents (Toe Taps, Bell Touches, Sole Rolls, Juggling Ladder, Pull Push, Inside Outside, L Turn, Wall Passes, Directional First Touch, Wall Juggles, Straight-Line Cone Weave, Figure-8, Cruyff Turn, Ball to Gate Passing, Half Volley at Goal, Give and Go, Give and Go to Goal). The data lives in `public/js/drills.js`.
- After a session the player rates it (too easy, about right, too hard) and the next one changes.

Never write or imply: a price, a launch date, app store availability, user counts, partner clubs or coaches, testimonials, ratings, benchmark numbers, or camera form feedback as a shipped feature. The early-access form collects an email and, optionally, position and level. Nothing else.

## 4. Research method (do this before any design decision)

Do not design from memory. Open the real sites and measure them.

1. Capture each site headless at 1440x900 and 390x844: the hero, a frame every 0.85 viewport, the page text, detected libraries (GSAP, Lenis, three, Framer, Webflow, Lottie, Rive), fonts, top colours, word count. The script used is in the session scratchpad (`shoot.mjs`, Playwright with the installed Chrome). Look at every frame.
2. For motion, capture 6 frames 120ms apart right after load, dump `document.getAnimations()` and, where GSAP is global, `gsap.globalTimeline.getChildren()`.
3. Write each teardown with exact values (hex, px, ms, cubic-bezier), not adjectives.

Reports in this repo:
- `docs/research/synesdj.md`: the reference site, measured down to its easing curves.
- `docs/research/design-references.md`: 20 craft and sport sites (Linear, Raycast, Family, Cosmos, Dia, Rive, Luma, Vercel Ship, Nothing, Teenage Engineering, On, WHOOP, McLaren, Red Bull, Williams, and five recent Awwwards sports sites).
- `docs/research/competitors.md`: soccer and sports-AI training products plus the plan-first fitness apps (DribbleUp, Techne, JOGO, AiScout, HomeCourt, PLAYERMAKER, Veo, Catapult, MOJO, Runna, Ladder, Future, Nike Football).

What the research decided, in short:
- The best pages in this space use 300 to 450 words in total, one accent colour used rarely, labels instead of sentences, and the real product as the illustration.
- Category defaults to stay away from: night-stadium athlete photography, neon green on black, floating phone mockups over gradients, rows of three feature cards, "Unlock your potential" copy.
- The steal-worthy mechanics: the product is the hero and works in place (Linear, Raycast); a typed or tapped input that the product answers instantly (Luma, Runna's plan preview); a diagram that assembles itself (Linear's figures); scramble-decoded labels for a computed result (Williams); blur-to-sharp headline entrance at about 120ms per line (Linear); Mona Sans with its width axis for sport type (Lacoste's Site of the Day).
- Signup: one field and one button visible, extras asked after the email is saved, never before.

## 5. Direction (decided by the impeccable roll, seed 2da6c609)

The world: a training ground seen from above. Flat saucer cones, a ball, a wall, a goal, and player tokens sit on concrete. The visitor's own kit decides where they land. The full contract is in `.impeccable/surfaces/public-index-html.md`.

- Ground: cool driveway concrete `oklch(0.928 0.004 150)`, with a darker slab `oklch(0.885 0.005 150)` for the driveway itself, and static grain over everything.
- Ink: asphalt `oklch(0.2 0.008 255)` for type, walls, players, and every line.
- Kit colour: saucer-cone orange `oklch(0.69 0.19 44)` with a lighter top `oklch(0.77 0.16 56)`. It appears on cones, on the timer bar, and on one flooded section (the join block). Type is never orange.
- Depth: flat layers overlapping, plus one perspective tilt on the slab (about 20 degrees) that leans a few degrees toward the pointer. No shadows, gradients, or glass.
- Notation, from real coaching diagrams: solid line with an arrow for a pass, dotted for a run, wavy for a dribble, one-word labels next to each route.
- Type: Mona Sans variable, self-hosted. Headlines at weight 790 to 820 and width 116%, tracking about -0.03em, two balanced lines. Text at width 100%, weight 440 to 620.
- Shape: pills for every control, 18px for objects (cards, slabs), circles for kit.

## 6. The page, section by section

Word budget for the whole page: under 450 visible words, FAQ answers excluded.

1. **Hero (one viewport, 1440x900 down to 360 wide).**
   - Headline across the top, two lines: "Soccer training that fits your driveway."
   - Left: one line ("Tell it what you have. It plans the session and coaches you through it."), the email form, then "What have you got?" with kit chips: Ball (always on), Wall, Cones, Goal, A friend. Chips you don't have are dashed outlines; chips you have are solid.
   - Right: the driveway slab in perspective, bleeding off the right edge, with the main drill for your kit drawn on it. The ball and player run the routes on a loop.
   - Bottom edge: the session lane. A painted line with a cone at the start of each drill, gaps sized by minutes, the focus drill's line in full ink, and a 15 / 30 / 45 minute control.
   - Signature interaction: tap a chip and the cones slide to their new spots, the wall or goal drops in, the routes draw on, a ball rolls down the lane, and each drill name decodes into place as it passes. Until the visitor touches anything, the hero cycles through kits by itself every 4.4 seconds. The first real tap stops that for good.
   - Mobile order: headline, line, slab, kit, lane (vertical list), form.
2. **"Then it runs the session with you."** Pinned for about two screens. The visitor's own first three drills play in order on the slab, while a phone lying on the same plane shows "Drill 1 of 3", the name, a timer that counts down with the scroll, the cue, an orange bar, and what's next. Three short steps on the left light up in turn.
3. **"Too easy? Say so."** One line under it. Three columns: Today's drill, the question with three buttons (Too easy, About right, Too hard), and Tomorrow's drill under the same camera. Too easy moves the player back from the wall or pulls the cones closer and states the harder variation from the drill data. Too hard does the opposite.
4. **"The drills it picks from."** A draggable strip of drill cards, one per real drill, each a live diagram (it plays on hover) with the name and "Block · gear".
5. **Join.** The one flooded section, all cone orange: "Your first session is ready when you are.", the email form, then four FAQ items (What do I need, Who is it for, Where does the AI come in, When can I use it).
6. **Footer.** The wordmark at full width, copyright, and a privacy note that opens in place.

One state object (kit plus minutes) drives the hero, the lane, the pinned session, the adapt section, and the signup payload, so the whole page reflects what the visitor picked.

## 7. Motion system

- Curves, measured on the reference sites: states and hovers `cubic-bezier(.23,1,.32,1)`, entrances `(.19,1,.22,1)`, large moves `(.77,0,.175,1)`.
- Durations: hover 160 to 220ms, press 120ms at `scale(.97)`, state changes 300ms, reveals 600 to 1100ms, the hero fully settled by about 1.6s.
- Stagger: headline lines 120ms apart, items 50 to 110ms, never more than about 600ms in total.
- One loop on screen at a time. Loops pause when their section is off screen.
- Hero entrance: headline lines blur to sharp, the slab drops from 58 degrees into its tilt, the kit and lane fade up.
- Never: bouncy springs on text, parallax on everything, scroll hijacking beyond one honest pin, GSAP and CSS transitions animating the same property on one element.
- `prefers-reduced-motion` and `?motion=off`: no smooth scroll, no pin, no loops, every diagram drawn in its final state, nothing hidden.

## 8. Copy rules

- Voice: a teammate who knows training. Short sentences. Concrete nouns (wall, cones, minutes).
- Banned: em dashes and en dashes, "not X but Y" reveals, negation lists, colon reveals, stock openers, "unlock", "elevate", "seamless", "next level", exclamation marks, kickers above headings, helper lines under headings that only restate them.
- One label per intent. The signup button says "Get early access" everywhere.
- Errors name the problem and the fix ("That email looks off. Check it and try again.").

## 9. Build

- Static site in `public/`, no build step. Vendored GSAP 3.15 (ScrollTrigger, SplitText, Flip, CustomEase, DrawSVG, MotionPath, ScrambleText, Draggable, Inertia) and Lenis 1.3.26 in `public/vendor`.
- `public/js/drills.js` holds the drill data and the session builder. `public/js/field.js` draws and animates any drill from data. `public/js/main.js` wires the sections.
- `api/join.js` is the only server code. It validates the email, then writes one private JSON file per email to the project's Vercel Blob store. Step two overwrites it with position and level. `npm run signups` exports a CSV.
- Fonts and icons are self-hosted: Mona Sans (OFL) and Phosphor bold (MIT) inline as SVG symbols.

## 10. Verify (bounded: one full round, fixes, one confirm round)

1. Capture 1440x900 and 390x844 at the top, plus a full page with `?motion=off`, plus scroll frames through the pin. Check: no horizontal overflow, the hero fits one viewport on desktop, the CTA never wraps, nothing is hidden by animation timing.
2. Drive the hero: tap every chip, change minutes, confirm the field, the lane, the run section, and the adapt section all follow.
3. Run `impeccable detect` on `public/index.html` and `public/css/site.css`.
4. Hand the captures, the direction contract, and this prompt to the `impeccable-finish-reviewer` subagent. Apply its material fixes in one batch and send it back for a verdict.
5. Have `impeccable-documenter` write DESIGN.md and `.impeccable/design.json` from the shipped build.

## 11. Ship

1. GitHub: the existing repo `ivannadil/xTrain`, main branch. The old prototype stays reachable at tag `prototype-final`.
2. Vercel: the existing project (`xtrain-pi.vercel.app`). Connect a private Blob store (`vercel blob create-store xtrain-signups --access private`), deploy with `vercel --prod`, then submit a test email and confirm a 201.
3. Check the live URL at desktop and phone width.

## 12. Synthetic material to replace later

- The phone screen in section 2 is a drawn example of the session screen, not a screenshot. Swap in a real recording when the app exists.
- Drill minutes and the "about right" result (two minutes longer) are illustrative outputs of the demo planner in `drills.js`, not the production algorithm.
