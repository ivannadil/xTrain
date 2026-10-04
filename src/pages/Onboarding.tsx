import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Play, Sparkle, PencilSimple } from "@phosphor-icons/react";
import clsx from "clsx";
import { useStore } from "../lib/store";
import { generatePlan, iso, mondayOf, DOW, DOW_LONG, parseISO } from "../lib/courseAI";
import { DRILLS, DRILL_BY_ID } from "../data/drills";
import { GOAL_LABEL, POSITION_LABEL, EQUIPMENT_LABEL, type Equipment, type Goal, type Plan, type Profile } from "../data/types";
import { EASE_OUT, EASE_RAMP, timecode } from "../lib/motion";
import { Button, Chip, AIVoice, TimeBadge } from "../components/ui";
import { Wordmark } from "../components/Wordmark";
import { DaysPicker, EQUIPMENT_OPTIONS, EXPERIENCE_OPTIONS, FOOT_OPTIONS, GOAL_OPTIONS, MultiChips, OptionGrid, POSITION_OPTIONS, SPACE_OPTIONS, Stepper, TextInput, minutesLabel } from "../components/ProfileFields";
import { FocusIcon } from "../components/FocusIcon";
import { PitchDiagram } from "../components/PitchDiagram";

type Draft = Omit<Profile, "createdAt">;

const STEPS = [
  { id: "name", group: "About you" },
  { id: "age", group: "About you" },
  { id: "position", group: "About you" },
  { id: "level", group: "About you" },
  { id: "foot", group: "About you" },
  { id: "goals", group: "Your goals" },
  { id: "team", group: "Your week" },
  { id: "week", group: "Your week" },
  { id: "space", group: "Your setup" },
  { id: "kit", group: "Your setup" },
  { id: "body", group: "Your setup" },
  { id: "summary", group: "Your plan" },
] as const;
type StepId = (typeof STEPS)[number]["id"];
const GROUPS = ["About you", "Your goals", "Your week", "Your setup", "Your plan"];

const WHY: Record<StepId, string> = {
  name: "So the coach notes sound like they are written to you, because they are.",
  age: "Training load guidelines change with age. Under 13 needs a guardian's OK.",
  position: "Position shapes the drill mix: a winger gets more cut-inside finishing, a centre back more duels.",
  level: "Sets the starting difficulty. You can move it later.",
  foot: "So weak-foot work targets the right foot.",
  goals: "Your first goal gets the freshest day of every week.",
  team: "Course AI keeps team days clear and caps the day before.",
  week: "Realistic beats ambitious. Three honest sessions beat five skipped ones.",
  space: "Some drills need 20 metres. Course AI only picks what fits.",
  kit: "No wall? No problem. Passing uses gates instead of rebounds.",
  body: "If something is sore, the plan starts lighter and avoids that movement.",
  summary: "Check it, then let Course AI cut the plan.",
};

export default function Onboarding() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [phase, setPhase] = useState<"form" | "building" | "reveal">("form");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [draft, setDraft] = useState<Draft>({
    name: "",
    age: 15,
    position: "W",
    experience: "intermediate",
    foot: "right",
    goals: [],
    daysPerWeek: 3,
    minutesPerSession: 45,
    equipment: [],
    space: "medium",
    teamDays: [],
    injuries: "",
    guardianEmail: "",
  });
  const step = STEPS[i];
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const toggle = <T extends string | number>(k: "goals" | "equipment" | "teamDays", v: T, max?: number) => {
    const arr = draft[k] as unknown as T[];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : max && arr.length >= max ? arr : [...arr, v];
    set(k, next as never);
  };

  const valid = (() => {
    switch (step.id) {
      case "name": return draft.name.trim().length >= 2;
      case "age": return draft.age >= 8 && draft.age <= 60 && (draft.age >= 13 || /@/.test(draft.guardianEmail ?? ""));
      case "goals": return draft.goals.length >= 1;
      default: return true;
    }
  })();

  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(Math.max(0, Math.min(STEPS.length - 1, n)));
  };
  const next = () => (valid ? go(i + 1) : undefined);
  const back = () => go(i - 1);

  const pick = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    set(k, v);
    setTimeout(() => go(i + 1), reduce ? 60 : 180);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "form") return;
      if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, i, valid]);

  const build = () => {
    const profile: Profile = { ...draft, name: draft.name.trim(), createdAt: new Date().toISOString() };
    const today = new Date();
    const mon = mondayOf(today);
    if (today.getDay() !== 1) mon.setDate(mon.getDate() + 7);
    const p = generatePlan(profile, { favorites: [], excluded: [] }, iso(mon), Math.floor(Math.random() * 1e6));
    setPlan(p);
    setPhase("building");
    dispatch({ type: "setProfile", profile });
  };

  const finish = (startSession?: string) => {
    if (plan) dispatch({ type: "setPlan", plan });
    navigate(startSession ? `/app/session/${startSession}` : "/app");
  };

  const groupIdx = GROUPS.indexOf(step.group);

  return (
    <div className="min-h-dvh bg-ink-1 text-ink-10 flex flex-col">
      <header className="flex items-center justify-between px-4 md:px-8 h-16">
        <Link to="/" aria-label="xTrain home"><Wordmark /></Link>
        {state.profile && phase === "form" && (
          <Link to="/app" className="text-[13px] text-ink-8 hover:text-ink-10">Back to {state.profile.name}'s plan</Link>
        )}
      </header>

      {phase === "form" && (
        <>
          <div className="px-4 md:px-8">
            <div className="mx-auto max-w-[640px]">
              <div className="flex gap-1.5" aria-hidden>
                {GROUPS.map((g, gi) => {
                  const stepsIn = STEPS.filter((s) => s.group === g).length;
                  const doneIn = STEPS.slice(0, i).filter((s) => s.group === g).length + (step.group === g ? 0.5 : 0);
                  const fill = gi < groupIdx ? 1 : gi === groupIdx ? Math.min(1, doneIn / stepsIn) : 0;
                  return (
                    <div key={g} className="flex-1">
                      <div className="h-[3px] rounded-full bg-ink-4 overflow-hidden">
                        <div className="h-full bg-teal rounded-full origin-left transition-transform duration-500" style={{ transform: `scaleX(${fill})`, transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }} />
                      </div>
                      <div className={clsx("mt-1.5 caption text-[10px] tracking-[0.1em] hidden sm:block", gi === groupIdx ? "text-ink-10" : "text-ink-7")}>{g}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 timecode text-[11px] text-ink-7">
                {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </div>
            </div>
          </div>

          <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
            <div className="mx-auto max-w-[640px]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step.id}
                  custom={dir}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 28, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -20, filter: "blur(4px)", transition: { duration: 0.14 } }}
                  transition={{ duration: 0.34, ease: EASE_OUT }}
                >
                  <StepView
                    id={step.id}
                    draft={draft}
                    set={set}
                    toggle={toggle}
                    pick={pick}
                    goTo={(id) => go(STEPS.findIndex((s) => s.id === id))}
                    onBuild={build}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" onClick={back} disabled={i === 0} icon={<ArrowLeft size={16} />}>Back</Button>
                {step.id !== "summary" ? (
                  <Button variant="primary" size="lg" onClick={next} disabled={!valid} iconRight={<ArrowRight size={16} weight="bold" />}>
                    {["position", "level", "foot", "space"].includes(step.id) ? "Next" : "Continue"}
                  </Button>
                ) : null}
              </div>
            </div>
          </main>
        </>
      )}

      {phase === "building" && plan && <Building plan={plan} draft={draft} onDone={() => setPhase("reveal")} reduce={!!reduce} />}
      {phase === "reveal" && plan && <Reveal plan={plan} draft={draft} onHome={() => finish()} onStart={(id) => finish(id)} reduce={!!reduce} />}
    </div>
  );
}

function Title({ children, why }: { children: React.ReactNode; why: string }) {
  return (
    <div className="mb-6">
      <h1 className="display text-[30px] md:text-[40px] text-ink-10 text-balance">{children}</h1>
      <p className="mt-2 text-[14px] text-ink-8 max-w-[52ch]">{why}</p>
    </div>
  );
}

function StepView({ id, draft, set, toggle, pick, goTo, onBuild }: { id: StepId; draft: Draft; set: <K extends keyof Draft>(k: K, v: Draft[K]) => void; toggle: <T extends string | number>(k: "goals" | "equipment" | "teamDays", v: T, max?: number) => void; pick: <K extends keyof Draft>(k: K, v: Draft[K]) => void; goTo: (id: StepId) => void; onBuild: () => void }) {
  switch (id) {
    case "name":
      return (
        <>
          <Title why={WHY.name}>What do your teammates call you?</Title>
          <TextInput id="name" value={draft.name} onChange={(v) => set("name", v)} placeholder="Your first name" autoFocus maxLength={24} />
        </>
      );
    case "age":
      return (
        <>
          <Title why={WHY.age}>How old are you?</Title>
          <Stepper value={draft.age} onChange={(v) => set("age", v)} min={8} max={60} step={1} />
          {draft.age < 13 && (
            <div className="mt-6 rounded-md bg-ink-2 hairline p-4">
              <div className="font-semibold text-ink-10">A guardian needs to say yes</div>
              <p className="text-[13px] text-ink-8 mt-1 mb-3">We email them a consent request before anything is stored. Nothing else happens until they approve.</p>
              <TextInput id="guardian" type="email" inputMode="email" value={draft.guardianEmail ?? ""} onChange={(v) => set("guardianEmail", v)} placeholder="parent@example.com" />
            </div>
          )}
        </>
      );
    case "position":
      return (
        <>
          <Title why={WHY.position}>Where do you play?</Title>
          <OptionGrid options={POSITION_OPTIONS} value={draft.position} onChange={(v) => pick("position", v)} cols={2} />
        </>
      );
    case "level":
      return (
        <>
          <Title why={WHY.level}>Where are you right now?</Title>
          <OptionGrid options={EXPERIENCE_OPTIONS} value={draft.experience} onChange={(v) => pick("experience", v)} cols={3} />
        </>
      );
    case "foot":
      return (
        <>
          <Title why={WHY.foot}>Stronger foot?</Title>
          <OptionGrid options={FOOT_OPTIONS} value={draft.foot} onChange={(v) => pick("foot", v)} cols={3} />
        </>
      );
    case "goals":
      return (
        <>
          <Title why={WHY.goals}>What do you want to be better at by the end of the month?</Title>
          <MultiChips options={GOAL_OPTIONS} value={draft.goals} onToggle={(v) => toggle<Goal>("goals", v, 2)} max={2} />
          <p className="mt-3 text-[12.5px] text-ink-7">Pick up to two. {draft.goals.length === 2 ? "That is the limit, on purpose." : ""}</p>
        </>
      );
    case "team":
      return (
        <>
          <Title why={WHY.team}>Which days do you train or play with a team?</Title>
          <DaysPicker value={draft.teamDays} onToggle={(d) => toggle<number>("teamDays", d)} />
          <p className="mt-3 text-[12.5px] text-ink-7">None is fine. Tap again to clear a day.</p>
        </>
      );
    case "week":
      return (
        <>
          <Title why={WHY.week}>How much solo training, honestly?</Title>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-[14px] font-semibold text-ink-10 mb-2">Days a week</div>
              <Stepper value={draft.daysPerWeek} onChange={(v) => set("daysPerWeek", v)} min={1} max={6} step={1} />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-ink-10 mb-2">Minutes a session</div>
              <div className="flex flex-wrap gap-2">
                {[20, 30, 45, 60, 75].map((m) => (
                  <Chip key={m} selected={draft.minutesPerSession === m} onClick={() => set("minutesPerSession", m)}><span className="timecode">{minutesLabel(m)}</span></Chip>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-ink-8">That is <span className="timecode text-ink-10">{timecode(draft.daysPerWeek * draft.minutesPerSession)}</span> a week on top of {draft.teamDays.length ? `${draft.teamDays.length} team day${draft.teamDays.length > 1 ? "s" : ""}` : "no team days"}.</p>
        </>
      );
    case "space":
      return (
        <>
          <Title why={WHY.space}>How much room do you usually have?</Title>
          <OptionGrid options={SPACE_OPTIONS} value={draft.space} onChange={(v) => pick("space", v)} cols={3} />
        </>
      );
    case "kit":
      return (
        <>
          <Title why={WHY.kit}>What can you get your hands on?</Title>
          <p className="text-[13px] text-ink-8 mb-3">A ball is assumed. Everything else is optional.</p>
          <MultiChips options={EQUIPMENT_OPTIONS} value={draft.equipment} onToggle={(v) => toggle<Equipment>("equipment", v)} />
        </>
      );
    case "body":
      return (
        <>
          <Title why={WHY.body}>Anything sore, or recovering from an injury?</Title>
          <TextInput id="inj" value={draft.injuries ?? ""} onChange={(v) => set("injuries", v)} placeholder="Nothing, or: left ankle, rolled it two weeks ago" />
        </>
      );
    case "summary":
      return (
        <>
          <Title why={WHY.summary}>Here is what Course AI will cut from.</Title>
          <dl className="grid gap-2 rounded-lg bg-ink-2 hairline p-4 md:p-5 text-[14px]">
            {[
              ["name", "Name", draft.name],
              ["age", "Age", String(draft.age)],
              ["position", "Position", POSITION_LABEL[draft.position]],
              ["level", "Level", EXPERIENCE_OPTIONS.find((o) => o.v === draft.experience)?.label ?? ""],
              ["foot", "Stronger foot", draft.foot],
              ["goals", "Goals", draft.goals.map((g) => GOAL_LABEL[g]).join(", ")],
              ["team", "Team days", draft.teamDays.length ? draft.teamDays.map((d) => DOW[d]).join(", ") : "None"],
              ["week", "Solo week", `${draft.daysPerWeek} days · ${timecode(draft.minutesPerSession)} each`],
              ["space", "Space", SPACE_OPTIONS.find((o) => o.v === draft.space)?.label ?? ""],
              ["kit", "Kit", draft.equipment.length ? draft.equipment.map((e) => EQUIPMENT_LABEL[e].split(" ")[0]).join(", ") : "Ball only"],
              ["body", "Body", draft.injuries?.trim() ? draft.injuries : "All good"],
            ].map(([id, k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr_auto] items-center gap-3 py-1">
                <dt className="text-ink-8">{k}</dt>
                <dd className="text-ink-10 capitalize truncate">{v}</dd>
                <button type="button" onClick={() => goTo(id as StepId)} aria-label={`Edit ${k}`} className="pressable grid h-8 w-8 place-items-center rounded-md text-ink-7 hover:text-ink-10 hover:bg-ink-3"><PencilSimple size={14} /></button>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <Button variant="primary" size="lg" onClick={onBuild} icon={<Sparkle size={18} weight="fill" />} full>
              Cut my plan
            </Button>
          </div>
        </>
      );
  }
}

/* ---------------- Building: the plan is cut like an edit ---------------- */
function Building({ plan, draft, onDone, reduce }: { plan: Plan; draft: Draft; onDone: () => void; reduce: boolean }) {
  const steps = useMemo(() => {
    const fits = DRILLS.filter((d) => d.equipment.every((e) => e === "ball" || draft.equipment.includes(e) || (e === "wall" && draft.equipment.includes("rebounder")))).length;
    return [
      `Reading ${draft.name}'s profile: ${POSITION_LABEL[draft.position].toLowerCase()}, ${EXPERIENCE_OPTIONS.find((o) => o.v === draft.experience)?.label.toLowerCase()}`,
      draft.teamDays.length ? `Blocking out team days (${draft.teamDays.map((d) => DOW[d]).join(", ")})` : "No team days to block, using the freshest days for your first goal",
      `Choosing from ${fits} drills that fit your kit and ${draft.space} space`,
      `Putting "${draft.goals[0] ? GOAL_LABEL[draft.goals[0]].toLowerCase() : "all-round work"}" on the freshest day`,
      "Spacing the hard sessions, keeping two rest days",
      "Writing a reason for every session",
    ];
  }, [draft]);
  const [k, setK] = useState(0);
  const week = plan.weeks[0];
  const sessions = week.days.flatMap((d) => d.sessions);
  const perStep = reduce ? 120 : 620;

  useEffect(() => {
    if (k >= steps.length) {
      const t = setTimeout(onDone, reduce ? 200 : 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setK((x) => x + 1), perStep);
    return () => clearTimeout(t);
  }, [k, steps.length, perStep, onDone, reduce]);

  const shown = Math.min(sessions.length, Math.round((k / steps.length) * sessions.length));

  return (
    <main className="flex-1 px-4 md:px-8 py-6 grid place-items-center" aria-live="polite">
      <div className="w-full max-w-[720px]">
        <h1 className="display text-[32px] md:text-[44px] text-ink-10">Four weeks, {draft.daysPerWeek} days each.</h1>
        <p className="mt-2 text-[14px] text-teal flex items-center gap-2"><Sparkle size={14} weight="fill" /> Course AI is cutting your plan</p>

        <div className="mt-6 h-[3px] w-full rounded-full bg-ink-4 overflow-hidden">
          <div className="h-full bg-teal rounded-full origin-left" style={{ transform: `scaleX(${k / steps.length})`, transition: `transform ${perStep}ms cubic-bezier(0.23,1,0.32,1)` }} />
        </div>

        <ol className="mt-5 grid gap-2">
          {steps.map((s, idx) => (
            <li key={s} className={clsx("flex items-center gap-3 text-[14px] transition-opacity duration-300", idx < k ? "text-ink-9" : idx === k ? "text-ink-10" : "text-ink-7 opacity-60")}>
              <span className={clsx("grid h-5 w-5 shrink-0 place-items-center rounded-full", idx < k ? "bg-teal text-ink-0" : idx === k ? "bg-ink-4 text-teal" : "bg-ink-3")}>
                {idx < k ? <Check size={12} weight="bold" /> : idx === k ? <span className="h-1.5 w-1.5 rounded-full bg-teal" style={{ animation: "blink 0.8s infinite" }} /> : null}
              </span>
              {s}
            </li>
          ))}
        </ol>

        {/* Week 1 assembling itself, clip by clip */}
        <div className="mt-8 flex gap-1.5 h-[88px] min-w-0">
          {week.days.map((d) => {
            const s = d.sessions[0];
            const idx = s ? sessions.indexOf(s) : -1;
            const visible = s && idx < shown;
            return (
              <motion.div
                key={d.date}
                layout
                className={clsx("rounded-md overflow-hidden min-w-0", s ? "bg-ink-3 hairline" : "bg-ink-2/60 min-w-[44px]")}
                style={{ flexGrow: s ? Math.max(s.minutes, 20) : 0, flexBasis: s ? 0 : "auto" }}
              >
                <AnimatePresence>
                  {visible && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 100% 0 0)", y: 6 }}
                      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0 }}
                      transition={{ duration: 0.55, ease: EASE_RAMP }}
                      className="h-full p-2.5 flex flex-col justify-between"
                    >
                      <span className="caption text-[10.5px] tracking-[0.1em] text-ink-8">{DOW[d.dow]}</span>
                      <div>
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-10 truncate"><FocusIcon focus={s!.focus} size={14} className="text-ink-8 shrink-0" />{s!.title.split(" · ")[0]}</div>
                        <div className="timecode text-[11px] text-ink-8">{timecode(s!.minutes)}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!s && <div className="h-full p-2.5 caption text-[10px] tracking-[0.1em] text-ink-7 flex flex-col justify-between"><span>{DOW[d.dow]}</span><span>{d.teamDay ? "Team" : "Rest"}</span></div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

/* ---------------- Reveal ---------------- */
function Reveal({ plan, draft, onHome, onStart, reduce }: { plan: Plan; draft: Draft; onHome: () => void; onStart: (id: string) => void; reduce: boolean }) {
  const week = plan.weeks[0];
  const first = week.days.flatMap((d) => d.sessions)[0];
  const firstDay = week.days.find((d) => d.sessions.includes(first))!;
  const main = DRILL_BY_ID[first.blocks.find((b) => b.role === "main")?.drillId ?? ""];
  const bullets = [
    draft.goals[0] ? `Because you said "${GOAL_LABEL[draft.goals[0]].toLowerCase()}", your first ${first.focus} day is ${DOW_LONG[firstDay.dow]}.` : `Your first session is ${DOW_LONG[firstDay.dow]}.`,
    draft.teamDays.length ? `Because you train with the team on ${draft.teamDays.map((d) => DOW[d]).join(" and ")}, those days stay clear and the day before is capped.` : `No team days, so your hard sessions sit on the freshest days with rest between.`,
    draft.equipment.includes("wall") || draft.equipment.includes("rebounder") ? "Because you have a wall, passing and first touch use rebounds for twice the reps." : "No wall listed, so passing uses gates you can set with cones or shoes.",
  ];
  const ref = useRef<HTMLDivElement>(null);
  return (
    <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
      <div className="mx-auto max-w-[960px]" ref={ref}>
        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
          <h1 className="display text-[36px] md:text-[56px] text-ink-10">Your plan is cut, {draft.name}.</h1>
          <p className="mt-2 text-[15px] text-ink-8">{plan.name.replace("4-week ", "Four weeks. ")}</p>
        </motion.div>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
          <motion.div className="min-w-0" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}>
            <h2 className="display text-[20px] text-ink-10 mb-3">Coach note</h2>
            <AIVoice>
              <ul className="grid gap-2">
                {bullets.map((b, i) => (
                  <motion.li key={b} initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.25 + i * 0.12 }}>
                    {b}
                  </motion.li>
                ))}
              </ul>
            </AIVoice>
            <div className="mt-5 grid gap-1.5">
              <div className="text-[13px] text-ink-8 mb-1">Week 1 · {week.theme}</div>
              <div className="flex gap-1.5 min-w-0">
                {week.days.map((d) => {
                  const s = d.sessions[0];
                  return (
                    <div key={d.date} className={clsx("rounded-md p-2 h-[72px] flex flex-col justify-between overflow-hidden min-w-0", s ? "bg-ink-3 hairline" : "bg-ink-2/60 min-w-[40px]")} style={{ flexGrow: s ? Math.max(s.minutes, 20) : 0, flexBasis: s ? 0 : "auto" }}>
                      <span className="caption text-[10px] tracking-[0.1em] text-ink-8">{DOW[d.dow]}</span>
                      {s ? (
                        <div className="min-w-0"><div className="text-[12px] font-semibold text-ink-10 truncate">{s.title.split(" · ")[0]}</div><div className="timecode text-[10.5px] text-ink-8">{timecode(s.minutes)}</div></div>
                      ) : (
                        <span className="caption text-[10px] tracking-[0.1em] text-ink-7">{d.teamDay ? "Team" : "Rest"}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }} className="clip-frame letterbox min-w-0">
            <div className="aspect-[4/3] sm:aspect-video relative">
              <div className="absolute inset-x-0 top-0 h-[72%] sm:h-full">{main && <PitchDiagram d={main.diagram} play={!reduce} />}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-0 via-ink-0/55 via-32% to-ink-0/5 sm:via-ink-0/75 sm:via-40% z-[1]" aria-hidden />
              <div className="absolute left-4 right-4 top-[9%] z-[3] flex items-start justify-between">
                <span className="caption caption-stroke text-[12px] tracking-[0.12em] text-ink-10">Session 1 · {DOW_LONG[firstDay.dow]} {parseISO(firstDay.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                <TimeBadge minutes={first.minutes} />
              </div>
              <div className="absolute left-4 right-4 bottom-[10%] z-[3]">
                <h2 className="display text-[30px] md:text-[40px] text-ink-10">{first.title.split(" · ")[0]}</h2>
                <p className="hidden sm:block text-[13px] text-ink-9 mt-1 max-w-[46ch]">{first.reason}</p>
                <div className="mt-4 hidden sm:flex flex-wrap gap-2">
                  <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => onStart(first.id)}>Start session 1 now</Button>
                  <Button variant="secondary" size="lg" onClick={onHome} iconRight={<ArrowRight size={16} />}>Go to my plan</Button>
                </div>
              </div>
            </div>
            <div className="sm:hidden p-4 bg-ink-2 grid gap-3">
              <p className="text-[13.5px] text-ink-9">{first.reason}</p>
              <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => onStart(first.id)} full>Start session 1 now</Button>
              <Button variant="secondary" size="lg" onClick={onHome} iconRight={<ArrowRight size={16} />} full>Go to my plan</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
