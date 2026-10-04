import type { Plan, Profile } from "./types";
import { addDays, generatePlan, iso, mondayOf, moveSession, setStatus, parseISO } from "../lib/courseAI";

/** Demo player. Synthetic; used so the prototype opens on a lived-in week. */
export function demoProfile(today = new Date()): Profile {
  const created = new Date(today);
  created.setDate(created.getDate() - 16);
  return {
    name: "Alex",
    age: 16,
    position: "W",
    experience: "intermediate",
    foot: "right",
    goals: ["shooting", "weak-foot"],
    daysPerWeek: 4,
    minutesPerSession: 45,
    equipment: ["cones", "wall", "goal"],
    space: "medium",
    teamDays: [2, 4],
    createdAt: created.toISOString(),
  };
}

export function demoPlan(profile: Profile, today = new Date()): Plan {
  const start = mondayOf(today);
  start.setDate(start.getDate() - 14);
  let plan = generatePlan(profile, { favorites: ["cut-inside-finish"], excluded: [] }, iso(start), 7);
  const todayIso = iso(today);
  const dow = today.getDay();

  // Make sure today is a training day so the demo opens on a session, not a rest day.
  const week = plan.weeks[2];
  const todayDay = week.days.find((d) => d.date === todayIso);
  if (todayDay && todayDay.sessions.length === 0) {
    const donor = week.days.find((d) => d.date > todayIso && d.sessions.length) ?? week.days.find((d) => d.sessions.length && d.date !== todayIso);
    if (donor) plan = moveSession(plan, donor.sessions[0].id, 2, week.days.indexOf(todayDay));
  }
  void dow;

  // Log weeks 1-2 and the days before today in week 3.
  const rpes = [6, 7, 5, 8, 6, 7, 6, 7, 5, 8];
  let k = 0;
  for (const w of plan.weeks) {
    for (const d of w.days) {
      if (d.date >= todayIso) continue;
      for (const s of d.sessions) {
        const skip = k === 4;
        const partial = k === 7;
        const status = skip ? "skipped" : partial ? "partial" : "done";
        plan = setStatus(plan, s.id, status, skip ? undefined : {
          date: d.date,
          minutes: partial ? Math.round(s.minutes * 0.55) : s.minutes + (k % 3 === 0 ? 3 : 0),
          rpe: rpes[k % rpes.length],
          pain: false,
          feel: k % 4 === 1 ? "hard" : k % 5 === 0 ? "easy" : "right",
        });
        k++;
      }
    }
  }
  return plan;
}

export function demoToday() {
  return iso(new Date());
}

export { addDays, parseISO };
