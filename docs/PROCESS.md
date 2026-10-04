# How xTrain was built

A record of the process behind version 0.1.0, written for readers who want to see the decisions, not just the result.

## 1. The brief

The product team's PRD (33 pages) describes an "AI coach in your pocket" for U.S. youth and amateur players aged roughly 13 to 18: personalized multi-week plans, a drill library, a session player, behaviour-derived ratings, XP and badges, and a later camera-based "Coach AI". The founding ask for this build was a complete website where a player signs up with their specs (name, age, experience, position), gets an AI-generated plan, and can move things around and modify it with ease. It had to feel futuristic and heavily animated, and it had to be built and tested in phases rather than in one shot.

Product truth distilled from the PRD lives in [PRODUCT.md](../PRODUCT.md).

## 2. Research

Three parallel research passes, archived in [docs/research](research/):

- **Competitors** ([competitors.md](research/competitors.md)): 25 products across coach-authored content apps (Techne, Train Effective), the 2025-26 wave of AI plan generators (Footly, Baller Lab, BallerAI), and hardware-gated trainers (Dribbleup, Playermaker). Key finding: no competitor lets a player drag and reorder their week. Fixed plans or "regenerate only" everywhere.
- **Design references** ([design-references.md](research/design-references.md)): WHOOP, Oura, Strava, Linear, Raycast, Runna, Freeletics and a dozen award-level AI product sites. Borrowed: process-aware plan-generation steps, "because you said" reveal chips, data fills at 1.2 to 1.5 seconds, Undo on every edit, Netflix-style focus dimming in rails. Rejected: the volt-green-on-blue-black palette the research recommended, because it is the category default.
- **UX patterns** ([ux-patterns.md](research/ux-patterns.md)): onboarding benchmarks (median 11 steps; Runna's "building your plan" loader), plan-editor rules (Runna's move window, TrainingPeaks' missing Undo, Athletica's "AI proposes, user confirms"), session-player and completion flows, and Football Australia's youth load guidelines that shaped the planner's warnings.

## 3. Direction

The visual world was chosen with a structured direction roll rather than taste. Seven candidate worlds were drawn from what teenage players already know by heart: EA FC rating cards, boot design language, skill-edit highlight reels, broadcast stat graphics, the coach's tactics board, stadium LED boards, cage-football culture. The roll assigned **the highlight reel**: the plan is cut like a skill-edit. Weeks are filmstrips, sessions are clips whose width is their minutes, today sits under an orange playhead, and re-cutting means dragging clips.

Six disciplines were borrowed from the alternates the roll dealt and written into the contract:

| Rule | Meaning |
| --- | --- |
| Tonal ramp | Eleven fixed ink steps are the only tones |
| Action-only orange | Orange means pressable or "now", never decoration |
| Duration as length | A clip's width is exactly its minutes |
| Hard cuts | Navigation, tabs and filters switch instantly; eased motion only on authored moments |
| Focus dimming | In rails, the focused tile leads and siblings step back |
| Minutes everywhere | Every next step carries its cost in minutes |

The full contracts are in `.impeccable/surfaces/`, and the system derived from the finished build is in [DESIGN.md](../DESIGN.md).

## 4. Build order and verification

Each phase was built, run in a browser, and checked before the next:

1. Tokens, fonts (self-hosted Archivo variable and Azeret Mono), app shell.
2. Data model, 30 authored drills with diagram specs, the rule-based planner, ratings math, persisted store.
3. Home, then Plan (the signature drag interaction), then library and detail.
4. Session player, Progress, Achievements.
5. Coach chat, Profile, Onboarding, Landing.
6. Playwright flow tests on desktop and phone projects, plus a capture spec that screenshots every route at 1440 and 390 px and fails on any horizontal overflow.
7. A finish review against the direction contract and the craft floor, which produced an eight-item fix list (kicker labels, a mobile overlap, a card-grid roadmap, a sticky phone action, diagram legibility, caption truncation, low-contrast labels, a stray orange). All eight were resolved and re-scored.

Final state for 0.1.0: 23 flow tests passing and 1 intentionally skipped, 0 design-detector findings, 39 review captures with zero overflow.

## 5. What is real and what is not

Course AI is rule-based in this version, exactly as the PRD scopes the MVP. It is transparent: every decision is a readable rule with a one-line reason. The demo player, logged sessions, badge percentages and coaching copy are synthetic and labelled. There are no accounts, no guardian consent emails, no coach or parent dashboard, no camera tracking, no real drill video. The roadmap section on the landing page says so.

## 6. Versioning

Pre-1.0, every major change to what the product does or how it looks bumps the minor version (0.2.0, 0.3.0) with a dated entry in [CHANGELOG.md](../CHANGELOG.md), a git tag, and a GitHub release. Patches (0.1.1) are fixes that do not change behaviour. 1.0.0 is the first version a real player trains with.
