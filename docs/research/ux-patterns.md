# xTrain UX Pattern Research: Intake, Editable Plan, Drill Library & Session Player

Date: 2026-10-03
Scope: Reference teardowns and proposals for three interaction areas of xTrain, an AI soccer-training web app for players training alone. Numbered citations map to the Sources list at the end. Claims marked (PK) are product knowledge not verified by a fetched page in this session.

---

## 0. Executive summary

- Intake: the best plan-generating apps (Runna 18 steps, Fitbod 14, Headspace 17, Whoop ~20, Caliber 35) run one question per screen with a progress bar, lead with the goal, collect constraints (days, minutes, equipment, space) in the middle, show a summary card, then a short "building your plan" screen with named steps, then reveal the plan before asking for payment or account. Median onboarding flow is 11 steps (p90 27). xTrain should land at 16-18 screens, under 3 minutes, soccer-specific from screen 2 on.
- Plan page: endurance platforms (TrainingPeaks, Final Surge, Intervals.icu) own drag-and-drop calendars with week controls, copy/shift, library drag-in, and compliance colors. Coaching apps (Runna, Athletica, Garmin, Freeletics, Fitbod) layer constrained moves (Runna: same week or +/-1 week, no double-booking, warning before harmful changes, drag back to undo), temporary dial-backs (Runna "Not feeling 100%": 3-14 days, 4 intensity levels, 3 return ramps), per-session "adapt" menus (Freeletics: time, equipment, space, noise, body area, difficulty, regenerate), and visible rationale for AI changes (Athletica: arrows + % + reason text). xTrain should treat team training and matches as fixed constraint events, re-plan only forward, preview changes before applying, and attach a one-line coach note to every AI edit.
- Drill library and player: Techne (30 drills/session, 1-min timers, difficulty options, technical tests), Peloton (multi-select filters, class-plan tab with 3 focus areas), NTC (spoken summary, large clock, voice cues, haptics on next drill), Hevy (auto rest timer, next-set notification), and coaching-site drill formats (setup, procedure, reps/sets, coaching points, progressions) define the bar. Post-session rating should be two taps (sRPE 1-10 + "how did it feel" faces) plus optional notes, following TrainingPeaks and Volt. The 24 drills in C4 are written to the proposed schema.

---

## A. Onboarding / intake quiz

### A1. Benchmarks

| Metric | Value | Source |
|---|---|---|
| Median total onboarding steps (129 flows) | 11 (avg 13.9, p90 27, range 2-70) | [1] |
| Personalization-quiz question screens, general apps | avg 3.9; 90th percentile 10 | [1][2] |
| Apps showing a progress indicator on quiz screens | 58% (39 of 67), counted as a lower bound | [3] |
| Apps asking a goal question in the quiz | 24 of 119; tied with demographics as most common; typically placed first | [4][5] |
| Apps ending with a "building your plan" loader | 9 of ~751 (emerging tactic, not majority) | [6] |
| Noom web funnel | up to 113 screens, 10-15 min | [7] |
| Runna | 18 question/setup screens before "Generate my plan", then 2 loader screens | [8] |
| Fitbod | 14 steps; first generated workout shown free before paywall | [9] |
| Headspace | 17 steps (screensdesign count); teardown collapses to 6 meaningful decisions | [10][11] |
| Caliber | 35 steps ("biometrics to motivations and obstacles") | [12] |
| Whoop | ~19-20 screens, mostly device setup; 4-day calibration before scores appear | [13][14] |
| Duolingo | "Just 7 quick questions before your first lesson"; first lesson in 4 taps, no account needed | [15][16] |

Takeaway: planning apps that must output a real schedule run 14-18 screens; content apps run 6-10. xTrain is a planning app, so 16-18 screens is defensible if every answer visibly changes the plan ("a quiz this long works when each answer visibly changes the product" [2]).

### A2. Reference captures

**Noom** [7]
- Up to 113 screens; progressive commitment-building; paywall only after heavy time investment.
- Behavioral section: 10 slider questions between two opposing statements, one per screen, explicit "Question X of 10" counter, background shade deepens with answer intensity.
- Repeated anchors: "we've helped 3,627,436 people", "subscribers typically lose 0.5-1 kg per week".
- Loaders used twice: short loaders as "pause after effort", long loaders that interleave extra questions; final loader "building your plan" with animated plan construction.
- Email gate placed after investment but before results; CTA reads "See my results".
- Critique: never shows what the app actually looks like before paywall.

**Headspace** [10][11]
- Intent question first ("what brings you here"), with animated descriptions changing per selection and a manual Continue so users can explore options.
- Asks about routines ("before bed", "during commute", "morning routine") rather than abstract time preferences.
- After quiz, lets user pick entry point (guided course, sleep, free exploration) so experienced users are not forced through beginner content.
- Critiques: redundant confirmation screen after intent; paywall before any product value; personalization answers did not change what came next.

**Freeletics Coach** [17][18][19]
- Questions: gender, goal, fitness level, age, height, weight; then training days, available equipment, running preferences before the first workout is generated.
- Training Journeys open with an assessment week; Coach uses per-workout feedback to calibrate.
- Mindset/commitment questions during setup to set intensity expectations.

**Fitbod** [9][20][21]
- 14 steps: experience level (beginner/intermediate/advanced, which changes exercise pool and recovery rates), goal (strength, muscle, lean, lose weight), extremely granular equipment picker (saveable as profiles per gym), training preferences (split, duration, cardio, warm-up, supersets), then height/weight/age/gender.
- Shows "strength gain projections" before signup; first generated workout visible free; paywall after generation, before starting.
- Tooltips appear during the first workout, not before.
- Body map of fresh vs fatigued muscles explains why today's workout is what it is.

**Runna** [8][22][23]
- Order: goal -> distance -> terrain (hilliness) -> ability -> birthday -> gender -> current race time -> runs per week -> which days -> long-run day -> notification pre-prompt (mock notification shown before the OS prompt) -> plan start date -> "first run tomorrow?" -> plan length (e.g., 6-week fast-track) -> race day -> units -> training-preferences summary -> plan summary with "Generate my plan".
- Loader: screen 1 "Building your plan" with running-shoe illustration; screen 2 "Optimizing your schedule" with progress bar.
- Reveal: personalized plan summary, then paywall with trial, then confetti welcome.
- Guardrail copy: if you enter an implausibly fast 5k time the app says it is not built for you (reinforces fit for everyone else).

**Whoop** [13][14]
- Mostly hardware/account setup; the real "onboarding" is a 4-day calibration (full baseline ~30 days). Pattern worth copying: tell users up front that the first N days are calibration and show a calibration progress state instead of empty metrics.

**Duolingo** [15][16][24]
- Sequence is the lesson: purpose -> level (placement, "7 quick questions") -> commitment (daily goal 5/10/15/20 min) -> practice. First lesson in 4 taps, account later.
- Choosing a goal creates commitment even when the value is not operationally used (streak-goal experiment improved retention weeks later) [24].
- Author warning: copying mascots/progress bars without the sequencing logic does nothing.

**Calm** [25][26]
- First question "What brings you to Calm?" is multi-select (sleep, stress, anxiety, focus...), with the line "We'll personalize recommendations based on your goals."
- Quiz skippable straight to account creation.
- Reminder preferences framed as a personal boundary; first short practice offered before paywall.

**Centr** [27]
- "FitQuiz": primary goal, current fitness level (explicit guidance: "choose where you are RIGHT NOW"), training styles you enjoy, equipment, dietary preferences, time available. Output is recommended programs + individual workouts + meal plans.

**Caliber** [12][28]
- 35 steps; age, gender, weight, height, goals, motivations, obstacles. Post-setup checklist on home screen (do a workout, join a community). Paywall after plan creation; coaching upsell framed as a personalized recommendation.

**Future** [29]
- Three-minute coach-match quiz: fitness experience, top goal, desired coach intensity, gender, age, relationship with fitness, prior experience, unique needs (pregnancy, injury, conditions), nutrition, sessions per week. Output is a human coach match rather than a plan.

**Ladder** [30][31]
- Two-minute "find your team" quiz filtering by goals and equipment (home vs gym teams). Trial shown as a timeline of what to expect rather than a price grid. Full weekly plan is locked until the welcome workout is done ("action-gated activation"). Team chat and a "Workout Wall" of member selfies for social proof.

**Strong / Hevy** (PK + [32])
- Near-zero onboarding: open to templates / "Start Empty Workout". Hevy's defaults (rest timer length, units) are set in settings, not a quiz. Lesson: logging tools skip intake; planning tools cannot.

**Zwift** [33]
- Asks weight and a "fitness level profile" before the first workout and estimates FTP from them; later replaces the estimate with measured power. Pattern: self-rated level as a seed, replaced by measured tests.

**Mid-flow reassurance (Knowunity)** [34]
- Asks "what's holding you back", then answers with a normalizing statistic on the next screen so admitting a weakness feels safe. Reassurance is tied to the specific answer so it reads as a reply.

**2026 onboarding trends** [35]
- Outcome before explanation; higher-signal questions whose answers change the product; visible personalization ("here is the number we computed from your answers, adjust it"); contextual proof (reviews grouped by the goal the user picked); permissions requested after utility; account creation after value ("Continue as guest").

### A3. Patterns to adopt (and avoid)

1. One decision per screen, manual Continue for multi-select, auto-advance for single-select (Headspace, Runna). Forms are acceptable only for the final editable summary.
2. Segmented progress bar labeled by section (About you / Your week / Your setup / Your goal) rather than "3 of 18", because the count may branch (no team -> skip team days) [3].
3. Goal first [4][5], demographics only when they drive the plan [36], constraints in the middle, commitment/motivation near the end, summary last.
4. Reason line under each question ("We use this to...") as in Calm [25]; it is the cheapest way to make a long quiz feel justified [2].
5. Notification pre-prompt with a mock notification before the OS dialog (Runna screen 11) [8].
6. Summary card before generation (Runna screens 17-18), editable inline.
7. Loader: two short screens with named steps and a progress bar (Runna), honest duration (real generation time + ~1s minimum per step so text is readable), contextual social proof slot (Glow/Lose It show star ratings on this screen) [6]. Avoid faking 10+ seconds; 9 of 751 apps use this and the research recommends A/B testing it [6].
8. Reveal before the gate (Fitbod, Duolingo): show the plan, let the player open Session 1, then ask for an account to save it.
9. Answer-tied reassurance at most twice (after goal, after weak-foot/injury) [34]. Do not fabricate "you're in the top X%" claims; only show percentile/comparison copy if it is computed from real data (trend guidance: "derive dynamic claims from current product state" [16]).
10. Avoid: redundant confirmation screens (Headspace critique), paywall before value, asking for data you already have (Garmin critique [37]), questions that do not change the plan.

### A4. Soccer-specific inputs a coach actually needs

| Input | Why it matters | How it changes the plan |
|---|---|---|
| Position (GK, CB, FB/WB, CDM, CM, CAM, Winger, ST, unsure) | Technical priorities differ (CB: long passing, aerial control, 1v1 defending; Winger: 1v1, crossing; ST: finishing, hold-up touch) | Weights drill categories; swaps position-specific variants (e.g., FB crossing instead of ST volleys) |
| Dominant foot + weak-foot confidence (1-5) | Weak foot is a top player goal; needs explicit per-foot dosing | Sets per-foot rep splits (e.g., 60/40 weak-foot bias when goal = weak foot); picks mirrored drills |
| Age band (U12, 12-14, 15-17, 18-22, 23-34, 35+) | Load rules, plyometric/strength appropriateness, session length, consent | Caps session length (U12: 20-30 min), limits high-impact speed work, triggers guardian flow under 13 |
| Experience/level (new, school/rec, club/travel, academy/HP, adult returning) | Drill difficulty seed and progression speed | Starting difficulty 1-2 vs 3-4; faster progression for academy |
| Days per week available for solo work (2-6) and which days | Core scheduling constraint | Determines session count and spacing |
| Minutes per session (20/30/45/60/75+) | Block budgeting | Number of blocks and drills per session |
| Equipment (ball, wall/rebounder, cones, goal, ladder/hurdles, mannequins/poles, partner sometimes) | Drill eligibility | Hard filter on drill pool; wall unlocks passing/first-touch solo work; goal unlocks finishing |
| Space (backyard ~5x5 m, park ~20x20 m+, full pitch with goal, indoor/hard, varies) | Drill eligibility and sprint distances | Filters drills by min space; scales sprint distances |
| Goals (first touch, passing, dribbling/1v1, shooting, speed, fitness, weak foot, overall) | Primary driver of plan composition | Primary goal gets ~40% of technical time, secondary ~25% |
| Injury history / current niggles (area, cleared?) | Safety; avoid aggravation | Excludes high-risk drills (e.g., no max sprints with hamstring niggle), adds prehab block |
| Season phase (off, pre, in-season, no team) | Load philosophy | Off-season: volume + fitness; pre-season: speed/fitness ramp; in-season: short technical top-ups, low volume |
| Team training days and match days | Overload prevention | Marks fixed events; blocks heavy solo sessions day before match; caps consecutive days at 3; ensures 2 days off football per week [38][39] |
| Current fitness self-rating (1-5) and "can you run 5 min continuously?" | Seeds fitness drill intensity | Chooses tempo vs interval starting point |
| Motivation / driver (make the team, starting spot, next level, beat friends, enjoyment, get back in shape) | Coach tone and reminders | Copy voice; reminder framing; optional streak goals |
| Plan length (4/6/8 weeks) and start date | Block design | Deload placement (week 4 of 6 or weeks 4 and 7 of 8) |
| Preferred training time of day | Reminders | Notification scheduling |
| Baseline test opt-in (juggling count, wall-pass count in 60 s, 20 m sprint if measurable) | Progress tracking | Creates week-1 and final-week test sessions (Techne pattern [40]) |

Load rules to encode from the literature: at least 24 h between football sessions where possible; no more than 3 training days in a row; 2 days off structured football per 7 days, one of them complete rest; reduce volume in exam periods [38]. No long or heavy session with less than 48 h to the next match; day-before-match sessions short and light [39]. Academy U17/U19 train 5x/week, younger groups 4x, with marked day-to-day load fluctuation [41].

### A5. Proposed xTrain intake flow

Design rules: one question per screen; segmented progress bar with 4 labeled sections; single-select auto-advances after 250 ms; multi-select shows Continue; every screen has a one-line "why we ask"; back always available; total 17 screens plus loader and reveal; target under 3 minutes.

**Section 1: About you**

0. Welcome
- Headline: "A training plan built around your week."
- Sub: "Answer a few questions. Your coach builds a plan you can move, swap, and change any time. About 2 minutes."
- CTA: "Build my plan" / small link "I already have an account"

1. Name
- "What should your coach call you?" [text]
- Why: "We'll use it in your sessions and coach notes."

2. Primary goal (pick up to 2, first pick becomes primary)
- "What do you most want to improve in the next few weeks?"
- Options: First touch · Passing · Dribbling & 1v1 · Shooting & finishing · Speed & agility · Fitness & stamina · Weak foot · Overall sharpness
- Why: "Your top pick gets the biggest share of your training time."

2b. Reassurance interstitial (auto, 1 screen, tied to goal)
- e.g., Weak foot: "Good pick. Weak-foot work responds fast because every rep is new to that foot. We'll put weak-foot reps into every technical session, not just one drill."
- e.g., Shooting: "We'll build finishing in three layers: technique with a dead ball, then touch-and-finish, then finishing under fatigue."
- CTA: "Keep going"

3. Position
- "Where do you usually play?"
- Options: Goalkeeper · Centre back · Full back / wing back · Defensive mid · Central mid · Attacking mid · Winger · Striker · Not sure / anywhere
- Why: "Position changes which drills we prioritise."

4. Feet
- "Which is your stronger foot?" Left · Right · Both equally
- Slider: "How confident is your weaker foot?" 1 (avoid it) to 5 (no difference)
- Why: "We dose reps per foot from this."

5. Age band
- "How old are you?" Under 12 · 12-14 · 15-17 · 18-22 · 23-34 · 35+
- Why: "Keeps sessions and sprint work safe for your age."
- Under 13 branches to a guardian consent step at account creation.

6. Level
- "What best describes your current level?"
- Options: Just starting out · School or rec league · Club / travel team · Academy or high-performance · Adult player getting back into it
- Why: "Sets your starting difficulty. Pick where you are now, not where you want to be."

**Section 2: Your week**

7. Season phase
- "Where are you in the season?" Off-season · Pre-season · In-season (games most weeks) · No team right now
- Why: "In-season plans are shorter and lighter; off-season builds volume."

8. Team schedule (skipped if "No team")
- "When does your team train or play?" Weekly 7-day row; tap a day to cycle: none -> Training -> Match
- Why: "We never put a hard solo session right before a match or stack too many days in a row."

9. Solo days
- "How many days a week can you train on your own?" 2 · 3 · 4 · 5 · 6
- Then: "Which days work best?" tap days; team days show a small badge; picking a match day prompts "Light recovery only on match days, ok?"
- Why: "You can always move sessions later."

10. Session length
- "How long per session?" 20 min · 30 min · 45 min · 60 min · 75+ min
- Why: "We fit blocks to this, not the other way round."

**Section 3: Your setup**

11. Space
- "Where will you usually train?" Backyard / small space (about 5x5 m) · Park or open grass · Full pitch with a goal · Indoor or hard surface · It varies
- Why: "Filters out drills that need more room than you have."

12. Equipment (multi-select, Ball pre-checked)
- "What do you have access to?" Ball · Wall or rebounder · Cones or markers · A goal (any size) · Agility ladder or mini hurdles · Mannequins or poles · A partner sometimes · Just a ball
- Why: "Most sessions only need a ball and a wall. We plan with what you've got."

13. Body check
- "Anything we should work around?" I'm fully fit · I'm managing a niggle right now · I had an injury in the last 12 months
- If not fully fit: body-area chips (Ankle · Knee · Hamstring · Groin / hip · Calf · Back · Other) + toggle "Cleared by a physio or doctor to train fully?"
- Why: "We'll avoid drills that stress that area and add prehab."
- Reassurance line after answer: "Noted. Sessions will skip max sprints for the first two weeks and include a 5-minute activation block."

14. Fitness check
- "How's your match fitness right now?" slider 1 (gassed early) to 5 (last 10 minutes are my best)
- Toggle: "I can jog 5 minutes without stopping"
- Why: "Sets your starting point for fitness blocks."

**Section 4: Your plan**

15. Driver
- "What's driving you this season?" Make the team · Win a starting spot · Play at the next level · Beat my mates · Enjoy the game more · Get back in shape
- Why: "Your coach will talk to you with this in mind."

16. Plan length, start, baseline
- "How long should this block be?" 4 weeks · 6 weeks (recommended) · 8 weeks
- "Start" Today · Tomorrow · Pick a date
- Toggle: "Add a 10-minute baseline test in week 1 (juggles, wall passes, 20 m sprint) so you can see progress" (default on)
- Checkbox-free time pick: "When do you usually train?" Morning · After school/work · Evening (used for reminders; OS permission requested later, after a mock preview)

17. Summary card (editable rows)
- "Here's what we're building for you, [Name]"
- Rows: Goal (First touch, then Shooting) · Position (Winger) · Stronger foot (Right, weak foot 2/5) · Level (Club) · In-season, team Tue/Thu, match Sat · Solo days Mon/Wed/Sun, 45 min · Park, ball + wall + cones · Managing: none · 6 weeks from Mon 6 Oct
- CTA: "Generate my plan"

**Loader** (real generation; show steps as they complete, minimum 900 ms each, no step shown as done before it is)
- Title: "Building your plan"
- Steps: Reading your week ✓ · Blocking out team days and match days ✓ · Picking drills for a park with a wall ✓ · Balancing load across 6 weeks ✓ · Writing your coach notes ✓
- Side panel: one contextual proof element when available (rating badge or a testimonial filtered by the player's goal, per the "contextual proof" trend [35]).
- If generation exceeds 10 s, rotate one coaching tip related to the primary goal.

**Reveal**
- Headline: "Your 6-week plan, [Name]"
- Coach note (3 bullets derived from answers): "First touch gets 40% of your technical time. Weak-foot reps are built into every session. Sundays are light because Saturday is match day."
- Focus split chart (small) + weekly rhythm strip (Mon technical 45 · Tue team · Wed technical+speed 45 · Thu team · Fri off · Sat match · Sun recovery touch 25).
- Session 1 preview card: title, duration, blocks, equipment, "Start Session 1" CTA.
- Secondary: "Adjust plan" (opens plan page) and "Looks wrong? Change an answer" (returns to summary).
- Then account creation to save: Apple / Google / email, with "Continue as guest for today" allowed (plan cached locally; nudge to save after Session 1). Notification permission requested after Session 1 completes, with a mock preview first.

Conversion mechanics retained: answer-tied reassurance (2 max), commitment question (driver), visible personalization at reveal (chart + coach note tie answers to output), contextual proof on loader, value before gate. Mechanics rejected: fake percentile claims, pre-value paywall, long slider batteries.

---

## B. Editable training plan / calendar UX

### B1. Reference captures

**TrainingPeaks** [42][43][44][45]
- Move by drag-and-drop; copy-paste; "shift by" a date range; hold C + drag to duplicate; A+click opens analysis; E+click opens the structured builder; right-click context menus on cards, days, and weeks.
- Week Controls (three dots at the end of each week): cut, paste, hide, lock, shift, delete whole weeks. Coaches build a base week and replicate forward.
- "There's no undo yet" (coach blog) [43]: a notable gap users feel.
- Dual Calendar: two calendars side by side to drag between athletes or from a plan into an athlete.
- Compliance colors on the card: green = completed within +/-20% of planned; yellow = 50-79% or 121-150%; orange = more than 50% off; red = not completed; grey = unplanned. Priority metric (duration/distance/TSS) configurable; mobile shows the color as a strip on the left of the card [44][45].
- Subjective feedback after a workout: "How did it go?" and "How did you feel?" with five face icons from strong to weak; RPE on 0-10 Borg scale [46].

**Runna** [22][23][47][48][49]
- Calendar tab: drag and drop a workout to a new day, tap Save; smartwatch re-sync needed after.
- Constraints: a workout can move only within the same week or one week forward/back ("to protect your plan structure and training progression"); cannot drop onto a day that already has a planned run; no batch moves or week swaps.
- Warning shown "if a change could impact your training", but the user may proceed.
- Undo = drag it back and save.
- Permanent changes live in Plan -> Manage Plan -> Running Schedule (available days, runs per week, long-run day). Separation of "temporary move" from "change my schedule" is explicit.
- Extra runs: Instant Workouts / Free Runs do not count toward the plan; advice to match effort when substituting a club run for a planned run ("keeps your overall running load balanced") and to link the activity back to the planned workout.
- Holiday mode: 3-21 days; options "All workouts", "Easy and long runs", "Easy and speed runs", "Easy runs only", "I am not planning on running"; toggle to remove non-running workouts; app rearranges deload weeks and mileage progression inside the existing end date; shows impact on race time/mileage before confirming; push notification when the holiday ends [48].
- "Not feeling 100%": Plan -> Manage Plan -> Adapt Your Plan. Reasons: illness, aches, busy schedule, needing it easier. Duration 3-14 days, can be scheduled ahead or backdated up to 7 days. Four levels: Reduced Difficulty (all run types, lower intensity), Easy & Long Runs Only (pace targets removed, mileage slightly reduced), Short Easy Runs Only, No Running. Return ramps: Slowly / Balanced / Quickly. Push reminder the day before it ends; warning if a B-race overlaps [49].
- Heat/humidity adaptation of a session automatically [50].

**Final Surge** [51][52]
- Drag to move, Shift+drag to copy, drag from library to add. Shift an entire applied plan's dates from Plan History.

**Intervals.icu** [53]
- Plan builder is week-based with unlimited weeks; drag workouts from library into the plan; nest plans; drag onto an athlete calendar on any day (plan starts from that day); "Apply changes" pushes updates to all linked athletes, future workouts only.

**Fitbod** [20][21][54]
- Swipe left -> Replace; Swap Menu consolidates replace/reorder/sets adjustments; changing muscle groups regenerates the workout.
- Edits made before "Start Workout" are not persisted: any refresh trigger (recovery change, equipment change, profile change) wipes them. After Start, the workout is locked. Lesson: user edits must be pinned explicitly or they get lost, and the app must explain refreshes ("Why did my workout change?" is a support article because users were confused).
- Muscle freshness body map explains the day's selection.

**Freeletics** [55][56][57]
- "Adapt session" on any Coach session: Time (max minutes, Coach trims), Equipment (remove), Space, Runs (exclude), Noise (removes jumps across warm-up, main, cooldown), Body areas (exclude up to two), Difficulty, and "generate a different session". Fewer options for weights/running sessions.
- Post-workout feedback per exercise on a five-point scale from "Too easy" to "Too hard"; used to decide whether to scale back or push next time [57].
- Journeys begin with an assessment week.

**Garmin Coach** [37][58][59]
- Setup: race date, current fitness, runs per week (criticized for asking what Garmin already knows).
- Missed/skipped workouts cannot be rescheduled; the plan adapts forward automatically; several skips prompt "pause plan?".
- Adapts up on good benchmark runs, down on misses/slow paces/fatigue. Criticisms: rest days get replaced by recovery runs over time; recovery metrics (HRV, Body Battery) run in parallel, not integrated; no explanation or check-in about why a workout was missed.

**Apple Fitness+ Custom Plans** [60][61]
- Builder: tap days, total duration, plan length, up to 5 activity types; "Stay Consistent" auto-plan from history and preferences. No AI re-planning on misses; it is a scheduler.

**Strava** [62][63]
- Strava acquired Runna (Apr 2025); apps remain separate; integrations arriving (race database, strength overhaul). Strava's own legacy plans were static. Treat Strava as a logging/social layer, Runna as the coach.

**Athletica** [64]
- AI adjusts after deleted, moved, or completed sessions; changed workouts show arrows up/down with a % and a reason string (e.g., "Increase in training load to ensure progressive overload"). Settings: adjust "As needed" vs "Daily"; ability to protect specific sessions from AI changes.
- User complaints: after illness, no visible modifications the following week; AI chat could not explain adjustments. Lesson: show a change log even when the answer is "no change, because...".

**Humango / TriDot** [65]
- Humango: plan updates automatically on missed sessions, travel, fatigue. TriDot does not claim a specific per-event response. The simple model: a plan carries assumptions about load capacity per day/week/mesocycle and ramp rate; adjustments keep those within bounds.

**Hevy routine builder** [32][66]
- Drag-and-drop reorder of exercises and routines into folders; supersets/giant sets via three-dot menu; per-exercise rest timers; auto-start rest timer on set completion with +/-15 s; background notification shows next set and live timer.

**Google Calendar (Android)** [67]
- Long-press and drag an event; card expands for precision; toast at the bottom with Undo after a move.

**Linear cycles** [68]
- Unfinished issues roll automatically into the next cycle; no manual housekeeping; what's unfinished stays visible. Analog for xTrain: a skipped session's key drill can roll into the next session of the same focus rather than the whole session being rescheduled.

**Notion Calendar / Trello (PK)**
- Notion Calendar: drag to move, drag edges to resize duration, overlay multiple calendars (analog: team calendar overlay on top of the solo plan).
- Trello: columns as days, cards as sessions, optimistic drop with placeholder, card badges for labels/duration. A week-as-Kanban view maps cleanly to mobile portrait (horizontal day columns) and desktop (7 columns).

**McMillan Running** [69]
- Explicit "adjust for your life schedule" docs: drag-and-drop around work/family and adjust intensity on perceived fatigue; the explanatory tone (why hard days need spacing) is the part to copy.

### B2. Patterns extracted

| Dimension | What the references do | What to take |
|---|---|---|
| Views | Endurance tools: week rows in a month grid, customizable card fields; Runna/Garmin: week list with "this week" first; Hevy: routine list | Week view default (7 columns desktop, horizontal day strip + list mobile); month view for overview and deloads; day/session detail sheet |
| Moving | Drag-and-drop everywhere on desktop; Runna constrains to +/-1 week and no double-booking; TP has shift-by and week controls | Drag within +/-1 week; "Move" action sheet on mobile; week controls (shift week, swap two weeks, lock week); no silent drops onto team/match days |
| Swap/regenerate | Fitbod Replace + regenerate on constraint change; Freeletics Adapt menu with reasons; Runna link activity | Per-session "Adapt" with reason chips (less time, no wall, no goal, too hard, too easy, different focus, quieter/indoor) and "Swap for alternative" showing 3 candidates |
| Color/load | TP compliance colors (green/yellow/orange/red/grey); Athletica arrows + %; Fitbod muscle map | Two color channels: intensity (planned, 1-5 as tint) and status (done/partial/missed/moved as left strip, TP mobile pattern); week load bar vs target |
| Rest days | Garmin criticized for erasing rest; FA guidance 2 days off | Rest days are first-class cards ("Off" / "Recovery touch 15 min"), AI may not fill them without asking |
| Conflicts | Runna warns but allows; FA/sports-science rules | Warn-and-allow with options; hard block only for under-age load caps |
| Undo | Google Calendar toast; Runna drag back; TP none | Toast undo (8 s) on every move/swap/skip + version history per week ("Restore Monday's version") |
| AI re-plan | Garmin forward-only auto-adapt; Athletica reason strings + protect; Runna Not-feeling-100% + Holiday; Fitbod refresh wipes edits | Forward-only, preview-then-apply for multi-session changes, protect/lock, explicit change log with reasons, user edits are sticky |
| Explanation | Athletica reason string; Fitbod body map; Runna shows impact before confirming | One-line coach note on every AI-changed session + "What changed this week" feed + impact preview before confirming |
| Mobile vs desktop | TP mobile strips color; Google long-press drag; Runna mobile-first with Save button | Desktop: drag, hover previews, keyboard (M to move, S to swap, Z undo). Mobile: tap -> action sheet, long-press drag with haptics, sticky Save/Undo bar |

### B3. Proposed xTrain plan page

**Data model**

```
Plan
  id, player_id, created_at, version
  horizon_weeks (4|6|8), start_date, season_phase
  goals { primary, secondary }, constraints (snapshot of intake + edits)
  fixed_events[]            # team training, matches, holidays, dial-backs
  weeks[]                   # ordered
  change_log[]              # every AI/user edit with reason, before/after refs
  rationale                 # generation-time coach note

Week
  index, start_date, theme ("Weak-foot foundations"), deload: bool
  target_load (sum of session.load), actual_load
  sessions[]                # one per day max; rest days are sessions of type rest
  status (upcoming|current|past), locked: bool

Session
  id, date, type (technical|physical|mixed|recovery|rest|test)
  title, focus_tags[], duration_min, intensity (1-5), load (= duration x intensity factor)
  blocks[]
  status (planned|in_progress|done|partial|skipped|moved)
  origin (ai|user_created|user_swapped|ai_replanned)
  locked: bool              # AI may not touch
  coach_note                # why this session, what changed
  completion { started_at, ended_at, srpe (1-10), feel (1-5), difficulty_felt (too_easy|right|too_hard), notes, drills_done[] }
  history[]                 # previous versions for undo

Block
  id, kind (activation|technical|main|conditioning|cooldown), duration_min, order
  drill_instances[]

DrillInstance
  drill_id, order, dose_override { sets, reps, work_s, rest_s, per_foot_split }
  equipment_subs { wall -> rebounder }, status, result { reps_completed, score }

FixedEvent
  id, kind (team_training|match|holiday|dial_back|unavailable), date or range
  load_estimate (team_training = 3, match = 5), notes
```

**Views**
- Week (default): 7 day columns on desktop; on mobile a horizontal day strip (Mon-Sun with dots for status) above a vertical list of that week's sessions. Fixed events render as muted cards in the same column. Week header: theme, load bar (actual/target), "Rebalance week" button when drift > 15%.
- Month: compact grid, one chip per day colored by intensity tint, deload weeks hatched, team/match icons. Click a week to jump.
- Session sheet: blocks with drills, dose per foot, equipment, space, "Adapt", "Swap", "Move", "Lock", "Skip", "Start".
- Change feed ("Coach updates"): chronological list of AI changes with reasons and a Revert link, including "No changes needed" entries after you skip or move something.

**Interactions and what the AI does on each edit**

1. Move a session (drag on desktop; tap -> Move -> day picker on mobile)
   - Allowed targets: any day within the same week or the adjacent weeks. Drop zones highlight green (clean), amber (warning), red (blocked).
   - Clean move: apply instantly, toast "Moved to Thursday. Undo", recompute week load bars. AI does not touch anything else.
   - Warning cases (amber): day before a match; day after a match for intensity >=4; 4th consecutive football day; two intensity >=4 sessions back-to-back; week total above target by >15%. Sheet: "Thursday is the day before your match. Options: Move anyway · Move and make it light (25 min, intensity 2) · Pick another day". Choosing "make it light" creates an AI variant and a coach note ("Shortened to 25 min because Saturday is match day").
   - Blocked (red): age-band daily caps (e.g., U12 second session in one day); dropping onto a day that already has a planned session (offer "Swap places with Monday's session" instead, the Runna rule made friendlier).
   - Across week boundary: the AI proposes a rebalance preview for both weeks ("Week 2 now has 4 sessions. Suggest: make Sunday a 20-min recovery touch. Apply / Keep as is"). Never auto-applies multi-session changes.

2. Swap a session ("Give me something else")
   - Offers 3 alternates of equal focus and load (+/-10%) that fit the same equipment/space; shows diff chips ("Same focus · 5 min shorter · needs a wall"). Original restorable from history.

3. Adapt a session (Freeletics pattern)
   - Chips: Less time (choose minutes) · No wall today · No goal today · Small space · Indoor/quiet · Too easy · Too hard · Different focus · Partner available.
   - AI regenerates only that session's blocks, keeps the slot and load class, writes a coach note ("Replaced wall passing with self-toss aerial control because you have no wall today").

4. Skip or miss
   - Marking skipped (or the day passing) never auto-reschedules the whole session (Garmin). Instead: "Carry the key drill (Weak-foot wall passing, 6 min) into Wednesday? Yes / Let it go". Two skips in one week pause progression for that focus (next same-focus session repeats difficulty rather than progressing). Three consecutive weeks of <50% completion triggers a "Make the plan easier?" prompt offering fewer days or shorter sessions (Garmin's pause prompt, friendlier).

5. Complete with rating (see C3)
   - sRPE >= 9 or "too hard" on the same focus twice in a row -> next session of that focus regresses one difficulty step; "too easy" twice -> progress. Each change appears in the feed with the reason.

6. Dial back ("Not feeling 100%")
   - Reasons: sick, niggle (area), busy week, tired. Duration 3-14 days. Levels: Keep everything but easier · Technical only, no sprints · Short touch sessions only · Full rest. Return ramp: gentle/normal/quick. Preview shows which sessions change before confirming; reminder the day before it ends.

7. Holiday / away
   - 3-21 days; options: ball-only sessions, bodyweight + ball, nothing. Plan keeps its end date; deload week relocates if it falls inside the holiday; preview impact.

8. Change constraints (Settings -> Training setup: days, minutes, equipment, space, team schedule, season phase)
   - Re-plan from tomorrow forward only; past and locked sessions untouched; show a before/after week comparison; Apply or Cancel. (Intervals.icu: future only; Fitbod: explain refreshes.)

9. Add a fixed event (extra team session, tournament, exam week)
   - Added as FixedEvent with load estimate; AI runs a conflict check and proposes changes for the affected week only.

10. Lock / protect
    - Any session or week can be locked; AI changes skip it and the feed says so ("Week 3 locked, left unchanged").

11. Week controls (desktop three-dot, mobile long-press on week header)
    - Shift week by N days, swap two weeks (allowed only if neither contains a completed session), mark as deload, regenerate week with reason, copy a session to another day.

12. Undo and history
    - Toast undo (8 s) for every single-step edit; session history with "Restore"; "What changed this week" feed with Revert per AI change. Never a destructive change without a path back (addresses TrainingPeaks' missing undo).

**How edits are explained**
- Every AI-touched session carries a one-sentence coach note starting with the cause: "Because you moved Monday to Tuesday, Wednesday is now 30 min and lighter." Mirrors Athletica's reason strings but written in second person.
- Multi-session changes are shown as a preview diff (changed cards highlighted, old vs new duration/intensity chips) with Apply / Keep mine. Mirrors Runna's "shows impact before confirming".
- Weekly digest Sunday evening: what you did, what changed, what next week's theme is.

**Mobile vs desktop**
- Desktop: drag-and-drop, hover to preview session contents, keyboard shortcuts (M move, S swap, A adapt, L lock, Cmd/Ctrl+Z undo), right-click context menu, side panel for session detail.
- Mobile: tap card -> bottom sheet with actions; long-press to pick up and drag along the day strip with haptics; sticky bottom bar with Undo after edits; swipe left on a card for Skip/Move quick actions; Save not required (optimistic, undoable).

---

## C. Drill library and session player

### C1. Reference captures

**Techne Futbol** [40][70][71]
- Weekly curated technical sessions plus a library of hundreds of drills across ball mastery, dribbling, juggling, wall work, passing, shooting.
- Each session lists ~30 drills with demo video and written description; many have difficulty-adjustment options for progression; every drill runs on a timer (typically 1 minute) and training time accrues to a leaderboard.
- One-minute technical tests for progress tracking.
- Reviews praise variety and clean interface; motivation via leaderboards.

**DribbleUp** [72][73]
- Smart ball + phone camera tracks touches; 2,000+ drills and live classes; dashboard of speed, accuracy, consistency per session. Cons: no shooting or passing, occasional bugs. Pattern: objective rep counting is a big motivator, but only for ball-mastery; xTrain can approximate with self-count prompts and timed tests.

**Nike Training Club** [74][75][76]
- Spoken summary of what's ahead, then a large on-screen countdown; voice cues at key moments (tips, time remaining); Apple Watch shows time/reps remaining with a haptic at the start of the next drill; playback speed and picture-in-picture controls. Critique: on-screen reps/time sometimes hard to read, audio controls finicky.

**Peloton** [77][78][79]
- Filters: class type, length (multi), instructor (multi), music genre, difficulty, language, subtitles, bookmarked, taken/not taken; sort by new/trending/popular/top rated/easiest/hardest; web "body activity" filter with multi-select muscle groups. Class detail tabs: Overview, Equipment, Class plan (moved ahead of Music), Music; strength class plan shows three focus areas at the top. Critique: some collections only sort alphabetically; no "exclude instructor".

**Freeletics exercise library** [80]
- Users complain they cannot search and must scroll the whole list; requests for equipment and muscle-group filters. Pattern to avoid.

**Hevy / Strong logging player** [32][66]
- One-screen session: sets, reps, rest timer, notes; auto rest timer on set completion, adjustable +/-15 s; background notification with next set and live timer. Strong: fill weight/reps, auto rest timer, visually clean (PK).

**Hudl** [81]
- Video review with data and notes per clip, highlight reels, athlete profiles for recruiting. Not a drill library; relevant as a later "record your rep" feature.

**YouTube / creator formats** [82][83][84]
- Become Elite (Matt Sheldon): sessions planned the night before around perceived weaknesses (crossing, driven passes, first touch, attacking dribbling); builds a personal drill database by saving drills from YouTube/Instagram; flexible on-site adjustment.
- Beast Mode Soccer+: 70+ videos categorized footwork, passing, finishing, first touch, dribbling; each session broken into warm-up, juggling, footwork, then topic drills.
- 7mlc, Unisport, AllAttack: skill tutorials with high production; AllAttack breaks down skills used by top players. Fetches of their sites returned no structured text; the common video format (PK) is: intro + why it matters, setup shot from above, slow-motion demo, 2-3 key cues, common mistake, progression, "do X reps each foot".

**Drill description formats (coaching sites)** [85][86][87]
- Renderfoot: Name, Setup (cones, distances), Players, Instructions, Coaching points, Progressions, Reps/duration. Example: Cone Slalom, "5-6 cones in a line, about 1.5 yards apart", cues both feet / one touch per step / head up, progressions inside-only -> outside-only -> alternate -> timed, "5-6 runs per player".
- easy2coach: Duration (25 min), Age group (U14-U19), Number of players, Training set (main point), Exercise level, Location (pitch), Timing (season preparation), Setup, Procedure ("3 rounds = 1 set... 3-5 sets"), Training attributes, Form of training (individual/group/team).
- Sportsessionplanner: diagram + coaching-point bubbles ("Good first touch", "Head up"), reps as runs per player or 60-90 s intervals, progressions two-touch -> one-touch -> change direction on call -> second ball.

**Completion and rating flows** [46][57][88]
- TrainingPeaks: "How did it go?" + "How did you feel?" (five faces strong -> weak) + RPE 0-10 + notes.
- Volt Athletics: session RPE 1-10 + enjoyment on a 4-point scale from "Hated it" to "Loved it!".
- Freeletics: per-exercise 5-point "Too easy" -> "Too hard".
- Fitbod: confetti on completion (noted as generic) [9].

### C2. Patterns to adopt

Filter taxonomy (multi-select chips, counts shown, "clear all"): Category · Sub-skill · Difficulty (1-5) · Duration (<5, 5-10, 10-15, 15+) · Equipment (ball only, wall, cones, goal, ladder, poles, partner) · Space (small, medium, large) · Foot focus (weak-foot friendly) · Position bias · Intensity (low/med/high) · Status (done before, saved, in my plan) · Sort (recommended for you, newest, easiest, hardest, most done).

Card: thumbnail/loop, name, category chip, difficulty dots, duration, equipment icons, space icon, "weak-foot" badge, saved heart, "in plan Wed" tag.

Detail page sections (Peloton tab order adapted): Overview (what it trains, who it is for, intensity) · Setup (diagram + dimensions + equipment, substitutions) · How to do it (steps, dose per foot) · Coaching cues (3) · Common mistakes · Make it easier / harder · Video (demo + slow-mo) · Your history (best score, last done) · Add to session / Start now.

Session player: pre-session summary (spoken optional) with blocks and total time; per-drill screen with large timer or rep counter, foot indicator (L/R), cue card (one cue at a time, rotates every 20 s), next-up strip, rest countdown with "+15 s / skip", audio cues at 10 s and 3-2-1, haptics where available, PiP demo video, lock-screen/background notification with timer and next drill (Hevy), pause/skip/swap-this-drill, "log result" for scored drills.

Completion: auto-summary (time, drills done, best scores) -> two taps (sRPE 1-10 slider, feel faces) -> optional "too easy / about right / too hard" per block (not per drill, to keep it fast) -> optional note/voice note -> coach reaction line ("RPE 8 on a technical day; I'll keep Wednesday's volume and add 5 min of recovery touch") -> streak/weekly completion ring.

### C3. Proposed drill schema

```json
{
  "id": "drl_wall_pass_rhythm",
  "slug": "wall-pass-rhythm",
  "name": "Wall Pass Rhythm",
  "category": "passing",
  "subskills": ["inside_foot_pass", "two_touch", "weak_foot"],
  "position_bias": ["CM", "CDM", "CB"],
  "difficulty": 1,
  "intensity": 2,
  "impact": "low",
  "duration_min_default": 6,
  "dose": {
    "mode": "time",
    "sets": 3,
    "work_s": 60,
    "rest_s": 30,
    "per_foot": "alternate_sets",
    "target_metric": "passes_completed"
  },
  "equipment_required": ["ball", "wall"],
  "equipment_optional": ["cones"],
  "equipment_substitutions": {"wall": ["rebounder", "partner"]},
  "space_min": {"length_m": 6, "width_m": 3, "surface": ["grass", "hard"]},
  "solo": true,
  "partner_variant_id": null,
  "setup": {
    "text": "Stand 4-5 m from a wall. Place one cone where you stand.",
    "diagram": {"wall": true, "cones": [[0, 0]], "player": [0, 4.5], "scale_m": 1}
  },
  "steps": [
    "Pass with the inside of the foot against the wall.",
    "Control the return with one touch out of your feet, pass with the second.",
    "Alternate feet each set."
  ],
  "coaching_cues": ["Lock the ankle, toe up, strike through the middle", "First touch out of your feet, not under them", "Head up before the ball arrives"],
  "common_mistakes": ["Toe pointed down so the ball lifts", "Standing still and stabbing at the ball"],
  "progressions": ["One touch only"],
  "regressions": ["Move to 3 m and allow three touches"],
  "season_phase_fit": ["off", "pre", "in"],
  "age_min": 8,
  "injury_flags": [],
  "media": {"video": "...", "slowmo": "...", "thumbnail": "..."},
  "benchmarks": {"beginner": 25, "club": 35, "academy": 45},
  "tags": ["warm_up_ok", "quiet"]
}
```

Session-generation rules reading this schema: filter by equipment_required ⊆ player.equipment (with substitutions), space_min ≤ player.space, difficulty within [level-1, level+1], injury_flags ∩ player.flags = ∅, age_min ≤ age; then fill blocks to duration budget with the primary goal weighted 40%, secondary 25%, maintenance 20%, physical 15% (in-season: physical drops to 5% and sessions cap at 45 min).

### C4. 24 example drills (solo-friendly)

Format: Name · Category · Difficulty (1-5) · Duration · Equipment · Space · Dose · 3 cues · Progression.

**Passing**

1. Wall Pass Rhythm · passing · 1 · 6 min · ball, wall (or rebounder) · 6x3 m · 3 x 60 s two-touch, 30 s rest, alternate feet each set, count completed passes
   - Cues: lock the ankle and keep the toe up; first touch out of your feet, second touch is the pass; head up as the ball comes back
   - Progression: one-touch only for the final set

2. Weak-Foot Wall Ladder · passing · 2 · 8 min · ball, wall, 3 cones · 8x3 m · cones at 3, 5, 7 m; 10 passes weak foot from each distance, 2 rounds, 30 s rest between distances
   - Cues: open the hips so the plant foot points at the wall; strike through the centre of the ball; same weight every pass, let the distance do the work
   - Progression: receive with the weak foot too (weak-weak), then one-touch at 3 m

3. Driven Pass to Gate · passing · 3 · 10 min · ball, 4 cones (goal optional) · 25x10 m · 2 m cone gate 20 m away; 8 driven passes each foot x 2 sets, retrieve and jog back as rest
   - Cues: plant foot beside the ball pointing at the gate; laces through the ball, ankle locked, lean slightly over it; follow through low to keep it driven, not lofted
   - Progression: two-touch from a self-pass, then from a wall rebound, then 30 m

4. Pass, Sprint, Receive Triangle · passing · 3 · 8 min · ball, wall, 2 cones · 10x6 m · pass to wall, sprint around a cone 3 m away, receive and pass again; 6 reps x 3 sets, 45 s rest
   - Cues: pass firm enough to arrive after your run; open your body on the way back so you can see wall and space; receive across your body with the back foot
   - Progression: call out the next cone before the pass arrives (reaction), then one-touch returns

**First touch**

5. Cushion and Set · first touch · 1 · 6 min · ball, wall, 2 cones · 6x3 m · pass firmly to wall, cushion the return into a 1 m cone gate beside you, 10 per side x 3 sets
   - Cues: meet the ball, don't wait for it; soften the ankle on contact and withdraw the foot slightly; push the touch into space you can step into
   - Progression: harder pass, then alternate inside and outside of the foot

6. Directional Touch Gates · first touch · 2 · 8 min · ball, wall, 4 cones · 8x6 m · two 1 m gates left and right at 2 m; receive from wall, touch through a gate, pass back from there; 12 reps x 3 sets, call the gate before the touch
   - Cues: first touch takes you away from where pressure would come; use the far foot to take the ball across your body; eyes up as the ball travels
   - Progression: random cue (coin flip or app beep) decides the gate after the pass leaves your foot

7. Self-Toss Aerial Control · first touch · 2 · 7 min · ball · 5x5 m · toss 3 m above head, control with thigh, then instep, then chest; settle in two touches; 8 per surface x 2 sets
   - Cues: get under the ball early and let it drop onto the surface; relax and withdraw on contact; second touch kills it dead
   - Progression: toss higher, control and pass to a wall in one movement, then weak-foot instep only

8. Wall Volley Control · first touch · 4 · 8 min · ball, wall · 8x4 m · strike a bouncing ball hard into the wall, control the fast return within two touches inside a 2 m square; 10 reps x 3 sets, 45 s rest
   - Cues: read the bounce early and adjust feet before the ball arrives; cushion with the surface that faces the ball; second touch sets up the next strike
   - Progression: control with weak foot only, then one-touch volley returns for 20 s bursts

**Dribbling**

9. Cone Slalom Close Control · dribbling · 1 · 6 min · ball, 6 cones · 10x2 m · cones 1.5 m apart; 6 runs down and back, inside-outside of the same foot, 20 s rest
   - Cues: one touch per step; ball never more than a stride away; head up between cones
   - Progression: outside of the foot only, then alternate feet each cone, then timed

10. Ball Mastery Circuit · dribbling · 2 · 8 min · ball · 3x3 m · 30 s each: toe taps, sole rolls L/R, inside-inside, inside-outside, V-pulls, pull-push, scissors in place; 2 rounds, 30 s rest between rounds
    - Cues: light on the balls of the feet; quick small touches with rhythm, not power; eyes up for the last 10 s of each move
    - Progression: add a second ball alternating touches, then do each move for 45 s at speed

11. Move-and-Explode Gates · dribbling · 3 · 10 min · ball, 4 cones · 15x8 m · dribble at a cone 8 m away, perform one move (scissors, stepover, body feint, Cruyff), explode through a 1 m gate 3 m past it; 8 reps per move x 2 moves, walk back as rest
    - Cues: sell the move with shoulders and hips, not just the feet; drop the hips before the change of direction; the first touch after the move is big and the next two are sprints
    - Progression: alternate the exit gate left/right unannounced, then finish with a shot or driven pass

12. Figure-8 Change of Pace · dribbling · 3 · 8 min · ball, 2 cones · 8x4 m · cones 5 m apart; figure-8 for 40 s slow-fast-slow (sprint the straight, tight turns at cones), 20 s rest x 5
    - Cues: slow in, fast out of every turn; use the outside of the foot on the straights to keep the ball ahead; shield the ball with your body around the cone
    - Progression: weak foot only on one loop, then react to a beep to reverse direction

**Shooting**

13. Dead-Ball Technique · shooting · 2 · 8 min · ball, goal or 2 cones as a 3 m target · 20x10 m · from 14 m, 6 strikes each foot to each bottom corner (24 total), retrieve as rest
    - Cues: plant foot beside the ball pointing at the target; toe down, ankle locked, strike the ball just inside centre with the laces; land on the striking foot
    - Progression: move to 18 m, then one step run-up only, then aim top corners

14. Touch and Finish · shooting · 2 · 10 min · ball, goal/target, 2 cones · 20x12 m · from 16 m push the ball out of your feet with one touch and finish on the second, alternate feet; 10 reps x 2 sets
    - Cues: the setting touch goes forward and slightly to the side so you can open your hips; look at the target before the touch, at the ball during the strike; pass it into the corner with pace, not power
    - Progression: receive off a wall rebound instead of a static ball, then finish inside two touches from a dribble

15. Rebounder Turn and Shoot · shooting · 3 · 10 min · ball, wall/rebounder, goal/target, 2 cones · 25x12 m · back to goal 12 m out, pass to a wall/rebounder in front of you, receive, turn past a cone, shoot; 8 reps each side x 2 sets, 45 s rest
    - Cues: check the shoulder before the pass arrives; take the first touch across your body into the turn; shoot early, before you are fully set
    - Progression: one-touch turn (let the ball run across), then add a second cone as a defender to beat with a move

16. Volley and Half-Volley Finishing · shooting · 4 · 10 min · ball, goal/target · 20x12 m · self-toss at 12 m: 6 half-volleys each foot, then 6 volleys each foot; 2 sets
    - Cues: drop the ball low and close to the body, strike it just after the bounce; knee over the ball, lean forward, short backswing; keep the head still through contact
    - Progression: toss higher and side-on, then toss against the wall and volley the rebound

**Speed and agility**

17. Acceleration Starts · speed_agility · 2 · 10 min · 2 cones · 20x3 m · 10 m sprints from 4 start positions (standing, half-kneeling, push-up, lateral shuffle), 3 each, walk back plus 45 s rest; full rest, no fatigue
    - Cues: push the ground away behind you on the first three steps; forward lean from the ankles, not the waist; arms drive hard and opposite
    - Progression: 15 m, then react to a sound cue, then start with a ball and a push touch

18. Ladder Footwork · speed_agility · 1 · 6 min · agility ladder (or 8 cones as a ladder) · 10x2 m · two-in, lateral two-in, icky shuffle, in-in-out-out; 2 runs each, walk back as rest
    - Cues: stay on the balls of the feet; arms pump like sprinting; look forward, not down, by the second run
    - Progression: finish each run with a 5 m sprint, then with a ball waiting for a first touch

19. 5-10-5 Pro Agility · speed_agility · 3 · 8 min · 3 cones · 12x3 m · cones 5 m apart; sprint 5 right, 10 left, 5 right; 6 reps alternating start direction, 60 s rest
    - Cues: touch the line with the hand low and drop the hips; plant the outside foot and push, don't step over; look to the next cone before you turn
    - Progression: timed with phone, then add a ball to dribble the last 5 m

20. Decelerate and Cut · speed_agility · 3 · 8 min · 4 cones · 20x6 m · sprint 10 m, decelerate inside 2 m, cut 45 degrees to a cone 5 m away; 5 reps per side, 60 s rest
    - Cues: short choppy steps to brake, chest up; sink into the plant leg, knee over toes, not inside; re-accelerate low for the first three steps
    - Progression: cut at 90 degrees, then receive a self-pass off a wall after the cut

**Fitness**

21. Soccer Tempo Runs · fitness · 2 · 15 min · 2 cones · 100x5 m (or 50 m there and back) · 10 x 100 m at 70% effort, walk 50 m back as recovery, 2 min rest at halfway
    - Cues: relaxed shoulders and jaw; same pace every rep, you should finish able to talk; land under the hips, not out in front
    - Progression: 12 reps, then 80% effort on the last four

22. 30-15 Intervals · fitness · 3 · 14 min · 4 cones · 40x5 m · run 30 s at hard pace between cones, walk 15 s; 8 reps, 3 min rest, second block of 8 (12 min work total); scale distance to level
    - Cues: hit the cone each time, don't drift short; breathe out hard on the turn; keep form in the last three reps
    - Progression: add 5 m per rep, then make every third rep a sprint

23. Ball HIIT · fitness · 3 · 12 min · ball, 4 cones · 20x10 m · 30 s dribble-sprint around a 20x10 m rectangle (sprint the long sides, close control the short sides), 30 s rest; 10 rounds
    - Cues: big touch into the sprint, small touches on the short sides; head up on the long sides; recover with hands on hips, not knees
    - Progression: 40 s on / 20 s off, then weak foot only on short sides

24. Footballer's Bodyweight Circuit · fitness · 2 · 15 min · none (optional ball) · 3x3 m · 3 rounds, 40 s work / 20 s rest: split squats L, split squats R, Nordic lowers (3-5 slow reps, hands catch), Copenhagen side plank L/R, single-leg calf raises, glute bridge march; 60 s between rounds
    - Cues: control the lowering phase, 3 seconds down; knee tracks over the second toe; hips level in every single-leg move
    - Progression: add a 1 s pause at the bottom, then hold the ball overhead for split squats and raise the Nordic lower to 6 reps

Dose scaling: U12 and "just starting" players use 60-70% of listed sets/time; in-season sessions pick at most one intensity-4+ drill; the day before a match only drills with intensity ≤ 2 are eligible.

---

## Sources

1. Lazyweb Research, "How many steps does a typical onboarding flow have?" https://www.lazyweb.com/research/onboarding-flow-length-benchmark-steps.md
2. Lazyweb Research, "Which apps have the longest onboarding personalization quizzes?" https://www.lazyweb.com/research/longest-onboarding-quizzes-benchmark.md
3. Lazyweb Research, "Do onboarding quiz apps show a progress indicator on question screens?" https://www.lazyweb.com/research/quiz-progress-indicator-prevalence.md
4. Lazyweb Research, "How many onboarding quizzes ask a goal or objective question?" https://www.lazyweb.com/research/how-many-apps-ask-goal-question-onboarding.md
5. Lazyweb Research, "What questions do apps ask in an onboarding quiz before the paywall?" https://www.lazyweb.com/research/what-questions-apps-ask-before-paywall.md
6. Lazyweb Research, "What share of onboarding quizzes end with a 'building your plan' loading screen?" https://experiments.lazyweb.com/research/building-your-plan-loading-screen-prevalence.md
7. RevenueCat, "Web to app onboarding funnel" (Noom teardown) https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel.md
8. screensdesign, "Runna: Running Plans & Coach" screen flow https://screensdesign.com/apps/runna-running-training-plans/?vs=124771
9. screensdesign, "Fitbod" showcase https://screensdesign.com/showcase/fitbod-gym-fitness-planner
10. screensdesign, "Headspace" https://screensdesign.com/apps/headspace-meditation-sleep/?vs=125314
11. Tear Them Down, "Headspace: User onboarding personalization" https://tearthemdown.substack.com/p/headspace
12. screensdesign, "Caliber: Strength Training" showcase https://screensdesign.com/showcase/caliber-strength-training
13. Lazyweb canvas, Whoop https://www.lazyweb.com/canvas/companies/whoop
14. Whoop Community, "How long does it take for whoop to learn your baseline metrics?" https://community.whoop.com/t/how-long-does-it-take-for-whoop-to-learn-your-baseline-metrics/359
15. UX Collective, "The Duolingo diaries: an honest UX review, part 1" https://uxdesign.cc/the-duolingo-diaries-an-honest-ux-review-part-1-onboarding-ed0165d44c58
16. screensdesign, "Duolingo onboarding design" https://screensdesign.com/articles/duolingo-onboarding-design/
17. Freeletics Help, "Get started with Freeletics Training" https://help.freeletics.com/hc/en-us/articles/115004675229
18. Freeletics blog, "Getting started with Freeletics" https://www.freeletics.com/en/blog/posts/getting-started-with-freeletics/
19. Freeletics blog, "Update: Training Journeys" https://www.freeletics.com/en/blog/posts/update-freeletics-training-journeys/
20. Fitbod Help, "Getting Started with Fitbod: A New User's Guide" https://help.fitbod.me/hc/en-us/articles/30721771750039-Getting-Started-with-Fitbod-A-New-User-s-Guide
21. Fitbod Help, "Editing Workouts in Fitbod" https://help.fitbod.me/hc/en-us/articles/360006335593-Editing-Workouts-in-Fitbod
22. Runna Support, "How to use and manage your training calendar" https://support.runna.com/en/articles/10137793-how-to-use-and-manage-your-training-calendar
23. Tom's Guide, "Runna app review" https://www.tomsguide.com/reviews/runna-app
24. Lazyweb Research, "How did Duolingo use streak goals to improve retention?" https://lazyweb.com/research/duolingo-streak-goals-retention
25. screensdesign, "Calm onboarding design" https://screensdesign.com/articles/calm-onboarding-design/
26. Appcues GoodUX, "Calm app new user experience" https://goodux.appcues.com/blog/calm-app-new-user-experience
27. Centr Help, "How do I set up my profile and goals?" and related getting-started articles https://help.centr.com/en-US/how-do-i-set-up-my-profile-and-goals-3233560
28. Garage Gym Reviews, Caliber app review https://www.garagegymreviews.com/?p=171911
29. Exercise With Style, "Future app review" https://exercisewithstyle.com/future-app-review/
30. screensdesign, "LADDER Strength Training Plans" showcase https://screensdesign.com/showcase/ladder-strength-training-plans
31. Sensai, "Ladder App Review 2026" https://www.sensai.fit/blog/ladder-app-review-2026
32. Hevy Help, "Build a Workout Program: Create & Organize Routines" https://help.hevyapp.com/hc/en-us/articles/34953606698903-Build-a-Workout-Program-Create-Organize-Routines
33. Zwift Support, "Manually adjusting your FTP" https://support.zwift.com/en_us/manually-adjusting-your-ftp-S1bUyp38v.md
34. Built for Mars, Knowunity https://builtformars.com/company/knowunity
35. screensdesign, "7 app onboarding trends for 2026" https://screensdesign.com/articles/app-onboarding-trends-2026/
36. Lazyweb Research sequencing recommendation in [5]
37. Should I Train, "Garmin Coach review" https://www.shoulditrain.com/blog/garmin-coach-review
38. Football Australia Medical Dept., "Youth Training Load Guidelines" (2025) https://www.footballaustralia.com.au/sites/ffa/files/2025-08/Youth%20Training%20Load%20Guidelines.pdf
39. Match-day training guidance (termedia / UTS / PMC results on pre- and post-match load) https://pmc.ncbi.nlm.nih.gov/articles/PMC8669933
40. SimpliFaster, "The Path to Ball Mastery with Techne Futbol" https://simplifaster.com/articles/ball-mastery-techne-futbol/
41. LJMU, "Training loads and microcycle periodisation in Italian Serie A youth soccer players" https://researchonline.ljmu.ac.uk/id/eprint/24008/
42. TrainingPeaks Help, "How do I move a workout" https://help.trainingpeaks.com/hc/en-us/articles/204072164-How-do-I-move-a-workout
43. TrainingPeaks Coach Blog, "Speed up your coaching with 5 TrainingPeaks calendar efficiency features" https://www.trainingpeaks.com/coach-blog/speed-up-your-coaching-with-5-trainingpeaks-calendar-efficiency-features/
44. TrainingPeaks Help, compliance colors https://help.trainingpeaks.com/hc/en-us/articles/204861204
45. TrainingPeaks, "Athlete User Guide" https://www.trainingpeaks.com/learn/trainingpeaks-athlete-user-guide/
46. TrainingPeaks, "What are RPE and subjective feedback" https://trainingpeaks.com/learn/articles/what-are-rpe-and-subjective-feedback
47. Runna Support, "How can I adjust my plan to add extra runs, parkrun and club runs" https://support.runna.com/en/articles/6206280-how-can-i-adjust-my-plan-to-add-extra-runs-parkrun-and-club-runs
48. Runna Support, "What is holiday mode" https://intercom.help/runna/en/articles/10225691-what-is-holiday-mode
49. Runna Support, "How to use Not Feeling 100%" https://support.runna.com/en/articles/13531498-how-to-use-not-feeling-100
50. Engadget, "Runna's new coaching feature will adjust your workout based on local heat and humidity" https://engadget.com/2226300/runnas-new-coaching-feature-will-adjust-your-workout-based-on-local-heat-and-humidity
51. Final Surge blog, "Drag & drop calendar" https://blog.finalsurge.com/final-surge-drag-drop-calendar/
52. Final Surge Support, "Shifting Training Plan Dates" https://support.finalsurge.com/hc/en-us/articles/360041301593-Shifting-Training-Plan-Dates
53. Intervals.icu forum, "Training plans now supported" https://forum.intervals.icu/t/training-plans-now-supported/1599
54. Fitbod Help, "Why did my workout change? Understanding workout refreshes" https://help.fitbod.me/hc/en-us/articles/42333470514455-Why-did-my-workout-change-Understanding-workout-refreshes
55. Freeletics Help, "Adapt your Bodyweight training session" https://help.freeletics.com/hc/en-us/articles/360003933780
56. Freeletics Help, "Adapt your Weights Training Session" https://help.freeletics.com/hc/en-us/articles/4407875324818-Adapt-your-Weights-Training-Session
57. Freeletics blog, "What is the purpose of the feedback I am asked to give after each workout" https://www.freeletics.com/en/blog/posts/what-is-the-purpose-of-the-feedback-i-am-asked-to-give-after-each-workout
58. Garmin Forums, "Reschedule a missed training plan session" https://forums.garmin.com/apps-software/mobile-apps-web/f/garmin-connect-web/326235/reschedule-a-missed-training-plan-session/1748699
59. Runner's Picks, "How to set up Garmin training plans" https://www.runnerspicks.com/blog/how-to-set-up-garmin-training-plans/
60. Apple Support, "Use Custom Plans in Apple Fitness+" https://support.apple.com/guide/fitness-plus/apdf222051d8/ios
61. 9to5Mac, "Create custom Apple Fitness plans in iOS 17" https://9to5mac.com/2023/11/30/create-custom-apple-fitness-plans-ios-17/
62. Marathon Handbook, "Strava announces acquisition of Runna" https://marathonhandbook.com/strava-announces-acquisition-of-personalized-training-app-runna/
63. the5krunner, "Runna: how Strava's running coach app works" https://the5krunner.com/runna/
64. Athletica forum, "Is Athletica AI coach no longer dynamic in modifying workouts..." https://forum.athletica.ai/t/is-athletica-ai-coach-no-longer-dynamic-in-modifying-workouts-and-has-become-a-passive-platform-like-trainingpeaks/4829
65. Slowtwitch forum, "Are you triathlon training with AI adaptive training?" https://forum.slowtwitch.com/forum/Slowtwitch_Forums_C1/Triathlon_Forum_F1/Are_you_triathlon_training_with_AI_adaptive_training%3F_P8047265/
66. Hevy, "Workout rest timer" https://www.hevyapp.com/features/workout-rest-timer/
67. 9to5Google, Google Calendar drag-to-move with undo toast https://9to5google.com/?p=184951
68. Linear, "Cycles guide" https://linear.app/enablement/guide/cycles-guide
69. McMillan Running Help, "How to adjust for your life schedule?" https://mcmillan.helpscoutdocs.com/article/53-how-to-adjust-for-your-life-schedule
70. Playermaker, "Best soccer training apps for players of all levels" https://www.playermaker.com/blogs/news/soccer-training-apps
71. JustUseApp, Techne Futbol reviews https://justuseapp.com/en/app/1298569303/techne-futbol/reviews
72. Digital Trends, "DribbleUp review" https://digitaltrends.com/cool-tech/dribbleup-review
73. DribbleUp, Smart Soccer Ball https://dribbleup.com/products/smart-soccer-ball
74. Reviewed, "Nike Training Club review" https://reviewed.com/health/content/nike-training-club-review-workout-app
75. iPhone in Canada, "Nike brings its popular Training Club app to Apple Watch" https://www.iphoneincanada.ca/news/nike-training-club-apple-watch-app/
76. Garage Gym Reviews, Nike Training Club https://www.garagegymreviews.com/equipment/nike-training-club
77. Pelobuddy, filtering updates on the Peloton app https://www.pelobuddy.com/?p=31895
78. Pelobuddy, "New feature on Peloton web: filter classes by body activity" https://www.pelobuddy.com/?p=11041
79. Pelobuddy, "The new focus area for strength classes in the Peloton app" https://www.pelobuddy.com/?p=44659
80. Freeletics forum, "Feature suggestion" (exercise library filters) https://forum.freeletics.com/t/feature-suggestion/22032
81. Hudl, soccer solutions https://hudl.com/sports/soccer
82. VideoHighlight summary, Become Elite "Exactly how I plan out my training sessions" https://videohighlight.com/v/6deAldRhqN0
83. Soccer Insider, "Becoming Elite YouTube channel review" https://soccer-insider.beehiiv.com/p/becoming-elite-youtube-channel-social-media-review-education
84. App Store, Beast Mode Soccer+ https://apps.apple.com/us/app/beast-mode-soccer/id1398275434
85. Renderfoot, "Soccer Drills: 12 Best Drills for Every Skill" https://www.renderfoot.com/blog/soccer-drills
86. easy2coach, "Sprint-interval course with speed endurance" https://www.easy2coach.net/en/soccer-exercise/soccer-training-sprint-intervalcoursewithspeedendurance.html
87. Sportsessionplanner, session examples https://www.sportsessionplanner.com/s/P05jb/Shooting-2008BR-1-11-17.html
88. Volt Athletics Help, "How does athlete activity feedback work" https://help.voltathletics.com/how-does-athlete-activity-feedback-work
