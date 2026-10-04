# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Vite + React 19 + TypeScript, Tailwind v4 (Vite plugin), Motion (`motion/react`) for UI and layout motion, GSAP ScrollTrigger isolated to landing-page scroll choreography, dnd-kit for plan editing, Phosphor icons, React Router. Chosen because the deliverable is a multi-page, heavily animated prototype the team must run, test (Playwright is installed in this repo), and extend, and because the PRD plans a React Native mobile app plus a web dashboard, so React components and tokens port. The user delegated this choice in the brief ("design everything").

## Users

Primary (from PRD): youth and amateur soccer players, roughly ages 13-18 in the U.S. (middle/high school and club players) who lack consistent access to quality coaching and train alone in a backyard, park, or local pitch with the phone propped on a wall, stand, or bag. Personas: Alex, 16, high-school team, trains shooting and dribbling in the backyard; Bella, 12, new to football and shy, needs confidence and positive reinforcement, parent checks her progress; Coach Dan, 34, weekend youth coach who wants a dashboard of his players (post-MVP).

Secondary (later phases): coaches and parents with permissioned, read-mostly dashboards.

## Product Purpose

xTrain turns a phone into a personal football coach. At signup the player enters name, age, experience level, position, goals, time availability, and equipment; Course AI assembles a personalized multi-week training plan from the drill library. The player can move, swap, shorten, delete, regenerate, and add sessions freely; the app guides each session drill by drill with timer, cues, and rest; progress shows as 0-100 skill ratings, XP, levels, streaks, and badges. Success per PRD: players complete 3+ sessions per week, strong D7/D30 retention, self-reported skill improvement, 4.5+ store rating.

## Positioning

Motto in PRD: "Train like a pro, with AI as your coach." Affordable, accessible, structured coaching for players who cannot afford private coaching. Mechanism a neighbor cannot copy truthfully: the plan is built from the player's own profile, logged sessions, ratings (too easy / too hard), pain reports, and the equipment and space they actually have, and every session carries a plain-language reason ("Because you want to improve speed, Wednesday is a conditioning day"). Lite tier = Course AI (planning, no camera). Full tier = Coach AI (camera pose tracking, rep counting, real-time corrections) in a later phase.

## Operating Context

- Training happens outdoors with the phone at a distance: large tap targets, glanceable session player, optional voice cues, offline-ready session content.
- Plan navigation decided in PRD: linear scrollable weekly view; day detail with "Start session" and "Mark skipped"; Edit This Week (planned vs target minutes; per-session change duration, move, delete; add session); Create Session (focus area, session type, duration, people, space, equipment, then generate).
- Session flow: "Drill 2 of 5", purpose, instructions, countdown timer or rep counter, pause, next drill, end session; summary with completion status (full / partial / skipped), minutes trained, RPE 1-10, "Did you feel pain?", save log.
- Drill library: categories dribbling & ball control, passing, shooting, defending, physical conditioning; search and filter by category, difficulty, equipment, tags such as "no equipment"; drill detail with description, step-by-step, demo video with voice-over, coaching tips, common mistakes, reps/sets/duration suggested from the player's progression, equipment icons; favorite or exclude drills (with a note explaining the drill's benefit before excluding).
- Progress: skill ratings 0-100 derived from time spent, consistency, drill difficulty, and progression (not biomechanics); streaks; totals; skill breakdown to encourage balance; level and XP (Rookie, Amateur, Pro); achievements page showing the percentage of players who unlocked each badge.
- AI coach chat answers training questions ("How can I improve my weaker foot?"), links drills, and can adjust the plan within constraints (Phase 2+).
- Notifications and nudges are friendly, never guilt-inducing.
- Existing Figma Make prototypes referenced in the PRD use a dark background with bright green primary buttons and black cards; the team's earlier mockups were described as dark navy + turf green. These are evidence of the subject, not a pinned direction.

## Capabilities and Constraints

- Phases: Phase 1 basic app (drills, sessions, logging, progress, gamification, no AI); Phase 2 Course AI plans and feedback loop; Phase 3 Coach AI camera tracking. This website is designed for the Lite (Course AI) scope with the AI coach chat, and leaves Coach AI as a visible roadmap, not a shipped claim.
- Under-13 users need guardian consent; data stored per account; coach/parent linking is permission-based and revocable.
- Terminology: Course AI (plan engine), Coach AI (pose tracking tier), plan, week, session, drill, block, set, rep, XP, level, badge, streak, RPE.
- Undecided (do not invent as fact): pricing (free at launch, freemium later), real drill demonstration videos (none exist yet), mascot or coach persona design, exact rating formula, launch date.

## Brand Commitments

- Name: xTrain (set by the user on 2026-10-03).
- Tone: engaging, game-like, encouraging; teen-friendly; positive feedback that celebrates effort as much as outcomes.
- User-pinned visual constraint: the site must feel "almost futuristic, very very very animated and cool", like a famous AI sports company. Heavy, purposeful motion is a requirement, with full reduced-motion fallbacks.

## Evidence on Hand

- PRD: `/Users/ishanv/Downloads/AI Football Fitness PRD Download.pdf` (33 pages, image-only; rendered pages in the session scratchpad).
- Prior team work: a 3D technique visualization lab for passing and shooting (`~/Desktop/Claude/inside-foot-pass-lab.html`) that could later feed drill detail pages.
- No real drill videos, player testimonials, user counts, press, or benchmark data exist. All demo players, stats, and drills in this build are synthetic and labeled as such; do not present them as real.

## Product Principles

1. The plan belongs to the player: every AI decision is editable, reversible, and explained in one sentence.
2. Glanceable in the field: big targets, high contrast, the fewest taps possible during a session.
3. Progress is visible and honest: ratings are derived from effort and consistency, and the app says so.
4. Encourage, never guilt: effort is celebrated; nudges are friendly.
5. Content quality over quantity: a small library of correct, well-explained drills beats a big one.

## Accessibility & Inclusion

Teen audience that includes 12-13 year olds: simple language, large touch targets (44px minimum), strong contrast on dark surfaces for outdoor glare, keyboard-reachable controls, and a complete `prefers-reduced-motion` path given the heavy animation. Text kept translatable for later multi-language support.
