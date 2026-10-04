# Architecture

xTrain is a single-page React application with no backend in this version. Everything a player does is computed in the browser and persisted to `localStorage` under the key `xtrain:v1`.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build | Vite 8, TypeScript 7 | Fast dev server, simple static output for Vercel and the artifact host |
| UI | React 19, React Router 7 | Path routing locally; hash routing in the artifact build (`VITE_HASH_ROUTER=1`) |
| Styling | Tailwind v4 with `@theme` tokens | Tokens in `src/index.css` are the single source of colour, type, radius, easing |
| Motion | Motion (`motion/react`) | Layout animations for the filmstrip, presence transitions, reduced-motion hooks |
| Drag | dnd-kit | Pointer, touch and keyboard sensors for moving sessions between days |
| Icons | Phosphor | One family, consistent stroke |
| Tests | Playwright | Flow tests on desktop and phone projects; capture spec for review screenshots |

## Data model (`src/data/types.ts`)

```
Profile  name, age, position, experience, foot, goals[], daysPerWeek,
         minutesPerSession, equipment[], space, teamDays[], injuries, guardianEmail
Plan     weeks[4]
  Week   index, theme, targetMinutes, days[7]
    Day  date, dow, teamDay, sessions[]
      Session  title, focus, minutes, blocks[], reason, status, log, intensity
        Block  drillId, minutes, role (warmup | main | finisher | cooldown), weakFoot
Drill    skill, sub, difficulty 1-5, minutes, equipment[], space, positions[],
         setup, steps[], cues[3], mistakes[], progression, regression, dose,
         work/rest (intervals), why, diagram
Diagram  area, cones, gates, wall, goal, ladder, player, run[], ball[]
```

## Course AI (`src/lib/courseAI.ts`)

A deterministic, rule-based planner (the PRD's MVP scope). Key functions:

- `generatePlan(profile, prefs, startDate, seed)`: picks training days around team days, builds a focus template from goals, position and mandatory fundamentals (one ball-control and one passing day every week), and composes each session as warm-up, ball mastery, two or three main drills filtered by kit and space and scored by goal fit, a conditioning finisher, and a cool-down. Week themes progress Foundation, Build, Sharpen, Perform. Every session gets a `reason` string.
- Edit operations, all pure functions on the plan: `moveSession`, `swapBlock`, `addBlock`, `removeBlock`, `setSessionMinutes`, `regenerateSession`, `adaptSession` (chips: less time, no wall, no cones, no goal, small space), `addSession`, `deleteSession`, `scaleWeek`, `setStatus`.
- Reading: `weekAdvice` (back-to-back hard days, team-day stacking, under or over target, missing fundamentals), `dayLoad`, `ratingHistory` and `currentRatings` (0-100 per skill from minutes, difficulty and role weight, never from biomechanics), `streak`, `xpFor`, `levelFor`, `nextSession`.

`src/lib/coachBrain.ts` maps chat intents (pain, missing kit, lighter or harder, weak foot, first touch, fitness, "why is Wednesday…") to grounded replies and optional plan actions that reuse the same operations.

## State (`src/lib/store.tsx`)

A reducer-backed context: profile, plan, favourites, excluded drills, toasts (with Undo callbacks), and `today`. On first load it seeds a demo player (Alex, winger, week 3 of 4) unless `?fresh=1` is present. `usePlanOps().apply(nextPlan, message)` is the one door for every plan change: it stores the previous plan and raises a toast with Undo.

## Components

- `PitchDiagram`: renders a drill's diagram spec as SVG. `play` loops a speed-ramped run and ball animation; `progress` scrubs it from a range input.
- `Filmstrip`: a week as clips with `flex-grow` equal to minutes, rest and team days at fixed width, an orange playhead on today, and a load waveform on desktop. Plan has its own draggable variant built on dnd-kit.
- `Charts`: `Radar` (five axes with a baseline ghost), `SeasonChart` (ratings over time with a draggable playhead), `ConsistencyGrid`, `CountUp`.
- `ui`: Button, Chip, Tag, AIVoice, TimeBadge, StreakChip, Difficulty, EmptyState, Page.

## Routes

```
/                      Landing
/start                 Onboarding (?fresh=1 clears the demo)
/app                   Home          /app/plan        Plan
/app/drills            Library       /app/drills/:id  Drill detail
/app/session/:id       Session player (outside the shell)
/app/progress          Progress      /app/achievements
/app/coach             Coach chat    /app/profile
```

## Builds

- `npm run build` → `dist/` with path routing; `vercel.json` rewrites every non-asset path to `index.html`.
- `npm run build:artifact` → `dist-artifact/` with hash routing and relative asset paths for the Claude artifact host; a post-build step inlines fonts and appends an unlayered body override (see README).

## Testing

- `tests/xtrain.spec.ts`: Home, Plan (drag with warning and Undo, swap, length, re-cut), Drills (filters, exclude flow, chip contrast), Session (run, rest, log, XP), Coach (action), Onboarding (end to end), Landing (hero fits, no em-dashes).
- `tests/captures.spec.ts`: full-page captures of every route at 1440 and 390 px plus the session and onboarding flows, asserting `scrollWidth <= innerWidth` after each.
