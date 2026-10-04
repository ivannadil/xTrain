/**
 * Course AI: a deterministic, rule-based planner (the PRD's MVP approach).
 * Every decision produces a one-line reason the player can read.
 */
import { DRILLS, DRILL_BY_ID } from "../data/drills";
import {
  GOAL_LABEL,
  POSITION_LABEL,
  type Block,
  type Day,
  type Drill,
  type Focus,
  type Goal,
  type Plan,
  type Profile,
  type Ratings,
  type Session,
  type Skill,
  type Week,
  SKILLS,
} from "../data/types";

export const SKILLS_LIST = SKILLS;
export const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let counter = 0;
const uid = (p: string) => `${p}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

/** Small seeded PRNG so regenerate gives variety but stays reproducible per seed. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s: string, n: number) {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
export function mondayOf(d: Date) {
  const c = new Date(d);
  const diff = (c.getDay() + 6) % 7;
  c.setDate(c.getDate() - diff);
  return c;
}

const INTENSITY: Record<Focus, number> = {
  dribbling: 1.0,
  passing: 0.95,
  shooting: 1.05,
  defending: 1.1,
  fitness: 1.3,
  mixed: 1.1,
  recovery: 0.5,
};

const WEEK_THEMES = [
  ["Foundation", "Groove the technique at a tempo you control."],
  ["Build", "Same patterns, more reps, less rest."],
  ["Sharpen", "Gaps shrink, targets get smaller, reps get faster."],
  ["Perform", "Lighter volume, test week. Log your bests."],
];

function goalSkill(g: Goal): Skill {
  if (g === "weak-foot") return "passing";
  if (g === "first-touch") return "dribbling";
  if (g === "speed") return "fitness";
  return g;
}

export function baseDifficulty(p: Profile): number {
  return p.experience === "beginner" ? 1.5 : p.experience === "intermediate" ? 2.5 : 3.5;
}

function pickTrainingDays(p: Profile): number[] {
  const pref = [1, 3, 5, 6, 2, 4, 0];
  const avail = pref.filter((d) => !p.teamDays.includes(d));
  const chosen = avail.slice(0, Math.min(p.daysPerWeek, avail.length));
  return chosen.sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
}

function focusTemplate(p: Profile): Focus[] {
  const primary = goalSkill(p.goals[0] ?? "dribbling");
  const secondary = p.goals[1] ? goalSkill(p.goals[1]) : undefined;
  const mandatory: Skill[] = ["dribbling", "passing"];
  const seq: Focus[] = [primary];
  for (const m of mandatory) if (!seq.includes(m)) seq.push(m);
  if (secondary && !seq.includes(secondary)) seq.push(secondary);
  if (!seq.includes("fitness")) seq.push("fitness");
  if (p.position === "CB" || p.position === "FB" || p.position === "CDM") {
    if (!seq.includes("defending")) seq.splice(2, 0, "defending");
  }
  if (p.position === "ST" || p.position === "W") {
    if (!seq.includes("shooting")) seq.splice(1, 0, "shooting");
  }
  const n = p.daysPerWeek;
  if (n <= 2) return [primary, "mixed"];
  const out = seq.slice(0, n);
  while (out.length < n) out.push(out.length % 2 ? "mixed" : "recovery");
  return out;
}

function fits(d: Drill, p: Profile, excluded: Set<string>) {
  if (excluded.has(d.id)) return false;
  const have = new Set<string>(["ball", ...p.equipment]);
  if (have.has("rebounder")) have.add("wall");
  // A cone gate or a wall is an honest stand-in for a goal when shooting for placement.
  if (!have.has("goal") && (have.has("cones") || have.has("wall"))) have.add("goal");
  for (const e of d.equipment) if (!have.has(e)) return false;
  const order = { small: 0, medium: 1, large: 2 };
  if (order[d.space] > order[p.space]) return false;
  return true;
}

function score(d: Drill, p: Profile, target: number, favorites: Set<string>, r: () => number) {
  let s = 10 - Math.abs(d.difficulty - target) * 3;
  if (d.positions?.includes(p.position)) s += 3;
  if (favorites.has(d.id)) s += 4;
  if (p.goals.includes("weak-foot") && d.tags.includes("weak foot")) s += 4;
  if (p.goals.includes("first-touch") && d.tags.includes("first touch")) s += 4;
  if (p.goals.includes("speed") && d.tags.includes("speed")) s += 3;
  s += r() * 2;
  return s;
}

export type Prefs = { favorites: string[]; excluded: string[] };

function buildBlocks(
  focus: Focus,
  minutes: number,
  target: number,
  p: Profile,
  prefs: Prefs,
  r: () => number,
  weekIdx: number,
): Block[] {
  const favorites = new Set(prefs.favorites);
  const excluded = new Set(prefs.excluded);
  const pool = DRILLS.filter((d) => fits(d, p, excluded));
  const by = (skill: Skill, not: Set<string>) =>
    pool
      .filter((d) => d.skill === skill && !not.has(d.id) && !d.tags.includes("warm-up") && !d.tags.includes("cool-down"))
      .sort((a, b) => score(b, p, target, favorites, r) - score(a, p, target, favorites, r));

  const used = new Set<string>();
  const blocks: Block[] = [];
  const push = (d: Drill | undefined, role: Block["role"], m: number, weakFoot?: boolean) => {
    if (!d) return;
    used.add(d.id);
    blocks.push({ id: uid("b"), drillId: d.id, minutes: m, role, weakFoot });
  };

  const warm = pool.find((d) => d.id === "dynamic-warm-up");
  const cool = pool.find((d) => d.id === "cool-down-mobility");
  const warmMin = minutes >= 40 ? 5 : 4;
  const coolMin = minutes >= 40 ? 5 : 3;
  push(warm, "warmup", warmMin);

  const mainBudget = minutes - warmMin - coolMin;
  const mainSkills: Skill[] =
    focus === "mixed"
      ? [goalSkill(p.goals[0] ?? "dribbling"), "passing", "dribbling"]
      : focus === "recovery"
        ? ["dribbling"]
        : [focus];
  const wantFinisher = focus !== "fitness" && focus !== "recovery" && mainBudget >= 24;
  const finisherMin = wantFinisher ? (mainBudget >= 36 ? 8 : 6) : 0;
  let budget = mainBudget - finisherMin;

  if (focus !== "fitness" && focus !== "recovery") {
    const bm = pool.find((d) => d.id === "toe-taps-sole-rolls");
    if (bm && budget >= 20) {
      push(bm, "warmup", 4);
      budget -= 4;
    }
  }

  const mainCount = focus === "recovery" ? 2 : budget >= 30 ? 3 : 2;
  const candidates: Drill[] = [];
  for (let i = 0; i < mainCount; i++) {
    const skill = mainSkills[i % mainSkills.length];
    const next = by(skill, used).find((d) => !candidates.includes(d));
    if (next) {
      candidates.push(next);
      used.add(next.id);
    }
  }
  // Fill from the fundamentals when the focus skill has too few drills that fit the kit.
  if (candidates.length < mainCount) {
    for (const skill of ["dribbling", "passing", "fitness"] as Skill[]) {
      while (candidates.length < mainCount) {
        const next = by(skill, used).find((d) => !candidates.includes(d));
        if (!next) break;
        candidates.push(next);
        used.add(next.id);
      }
      if (candidates.length >= mainCount) break;
    }
  }
  if (candidates.length) {
    const base = Math.floor(budget / candidates.length);
    let rem = budget - base * candidates.length;
    candidates.forEach((d, i) => {
      const m = Math.max(4, base + (rem-- > 0 ? 1 : 0));
      const weakFoot = p.goals.includes("weak-foot") && (d.tags.includes("weak foot") || (i === 0 && weekIdx >= 1 && d.skill !== "fitness"));
      push(d, "main", m, weakFoot);
    });
  }
  if (wantFinisher) {
    const fin = by("fitness", used).find((d) => !d.tags.includes("strength")) ?? by("fitness", used)[0];
    push(fin, "finisher", finisherMin);
  }
  push(cool, "cooldown", coolMin);
  return blocks;
}

function sessionTitle(focus: Focus, blocks: Block[]) {
  const main = blocks.find((b) => b.role === "main");
  const sub = main ? DRILL_BY_ID[main.drillId]?.sub : "";
  switch (focus) {
    case "fitness":
      return "Conditioning";
    case "recovery":
      return "Recovery touch";
    case "mixed":
      return "Mixed skills";
    default:
      return `${focus[0].toUpperCase() + focus.slice(1)} · ${sub}`;
  }
}

function reasonFor(focus: Focus, p: Profile, weekIdx: number, dow: number, blocks: Block[], nextIsTeamDay: boolean): string {
  const primary = p.goals[0];
  const primarySkill = primary ? goalSkill(primary) : undefined;
  const dayName = DOW_LONG[dow];
  const pos = POSITION_LABEL[p.position].toLowerCase();
  const weak = blocks.some((b) => b.weakFoot);
  if (focus === "recovery") return `You trained hard twice this week already, so ${dayName} is a light touch session to keep the rhythm without the load.`;
  if (focus === "fitness") {
    if (p.goals.includes("speed")) return `Because you want to get faster, ${dayName} is a speed day: short sprints with full recovery, no slow running.`;
    return `One conditioning day a week keeps your technique working in the last 20 minutes, which is where ${pos}s win games.`;
  }
  if (focus === "mixed") return `With ${p.daysPerWeek} days a week, ${dayName} mixes your main goal with the two fundamentals every player needs.`;
  if (primary && primarySkill === focus) {
    const g = GOAL_LABEL[primary].toLowerCase();
    const weakLine = weak ? " Every main rep today is weak-foot only." : "";
    const goalNote = focus === "shooting" && !p.equipment.includes("goal") ? " No goal listed, so a cone gate or the wall is your target." : "";
    if (weekIdx >= 2) return `Week ${weekIdx + 1} sharpens the goal you set, "${g}": smaller targets and faster reps on ${dayName}.${weakLine}${goalNote}`;
    return `Because your first goal is "${g}", ${dayName} is a ${focus} day built around your position as a ${pos}.${weakLine}${goalNote}`;
  }
  if (focus === "dribbling") return `Every week keeps one ball-control day so your touch stays sharp when you are closed down.${weak ? " Main reps are weak-foot led." : ""}`;
  if (focus === "passing") {
    if (!p.equipment.includes("wall") && !p.equipment.includes("rebounder")) return `No wall on your list, so ${dayName}'s passing uses gates you can set with cones instead of rebounds.`;
    return `Passing is the fundamental that makes every other skill usable, so it stays in the week.${weak ? " Today every pass is weak foot." : ""}`;
  }
  if (focus === "shooting") return `As a ${pos}, finishing patterns are your bread and butter, so ${dayName} is a shooting day.${!p.equipment.includes("goal") ? " No goal listed, so a cone gate or the wall is your target." : ""}`;
  if (focus === "defending") return `${POSITION_LABEL[p.position]}s are judged on duels, so ${dayName} drills the footwork behind them.`;
  return nextIsTeamDay ? `You train with the team tomorrow, so today stays controlled.` : `Scheduled by Course AI from your profile.`;
}

export function makeSession(
  focus: Focus,
  minutes: number,
  p: Profile,
  prefs: Prefs,
  weekIdx: number,
  dow: number,
  seed: number,
  nextIsTeamDay = false,
): Session {
  const r = rng(seed);
  const target = Math.min(5, baseDifficulty(p) + (weekIdx >= 2 ? 0.75 : weekIdx === 1 ? 0.25 : 0) - (weekIdx === 3 ? 0.25 : 0));
  const m = nextIsTeamDay ? Math.min(minutes, 40) : minutes;
  const blocks = buildBlocks(focus, m, target, p, prefs, r, weekIdx);
  const total = blocks.reduce((a, b) => a + b.minutes, 0);
  return {
    id: uid("s"),
    title: sessionTitle(focus, blocks),
    focus,
    minutes: total,
    blocks,
    reason: reasonFor(focus, p, weekIdx, dow, blocks, nextIsTeamDay),
    status: "planned",
    intensity: INTENSITY[focus],
  };
}

export function generatePlan(p: Profile, prefs: Prefs, startDate: string, seed = 7): Plan {
  const days = pickTrainingDays(p);
  const template = focusTemplate(p);
  const weeks: Week[] = [];
  for (let w = 0; w < 4; w++) {
    const dayList: Day[] = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, w * 7 + i);
      const dow = parseISO(date).getDay();
      const idx = days.indexOf(dow);
      const sessions: Session[] = [];
      if (idx !== -1) {
        const focus = template[(idx + w) % template.length];
        const nextIsTeam = p.teamDays.includes((dow + 1) % 7);
        const minutes = w === 3 ? Math.round(p.minutesPerSession * 0.85) : p.minutesPerSession + (w === 1 ? 5 : 0);
        sessions.push(makeSession(focus, minutes, p, prefs, w, dow, seed * 1000 + w * 10 + i, nextIsTeam));
      }
      dayList.push({ date, dow, sessions, teamDay: p.teamDays.includes(dow) });
    }
    weeks.push({
      index: w,
      theme: WEEK_THEMES[w][0],
      themeLine: WEEK_THEMES[w][1],
      targetMinutes: p.daysPerWeek * p.minutesPerSession,
      days: dayList,
    });
  }
  const goal = p.goals[0] ? GOAL_LABEL[p.goals[0]] : "All-round";
  return {
    id: uid("plan"),
    name: `4-week ${POSITION_LABEL[p.position]} plan: ${goal}`,
    createdAt: new Date().toISOString(),
    startDate,
    weeks,
  };
}

/* ---------------- Plan operations (pure) ---------------- */

export function findSession(plan: Plan, id: string): { week: Week; day: Day; session: Session; wi: number; di: number } | null {
  for (const week of plan.weeks)
    for (const day of week.days)
      for (const session of day.sessions)
        if (session.id === id) return { week, day, session, wi: week.index, di: week.days.indexOf(day) };
  return null;
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

export function moveSession(plan: Plan, sessionId: string, toWeek: number, toDay: number): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  hit.day.sessions = hit.day.sessions.filter((s) => s.id !== sessionId);
  next.weeks[toWeek].days[toDay].sessions.push(hit.session);
  return next;
}

export function deleteSession(plan: Plan, sessionId: string): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  hit.day.sessions = hit.day.sessions.filter((s) => s.id !== sessionId);
  return next;
}

export function setSessionMinutes(plan: Plan, sessionId: string, minutes: number): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  const s = hit.session;
  const fixed = s.blocks.filter((b) => b.role !== "main").reduce((a, b) => a + b.minutes, 0);
  const mains = s.blocks.filter((b) => b.role === "main");
  const budget = Math.max(mains.length * 4, minutes - fixed);
  const base = Math.floor(budget / Math.max(1, mains.length));
  let rem = budget - base * mains.length;
  mains.forEach((b) => (b.minutes = base + (rem-- > 0 ? 1 : 0)));
  s.minutes = s.blocks.reduce((a, b) => a + b.minutes, 0);
  return next;
}

export function addBlock(plan: Plan, sessionId: string, drillId: string, minutes: number): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  const s = hit.session;
  const idx = s.blocks.findIndex((b) => b.role === "finisher" || b.role === "cooldown");
  const block: Block = { id: uid("b"), drillId, minutes, role: "main" };
  if (idx === -1) s.blocks.push(block);
  else s.blocks.splice(idx, 0, block);
  s.minutes = s.blocks.reduce((a, b) => a + b.minutes, 0);
  return next;
}

export function removeBlock(plan: Plan, sessionId: string, blockId: string): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  hit.session.blocks = hit.session.blocks.filter((b) => b.id !== blockId);
  hit.session.minutes = hit.session.blocks.reduce((a, b) => a + b.minutes, 0);
  return next;
}

export function drillHistory(plan: Plan | null, drillId: string) {
  let times = 0;
  let minutes = 0;
  let last: string | undefined;
  if (!plan) return { times, minutes, last };
  for (const w of plan.weeks)
    for (const d of w.days)
      for (const s of d.sessions)
        if (s.status === "done" || s.status === "partial")
          for (const b of s.blocks)
            if (b.drillId === drillId) {
              times++;
              minutes += b.minutes;
              last = s.log?.date ?? d.date;
            }
  return { times, minutes, last };
}

export function swapBlock(plan: Plan, sessionId: string, blockId: string, drillId: string): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  const b = hit.session.blocks.find((x) => x.id === blockId);
  if (!b) return plan;
  b.drillId = drillId;
  return next;
}

export function alternativesFor(drillId: string, p: Profile, prefs: Prefs, chips: string[] = []): Drill[] {
  const d = DRILL_BY_ID[drillId];
  if (!d) return [];
  const excluded = new Set(prefs.excluded);
  const prof: Profile = { ...p };
  if (chips.includes("no-wall")) prof.equipment = prof.equipment.filter((e) => e !== "wall" && e !== "rebounder");
  if (chips.includes("no-cones")) prof.equipment = prof.equipment.filter((e) => e !== "cones");
  if (chips.includes("small-space")) prof.space = "small";
  if (chips.includes("no-goal")) prof.equipment = prof.equipment.filter((e) => e !== "goal");
  return DRILLS.filter((x) => x.id !== d.id && x.skill === d.skill && fits(x, prof, excluded) && !x.tags.includes("warm-up") && !x.tags.includes("cool-down"))
    .sort((a, b) => Math.abs(a.difficulty - d.difficulty) - Math.abs(b.difficulty - d.difficulty))
    .slice(0, 4);
}

export function regenerateSession(plan: Plan, sessionId: string, p: Profile, prefs: Prefs, seed: number): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  const fresh = makeSession(hit.session.focus, hit.session.minutes, p, prefs, hit.wi, hit.day.dow, seed);
  fresh.id = hit.session.id;
  fresh.reason = `Re-cut on request: same focus, different drills. ${fresh.reason}`;
  hit.day.sessions = hit.day.sessions.map((s) => (s.id === sessionId ? fresh : s));
  return next;
}

export function adaptSession(plan: Plan, sessionId: string, p: Profile, prefs: Prefs, chips: string[]): Plan {
  let next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  const s = hit.session;
  const notes: string[] = [];
  for (const b of s.blocks) {
    const d = DRILL_BY_ID[b.drillId];
    if (!d) continue;
    const needsWall = d.equipment.includes("wall");
    const needsCones = d.equipment.includes("cones");
    const needsGoal = d.equipment.includes("goal");
    const bigSpace = d.space !== "small";
    const swap =
      (chips.includes("no-wall") && needsWall) ||
      (chips.includes("no-cones") && needsCones) ||
      (chips.includes("no-goal") && needsGoal) ||
      (chips.includes("small-space") && bigSpace);
    if (swap) {
      const alt = alternativesFor(d.id, p, prefs, chips)[0];
      if (alt) {
        notes.push(`${d.name} → ${alt.name}`);
        b.drillId = alt.id;
      }
    }
  }
  if (chips.includes("less-time")) {
    next = setSessionMinutes(next, sessionId, Math.max(20, Math.round(s.minutes * 0.6)));
    notes.push(`trimmed to ${findSession(next, sessionId)!.session.minutes} min`);
  }
  const after = findSession(next, sessionId)!.session;
  after.reason = notes.length ? `Adapted for today (${notes.join(", ")}). ${after.reason}` : after.reason;
  return next;
}

export function addSession(plan: Plan, weekIdx: number, dayIdx: number, focus: Focus, minutes: number, p: Profile, prefs: Prefs, seed: number): Plan {
  const next = clone(plan);
  const day = next.weeks[weekIdx].days[dayIdx];
  const s = makeSession(focus, minutes, p, prefs, weekIdx, day.dow, seed);
  s.reason = `Added by you. ${s.reason}`;
  day.sessions.push(s);
  return next;
}

export function setStatus(plan: Plan, sessionId: string, status: Session["status"], log?: Session["log"]): Plan {
  const next = clone(plan);
  const hit = findSession(next, sessionId);
  if (!hit) return plan;
  hit.session.status = status;
  if (log) hit.session.log = log;
  return next;
}

export function scaleWeek(plan: Plan, weekIdx: number, factor: number): Plan {
  let next = clone(plan);
  for (const day of next.weeks[weekIdx].days)
    for (const s of day.sessions) if (s.status === "planned") next = setSessionMinutes(next, s.id, Math.round(s.minutes * factor));
  return next;
}

/* ---------------- Reading the plan ---------------- */

export function dayLoad(day: Day) {
  return day.sessions.reduce((a, s) => a + (s.status === "skipped" ? 0 : s.minutes * s.intensity), 0);
}

export function weekPlanned(week: Week) {
  return week.days.reduce((a, d) => a + d.sessions.reduce((x, s) => x + (s.status === "skipped" ? 0 : s.minutes), 0), 0);
}

export function weekDone(week: Week) {
  return week.days.reduce((a, d) => a + d.sessions.reduce((x, s) => x + (s.status === "done" || s.status === "partial" ? (s.log?.minutes ?? s.minutes) : 0), 0), 0);
}

export type Advice = { kind: "warn" | "tip" | "ok"; text: string };

export function weekAdvice(week: Week, p: Profile): Advice[] {
  const out: Advice[] = [];
  const loads = week.days.map(dayLoad);
  for (let i = 0; i < 6; i++) {
    if (loads[i] >= 45 && loads[i + 1] >= 45) {
      out.push({ kind: "warn", text: `Two hard days back to back (${DOW[week.days[i].dow]}, ${DOW[week.days[i + 1].dow]}). Move one, or I can make ${DOW[week.days[i + 1].dow]} lighter.` });
      break;
    }
  }
  for (let i = 0; i < 7; i++) {
    const d = week.days[i];
    if (d.teamDay && d.sessions.length) {
      out.push({ kind: "warn", text: `${DOW[d.dow]} is a team training day and now has a ${d.sessions[0].minutes} min session on top. Keep it under 30 min or move it.` });
      break;
    }
  }
  const planned = weekPlanned(week);
  if (planned < week.targetMinutes - 20) out.push({ kind: "tip", text: `Week ${week.index + 1} is ${week.targetMinutes - planned} min under your ${week.targetMinutes} min target. Add a short session or extend one.` });
  else if (planned > week.targetMinutes + 30) out.push({ kind: "warn", text: `Week ${week.index + 1} is ${planned - week.targetMinutes} min over target. More is not better at ${p.age}; I would trim the longest day.` });
  const skills = new Set<Focus>();
  for (const d of week.days) for (const s of d.sessions) skills.add(s.focus);
  if (!skills.has("dribbling") && !skills.has("mixed")) out.push({ kind: "tip", text: "No ball-control day this week. One is worth keeping, even 20 minutes." });
  if (out.length === 0) out.push({ kind: "ok", text: `Week ${week.index + 1} is balanced: ${planned} of ${week.targetMinutes} min, hard days spaced, every fundamental covered.` });
  return out;
}

/* ---------------- Ratings (derived from behaviour, not biomechanics) ---------------- */

export function baselineRatings(p: Profile): Ratings {
  const base = p.experience === "beginner" ? 38 : p.experience === "intermediate" ? 52 : 66;
  const r: Ratings = { dribbling: base, passing: base, shooting: base, defending: base, fitness: base };
  const mod: Partial<Record<Skill, number>> = (
    {
      GK: { defending: 6, shooting: -8, dribbling: -6 },
      CB: { defending: 8, dribbling: -4, shooting: -4 },
      FB: { defending: 4, fitness: 5, shooting: -4 },
      CDM: { defending: 6, passing: 4, shooting: -4 },
      CM: { passing: 6, fitness: 3, defending: -1 },
      CAM: { passing: 4, dribbling: 4, defending: -5 },
      W: { dribbling: 6, shooting: 2, defending: -6, fitness: 2 },
      ST: { shooting: 7, dribbling: 1, defending: -7 },
    } as Record<string, Partial<Record<Skill, number>>>
  )[p.position];
  for (const k of SKILLS) r[k] = Math.round(r[k] + (mod[k] ?? 0) + (p.age <= 13 ? -4 : p.age >= 17 ? 2 : 0));
  return r;
}

export type RatingPoint = { date: string; ratings: Ratings };

export function ratingHistory(p: Profile, plan: Plan | null): RatingPoint[] {
  const base = baselineRatings(p);
  const points: RatingPoint[] = [{ date: p.createdAt.slice(0, 10), ratings: { ...base } }];
  if (!plan) return points;
  const cur = { ...base };
  const done = plan.weeks
    .flatMap((w) => w.days.flatMap((d) => d.sessions.map((s) => ({ s, d }))))
    .filter(({ s }) => s.status === "done" || s.status === "partial")
    .sort((a, b) => (a.s.log?.date ?? a.d.date).localeCompare(b.s.log?.date ?? b.d.date));
  for (const { s, d } of done) {
    const frac = s.status === "partial" ? 0.5 : 1;
    for (const b of s.blocks) {
      const drill = DRILL_BY_ID[b.drillId];
      if (!drill || b.role === "cooldown") continue;
      const roleW = b.role === "main" ? 1 : b.role === "finisher" ? 0.45 : 0.2;
      const gain = b.minutes * (0.6 + 0.2 * drill.difficulty) * 0.085 * frac * roleW;
      cur[drill.skill] = Math.min(99, cur[drill.skill] + gain);
    }
    points.push({ date: s.log?.date ?? d.date, ratings: { ...cur, ...Object.fromEntries(SKILLS.map((k) => [k, Math.round(cur[k] * 10) / 10])) } as Ratings });
  }
  return points;
}

export function currentRatings(p: Profile, plan: Plan | null): Ratings {
  const h = ratingHistory(p, plan);
  const last = h[h.length - 1].ratings;
  return Object.fromEntries(SKILLS.map((k) => [k, Math.round(last[k])])) as Ratings;
}

export function overall(r: Ratings) {
  return Math.round(SKILLS.reduce((a, k) => a + r[k], 0) / SKILLS.length);
}

export function streak(plan: Plan | null, today: string): number {
  if (!plan) return 0;
  const weeks = plan.weeks;
  const map = new Map<string, Day>();
  for (const w of weeks) for (const d of w.days) map.set(d.date, d);
  let n = 0;
  let cursor = today;
  let guard = 0;
  while (guard++ < 60) {
    const d = map.get(cursor);
    if (!d) break;
    if (d.sessions.length === 0) {
      cursor = addDays(cursor, -1);
      continue;
    }
    const ok = d.sessions.some((s) => s.status === "done" || s.status === "partial");
    if (ok) n++;
    else if (cursor !== today) break;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function totals(plan: Plan | null) {
  let sessions = 0;
  let minutes = 0;
  const bySkill: Record<Skill, number> = { dribbling: 0, passing: 0, shooting: 0, defending: 0, fitness: 0 };
  if (!plan) return { sessions, minutes, bySkill };
  for (const w of plan.weeks)
    for (const d of w.days)
      for (const s of d.sessions)
        if (s.status === "done" || s.status === "partial") {
          sessions++;
          minutes += s.log?.minutes ?? s.minutes;
          for (const b of s.blocks) {
            const dr = DRILL_BY_ID[b.drillId];
            if (!dr) continue;
            if (b.role === "main") bySkill[dr.skill] += b.minutes;
            else if (b.role === "finisher") bySkill[dr.skill] += Math.round(b.minutes / 2);
          }
        }
  return { sessions, minutes, bySkill };
}

export function levelFor(xp: number) {
  const tiers = [
    { name: "Rookie", at: 0 },
    { name: "Prospect", at: 300 },
    { name: "Starter", at: 800 },
    { name: "Captain", at: 1600 },
    { name: "Pro", at: 3000 },
  ];
  let i = 0;
  for (let k = 0; k < tiers.length; k++) if (xp >= tiers[k].at) i = k;
  const next = tiers[i + 1];
  return { level: i + 1, name: tiers[i].name, at: tiers[i].at, next: next?.at ?? tiers[i].at, nextName: next?.name ?? "Max", progress: next ? (xp - tiers[i].at) / (next.at - tiers[i].at) : 1 };
}

export function xpFor(plan: Plan | null) {
  if (!plan) return 0;
  let xp = 0;
  for (const w of plan.weeks)
    for (const d of w.days)
      for (const s of d.sessions) {
        if (s.status === "done") xp += 40 + s.blocks.length * 10 + Math.round(s.minutes / 2);
        if (s.status === "partial") xp += 20 + Math.round(s.minutes / 3);
      }
  return xp;
}

export function todayIndex(plan: Plan, today: string): { wi: number; di: number } | null {
  for (const w of plan.weeks) for (let i = 0; i < 7; i++) if (w.days[i].date === today) return { wi: w.index, di: i };
  return null;
}

export function nextSession(plan: Plan, today: string): { session: Session; day: Day; wi: number; di: number; isToday: boolean } | null {
  const all = plan.weeks.flatMap((w) => w.days.map((d, di) => ({ d, wi: w.index, di })));
  for (const { d, wi, di } of all) {
    if (d.date < today) continue;
    const s = d.sessions.find((x) => x.status === "planned");
    if (s) return { session: s, day: d, wi, di, isToday: d.date === today };
  }
  return null;
}
