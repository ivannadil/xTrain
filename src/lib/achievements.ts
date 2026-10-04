import { BADGES } from "../data/badges";
import { DRILL_BY_ID } from "../data/drills";
import type { Plan, Profile } from "../data/types";
import { currentRatings, streak, totals, SKILLS_LIST } from "./courseAI";

export type BadgeState = { id: string; unlocked: boolean; progress: number; label: string };

export function evaluateBadges(plan: Plan | null, profile: Profile | null, today: string): BadgeState[] {
  const t = totals(plan);
  const s = streak(plan, today);
  const ratings = profile ? currentRatings(profile, plan) : null;
  let weakFootMinutes = 0;
  let maxWeekSessions = 0;
  let activeDays = 0;
  let planComplete = false;
  if (plan) {
    for (const w of plan.weeks) {
      let n = 0;
      for (const d of w.days)
        for (const x of d.sessions) {
          if (x.status === "done" || x.status === "partial") {
            n++;
            activeDays++;
            for (const b of x.blocks) if (b.weakFoot) weakFootMinutes += b.minutes;
          }
        }
      maxWeekSessions = Math.max(maxWeekSessions, n);
    }
    const all = plan.weeks.flatMap((w) => w.days.flatMap((d) => d.sessions));
    planComplete = all.length > 0 && all.every((x) => x.status !== "planned");
  }
  const wallDrills = Object.values(DRILL_BY_ID).filter((d) => d.equipment.includes("wall")).map((d) => d.id);
  const doneDrills = new Set<string>();
  if (plan) for (const w of plan.weeks) for (const d of w.days) for (const x of d.sessions) if (x.status === "done") for (const b of x.blocks) doneDrills.add(b.drillId);
  const wallDone = wallDrills.filter((id) => doneDrills.has(id)).length;
  const minRating = ratings ? Math.min(...SKILLS_LIST.map((k) => ratings[k])) : 0;

  const p = (n: number, of: number, unit: string): [number, string] => [Math.min(1, n / of), `${Math.min(n, of)} of ${of} ${unit}`];

  return BADGES.map((b) => {
    let progress = 0;
    let label = "";
    switch (b.id) {
      case "first-session": [progress, label] = p(t.sessions, 1, "session"); break;
      case "hat-trick": [progress, label] = p(maxWeekSessions, 3, "in a week"); break;
      case "streak-7": [progress, label] = p(s, 7, "days"); break;
      case "wall-master": [progress, label] = p(wallDone, wallDrills.length, "wall drills"); break;
      case "weak-foot-100": [progress, label] = p(weakFootMinutes, 100, "min"); break;
      case "hours-10": [progress, label] = p(Math.round(t.minutes / 60), 10, "hours"); break;
      case "early-bird": [progress, label] = p(0, 5, "sessions"); break;
      case "plan-complete": progress = planComplete ? 1 : 0; label = planComplete ? "Done" : "Finish week 4"; break;
      case "balanced": [progress, label] = p(minRating, 60, "lowest rating"); break;
      case "marathon": [progress, label] = p(activeDays, 30, "days"); break;
    }
    return { id: b.id, unlocked: progress >= 1, progress, label };
  });
}
