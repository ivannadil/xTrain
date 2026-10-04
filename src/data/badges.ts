import type { Badge } from "./types";

/** Synthetic unlock percentages for the prototype; replace with live data. */
export const BADGES: Badge[] = [
  { id: "first-session", name: "First Whistle", line: "Complete your first session", rule: "sessions>=1", pct: 71.4, tier: "bronze" },
  { id: "hat-trick", name: "Hat-trick Week", line: "Three sessions in one week", rule: "weekSessions>=3", pct: 38.2, tier: "bronze" },
  { id: "streak-7", name: "Seven Straight", line: "A seven-day training streak", rule: "streak>=7", pct: 12.6, tier: "silver" },
  { id: "wall-master", name: "Wall Master", line: "Finish every wall drill in the library", rule: "wallDrills=all", pct: 6.1, tier: "silver" },
  { id: "weak-foot-100", name: "Two-Footed", line: "100 minutes of weak-foot work", rule: "weakFootMinutes>=100", pct: 9.3, tier: "silver" },
  { id: "hours-10", name: "Ten Hours", line: "Ten hours of logged training", rule: "minutes>=600", pct: 17.8, tier: "silver" },
  { id: "early-bird", name: "Early Bird", line: "Five sessions before 8am", rule: "earlySessions>=5", pct: 4.4, tier: "gold" },
  { id: "plan-complete", name: "Full Season", line: "Complete a four-week plan", rule: "planComplete", pct: 3.4, tier: "gold" },
  { id: "balanced", name: "Complete Player", line: "Every skill above 60", rule: "allRatings>=60", pct: 2.1, tier: "gold" },
  { id: "marathon", name: "Marathon Trainer", line: "Thirty days of consistent practice", rule: "activeDays>=30", pct: 1.2, tier: "gold" },
];
