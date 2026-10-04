import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { Play, ArrowRight, Sparkle, Check, DotsSixVertical, Swap, ArrowsIn, Pause } from "@phosphor-icons/react";
import clsx from "clsx";
import { DRILLS, DRILL_BY_ID } from "../data/drills";
import { demoPlan, demoProfile } from "../data/demo";
import { baselineRatings, currentRatings, dayLoad, DOW, DOW_LONG, moveSession, setSessionMinutes, weekAdvice } from "../lib/courseAI";
import { clock, timecode, EASE_OUT, EASE_RAMP } from "../lib/motion";
import { Button, AIVoice, TimeBadge, Chip } from "../components/ui";
import { Wordmark } from "../components/Wordmark";
import { PitchDiagram } from "../components/PitchDiagram";
import { DrillCard } from "../components/DrillCard";
import { FocusIcon } from "../components/FocusIcon";
import { Radar } from "../components/Charts";
import { RatingBars } from "../components/RatingBars";
import type { Plan, Week } from "../data/types";

const NAV = [
  { href: "#cut", label: "How it works" },
  { href: "#recut", label: "Re-cut" },
  { href: "#drills", label: "Drills" },
  { href: "#season", label: "Progress" },
];

export default function Landing() {
  const reduce = useReducedMotion();
  const profile = useMemo(() => demoProfile(), []);
  const plan = useMemo(() => demoPlan(profile), [profile]);

  useEffect(() => {
    if (reduce) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let alive = true;
    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reduce]);

  return (
    <div className="bg-ink-1 text-ink-10 min-h-dvh">
      <header className="sticky top-0 z-40 bg-ink-1/85 backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" aria-label="xTrain"><Wordmark /></Link>
          <nav aria-label="Sections" className="hidden md:flex items-center gap-6 text-[13.5px] text-ink-9">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-ink-10">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" to="/app">Open the demo</Button>
            <Button variant="primary" size="sm" to="/start?fresh=1" icon={<Sparkle size={14} weight="fill" />}>Build my plan</Button>
          </div>
        </div>
      </header>

      <Hero plan={plan} reduce={!!reduce} />
      <CutSection reduce={!!reduce} />
      <RecutSection plan={plan} reduce={!!reduce} />
      <DrillsSection />
      <SeasonSection plan={plan} profile={profile} reduce={!!reduce} />
      <PitchSection reduce={!!reduce} />
      <Roadmap />
      <Close />
      <footer className="border-t border-ink-4">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[12.5px] text-ink-8">
          <div className="flex items-center gap-3"><Wordmark /><span>Train like a pro, with AI as your coach.</span></div>
          <div>Prototype build. The demo player, drills, and badge percentages are synthetic.</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ plan, reduce }: { plan: Plan; reduce: boolean }) {
  const week = plan.weeks[2];
  const [scrub, setScrub] = useState<number | null>(null);
  const hero = DRILL_BY_ID["cut-inside-finish"];
  const words = ["Your", "training,", "cut", "like", "a", "highlight", "reel."];
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-10 md:pt-16 pb-12 md:pb-20 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center min-h-[calc(100dvh-64px)]">
        <div>
          <h1 className="display text-[44px] sm:text-[56px] md:text-[64px] xl:text-[76px] text-ink-10 max-w-[13ch]" aria-label="Your training, cut like a highlight reel.">
            {words.map((w, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block mr-[0.22em]"
                initial={reduce ? false : { opacity: 0, y: "0.35em", clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 -10% 0)" }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.08 + i * 0.06 }}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.55 }} className="mt-5 text-[16px] md:text-[18px] text-ink-9 max-w-[40ch] text-pretty">
            Tell xTrain who you are. Course AI cuts a four-week plan you can drag, swap and re-cut.
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.68 }} className="mt-7 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" to="/start?fresh=1" icon={<Sparkle size={18} weight="fill" />}>Build my plan</Button>
            <Button variant="secondary" size="lg" to="/app" icon={<Play size={16} weight="fill" />}>Open the demo</Button>
          </motion.div>
        </div>

        <motion.div className="min-w-0" initial={reduce ? false : { opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}>
          <div className="clip-frame letterbox">
            <div className="aspect-video relative">
              <PitchDiagram d={hero.diagram} play={scrub === null && !reduce} progress={scrub ?? undefined} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-0/90 via-ink-0/40 via-50% to-ink-0/5 z-[1]" aria-hidden />
              <div className="absolute left-4 right-4 top-[9%] z-[3] flex items-start justify-between">
                <span className="caption caption-stroke text-[12px] tracking-[0.12em] text-ink-10">Today · Shooting · Weak foot</span>
                <TimeBadge minutes={45} />
              </div>
              <div className="absolute left-4 right-4 bottom-[10%] z-[3]">
                <div className="display text-[28px] md:text-[40px] text-ink-10">Cut Inside & Finish</div>
                <div className="mt-2 flex gap-[3px]" aria-hidden>
                  {[5, 4, 13, 12, 6, 5].map((m, i) => (
                    <span key={i} className={clsx("h-[3px] rounded-full", i === 2 || i === 3 ? "bg-ink-10" : "bg-ink-10/45")} style={{ flexGrow: m }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="caption text-[10.5px] tracking-[0.12em] text-ink-8 whitespace-nowrap">Scrub it</span>
            <input type="range" min={0} max={100} value={scrub === null ? 100 : Math.round(scrub * 100)} onChange={(e) => setScrub(Number(e.target.value) / 100)} className="scrubber" aria-label="Scrub the drill" />
            <button type="button" onClick={() => setScrub(null)} className="pressable h-8 px-2.5 rounded-md bg-ink-3 text-[12px] font-semibold text-ink-9 inline-flex items-center gap-1.5"><Play size={13} weight="fill" /> Play</button>
          </div>
          <div className="mt-4">
            <MiniStrip week={week} today={plan.weeks[2].days[5].date} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniStrip({ week, today, highlight }: { week: Week; today: string; highlight?: number }) {
  const loads = week.days.map(dayLoad);
  const max = Math.max(40, ...loads);
  return (
    <div>
      <div className="flex gap-1.5 min-w-0">
        {week.days.map((d, i) => {
          const s = d.sessions[0];
          const isToday = d.date === today;
          return (
            <motion.div
              layout
              transition={{ type: "spring", duration: 0.55, bounce: 0.12 }}
              key={d.date}
              className={clsx("relative rounded-md p-2 h-[68px] flex flex-col justify-between overflow-hidden min-w-0", s ? "bg-ink-3 hairline" : "bg-ink-2/60 min-w-[36px]", highlight === i && "ring-2 ring-teal")}
              style={{ flexGrow: s ? Math.max(s.minutes, 20) : 0, flexBasis: s ? 0 : "auto" }}
            >
              <span className={clsx("caption text-[10px] tracking-[0.1em]", isToday ? "text-orange" : "text-ink-8")}>{isToday ? "Now" : DOW[d.dow]}</span>
              {s ? (
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[12px] font-semibold text-ink-10 truncate"><FocusIcon focus={s.focus} size={12} className="text-ink-8 shrink-0" />{s.title.split(" · ")[0]}</div>
                  <div className="timecode text-[10px] text-ink-8">{timecode(s.minutes)}</div>
                </div>
              ) : (
                <span className="caption text-[10px] tracking-[0.1em] text-ink-7">{d.teamDay ? "Team" : "Rest"}</span>
              )}
              {isToday && <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-orange" />}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5 items-end h-5" aria-hidden>
        {week.days.map((d, i) => {
          const s = d.sessions[0];
          return (
            <motion.div layout key={d.date} className="flex items-end min-w-[36px]" style={{ flexGrow: s ? Math.max(s.minutes, 20) : 0, flexBasis: s ? 0 : "auto" }}>
              <motion.div layout className={clsx("w-full rounded-sm", d.date === today ? "bg-orange" : "bg-teal/50")} animate={{ height: Math.max(2, (loads[i] / max) * 18) }} transition={{ duration: 0.5, ease: EASE_OUT }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- How it is cut ---------------- */
function CutSection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const inputs = [
    { k: "Position", v: "Winger" },
    { k: "Goals", v: "Score more · Trust my weak foot" },
    { k: "Week", v: "4 days · 45:00 · team Tue, Thu" },
    { k: "Kit", v: "Wall, cones, goal · medium space" },
  ];
  const steps = [
    "Blocks out team days and caps the day before",
    "Picks from 30 drills that fit a wall, cones and a medium space",
    "Puts your first goal on the freshest day",
    "Keeps one ball-control and one passing day every week",
    "Writes a one-line reason for every session",
  ];
  return (
    <section id="cut" ref={ref} className="border-t border-ink-4">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start">
        <div className="min-w-0">
          <h2 className="display text-[36px] md:text-[52px] text-ink-10 max-w-[14ch]">Cut from your specs, not a template.</h2>
          <p className="mt-4 text-[16px] text-ink-9 max-w-[44ch]">Twelve questions. Then Course AI builds four weeks around your position, goals, days and kit.</p>
          <ul className="mt-6 grid gap-2">
            {inputs.map((x, i) => (
              <motion.li key={x.k} initial={reduce ? false : { opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.08 }} className="grid grid-cols-[90px_1fr] gap-3 rounded-md bg-ink-2 hairline px-3.5 py-2.5 text-[14px]">
                <span className="text-ink-8">{x.k}</span>
                <span className="text-ink-10">{x.v}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-ink-2 hairline p-5 md:p-7">
          <h3 className="display text-[22px] text-ink-10 flex items-center gap-2"><Sparkle size={18} weight="fill" className="text-teal" /> What Course AI does with it</h3>
          <ol className="mt-4 grid gap-2.5">
            {steps.map((s, i) => (
              <motion.li key={s} initial={reduce ? false : { opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.3 + i * 0.12 }} className="flex items-center gap-3 text-[15px] text-ink-10">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-ink-0"><Check size={13} weight="bold" /></span>
                {s}
              </motion.li>
            ))}
          </ol>
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 1.0 }} className="mt-6">
            <AIVoice compact>Why Wednesday is conditioning: one conditioning day a week keeps your technique working in the last 20 minutes, which is where wingers win games.</AIVoice>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Re-cut: scroll-driven demo ---------------- */
function RecutSection({ plan, reduce }: { plan: Plan; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3));
  const profile = useMemo(() => demoProfile(), []);
  const base = plan.weeks[2];
  const sat = base.days[5].sessions[0];
  const fri = base.days[4].sessions[0];
  const stages = useMemo(() => {
    const s0 = plan;
    const s1 = sat ? moveSession(plan, sat.id, 2, 6) : plan;
    const s2 = fri && sat ? moveSession(s1, fri.id, 2, 5) : s1;
    const s3 = fri ? setSessionMinutes(s2, fri.id, 25) : s2;
    return [s0, s1, s2, s3];
  }, [plan, sat, fri]);
  const week = stages[stage].weeks[2];
  const notes = [
    { title: "Drag any clip.", line: "Each day is a clip. Its width is exactly its minutes. Grab Saturday's dribbling and drop it on Sunday.", icon: DotsSixVertical },
    { title: "Course AI re-balances.", line: "Moved Dribbling to Sunday. The load wave re-draws and the coach note rewrites itself.", icon: Sparkle },
    { title: "It warns before you break the week.", line: "Shooting onto Saturday puts two hard days back to back. You get: keep it, move anyway, or move and make it light.", icon: ArrowsIn },
    { title: "Swap, adapt, undo.", line: "Made Saturday light. Every edit has Undo. No wall today? Three chips re-cut the session around what you have.", icon: Swap },
  ];
  const advice = weekAdvice(week, profile)[0];
  const n = notes[stage];
  return (
    <section id="recut" ref={ref} className="relative border-t border-ink-4" style={{ height: reduce ? "auto" : "320vh" }}>
      <div className={clsx("mx-auto max-w-[1280px] px-4 md:px-8", reduce ? "py-20" : "sticky top-0 h-dvh flex flex-col justify-center")}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
          <div>
            <h2 className="display text-[36px] md:text-[52px] text-ink-10 max-w-[12ch]">The plan is yours. Re-cut it.</h2>
            <p className="mt-3 text-[16px] text-ink-9 max-w-[44ch]">No other training app lets you drag your week around. xTrain does, and explains every cut.</p>
            <div className="mt-6 min-h-[120px]">
              <motion.div key={stage} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE_OUT }} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-ink-3 text-teal"><n.icon size={18} weight={n.icon === Sparkle ? "fill" : "regular"} /></span>
                <div>
                  <div className="font-semibold text-[16px] text-ink-10">{n.title}</div>
                  <p className="text-[14px] text-ink-9 mt-1 max-w-[46ch]">{n.line}</p>
                </div>
              </motion.div>
            </div>
            <div className="mt-2 flex gap-1.5" aria-hidden>
              {notes.map((_, i) => (
                <span key={i} className={clsx("h-[3px] w-10 rounded-full", i === stage ? "bg-orange" : i < stage ? "bg-ink-8" : "bg-ink-4")} />
              ))}
            </div>
            {reduce && (
              <div className="mt-4 flex gap-2">
                {notes.map((_, i) => (
                  <Chip key={i} size="sm" selected={stage === i} onClick={() => setStage(i)}>{i + 1}</Chip>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-ink-2 hairline p-4 md:p-6 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-ink-8">Week 3 · Sharpen</span>
              <span className="timecode text-[12px] text-ink-8">{week.days.reduce((a, d) => a + d.sessions.reduce((x, s) => x + s.minutes, 0), 0)} planned</span>
            </div>
            <MiniStrip week={week} today={base.days[5].date} highlight={stage === 1 ? 6 : stage >= 2 ? 5 : undefined} />
            <div className="mt-4">
              <AIVoice compact>{advice.text}</AIVoice>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Drills ---------------- */
function DrillsSection() {
  const picks = ["cut-inside-finish", "two-touch-wall-passes", "one-v-one-move-menu", "wall-first-touch", "shuttle-sprints", "driven-pass-gates", "shadow-defending-footwork", "self-serve-volleys"].map((id) => DRILL_BY_ID[id]);
  return (
    <section id="drills" className="border-t border-ink-4">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="display text-[36px] md:text-[52px] text-ink-10 max-w-[14ch]">Every drill, drawn.</h2>
            <p className="mt-3 text-[16px] text-ink-9 max-w-[48ch]">{DRILLS.length} drills you can run alone. Each one has a pitch plan you can scrub, three cues the player reads out mid-drill, the common mistakes, and a harder and an easier version.</p>
          </div>
          <Button variant="secondary" to="/app/drills" iconRight={<ArrowRight size={16} />}>Browse the library</Button>
        </div>
        <div className="rail no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 snap-x scroll-pl-4 md:scroll-pl-8">
          {picks.map((d) => (
            <div key={d.id} className="snap-start shrink-0">
              <DrillCard drill={d} size="sm" to={`/app/drills/${d.id}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Season ---------------- */
function SeasonSection({ plan, profile, reduce }: { plan: Plan; profile: ReturnType<typeof demoProfile>; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });
  const cur = currentRatings(profile, plan);
  const base = baselineRatings(profile);
  return (
    <section id="season" ref={ref} className="border-t border-ink-4">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
        <div className="rounded-lg bg-ink-2 hairline p-5 md:p-7 min-w-0">
          <Radar ratings={cur} baseline={base} size={300} start={inView} />
          <div className="mt-2"><RatingBars ratings={cur} baseline={base} dense /></div>
        </div>
        <div>
          <h2 className="display text-[36px] md:text-[52px] text-ink-10 max-w-[12ch]">Ratings you earn, not guesses.</h2>
          <p className="mt-4 text-[16px] text-ink-9 max-w-[46ch]">Five skills, 0 to 100, moved only by minutes logged, consistency and the difficulty you actually trained at. The dashed line is where you started. Scrub the season to any day.</p>
          <ul className="mt-6 grid gap-3 text-[15px] text-ink-10">
            {["Levels from Rookie to Pro, XP for every logged session", "Badges with how many players have them", "A consistency grid that shows the honest picture"].map((t, i) => (
              <motion.li key={t} initial={reduce ? false : { opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.2 + i * 0.1 }} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-dim text-teal"><Check size={13} weight="bold" /></span>
                {t}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- On the pitch: a real mini player ---------------- */
function PitchSection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const drill = DRILL_BY_ID["weak-foot-wall-passing"];
  const [left, setLeft] = useState(8 * 60);
  const [running, setRunning] = useState(true);
  const [cue, setCue] = useState(0);
  useEffect(() => {
    if (!inView || !running || reduce) return;
    const t = setInterval(() => setLeft((s) => (s <= 0 ? 8 * 60 : s - 1)), 1000);
    const c = setInterval(() => setCue((x) => x + 1), 6000);
    return () => {
      clearInterval(t);
      clearInterval(c);
    };
  }, [inView, running, reduce]);
  return (
    <section ref={ref} className="border-t border-ink-4">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center">
        <div>
          <h2 className="display text-[36px] md:text-[52px] text-ink-10 max-w-[12ch]">Built for a phone propped against a wall.</h2>
          <p className="mt-4 text-[16px] text-ink-9 max-w-[46ch]">A timer you can read from the penalty spot. One cue at a time. Rest counts itself down. Space bar pauses. Afterwards: effort, pain, and how it felt, in three taps.</p>
        </div>
        <div className="clip-frame letterbox min-w-0">
          <div className="relative aspect-[4/3] sm:aspect-video">
            <div className="absolute inset-0 opacity-60"><PitchDiagram d={drill.diagram} play={inView && running && !reduce} muted /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-1 via-ink-1/60 to-ink-1/20" aria-hidden />
            <div className="absolute inset-0 z-[2] flex flex-col justify-between px-5 pt-[10%] pb-[11%]">
              <div>
                <div className="flex items-center justify-between caption text-[10.5px] tracking-[0.12em] text-ink-8">
                  <span>Drill 3 of 6 · <span className="text-ink-9">Passing</span></span>
                  <span className="timecode">{clock(8 * 60 - left + 9 * 60)} / 45:00</span>
                </div>
                <div className="display text-[20px] md:text-[28px] text-ink-10 mt-1.5">{drill.name}</div>
              </div>
              <div className="text-center">
                <div className={clsx("timecode display text-[56px] md:text-[88px] leading-none", running ? "text-ink-10" : "text-ink-8")}>{clock(left)}</div>
                <motion.div key={cue % 3} initial={reduce ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 0.5, ease: EASE_RAMP }} className="mt-2 caption caption-stroke text-[14px] md:text-[18px] tracking-[0.03em] text-ink-10">
                  {drill.cues[cue % 3]}
                </motion.div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2 max-w-[420px] w-full mx-auto">
                <Button variant="primary" size="lg" icon={running ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />} onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Resume"}</Button>
                <Button variant="secondary" size="lg" aria-label="Next drill">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Roadmap, honest ---------------- */
function Roadmap() {
  const items = [
    { title: "Course AI", line: "Plans, re-cuts, coach chat. In this build, rule-based and transparent.", tag: "Now" },
    { title: "Coach and parent view", line: "Permissioned, read-mostly: adherence, trends, a place to comment.", tag: "Next" },
    { title: "Coach AI", line: "Camera-based rep counting and technique cues from the phone. On the roadmap, not shipped.", tag: "Later" },
  ];
  return (
    <section className="border-t border-ink-4">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-16 md:py-20">
        <h2 className="display text-[28px] md:text-[36px] text-ink-10">What is real today, and what is not yet.</h2>
        <dl className="mt-6 divide-y divide-ink-4 border-y border-ink-4">
          {items.map((it) => (
            <div key={it.title} className="grid grid-cols-[72px_1fr] md:grid-cols-[96px_220px_1fr] gap-x-4 gap-y-1 py-4 items-baseline">
              <dt className={clsx("timecode text-[13px]", it.tag === "Now" ? "text-teal" : "text-ink-8")}>{it.tag}</dt>
              <dd className="font-semibold text-[16px] text-ink-10">{it.title}</dd>
              <dd className="col-start-2 md:col-start-3 text-[14px] text-ink-9">{it.line}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="border-t border-ink-4">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
        <div className="clip-frame letterbox p-8 md:p-14 grid gap-6 md:grid-cols-[1fr_auto] items-end min-h-[320px]">
          <div>
            <h2 className="display-wide text-[40px] md:text-[64px] xl:text-[72px] text-ink-10 mt-2 max-w-[12ch]">Press play on your season.</h2>
            <p className="mt-4 text-[16px] text-ink-9 max-w-[42ch]">Twelve questions, one minute, four weeks you can actually keep.</p>
          </div>
          <div className="flex flex-col gap-2 min-w-[220px]">
            <Button variant="primary" size="lg" to="/start?fresh=1" icon={<Sparkle size={18} weight="fill" />} full>Build my plan</Button>
            <Button variant="secondary" size="lg" to="/app" full>Open the demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { DOW_LONG };
