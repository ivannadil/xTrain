import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, Pause, SkipForward, X, Check, Plus, SpeakerHigh, SpeakerSlash, Warning, ArrowLeft, House, FilmStrip, Trophy } from "@phosphor-icons/react";
import clsx from "clsx";
import { usePlanOps } from "../lib/hooks";
import { DRILL_BY_ID } from "../data/drills";
import { currentRatings, findSession, levelFor, setStatus, xpFor, overall } from "../lib/courseAI";
import { SKILLS, SKILL_LABEL, type SessionLog } from "../data/types";
import { clock, timecode, EASE_OUT, EASE_RAMP } from "../lib/motion";
import { Button, Chip, Page, Tag } from "../components/ui";
import { PitchDiagram } from "../components/PitchDiagram";
import { EquipmentIcons } from "../components/DrillCard";
import { Wordmark } from "../components/Wordmark";
import { CountUp } from "../components/Charts";

type Phase = "pre" | "run" | "rest" | "summary" | "saved";
const REST_SECONDS = 30;

export default function Session() {
  const { id } = useParams();
  const { state, dispatch } = usePlanOps();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const plan = state.plan;
  const hit = useMemo(() => (plan && id ? findSession(plan, id) : null), [plan, id]);

  const [phase, setPhase] = useState<Phase>("pre");
  const [bi, setBi] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(false);
  const [restLeft, setRestLeft] = useState(REST_SECONDS);
  const [cueIdx, setCueIdx] = useState(0);
  const [painFlag, setPainFlag] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [before] = useState(() => ({ xp: plan ? xpFor(plan) : 0, ratings: plan && state.profile ? currentRatings(state.profile, plan) : null }));
  const lastTick = useRef<number | null>(null);
  const wake = useRef<WakeLockSentinel | null>(null);

  const session = hit?.session;
  const block = session?.blocks[bi];
  const drill = block ? DRILL_BY_ID[block.drillId] : undefined;
  const blockSeconds = block ? block.minutes * 60 : 0;
  const intervals = drill?.work && drill?.rest ? { work: drill.work, rest: drill.rest } : null;

  // Timer: wall-clock based, robust to tab throttling.
  useEffect(() => {
    if (!running || phase !== "run") {
      lastTick.current = null;
      return;
    }
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      if (lastTick.current !== null) {
        const dt = (now - lastTick.current) / 1000;
        setElapsed((e) => e + dt);
        setTotalSeconds((t) => t + dt);
      }
      lastTick.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, phase]);

  // Auto-advance when the block ends.
  useEffect(() => {
    if (phase === "run" && blockSeconds > 0 && elapsed >= blockSeconds) finishBlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, blockSeconds, phase]);

  // Rest countdown.
  useEffect(() => {
    if (phase !== "rest") return;
    if (restLeft <= 0) {
      startBlock(bi);
      return;
    }
    const t = setTimeout(() => setRestLeft((r) => r - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, restLeft]);

  // Rotate cues.
  useEffect(() => {
    if (phase !== "run" || !running) return;
    const t = setInterval(() => setCueIdx((c) => c + 1), 11000);
    return () => clearInterval(t);
  }, [phase, running]);

  // Keep the screen awake while running.
  useEffect(() => {
    if (phase !== "run" && phase !== "rest") return;
    (async () => {
      try {
        wake.current = await navigator.wakeLock?.request("screen");
      } catch {}
    })();
    return () => {
      wake.current?.release().catch(() => {});
      wake.current = null;
    };
  }, [phase]);

  const speak = useCallback(
    (text: string) => {
      if (!voice || !("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.02;
        window.speechSynthesis.speak(u);
      } catch {}
    },
    [voice],
  );

  const startBlock = (i: number) => {
    setBi(i);
    setElapsed(0);
    setCueIdx(0);
    setPhase("run");
    setRunning(true);
    const d = session ? DRILL_BY_ID[session.blocks[i].drillId] : undefined;
    if (d) speak(`${d.name}. ${d.cues[0]}.`);
  };

  const finishBlock = () => {
    if (!session || !block) return;
    setCompletedBlocks((c) => (c.includes(block.id) ? c : [...c, block.id]));
    setRunning(false);
    if (bi + 1 >= session.blocks.length) {
      setPhase("summary");
      return;
    }
    const nextRole = session.blocks[bi + 1].role;
    if (nextRole === "cooldown" || block.role === "warmup") {
      startBlock(bi + 1);
    } else {
      setBi(bi + 1);
      setRestLeft(REST_SECONDS);
      setPhase("rest");
      speak("Rest. Thirty seconds.");
    }
  };

  const skipBlock = () => {
    if (!session) return;
    setRunning(false);
    if (bi + 1 >= session.blocks.length) setPhase("summary");
    else startBlock(bi + 1);
  };

  // Keyboard: space pause, n next. No animation on keyboard actions.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "run") return;
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key.toLowerCase() === "n") finishBlock();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, bi, session]);

  if (!state.hydrated) return null;
  if (!plan || !session || !hit) return <Navigate to="/app" replace />;

  const totalPlanned = session.blocks.reduce((a, b) => a + b.minutes, 0);
  const doneMinutes = Math.round(totalSeconds / 60);

  /* ---------------- Save ---------------- */
  const save = (log: SessionLog, status: "done" | "partial" | "skipped") => {
    dispatch({ type: "setPlan", plan: setStatus(plan, session.id, status, status === "skipped" ? undefined : log) });
    setPhase("saved");
  };

  return (
    <div className="min-h-dvh bg-ink-1 text-ink-10 flex flex-col">
      {/* Chrome */}
      <header className="flex items-center justify-between px-4 md:px-6 h-14 hairline">
        <div className="flex items-center gap-3">
          <Link to="/app" aria-label="Back to home" className="grid h-9 w-9 place-items-center rounded-md hover:bg-ink-3 text-ink-8"><ArrowLeft size={18} /></Link>
          <Wordmark />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVoice((v) => !v)}
            aria-pressed={voice}
            className={clsx("pressable inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-semibold", voice ? "bg-teal-dim text-teal" : "bg-ink-3 text-ink-8 hover:text-ink-10")}
          >
            {voice ? <SpeakerHigh size={16} weight="fill" /> : <SpeakerSlash size={16} />} Voice cues
          </button>
          {(phase === "run" || phase === "rest") && (
            <Button size="sm" variant="ghost" icon={<X size={14} />} onClick={() => { setRunning(false); setPhase("summary"); }}>
              End
            </Button>
          )}
        </div>
      </header>

      {/* Chapter progress */}
      {(phase === "run" || phase === "rest") && (
        <div className="px-4 md:px-6 pt-3">
          <div className="flex gap-[3px]" aria-hidden>
            {session.blocks.map((b, i) => (
              <span key={b.id} className="h-[4px] rounded-full overflow-hidden bg-ink-4" style={{ flexGrow: b.minutes }}>
                <span
                  className={clsx("block h-full", completedBlocks.includes(b.id) || i < bi ? "bg-ink-9" : i === bi ? "bg-orange" : "bg-transparent")}
                  style={{ width: i === bi && phase === "run" ? `${Math.min(100, (elapsed / blockSeconds) * 100)}%` : "100%" }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[12.5px] text-ink-8">
            <span>
              Drill {bi + 1} of {session.blocks.length} · <span className="text-ink-9">{session.title.split(" · ")[0]}</span>
            </span>
            <span className="timecode">{clock(totalSeconds)} / {timecode(totalPlanned)}</span>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {/* ---------------- Pre ---------------- */}
          {phase === "pre" && (
            <motion.div key="pre" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.4, ease: EASE_OUT }} className="flex-1">
              <Page>
                <h1 className="display text-[36px] md:text-[56px] text-ink-10">
                  {session.title.split(" · ")[0]}
                  {session.title.includes(" · ") && <span className="block text-ink-9 text-[0.5em] font-semibold" style={{ fontStretch: "100%" }}>{session.title.split(" · ")[1]}</span>}
                </h1>
                <p className="mt-2 text-[13.5px] text-ink-8"><span className="timecode">{timecode(totalPlanned)}</span> · {session.blocks.length} drills</p>
                <p className="mt-3 text-ink-9 measure">{session.reason}</p>

                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_320px]">
                  <ol className="grid gap-1.5">
                    {session.blocks.map((b, i) => {
                      const d = DRILL_BY_ID[b.drillId];
                      return (
                        <li key={b.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-md bg-ink-2 hairline p-3">
                          <span className="timecode text-[12px] text-ink-7">{String(i + 1).padStart(2, "0")}</span>
                          <div>
                            <div className="font-semibold text-ink-10">{d?.name}</div>
                            <div className="text-[12.5px] text-ink-8">{d?.dose}{b.weakFoot ? " · weak foot" : ""}</div>
                          </div>
                          <span className="timecode text-[13px] text-ink-9">{timecode(b.minutes)}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="rounded-lg bg-ink-2 hairline p-4 grid gap-3 self-start">
                    <h2 className="display text-[18px]">Before you start</h2>
                    <ul className="grid gap-2 text-[13.5px] text-ink-9">
                      <li className="flex items-center gap-2"><EquipmentIcons list={Array.from(new Set(session.blocks.flatMap((b) => DRILL_BY_ID[b.drillId]?.equipment ?? [])))} /> <span>Get the kit out first.</span></li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-teal" /> Prop the phone where you can see it from the ball.</li>
                      <li className="flex items-center gap-2"><Check size={14} className="text-teal" /> Timer runs per drill; space bar pauses.</li>
                    </ul>
                    <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => startBlock(0)} full>
                      Start
                    </Button>
                  </div>
                </div>
              </Page>
            </motion.div>
          )}

          {/* ---------------- Run ---------------- */}
          {phase === "run" && block && drill && (
            <motion.div key={`run-${bi}`} initial={reduce ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.3, ease: EASE_OUT }} className="flex-1 flex flex-col">
              <div className="relative flex-1 min-h-[420px]">
                <div className="absolute inset-x-0 top-0 h-[26%] opacity-70">
                  <PitchDiagram d={drill.diagram} play={running && !reduce} muted />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-1 via-ink-1 via-72% to-ink-1/30" aria-hidden />

                <div className="relative z-[2] flex h-full flex-col justify-between p-4 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="display text-[36px] md:text-[56px] text-ink-10 max-w-[14ch]">{drill.name}</h1>
                      <p className="text-ink-9 text-[14px] md:text-[15px] mt-2 max-w-[52ch]">{drill.dose}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Tag>{block.role === "main" ? "Main" : block.role === "warmup" ? "Warm-up" : block.role === "finisher" ? "Finisher" : "Cool-down"}</Tag>
                        {block.weakFoot && <Tag tone="teal">Weak foot only</Tag>}
                        {intervals && <Tag tone="ink">{intervals.work}s on · {intervals.rest}s off</Tag>}
                      </div>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex flex-col items-center justify-center text-center my-6">
                    {intervals ? <IntervalReadout elapsed={elapsed} work={intervals.work} rest={intervals.rest} /> : null}
                    <div className={clsx("timecode display tabular-nums text-[88px] sm:text-[120px] md:text-[160px] leading-none", running ? "text-ink-10" : "text-ink-8")} aria-live="off">
                      {clock(Math.max(0, blockSeconds - elapsed))}
                    </div>
                    <div className="caption text-[11px] tracking-[0.14em] text-ink-8 mt-2">{running ? "Remaining" : "Paused"}</div>
                  </div>

                  {/* Cue card */}
                  <div className="min-h-[64px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={cueIdx % drill.cues.length}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                        animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.5, ease: EASE_RAMP }}
                        className="caption caption-stroke text-[18px] md:text-[26px] tracking-[0.03em] text-ink-10 text-center max-w-[32ch]"
                      >
                        {drill.cues[cueIdx % drill.cues.length]}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Controls: large targets for field use */}
                  <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-3 items-center max-w-[720px] w-full mx-auto">
                    <Button variant="primary" size="lg" className="h-16 text-[16px]" icon={running ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />} onClick={() => setRunning((r) => !r)}>
                      {running ? "Pause" : "Resume"}
                    </Button>
                    <Button variant="secondary" size="lg" className="h-16" icon={<SkipForward size={20} weight="fill" />} onClick={finishBlock} aria-label="Next drill">
                      <span className="hidden sm:inline">Next</span>
                    </Button>
                    <Button variant={painFlag ? "danger" : "ghost"} size="lg" className="h-16" icon={<Warning size={20} weight={painFlag ? "fill" : "regular"} />} onClick={() => setPainFlag((p) => !p)} aria-pressed={painFlag} aria-label="Flag pain">
                      <span className="hidden sm:inline">{painFlag ? "Pain flagged" : "Pain?"}</span>
                    </Button>
                  </div>
                  <div className="mt-2 text-center">
                    <button type="button" onClick={skipBlock} className="text-[12.5px] text-ink-8 hover:text-ink-10 underline underline-offset-4 decoration-ink-6 py-2 px-3">
                      Skip this drill
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------- Rest ---------------- */}
          {phase === "rest" && block && drill && (
            <motion.div key="rest" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <h1 className="display text-[28px] md:text-[36px] text-teal">Rest</h1>
              <div className="timecode display text-[120px] md:text-[180px] leading-none text-ink-10 mt-2">{clock(restLeft)}</div>
              <h2 className="display text-[28px] md:text-[40px] text-ink-10 mt-6">Up next: {drill.name}</h2>
              <p className="text-ink-9 mt-2 max-w-[48ch]">{drill.setup}</p>
              <div className="mt-6 flex gap-2">
                <Button variant="secondary" size="lg" icon={<Plus size={16} weight="bold" />} onClick={() => setRestLeft((r) => r + 15)}>+15 s</Button>
                <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => startBlock(bi)}>Go now</Button>
              </div>
            </motion.div>
          )}

          {/* ---------------- Summary ---------------- */}
          {phase === "summary" && (
            <motion.div key="summary" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.4, ease: EASE_OUT }} className="flex-1">
              <Summary
                plannedMinutes={totalPlanned}
                doneMinutes={doneMinutes}
                completed={completedBlocks.length}
                total={session.blocks.length}
                painDefault={painFlag}
                today={state.today}
                onSave={save}
              />
            </motion.div>
          )}

          {/* ---------------- Saved: freeze frame ---------------- */}
          {phase === "saved" && (
            <motion.div key="saved" initial={reduce ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="flex-1">
              <Saved before={before} onHome={() => navigate("/app")} onPlan={() => navigate("/app/plan")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function IntervalReadout({ elapsed, work, rest }: { elapsed: number; work: number; rest: number }) {
  const cycle = work + rest;
  const inCycle = elapsed % cycle;
  const working = inCycle < work;
  const left = working ? work - inCycle : cycle - inCycle;
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className={clsx("caption text-[14px] md:text-[18px] tracking-[0.14em] px-3 py-1 rounded-sm", working ? "bg-orange text-ink-0" : "bg-teal-dim text-teal")}>{working ? "Work" : "Rest"}</span>
      <span className="timecode text-[20px] md:text-[26px] text-ink-9">{clock(Math.ceil(left))}</span>
    </div>
  );
}

function Summary({ plannedMinutes, doneMinutes, completed, total, painDefault, today, onSave }: { plannedMinutes: number; doneMinutes: number; completed: number; total: number; painDefault: boolean; today: string; onSave: (log: SessionLog, status: "done" | "partial" | "skipped") => void }) {
  const full = completed >= total;
  const [status, setStatus] = useState<"done" | "partial" | "skipped">(full ? "done" : completed > 0 ? "partial" : "skipped");
  const [minutes, setMinutes] = useState(Math.max(doneMinutes, status === "done" ? plannedMinutes : doneMinutes));
  const [rpe, setRpe] = useState(6);
  const [pain, setPain] = useState(painDefault);
  const [feel, setFeel] = useState<"easy" | "right" | "hard">("right");
  const [note, setNote] = useState("");
  return (
    <Page>
      <div className="max-w-[640px]">
        <h1 className="display text-[36px] md:text-[44px] text-ink-10">{full ? "That's a wrap." : "Log what you did."}</h1>
        <p className="text-ink-9 mt-2">{completed} of {total} drills. Course AI uses this to set next week's load, so be honest.</p>

        <div className="mt-6 grid gap-5">
          <Field label="Completion">
            <div className="flex flex-wrap gap-2">
              <Chip selected={status === "done"} onClick={() => { setStatus("done"); setMinutes(Math.max(doneMinutes, plannedMinutes)); }}>Full</Chip>
              <Chip selected={status === "partial"} onClick={() => { setStatus("partial"); setMinutes(doneMinutes || Math.round(plannedMinutes / 2)); }}>Partial</Chip>
              <Chip selected={status === "skipped"} onClick={() => setStatus("skipped")}>Skipped</Chip>
            </div>
          </Field>
          {status !== "skipped" && (
            <>
              <Field label={`Minutes trained · ${minutes}`}>
                <input type="range" min={5} max={90} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="scrubber" aria-label="Minutes trained" />
              </Field>
              <Field label={`Effort (RPE) · ${rpe} of 10`}>
                <input type="range" min={1} max={10} value={rpe} onChange={(e) => setRpe(Number(e.target.value))} className="scrubber" aria-label="Rate of perceived exertion" />
                <div className="flex justify-between timecode text-[10.5px] text-ink-7 -mt-1"><span>Easy jog</span><span>Match pace</span><span>All out</span></div>
              </Field>
              <Field label="How did it feel?">
                <div className="flex flex-wrap gap-2">
                  <Chip selected={feel === "easy"} onClick={() => setFeel("easy")}>Too easy</Chip>
                  <Chip selected={feel === "right"} onClick={() => setFeel("right")}>About right</Chip>
                  <Chip selected={feel === "hard"} onClick={() => setFeel("hard")}>Too hard</Chip>
                </div>
              </Field>
              <Field label="Did you feel pain?">
                <div className="flex gap-2">
                  <Chip selected={!pain} onClick={() => setPain(false)}>No</Chip>
                  <Chip selected={pain} onClick={() => setPain(true)} icon={<Warning size={14} weight="fill" />}>Yes</Chip>
                </div>
                {pain && <p className="mt-2 text-[13px] text-amber">Course AI will keep the next two sessions lighter and avoid the same movement. If it hurts to walk, tell an adult and rest.</p>}
              </Field>
              <Field label="Note (optional)">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Left foot felt better on the second set..." className="w-full rounded-md bg-ink-3 hairline p-3 text-[14px] text-ink-10 outline-none focus-visible:outline-2 focus-visible:outline-teal" />
              </Field>
            </>
          )}
          <div className="flex gap-2">
            <Button variant="primary" size="lg" icon={<Check size={18} weight="bold" />} onClick={() => onSave({ date: today, minutes, rpe, pain, feel, note: note || undefined }, status)}>
              Save log
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[13px] text-ink-9 mb-2">{label}</div>
      {children}
    </div>
  );
}

function Saved({ before, onHome, onPlan }: { before: { xp: number; ratings: ReturnType<typeof currentRatings> | null }; onHome: () => void; onPlan: () => void }) {
  const { state } = usePlanOps();
  const plan = state.plan!;
  const profile = state.profile!;
  const xp = xpFor(plan);
  const lvl = levelFor(xp);
  const after = currentRatings(profile, plan);
  const gained = xp - before.xp;
  const leveled = before.xp < lvl.at && xp >= lvl.at;
  return (
    <Page>
      <div className="clip-frame letterbox p-6 md:p-10 grid gap-6 md:grid-cols-[1fr_auto] items-end min-h-[360px]">
        <div>
          <h1 className="display-wide text-[44px] md:text-[72px] text-ink-10">
            {leveled ? `Level ${lvl.level}` : "Session in the can"}
          </h1>
          <p className="text-ink-9 mt-3 max-w-[48ch]">{leveled ? `You are now ${lvl.name}. ` : ""}Coach says: effort logged, ratings updated, next session adjusted. See you on the pitch.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="primary" size="lg" icon={<House size={18} weight="fill" />} onClick={onHome}>Home</Button>
            <Button variant="secondary" size="lg" icon={<FilmStrip size={18} />} onClick={onPlan}>Plan</Button>
          </div>
        </div>
        <div className="grid gap-4 min-w-[220px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="caption text-[10.5px] tracking-[0.12em] text-ink-8">XP earned</div>
              <div className="display text-[44px] text-ink-10 leading-none mt-1">+<CountUp value={gained} /></div>
            </div>
            <Trophy size={36} weight="fill" className="text-ink-8" />
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-ink-8"><span>{lvl.name}</span><span className="timecode">{xp} / {lvl.next}</span></div>
            <div className="mt-1 h-[4px] rounded-full bg-ink-4 overflow-hidden"><div className="h-full bg-teal rounded-full origin-left transition-transform duration-[1300ms]" style={{ transform: `scaleX(${lvl.progress})` }} /></div>
          </div>
          <ul className="grid gap-1.5 text-[13px]">
            {SKILLS.map((k) => {
              const d = before.ratings ? Math.round(after[k] - before.ratings[k]) : 0;
              return (
                <li key={k} className="flex justify-between">
                  <span className="text-ink-9">{SKILL_LABEL[k]}</span>
                  <span className="timecode text-ink-10">{after[k]}{d > 0 && <span className="text-teal ml-1.5">+{d}</span>}</span>
                </li>
              );
            })}
            <li className="flex justify-between border-t border-ink-4 pt-1.5 mt-1"><span className="text-ink-9">Overall</span><span className="timecode text-ink-10">{overall(after)}</span></li>
          </ul>
        </div>
      </div>
    </Page>
  );
}
