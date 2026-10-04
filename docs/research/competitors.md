# xTrain competitor research

Date: 2026-10-03
Scope: direct and adjacent competitors for xTrain, an AI soccer web app that generates a personalized solo-training plan from a 4-field signup (name, age, experience, position), lets players drag / reorder / modify sessions, and ships a drill library.

Method: web search + fetched App Store listings, official sites, help centers, UX teardowns (screensdesign, Landing Doctor), press, and App Store screenshots viewed in the browser for Techne, Train Effective, Footly, BallerAI, Baller Lab, Dribly, GoalBall, City.Play and Dribbleup. Where a claim could not be verified it is marked "unverified".

---

## 0. Landscape at a glance

| Tier | Products | Relevance to xTrain |
|---|---|---|
| A. Solo-training content apps (coach-authored) | Techne Futbol, Train Effective, Trainsolo, Soccer Improved, Ballers App | Closest in job-to-be-done; the incumbents with real user bases |
| B. "AI coach" plan generators (2025–26 wave) | BallerAI, Baller Lab, Footly, Dribly, GoalBall, BallCoach, Level Up AI (archived), CoachFrank (coach-side) | Closest in mechanics (position + level → weekly plan); mostly small, template-like |
| C. Hardware-gated training | Dribbleup, Playermaker / CITYPLAY, Blazepod, Zepp Play Soccer, Rezzil Player (VR), Elite Skills Arena, Perfect Play (camera CV) | Best gamification and progress UX; locked to a device |
| D. Analysis / scouting / team tools | AiSCOUT, Veo, Trace, Hudl Technique (discontinued, now OnForm), Beyond Pulse, Zone7 | Not direct; useful for benchmark/score patterns |
| E. UX reference outside soccer | Freeletics Coach, FUTURE | Gold standard for AI onboarding, plan adaptation, human-coach tone |

Requested names with no matching product: "Striver" (no soccer training app found; "Strivers: Training & Wellness" is unrelated), "Coach Bot" (only a generic CoachBot; CoachFrank and FutCoach are the real coach-side generators), Pro Direct Academy (a physical UK academy network, no app), FC Barcelona Innovation Hub (research / education hub, no consumer training app found). Hudl Technique was discontinued; users migrated to OnForm.

---

## 1. Product profiles

### 1.1 Techne Futbol (Tier A, the benchmark incumbent)

1. Positioning / user: "The soccer training app designed by pros for the motivated player looking to improve on their own." Founded by Yael Averbuch (ex-USWNT). Claims 600K players; 4.7 stars, 17K ratings. Target: self-directed youth/club players age ~9–18 plus clubs/ODP/schools buying group plans.
2. Pages: Website nav: The App (Training Experience, Sock System, Community), For Players (Techne PRO, Fundamentals), For Organizations (Teams & Clubs, ODP, Schools), Blog, About, Log In, Pricing in footer. App: Training (tabs Sessions / Programs; weekly Dribbling, Passing (wall), Juggling sessions; classes), Video Library, Track (total / daily / weekly time, streak, weekly goals, skill tests, practice journal, training calendar), Leaderboards (global, state/regional, club/team, league, custom friend group), Profile (sock level, club, location, position).
3. Onboarding: sign-up, location (feeds regional leaderboards), club pick, position(s) shown on profile ("Center Back, Center Midfield"), choose PRO vs Fundamentals. 7-day trial, no card. Short (est. 5–6 screens). No skill assessment up front; skill tests live in Track.
4. Plan structure: content-cadence model, not a generated plan. A new guided session drops every week; each session has ~30 drills with 3 progressions (difficulty levels) per drill; expected 30–90 min of time-on-task across the week; each drill runs on a 1–3 min voice-controlled timer that logs time. Users can do any drill, section or the whole session any number of times; can build custom sessions; multi-week Programs exist. No drag/reorder, no regenerate; the "plan" is the week's drop.
5. Library UX: hundreds of drills across Dribbling, Juggling, Passing, Shooting/Finishing, Mental Strength, Physical, GK, Recovery, Balance, Foundational Skill Tests. Drill page = demo video + written description + "Setup" tab; difficulty toggle on the drill page; offline download. Filters are category-level only (no equipment/duration facets visible).
6. Progress / gamification: daily streak (10-min minimum) with Streak Saves (earned) and "Revive your streak" (special session within 3 days); time-trained totals; weekly goals; Sock System (martial-arts belts by logged hours: White 0h → Yellow 10 → Orange 25 → Green 50 → Blue 75 → Purple 100 → Grey 250 → Red 500 → Black 1000) with physical socks mailed at each tier; 4-level leaderboards; skill tests; seasonal challenges; coach dashboards.
7. Visual: marketing frames dark navy with sky-blue pill chips; in-app UI is light (white cards, photo thumbnails, clean sans-serif); no 3D or motion; sock colors are the gamified accent. Reviews call it "sleek" but it reads conservative.
8. Pricing: Fundamentals $9.99/mo; PRO $37.99/mo or $279.99/yr; Families $600/yr (5 players); Teams & Clubs quote. 7-day free trial.
9. Borrow: hours-based mastery ladder with real-world reward, plus streak saves. Beat: zero personalization (same session for every user), expensive, no editable plan, dated light UI.

### 1.2 Train Effective (Tier A, biggest brand)

1. Positioning / user: "The #1 digital soccer academy", "Become the player you're meant to be"; Rio Ferdinand-fronted; claims 1M+ downloads / 2M players; 4.8 stars, 13K US ratings. Target: 10–20 year-olds dreaming of academies/scouting; upsells to camps.
2. Pages: Website: Camps, Pathway Program, Hall of Fame, App Features (Tracker, Exercises, Gamebrain, Tactics, Mentality, Community, Leaderboard), For Clubs, Pricing. App: Home/Progress (player rating gauge e.g. "48", XP, pro badge), Tracker / Daily planner (schedule activities 365 days, goals), Exercises (a "Select Skill" photo grid: Dribbling, Touch & Control, Finishing… with session counts), Programs/Sessions, Game Brain (tactical video quizzes by Premier League analysts), Mentality (Ferdinand et al.), Community feed (posts earn XP), Leaderboard, Coach Sam / CoachAI, Profile.
3. Onboarding: profile (level, goals, available time) feeds CoachAI; "personalized weekly training plan" added v3.2.228; in-app guides added recently. Moderate length (est. 8–10 screens, unverified).
4. Plan: a daily planner you populate (behavioral framing: "8x more likely to complete if scheduled"); CoachAI suggests a weekly plan; users schedule and log sessions and earn XP. Reviews: timers inaccurate, goals not marked complete, little flexibility in repetitions inside a structured session. No drag/reorder at drill level.
5. Library: 150+ exercises/sessions/programs across technique, tactics, fitness, mentality; search + equipment filter ("no gear"); photo-led skill grid; video masterclasses; position-specific drills.
6. Progress: XP per session, player-rating gauge, daily targets, leaderboard, social feed, Hall of Fame (players who signed pro).
7. Visual: dark charcoal UI, red primary with radial red glow, bold condensed uppercase headlines ("LIVE LIKE A PRO", "DEVELOP SKILLS TO GET SCOUTED"), circular gauges, colored tiles, photo cards. High-energy, slightly busy.
8. Pricing: Pro $19.99–24.99/mo, $69.99/3 mo, $89.99/6 mo, $99.99–199.99/yr; Academy $49.99/mo or $399.99/yr; promos $4.99. Free tier is generous (reviewers say Pro adds little).
9. Borrow: four-pillar framing (technique / tactics / fitness / mentality) and the skill-grid entry into the library. Beat: repeated billing complaints (charged after cancel), timer bugs, aggressive upsell to camps, thin AI layer on a 150-item library.

### 1.3 Dribbleup (Tier C, best-in-class gamification)

1. Positioning / user: smart ball + camera-tracked classes, "a private trainer on call"; kids 6–14 and parents; 41K ratings, 4.7 stars; ~$65K/mo revenue per screensdesign.
2. Pages: Home (workout cards tagged with skill level, duration, "free" badge; "Unlock All" banner), Live classes schedule, On-demand library, Programs (e.g., 30-day bootcamp), Solo vs Head-to-Head mode, Profile (points, level, unlockable avatars, owned equipment), Leaderboard (anonymous avatars), Parent view.
3. Onboarding: 7 screens: pick owned products (soccer/basketball/…), skill level (5 levels), contextual notification permission; 10–14 day trial. Teardown gap: camera tracking (the core magic) is not demoed until the first workout.
4. Plan: no personal plan; fixed programs plus daily live classes; weekly goal measured in days active.
5. Library: 2,000+ drills/classes, new weekly; levels Beginner / Intermediate / Expert (now 5); categories shooting, juggling, ground work, plus role-specific (GK, defender, midfielder, attacker); 5–30 min sessions; drill names like Foundations, Sole Flicks, Back Side Turns; AR targets on screen count reps.
6. Gamification: points → levels; public leaderboard with anonymous avatars; unlockable avatars at point milestones; streaks; asynchronous head-to-head against another user's recorded performance on the same drill.
7. Visual: light UI, green brand, rounded friendly type, instructor-face video thumbnails, orange/yellow highlight chips. Kid-friendly.
8. Pricing: ball $39.99–59.99; membership $16.99–19.99/mo or $119/yr; up to 6 household members.
9. Borrow: card metadata (level, duration, free) and ghost head-to-head. Beat: hardware lock-in, tracking glitches, no personalized plan, aimed at kids.

### 1.4 BallerAI (Tier B)

1. Positioning / user: "Most apps track reps; BallerAI turns your phone into a professional coaching staff." Finnish (BallerBiz Oy). 4.8 stars, ~27–70 ratings. Ambitious 13–20 year-olds.
2. Pages: Today timeline (meals and training interleaved by time with a daily load label "LIGHT"), Full Plan, Sessions, Drills, Nutrition (photo meal log), Recovery / load management, AI chat ("Ballzy"), Player card / Profile (XP, rating), Roads & Leagues.
3. Onboarding: age, level, goals, position, available equipment.
4. Plan: daily sessions regenerated from feedback; "schedule customized every day"; no evidence of drag/reorder.
5. Library: position-specific (striker, winger, midfielder, defender, GK) covering dribbling, passing, finishing, first touch, juggling, weak foot, crossing.
6. Gamification: player card with XP and rating, roads and leagues, fitness metrics.
7. Visual: light UI, white, blue-gradient marketing, green accent, cartoon ball mascot. Friendly but generic.
8. Pricing: $9.99/mo, $59.99/yr.
9. Borrow: one day-timeline that merges training, meals and recovery with a load indicator. Beat: scope creep (nutrition, injury, chat) dilutes the core; tiny base.

### 1.5 Baller Lab (Tier B, best dark UI of the wave)

1. Positioning / user: "Structure instead of guesswork"; 100+ pre-made sessions; solo developer (Mads Drejsig Thorsen); 4.9 stars, 52 ratings.
2. Pages: Training (Plan / Sessions tabs; Mon–Sun week strip; day view "Speed & Agility & First Touch" with Warm-up and Main work blocks; a "Customize" control), Film Room (video analysis), Runs (GPS), Nutrition (barcode/photo), Chat Coach, Profile / Leaderboard (FIFA-style card: overall 58, PAC/SHO/PAS/DRI/DEF/PHY, XP 2,345, Level 1 Beginner, "Winger Program – Week 1 of 12").
3. Onboarding: position, level, training frequency.
4. Plan: 12-week position program laid out day by day; each drill lists setup, focus, time; some drills have live callouts/reaction prompts. Customize scope unclear (likely swap duration/intensity, not drag-reorder).
5. Library: first touch, tight-space control, passing, finishing, movement.
6. Gamification: XP, levels, leaderboard, FUT-card stats (self-reported inputs).
7. Visual: black / dark navy, electric blue, FUT card and hex stat layout, compact type. Modern and confident.
8. Pricing: $8.99/week, $34.99/yr, $24.99/yr promo; subscription-only, no free tier or trial.
9. Borrow: week strip + session anatomy (warm-up / main / cool-down) + program progress ("Week 1 of 12"). Beat: paywall before any value; card stats aren't earned from measurable tests.

### 1.6 Footly (Tier B, most editable plan found)

1. Positioning / user: "for real footballers", rewards consistency over perfection; Budge Technologies; 4.8 stars, 572 ratings; Apple Watch + visionOS.
2. Pages: Today/Plan, Month calendar (session value and 3-day performance history), Workouts (22+ strength/power drills with video; gym, conditioning, plyo, core), Analyze (upload clip → Coach's Breakdown / Improvement Areas / Recommended Drills), Runs (GPS map), Nutrition (6 meal slots clustered around training), Achievements (8 rank badges with 3D unlock animations), Profile.
3. Onboarding: position + level → plan, then first workout.
4. Plan: position-aware weekly plan; daily sessions are editable, regenerable, or resettable (the only app in the set that advertises all three).
5. Library: fitness-skewed; limited on-ball drills.
6. Gamification: performance streaks, 8 rank badges (3D), weekly stat celebrations after sessions.
7. Visual: near-black UI, neon green accent, bold white sans, 3D badge renders. Reads premium-sporty.
8. Pricing: Pro tiers $5.99 / $9.99 / $12.99 / $34.99 / $59.99; Premium $34.99; ads in free tier (users complain about ads and unclear free vs paid).
9. Borrow: per-day Edit / Regenerate / Reset controls and 3D rank badges. Beat: thin on-ball library, ads, pricing confusion.

### 1.7 Dribly, GoalBall, BallCoach, Level Up AI (Tier B template wave)

- Dribly (LaunchPulse AI): position + level + goals → weekly plan; Training Hub with week strip and "AI Practice Mode"; Schedule tab merges upcoming match, reminders, to-dos; clip analysis in <30s; nutrition; "Dribly Card" stat progression; rankings. $9.99 or $39.99/mo. 1.0 star (1 rating). Dark navy, electric-blue glow, stadium backdrops.
- GoalBall (ARKIVE): skill "paths"; short session blocks; Progress page with overall-rating line chart, streak in weeks, monthly activity-dot calendar, skill radar (Ball Mastery, First Touch, Dribbling, Passing, Striking, Weak Foot) and per-skill trend cards; badges (first session, weekly streak, PB); follow/kudos; tactical scenarios. $9.99/mo or $89.99/yr; Pro required to train at all. 5.0 stars (4 ratings). Dark navy + blue, data-viz heavy.
- BallCoach: weekly planning around match calendar and energy levels; intensity + duration on each session; voice/text AI coach; dashboard rating ~7.3. 4.3 stars (12 ratings).
- Level Up AI: weekly plan from position/level/goals, match footage analysis, XP leaderboard, FUT-card progression, habit tracking. Archived from the App Store April 2026 (a cautionary data point on churn in this wave).
- Borrow: GoalBall's radar + trend pairing; Dribly's match-aware calendar. Beat: near-identical dark-template UIs, nutrition/run tracking bolted on, almost no users, trust problem.

### 1.8 Perfect Play (Chelsea FC x Coach-AI) (Tier C, computer-vision)

1. Positioning: Chelsea Academy training games with computer-vision / AR feedback from the phone camera (2020 launch). Target 8–16.
2. Pages: Home, Training games by skill, personal Plan (Premium), Masterclass content, Progress/goals.
3. Onboarding: level + targets → personalized plan.
4. Plan: personalized to level and targets; game list.
5. Library: training games across agility, ball mastery, dribbling, focus, passing, receiving, shooting, speed, strength, resilience; AR maps the play area, scores reps.
6. Progress: per-game scores and goals.
7. Visual: Chelsea blue, AR overlays (unverified detail).
8. Pricing: free limited games; Premium £9.99/mo.
9. Borrow: club-credible content, camera-scored reps. Beat: current status unclear / likely dormant (unverified); CV setup friction.

### 1.9 Playermaker / CITYPLAY (Tier C, best benchmark scoring)

1. Positioning: boot-mounted 6-axis sensors (1000 Hz) + Manchester City coaching content; "benchmark against academy and pro players". Youth 8–18 and parents; City.Play 3.3 stars (89 ratings) because of sync/battery issues.
2. Pages: Session summary (Highlights: work rate, ball possessions, total distance, sprint distance, top speed), Skills (gauges 40–99: Two-footed, Dribbling, First touch, Agility, Speed), Spider skill chart (unlocks after 3 matches), Weekly trends, Match recap, Phase editor, Leaderboard (team/global, gender filter), Badges for PBs, shareable player card, City videos / drills / challenges.
3. Onboarding: pair sensors, age/gender/position (drives benchmarks).
4. Plan: none generated; drills and challenges recommended from weak metrics.
5. Library: Man City coach videos, "personalized drills, tips, and skill challenges".
6. Gamification: 40–99 score (99 = top 5% of your age/gender/position segment), spider chart, PB badges, leaderboards, player card.
7. Visual: CITYPLAY sky-blue + navy, dial gauges, bold condensed type; Playermaker neutral.
8. Pricing: device promos from $20–25 up front, then $149/yr subscription; 30-day money-back.
9. Borrow: segment-benchmarked 40–99 score and gating the radar until 3 sessions exist. Beat: hardware reliability and support complaints.

### 1.10 AiSCOUT (Tier D)

- Free. 7-step flow: download → profile (photo, bio) → enter club trials → record/upload drills → get scored → improve stats → get scouted. 75 drills with instructions + video; AI tracks 20+ body points; scores physical / technical / cognitive against academy standards. Light, photo-led site. Borrow: "benchmark against academy standard" framing. Beat: scouting, not training.

### 1.11 Other content apps (Tier A long tail)

- Trainsolo Soccer (STRACT): 500+ drills; custom sessions "in seconds"; coaches share plans; leaderboards; challenge games; donations per completed session; $9.99/mo, $89.99/yr, limited $84.99/yr; 14-day or 3-session trial; 4.1 stars (62). Loading bugs reported.
- Soccer Improved: ~1,000 drills; set 1 main + 2 supporting goals → tailored plan; equipment-based filtering; skill tests; calendar; activity feed; coach accounts; "My Career" log; $11.99 / $64.99 / $119.99.
- Ballers App (SA Fotboll AB): 56-week plan, 4 sessions/week; player profile with video; scout search; livestreams; $149.99/mo or $799.99/yr; 3.2 stars (6).
- BallersApp (Svexa engine, separate product): 1,500 exercises; premium AI programs built from profile, goals, training history; community challenges.
- CoachFrank (coach side, free): inputs age, group size, duration, difficulty, focus (attacking / defending / passing & receiving / transition) → plan in <60s, saved to a library; 30+ languages. Clean reference for a generator form.
- Soccer Skills Pro (free, PL/EN): 6 standardized tests → percentile vs peers and pros → personalized plan; results verified at camps.

### 1.12 Hardware / VR / team (Tier C–D, brief)

- Rezzil Player (VR): Headers, Shot Stopper, Reaction Wall, Hoops, Field General; 160+ levels; "20 min, 3x/week"; weekly/monthly global leagues and Hall of Fame; $4.99 (Steam), ~$10 (PSVR2), free on Quest; dark site, club add-ons (Man City, Adidas).
- Blazepod: 200+ drills, custom drills, reaction-time logs; app $12.99/mo or $99.99/yr; pods £299–539; "bait and switch" reviews after paywalling modes.
- Zepp Play Soccer (2016): shin-guard sensor; distance, kicks, sprints, max speed, conversion; team mode; auto highlight reel. Legacy.
- Elite Skills Arena: ICON 12-panel arena for 60+ clubs; app compares scores vs friends and pros. B2B.
- Beyond Pulse: HR smart belt for youth teams; player app shows HR, active participation, distance, individual leaderboard, weekly emails; 3.6 stars (29).
- Veo / Trace: AI match cameras; Veo $119–239/mo + €1,299 camera; coach workspace to clip/tag/share. Hudl Technique: discontinued → OnForm. Zone7: B2B injury-risk AI for pro clubs (daily risk emails, 72% hit rate claim).

### 1.13 UX references outside soccer

Freeletics Coach
- Onboarding ~25 steps (gender, goal, fitness level slider, age, height, weight, mindset/commitment, equipment, training days, running access, limitations) → "Building your plan" animation → ranked Training Journey list with a "#1 recommendation" → paywall immediately after sign-up, then a 50%-off countdown paywall.
- Plan: 6–12-week Journeys; week 1 is an assessment week; Coach/Today tab shows one session card (duration, equipment, focus, muscles) with training days as filled circles; unfinished sessions roll forward; "Adapt session" (no equipment, less space, less time, no running, low-impact/quiet, exclude sore muscles); regenerate an alternative with the same objective; post-session feedback (difficulty, technique) sets the next session's intensity; Daily Athlete Score; audio coaching.
- Borrow: adapt-session constraints, the generating moment, the feedback loop. Beat: paywall before value and onboarding fatigue; assessment discoverability complaints on their forum.

FUTURE
- Human coach picked from 100+; onboarding = goals, schedule, where you train, equipment, coach choice; coach builds the weekly plan; in-app messaging, voice-note form feedback, Apple Watch. $50 first month then $199/mo ($149/mo annual). Landing teardown: strong hero and CTA, but price is never justified against app-only rivals.
- Borrow: weekly "plan drop" ritual and coach voice; the human tone AI apps lack. Beat: 10–20x the price.

---

## 2. Pricing benchmark

| Product | Monthly | Annual | Free tier / trial |
|---|---|---|---|
| Techne PRO | $37.99 | $279.99 | 7-day trial; Fundamentals $9.99/mo |
| Train Effective Pro | $19.99–24.99 | $99.99–199.99 | Generous free tier; Academy $399.99/yr |
| Dribbleup | $16.99–19.99 | $119 | 10–14-day trial; needs $40–60 ball |
| BallerAI | $9.99 | $59.99 | Free download, premium paywall |
| Baller Lab | $8.99/week | $34.99 ($24.99 promo) | None |
| Footly | $5.99–12.99 | $34.99–59.99 | Ad-supported free |
| GoalBall | $9.99 | $89.99 | None (Pro required) |
| Dribly | $9.99 / $39.99 | – | – |
| Trainsolo | $9.99 | $89.99 | 14-day / 3 sessions |
| Soccer Improved | $11.99 | $64.99–119.99 | Limited free |
| Perfect Play | £9.99 | – | Free limited games |
| Playermaker / CITYPLAY | – | $149 + device | 30-day refund |
| Ballers App | $149.99 | $799.99 | – |
| Freeletics (ref) | ~$12–15 equiv | ~$75–90 | Paywall after onboarding |
| FUTURE (ref) | $199 | $149/mo prepaid | $50 first month |

Takeaway: the market clusters at $8–12/mo or $35–90/yr for AI-plan apps; Techne proves motivated families pay $280/yr for structure and community. A free tier that lets a user generate and edit one plan, with Pro at ~$7–10/mo or $50–70/yr, sits in the credible zone.

---

## 3. Synthesis

### 3.1 Recommended xTrain sitemap

Legend: [TS] table stakes (every credible competitor has it) · [DIFF] differentiator (few or none do it well)

Public
- `/` Landing: promise, 30-second demo of plan generation and drag-to-reorder, social proof, pricing teaser. [TS]
- `/pricing`: free vs Pro comparison; annual anchor. [TS]
- `/signup` → 4 steps (name, age, experience, position) + optional step 5 "constraints" (days/week, minutes/session, space, wall/goal/cones). [TS; the constraints step is DIFF]
- `/login` [TS]

Onboarding
- `/onboarding/generating`: "Building your plan" moment with visible reasoning (why these sessions for a 15-y/o intermediate winger). [DIFF, pattern from Freeletics]
- `/onboarding/preview`: first week preview with "looks good / tweak" before entering the app. [DIFF]

App shell (left nav on desktop, bottom tabs on mobile)
- `/today` Home: today's session card (duration, focus, equipment), start button, streak, weekly ring (days trained / target), next-up preview, "adapt today" shortcut. [TS]
- `/plan` Plan: week strip + day columns (desktop: 7-column board; mobile: day list). Drag sessions between days, reorder drills within a session, swap a drill (filtered suggestions), change duration, regenerate day or week, lock a session so regeneration leaves it alone, version history / undo. [DIFF: nobody in the set offers true drag/reorder; Footly is the only one with edit + regenerate + reset]
- `/plan/session/:id` Session detail: Warm-up / Main / Finisher / Cool-down blocks; each drill card with timer, reps, equipment; "why this drill" line; start → Player mode (fullscreen timer, auto-advance, voice cues). [TS; "why this" is DIFF]
- `/library` Drill library: facets skill, position, equipment, space, duration, difficulty, solo/partner; card = thumbnail, name, skill tags, difficulty pill, duration, equipment icons, "add to plan". [TS]
- `/library/:drill` Drill detail: video or 3D animation with angle control, setup diagram, execution steps, 3–5 coaching points, common mistakes, progressions/regressions, scoring metric, add-to-session. [TS for video; 3D + mistakes + progressions is DIFF]
- `/progress` Progress: streak and streak saves, hours trained, sessions completed, skill radar (gated until 3 sessions), per-skill trend lines, personal bests per scored drill, skill-test history. [TS; radar is now expected]
- `/skill-tests` Baseline tests (juggling count, 30-second wall passes, cone slalom time, 5 shots at target) used to calibrate the plan and refresh the radar monthly. [DIFF for AI apps; Techne / Soccer Improved / Soccer Skills Pro have it, the AI wave doesn't]
- `/achievements` Badges + mastery ladder by logged hours (Techne socks without the socks) + level. [TS-lite]
- `/friends` Crew: invite link, friends' streaks this week, ghost challenge on a scored drill, shared session ("train the same session today"). [DIFF: solo-but-together is the gap]
- `/leaderboard` Friends-first, then age-band/global; weekly reset. [TS, but friends-first ordering is DIFF]
- `/challenges` Weekly challenge tied to a scored drill. [optional]
- `/profile` Specs (age, level, position(s), goals, constraints); changing any field offers "regenerate plan". [TS]
- `/settings` Notifications, units, account, subscription. [TS]
- `/coach` AI chat scoped to the plan ("make Wednesday shorter", "I have no wall this week"). [DIFF if it edits the plan; skip if it's only chat]

Deliberately not in v1: nutrition, GPS runs, video analysis. Every AI competitor bolted these on and diluted the core; the research shows they drive complaints (Footly food editing bug, ads) rather than retention.

### 3.2 Ten UX patterns to borrow

1. "Building your plan" interstitial with a ranked recommendation (Freeletics): a short animation that names the inputs it used, then a #1 recommended plan plus two alternates (e.g., "Winger foundations 6 wk", "First-touch focus 4 wk").
2. Adapt-session constraints (Freeletics): one-tap chips on any session: less time, no wall, small space, no cones, low-impact. Regenerate the session holding the same objective.
3. Per-day Edit / Regenerate / Reset controls (Footly): three explicit verbs on each day; xTrain adds Lock and Undo.
4. Week strip + session anatomy (Baller Lab, Freeletics): Mon–Sun strip, program progress "Week 2 of 8", each session split into Warm-up / Main / Finisher / Cool-down with per-block minutes.
5. Drill card metadata at a glance (Dribbleup): level pill, duration, equipment icons, free/pro tag; sortable and filterable; "100s of touches in 15 min" style outcome copy.
6. Drill page with Setup tab and difficulty progressions (Techne): video + written setup + three progressions on the same page; 1–3 minute timer per drill that logs time automatically.
7. Streaks with Streak Saves and Revive (Techne): earn saves by training; a 3-day "revive" session after a miss. Count the streak on a 10-minute minimum, not a full session.
8. Hours-based mastery ladder (Techne socks): 9 tiers at 0/10/25/50/75/100/250/500/1000 hours; show the next tier on the Progress page.
9. Skill radar gated by data, plus per-skill trend (Playermaker spider chart after 3 sessions; GoalBall radar + trend cards; Train Effective's single rating gauge for the headline number).
10. Ghost head-to-head and friend groups (Dribbleup H2H vs a friend's recorded score; Techne custom-group leaderboards): asynchronous competition on scored drills is the cheapest "with friends" feature that works for solo training.

Honorable mentions: Playermaker's 40–99 segment-benchmarked score; Train Effective's skill-grid entry into the library; BallerAI's single day timeline; Dribly's match-aware calendar; CoachFrank's minimal generator form (age, duration, difficulty, focus).

### 3.3 Five category weaknesses xTrain can exploit

1. Plans are not editable. Incumbents ship fixed weekly drops (Techne, Dribbleup, Ballers App); the AI wave offers regenerate-only (Dribly, GoalBall, BallerAI) and at best edit/regenerate/reset per day (Footly). None offers drag-and-drop across days, drill-level swap with filtered suggestions, locks, or undo. This is xTrain's headline feature and it is uncontested.
2. Drill instruction is shallow. The norm is a 20–60s video plus two sentences. Nobody shows technique from multiple angles, lists common mistakes, or explains why a drill is in the plan. A 3D animation with angle control, coaching points and mistakes would be visibly better on the drill page, which is the page users spend the most time on.
3. Paywall before value and billing distrust. Baller Lab and GoalBall require a subscription before the first session; Train Effective has repeated "charged after cancelling" reviews; Footly mixes ads with confusing tiers; Ballers App charges $149.99/mo. A free tier that generates and edits a full plan, with transparent Pro pricing, converts on trust.
4. Template-grade AI apps. The 2025–26 wave (Dribly, GoalBall, BallCoach, Level Up AI, which is already archived) share the same dark-navy template, bolt on nutrition and GPS runs, and have single-digit to double-digit ratings. Users cannot tell them apart. Distinct visual identity plus a focused scope (plan + library + progress) reads as credible.
5. Solo training is lonely. Gamification is global leaderboards against strangers. Friend-group training (shared weekly plan, ghost challenges, seeing a friend's streak) exists only as Techne custom leaderboards and Dribbleup H2H. xTrain's "with friends" angle can own this.

Bonus gap: real-world constraints. Few products ask whether the user has a wall, a goal, cones, or how much space they have; plans assume a pitch. Techne's wall-passing sessions and Freeletics' "no equipment / less space" chips show the demand.

### 3.4 Drill taxonomy observed (use for xTrain's seed data)

Skill categories (union of Techne, Train Effective, Baller Lab, BallerAI, GoalBall, Dribbleup, SoccerXpert):
- Ball Mastery (sole rolls, drags, V-cuts, toe taps)
- First Touch / Receiving (wall, air, directional)
- Dribbling / 1v1 moves (cone slalom, change of direction, feints)
- Passing (wall passing, one-two, weighted, long)
- Shooting / Finishing (placement, power, first-time, volley)
- Juggling (feet, thigh, head, alternating)
- Weak Foot (any category tagged)
- Crossing (less common)
- Heading (rare in solo apps)
- Defending (1v1 body shape, shadow)
- Speed & Agility (ladder, cone sprints, reactive)
- Strength / Power (bodyweight, plyometrics, core)
- Conditioning (intervals, shuttles)
- Mobility / Recovery (stretching, foam roll)
- Mental (focus, visualization, resilience)
- Goalkeeping (handling, footwork, dives)
- Tactical / Game IQ (video quizzes, scenarios)

Difficulty tiers: three is the norm (Beginner / Intermediate / Advanced; Techne 3 progressions per drill; SoccerXpert Easy / Medium / Hard; Dribbleup grew from 3 to 5 levels). Recommend 3 tiers plus a per-drill progression/regression link.

Position tags: Goalkeeper, Centre-back, Full-back, Defensive mid, Central mid, Attacking mid, Winger, Striker (Dribbleup uses 4 roles; BallerAI 5; Baller Lab per-position programs).

Equipment tags: Ball only; Cones (4 / 6 / 8); Wall or rebounder; Goal or target; Agility ladder; Hurdles; Markers/discs; Resistance band; Partner required. Include a "No equipment" filter (Train Effective's only filter) and a Space tag: Small (3x3 m), Medium (10x10 m), Large (half pitch).

Durations: drill blocks 1–3 min (Techne timer), 30-second scored tests, 5 / 10 / 15 / 30 min sessions (Dribbleup), typical generated session 20–45 min (Baller Lab, Freeletics), weekly volume 90–180 min (Techne quotes 30–90 min per weekly session; Rezzil "20 min 3x/week").

Age bands used for benchmarks: U8, U10–12, U14–16, U17+ (SoccerXpert); CITYPLAY benchmarks by age, gender and position.

Session structure seen repeatedly: Warm-up 5–8 min → Technical block A (2–3 drills, 3 progressions) → Technical block B or Physical → Finisher / scored challenge (count or time) → Cool-down 3–5 min.

Suggested drill record fields: id, name, category, sub-skill, difficulty (1–3), duration_min, reps/sets or timer_sec, equipment[], space, players (solo/partner), positions[], setup_steps[], execution_steps[], coaching_points[] (3–5), common_mistakes[], progression_id, regression_id, scoring_metric (count_30s / time_sec / makes_of_10 / none), video_url, animation_id, why_it_matters (one line).

Realistic counts: Techne "hundreds", Train Effective 150+, Trainsolo 500+, Soccer Improved ~1,000, BallersApp 1,500, Dribbleup 2,000+ (classes). A credible xTrain v1 library is 120–200 drills with full metadata, which beats the AI wave (Footly 22, Baller Lab "100+ sessions") on quality.

---

## 4. Sources

Techne Futbol: https://apps.apple.com/us/app/techne-futbol-soccer-training/id1298569303 · https://www.technefutbol.com/ · https://www.technefutbol.com/faqs · https://simplifaster.com/articles/ball-mastery-techne-futbol/ · https://apps.appfollow.io/ios/techne-futbol/1298569303?country=us
Train Effective: https://apps.apple.com/us/app/train-effective-soccer-academy/id1425844780 · https://apps.apple.com/gb/app/id1425844780 · https://www.traineffective.com/ · https://www.traineffective.com/tracker · https://www.traineffective.com/exercises · https://spark.mwm.ai/en/apps/train-effective-soccer-academy/1425844780
Dribbleup: https://dribbleup.com/products/smart-soccer-ball · https://apps.apple.com/us/app/id1451878715 · https://screensdesign.com/showcase/dribbleup-sports-fitness · https://dribbleup.com/blog/what-is-dribbleup · https://greenlitcontent.com/resources/dribble-up-review
BallerAI: https://mwm.ai/apps/ballerai/6742112516 · https://apps.apple.com/us/app/id6742112516
Baller Lab: https://www.similarweb.com/app/apple/6806063649/ · https://apps.apple.com/us/app/id6806063649
Footly: https://apps.apple.com/app/id6758677131
Dribly: https://apps.apple.com/app/id6770824952
GoalBall: https://apps.apple.com/us/app/id6787764805
BallCoach: https://mwm.ai/apps/ballcoach/6754994365
Level Up AI: https://appshunter.io/ios/app/level-up-ai/id6751371008
CoachFrank: https://apps.apple.com/us/app/-/id6479705308
Perfect Play: https://www.coachweb.com/fitness-apps/8680/perfect-play-is-a-new-football-training-app-developed-with-chelsea-s-academy · https://calcalistech.com/ctech/articles/0,7340,L-3844814,00.html
Playermaker / CITYPLAY: https://apps.apple.com/us/app/id1606915551 · https://www.playermaker.com/pages/how-it-works · https://www.playermaker.com/pages/faq · https://www.playermaker.com/blogs/news/soccer-training-apps
AiSCOUT: https://www.ai.io/aiscout/aiscout-for-players · https://apps.apple.com/us/app/-/id1508291341
Ballers App: https://apps.apple.com/app/id1508112536 · BallersApp (Svexa): https://svexa.com/svexa-working-with-ballers-app-the-ultimate-virtual-soccer-coach/
Trainsolo: https://apps.apple.com/us/app/trainsolo-soccer/id1582909254
Soccer Improved: https://apps.apple.com/app/id1667534066
Soccer Skills Pro: https://apps.apple.com/us/app/soccer-skills-pro/id6741845806
Rezzil: https://rezzil.com/player · https://roadtovr.com/sports-training-app-rezzil-player-coming-psvr-2-soon/
Blazepod: https://apps.apple.com/us/app/-/id1382204042 · https://blazepod.eu/blogs/all/blazepod-review
Zepp Play Soccer: https://www.wareable.com/sport/zepp-play-soccer-football-features-specs-release-date-price-3319
Elite Skills Arena: https://eliteskillsarena.com/ · https://www.soccerscene.com.au/elite-skills-arenas-smart-training-tools-for-every-level-of-the-game/
Beyond Pulse: https://apps.apple.com/us/app/beyond-pulse-for-players/id1445128542
Veo / Trace: https://www.veo.com/en-us/veo-vs-trace · https://www.toolmage.com/en/tool/veo/
Hudl Technique → OnForm: https://glennpaulley.ca/curling/2021/08/24/moving-to-onform-from-hudl-technique/
Zone7: https://www.soccerscene.com.au/zone-7-ai-powered-injury-prevention/
Pro Direct Academy (not an app): https://www.prodirectacademy.com/
Freeletics: https://www.freeletics.com/en/blog/posts/update-freeletics-training-journeys/ · https://www.freeletics.com/en/blog/posts/update-today-view/ · https://www.freeletics.com/en/blog/posts/getting-started-with-freeletics/ · https://screensdesign.com/showcase/freeletics-workouts-fitness · https://forum.freeletics.com/t/onboarding-how-to-go-through-initial-assessment/2789
FUTURE: https://www.sensai.fit/blog/future-app-review-2026 · https://landingdoctors.com/teardowns/future-com
Drill taxonomy: https://www.soccerxpert.com/drills/all-soccer-drills
