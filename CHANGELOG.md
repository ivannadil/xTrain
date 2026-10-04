# Changelog

All notable changes to xTrain are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/): a major change to what the product does or how it looks bumps the minor version while we are pre-1.0 (0.x), and 1.0.0 marks the first release a real player trains with.

## [Unreleased]

## [0.1.0] - 2026-10-03

First complete prototype.

### Added
- Landing page with a scrubbable drill clip, live demo week, scroll-driven re-cut demo, drill rail, radar, mini session player, and an honest roadmap.
- Onboarding: 12 one-question steps, guardian step under 13, editable summary, plan-generation moment showing the planner's real steps, reveal with "because you said" coach notes.
- Course AI planner (`src/lib/courseAI.ts`): four-week plans from position, goals, days, minutes, team days, kit and space; move, swap, adapt, regenerate, scale, status, ratings, streaks, XP, coach advice; a one-line reason on every session.
- Home: today's session clip, adapt chips, ratings, week filmstrip with playhead and load wave, drill rail, sticky Start on phones.
- Plan: drag-and-drop week filmstrip (clip width equals minutes), amber warnings before a bad move with "move and make it light", session editor (swap, length, re-cut, skip, remove, add), week re-cut menu, coach notes, Undo on every edit.
- Drill library (30 authored solo drills with SVG pitch plans) and drill detail with scrubbable diagram, cues, mistakes, progressions, exclude-with-warning, history.
- Session player: pre-flight, big timer, rotating cues, intervals, rest countdown, pain flag, log (completion, minutes, RPE, feel, pain, note), saved freeze-frame with XP and rating deltas.
- Progress (radar with baseline, scrubbable season chart, minutes by skill, consistency grid, totals), Achievements (level ladder, badges with real progress), Coach chat (scripted brain over the real plan), Profile (every spec editable, re-cut remaining weeks).
- Design system recorded in `DESIGN.md` and `.impeccable/design.json`; product truth in `PRODUCT.md`; research in `docs/research/`.
- Playwright flow tests (desktop and phone) and a capture spec that asserts zero horizontal overflow on every route.
- Artifact build (`npm run build:artifact`) with hash routing for static hosts; Vercel config with SPA rewrites.

[Unreleased]: https://github.com/ishanvannadil/xTrain/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ishanvannadil/xTrain/releases/tag/v0.1.0
