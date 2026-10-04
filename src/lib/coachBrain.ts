/**
 * Course AI chat brain: scripted intents over the real plan (PRD MVP scope).
 * Every reply is grounded in the player's plan; actions are real plan operations.
 */
import { DRILLS, DRILL_BY_ID } from "../data/drills";
import type { Plan, Profile } from "../data/types";
import { DOW_LONG, adaptSession, findSession, nextSession, scaleWeek, setSessionMinutes, todayIndex, weekAdvice, type Prefs } from "./courseAI";

export type CoachReply = {
  text: string;
  drills?: string[];
  action?: { label: string; apply: (plan: Plan) => Plan; toast: string };
  followups?: string[];
};

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

export function coachReply(q: string, plan: Plan | null, profile: Profile | null, prefs: Prefs, today: string): CoachReply {
  const s = q.toLowerCase().trim();
  if (!plan || !profile) {
    return { text: "I do not have a plan for you yet. Build one and I can answer questions about every session in it.", followups: ["How does the plan work?"] };
  }
  const ti = todayIndex(plan, today);
  const week = ti ? plan.weeks[ti.wi] : plan.weeks[0];
  const todaySession = ti ? plan.weeks[ti.wi].days[ti.di].sessions.find((x) => x.status === "planned") : undefined;
  const next = nextSession(plan, today);
  const name = profile.name;

  // Pain / injury: safety first, no diagnosis.
  if (has(s, "pain", "hurt", "injur", "sore", "ache", "knee", "ankle", "hamstring", "groin")) {
    const target = todaySession ?? next?.session;
    return {
      text: `Thanks for telling me, ${name}. I am not a doctor, so if it hurts to walk or it is swollen, stop and tell a parent or coach today. For training: I will keep your next two sessions lighter and drop the sprint work. Easy touches only until it feels normal for two days in a row.`,
      action: target
        ? {
            label: "Make the next session light",
            apply: (p) => setSessionMinutes(adaptSession(p, target.id, profile, prefs, ["less-time"]), target.id, Math.min(25, target.minutes)),
            toast: "Next session trimmed to an easy 25 minutes. Pain noted on your log.",
          }
        : undefined,
      followups: ["What can I do without running?", "Undo that"],
    };
  }

  if (has(s, "no wall", "without a wall", "wall is", "no rebounder")) {
    const target = todaySession ?? next?.session;
    return {
      text: target
        ? `No problem. I can re-cut ${target === todaySession ? "today's" : "your next"} session so every wall drill becomes a gate or cone version. Same skill, same minutes.`
        : "Noted. When I cut your next week, passing will use gates instead of rebounds.",
      action: target ? { label: "Re-cut without the wall", apply: (p) => adaptSession(p, target.id, profile, prefs, ["no-wall"]), toast: "Wall drills swapped for gate versions." } : undefined,
      drills: DRILLS.filter((d) => d.skill === "passing" && !d.equipment.includes("wall")).slice(0, 2).map((d) => d.id),
    };
  }

  if (has(s, "no cones", "without cones", "no goal", "small space", "backyard", "less time", "only have", "short on time", "10 minutes", "15 minutes", "20 minutes")) {
    const chips: string[] = [];
    if (has(s, "cone")) chips.push("no-cones");
    if (has(s, "goal")) chips.push("no-goal");
    if (has(s, "space", "backyard")) chips.push("small-space");
    if (has(s, "time", "minutes", "short")) chips.push("less-time");
    const target = todaySession ?? next?.session;
    return {
      text: target ? `Got it. I will adapt ${target === todaySession ? "today's" : "your next"} session: ${chips.map(chipLabel).join(", ")}. The focus stays the same.` : "Got it. I will keep that in mind for the next session I cut.",
      action: target && chips.length ? { label: "Adapt the session", apply: (p) => adaptSession(p, target.id, profile, prefs, chips), toast: `Session adapted: ${chips.map(chipLabel).join(", ")}.` } : undefined,
    };
  }

  if (has(s, "lighter", "too hard", "too much", "tired", "exhausted", "easier week", "ease off")) {
    return {
      text: `Fair. Week ${week.index + 1} is ${weekMinutes(week)} minutes planned. I can take 20% off every planned session; the drills stay, the main blocks get shorter. If you are tired two weeks running, that is a sign to drop a day, not just minutes.`,
      action: { label: "Make this week 20% lighter", apply: (p) => scaleWeek(p, week.index, 0.8), toast: `Week ${week.index + 1} is 20% lighter.` },
      followups: ["Why is this week harder?", "Drop a day instead"],
    };
  }

  if (has(s, "harder", "too easy", "more", "challenge", "not enough")) {
    return {
      text: `Good sign. Two ways up: more minutes, or harder versions of the same drills. I would start with the drill progressions (each drill page has one), then add 15% to the main blocks if it still feels easy next week.`,
      action: { label: "Add 15% to this week", apply: (p) => scaleWeek(p, week.index, 1.15), toast: `Week ${week.index + 1} is 15% longer.` },
      drills: (todaySession ?? next?.session)?.blocks.filter((b) => b.role === "main").map((b) => b.drillId).slice(0, 2),
    };
  }

  if (has(s, "weak foot", "weaker foot", "left foot", "right foot", "two-footed", "both feet")) {
    const weak = profile.foot === "left" ? "right" : "left";
    return {
      text: `Your weak foot is your ${weak}. The rule that works: slow it down until the technique matches your strong foot, then speed up. I already put weak-foot reps in your plan; these two drills are the fastest route. Do them three times a week for four weeks and log your target hits so you can see the line move.`,
      drills: ["weak-foot-wall-passing", "weak-foot-finishing"],
      followups: ["Add a weak-foot block to today", "How many reps?"],
    };
  }

  if (has(s, "first touch", "control", "touch")) {
    return {
      text: `First touch is a direction problem, not a softness problem. Take every touch away from where pressure would come from and make the second touch a pass or a shot. Start with the wall drill, then the aerial one.`,
      drills: ["wall-first-touch", "juggle-drop-control"],
    };
  }

  if (has(s, "stamina", "fitness", "last the", "tired in the", "90 minutes", "engine", "faster", "speed", "quick")) {
    const speed = has(s, "faster", "speed", "quick");
    return {
      text: speed
        ? `Speed for football is the first five metres. Short sprints from odd starts with full rest, twice a week, and ladder work for foot speed. Never sprint tired if the goal is speed.`
        : `Football fitness is sprint, turn, recover. Box intervals and shuttles build it faster than steady running. One conditioning day a week is already in your plan; a second short one is the next step.`,
      drills: speed ? ["acceleration-starts", "ladder-patterns"] : ["box-intervals", "shuttle-sprints"],
    };
  }

  if (has(s, "dribbl", "1v1", "beat", "skill move", "step over", "stepover")) {
    return {
      text: `Beating a player is rehearsal plus commitment. Pick two moves, not ten. Do them at a cone until the exit touch is explosive, then at a real defender in training. Your 1v1 menu drill is built for exactly this.`,
      drills: ["one-v-one-move-menu", "inside-outside-cuts"],
    };
  }

  if (has(s, "shoot", "finish", "score", "goal")) {
    return {
      text: `Placement first. Pick the corner before the run-up and hit it like a firm pass. Power comes later and only with the laces. As a ${profile.position === "W" ? "winger, the cut-inside finish is your money shot" : "player, finishing on the move beats stationary shots"}.`,
      drills: ["stationary-finishing", "cut-inside-finish"],
    };
  }

  if (has(s, "defend", "tackle", "duel", "header")) {
    return {
      text: `Defending alone means footwork. Stay side-on, small steps, never cross your feet, and never dive in. The shadow drill builds the stance; the recovery run teaches the angle.`,
      drills: ["shadow-defending-footwork", "recovery-run-block"],
    };
  }

  if (has(s, "why") && has(s, "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "today", "tomorrow")) {
    const dayIdx = DOW_LONG.findIndex((d) => s.includes(d.toLowerCase()));
    let day = week.days.find((d) => (dayIdx >= 0 ? d.dow === dayIdx : d.date === today));
    if (has(s, "tomorrow") && ti) day = week.days[Math.min(6, ti.di + 1)];
    const sess = day?.sessions[0];
    if (!day) return { text: "Which day do you mean? Try: why is Wednesday conditioning?" };
    if (!sess) return { text: `${DOW_LONG[day.dow]} is ${day.teamDay ? "a team training day, so I keep it clear to avoid piling load on top" : "a rest day. Rest is where the adaptation happens, and at your age two full rest days a week is the guideline"}.` };
    return { text: `${DOW_LONG[day.dow]}: ${sess.reason}`, followups: [`Swap ${DOW_LONG[day.dow]}'s drills`, "Make it shorter"] };
  }

  if (has(s, "why") || has(s, "how does", "how do you", "explain the plan")) {
    return {
      text: `I build each week from your profile: ${profile.daysPerWeek} days, ${profile.minutesPerSession} minutes, goals "${profile.goals.join('" and "')}", and the kit you listed. Every week keeps a ball-control day and a passing day, puts your main goal on the freshest day, and spaces the hard sessions. Each session card says why it exists, and you can drag any of them.`,
      followups: ["Why is this week harder?", "What should I do today?"],
    };
  }

  if (has(s, "today", "what should i do", "what's next", "whats next", "next session")) {
    const sess = todaySession ?? next?.session;
    if (!sess) return { text: "Nothing planned right now. Your plan is complete, so the next move is building a new one." };
    const d = DRILL_BY_ID[sess.blocks.find((b) => b.role === "main")?.drillId ?? ""];
    return {
      text: `${todaySession ? "Today" : `Next up, ${DOW_LONG[next!.day.dow]}`}: ${sess.title.split(" · ")[0]}, ${sess.minutes} minutes. ${sess.reason} The key drill is ${d?.name ?? "the main block"}.`,
      drills: d ? [d.id] : undefined,
      followups: ["Start it", "Make it shorter"],
    };
  }

  if (has(s, "missed", "skip", "couldn't", "could not", "didn't train", "reschedule", "move")) {
    return {
      text: `Missing a session is normal; stacking two the next day is the mistake. I do not auto-reschedule. Skip it, and the key drill rolls into your next session of that focus. If you want it back, drag it onto a free day in the plan and I will warn you if the week gets lopsided.`,
      followups: ["Open the plan", "Why no auto-reschedule?"],
    };
  }

  if (has(s, "streak", "motivat", "lazy", "don't feel", "dont feel", "bored")) {
    return {
      text: `Ten minutes counts. On low days, do the warm-up and the first main block only, log it as partial, and keep the streak alive. Consistency beats intensity every month of the year.`,
      action: todaySession ? { label: "Cut today to 20 minutes", apply: (p) => setSessionMinutes(p, todaySession.id, 20), toast: "Today is a 20-minute session. Still counts." } : undefined,
    };
  }

  if (has(s, "thank", "cheers", "nice", "great")) return { text: `Any time, ${name}. See you on the pitch.` };
  if (has(s, "hello", "hi", "hey", "yo")) return { text: `Hey ${name}. Ask me about any session, or tell me what changed (no wall, less time, sore legs) and I will re-cut around it.`, followups: ["What should I do today?", "Make this week lighter", "How do I improve my weak foot?"] };

  const adv = weekAdvice(week, profile)[0];
  return {
    text: `I am not sure I follow. I can explain any session, adapt one to your kit and time, change the week's load, or point you to drills for a skill. Right now my note on week ${week.index + 1} is: ${adv.text}`,
    followups: ["What should I do today?", "I don't have a wall", "How do I improve my weak foot?", "Make this week lighter"],
  };
}

function chipLabel(c: string) {
  return { "no-wall": "no wall", "no-cones": "no cones", "no-goal": "no goal", "small-space": "small space", "less-time": "less time" }[c] ?? c;
}
function weekMinutes(week: Plan["weeks"][number]) {
  return week.days.reduce((a, d) => a + d.sessions.reduce((x, s) => x + (s.status === "skipped" ? 0 : s.minutes), 0), 0);
}

export const STARTERS = ["What should I do today?", "I don't have a wall this week", "How do I improve my weak foot?", "Make this week lighter", "Why is Wednesday conditioning?", "I felt pain in my knee"];

export { findSession };
