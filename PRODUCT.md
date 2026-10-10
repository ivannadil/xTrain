# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: one static page with no build step (hand-authored HTML, CSS, and ES modules), GSAP 3 with ScrollTrigger and SplitText plus Lenis vendored into `public/vendor`, and one Vercel serverless function for early-access signups. The user handed every technical decision over on 2026-10-10 ("you do whatever is the best") and asked for the existing GitHub repo (ivannadil/xTrain) and Vercel project (xtrain-pi.vercel.app) to be wiped and reused. The previous React prototype is preserved only at git tag `prototype-final`.

## Users

Primary: youth and amateur soccer players, roughly 12 to 18, mostly in the U.S., on school or club teams or no team at all, who want to get better on their own time. The scene is a driveway, a backyard, a park, or a wall behind a school, with one ball and sometimes a cone, a rebounder, a small goal, or a friend. The App Brief describes "the kid who is out in the driveway or at a local park with nothing but a ball". Many are not in expensive clubs and feel they are falling behind.

Beginners (two years of training or less, per the 7/12 team notes) need technique before plans: how to strike a pass, how to take a first touch. Intermediate and advanced players need structure: what to do today, for how long, and what comes next.

Secondary: parents who pay attention to what their kid is doing, and coaches who may later see a player's progress (both post-launch).

## Product Purpose

xTrain gives a solo player the structure of an academy. The player says what they have (time, days, gear, space, people) and what they want (position, goals, weaknesses), and xTrain builds a development plan from a coach-written drill library, then runs each session drill by drill. After every session the player says how it felt (too easy, too hard, unclear) and the plan adjusts. Progress shows as skill ratings, streaks, and rank.

Success for the landing page: a visitor understands this in one viewport, tries it in the next, and joins early access.

## Positioning

The plan is built around the space and gear the player actually has, down to "one ball and a wall", and it changes after every session based on the player's own feedback. Neighbors either sell hardware (smart balls, sensors, cameras), scout for clubs, or ship fixed video courses. xTrain sells a plan that fits a driveway.

Name history: the team project was called Playera; the product name is xTrain (set by the user, 2026-10-03, and reconfirmed 2026-10-10). The "x" reads naturally next to football analytics vocabulary (xG, xA), which the copy may use lightly.

## Operating Context

- Players train outside, phone propped on a bag or a fence, in sun glare. Big type, few taps.
- Plan inputs (from the team's Product Feedback and Priorities docs): session length per day, which days and time slots, position, goals broken into focus, weakness, and strength, equipment, space, and how many people are present.
- Session order the team settled on: warm-up, then basic ball mastery, then a skill or position drill.
- Each drill: setup, steps, a diagram, a slow-motion demo, a timer or rep counter, and the ability to skip ahead.
- After a session: a rating (too easy, too hard), and the plan adjusts (tested in the team prototype on 2026-04-25: "too hard" removed advanced drills and renamed the plan).
- Plan changes by request, in plain words: "I hurt my right knee", "I'm away the week of March 16".
- A Technique tab teaches the basic strikes and touches (passing short, long, on the ground, in the air; shooting with the laces, the inside, the outside; dribbling) with diagrams and slow-motion 3D demonstrations.

## Capabilities and Constraints

- Real drill content exists: the team's Drill Library (50 drills in progress across passing, dribbling, first touch, defending, goalkeeping, conditioning) and a detailed "5 drills" set (Toe Taps, Foundation Bell Touches, Sole Rolls, Pull Push, Inside Outside dribble, L Turn). Drill names, setups, equipment, and purposes on the site come from these documents.
- Shipped in prototypes, not yet in an app store: plan generation, session runner, feedback loop, calendar, drill library, technique demos.
- Roadmap only, never presented as shipped: camera or uploaded-video form feedback, social (friends, team, leaderboards), the Journey reflection log, calendar sync.
- Undecided, never invented: price, launch date, platforms and store availability, user counts, partner clubs, coach names, testimonials.
- Under-13 players need guardian consent before an account exists; the early-access form collects email only and says so.
- Terminology: plan, session, drill, touch, rep, streak, level. Use "soccer" in U.S. copy; "football" is fine in drill names.

## Brand Commitments

- Name: xTrain, written exactly so (lowercase x, capital T).
- The user's standing bar (2026-10-10): premium, crisp, animation-led, not text-heavy, not empty, never overwhelming, no copy that sounds AI-written, no decorative subtitles or helper lines under headings, and the visitor should be able to touch something meaningful right away. Reference for craft level: synesdj.vercel.app.
- The earlier xTrain prototype look (green-teal ink, signal orange, "highlight reel") is retired; it is evidence, not authority.

## Evidence on Hand

- Team documents (Playera folder, unzipped copy in the session scratchpad; originals in the user's Downloads zip): App Brief, Priorities, Product Feedback, In-Depth Product Feedback (prototype test notes, 2026-04-25), Meeting Notes, Notes from Discussion (7/12), Drill Library, 5 drills, Product Validation (planned outreach to 5 to 10 coaches and a club team; no results recorded).
- 3D push-pass demonstration renders (`push_pass_demo_3d_v7.mp4` and earlier versions) and the 3D technique lab at `~/Desktop/Claude/inside-foot-pass-lab.html`.
- No testimonials, no user counts, no press, no partner logos, no benchmark data, no real player footage cleared for marketing. Anything illustrative on the site is labeled as an example.

## Product Principles

1. Fit the player's real space first: a plan that needs a full pitch is a plan nobody runs.
2. Technique before volume: a beginner learns the touch before the plan asks for reps of it.
3. The player's word moves the plan: every session's feedback changes what comes next.
4. Show the drill, do not describe it: diagrams and motion beat paragraphs.
5. Encourage, never guilt.

## Accessibility & Inclusion

Teen audience including 12 and 13 year olds: plain words, 44px touch targets, strong contrast, keyboard-reachable controls, and a full `prefers-reduced-motion` path since the page is motion-heavy.
