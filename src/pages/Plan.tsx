import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  Play,
  Check,
  X,
  ArrowsClockwise,
  Trash,
  Plus,
  DotsSixVertical,
  CaretDown,
  Swap,
  UsersThree,
  Warning,
  Sparkle,
  ArrowRight,
  ShieldCheck,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { usePlanOps, useSeed } from "../lib/hooks";
import {
  DOW,
  DOW_LONG,
  addSession,
  alternativesFor,
  dayLoad,
  deleteSession,
  moveSession,
  parseISO,
  regenerateSession,
  scaleWeek,
  setSessionMinutes,
  setStatus,
  swapBlock,
  weekAdvice,
  weekDone,
  weekPlanned,
} from "../lib/courseAI";
import { DRILL_BY_ID } from "../data/drills";
import { FOCUS_LABEL, type Day, type Focus, type Session, type Week } from "../data/types";
import { EASE_OUT, timecode } from "../lib/motion";
import { AIVoice, Button, Chip, Difficulty, Page, Tag, TimeBadge, EmptyState } from "../components/ui";
import { FocusIcon } from "../components/FocusIcon";
import { EquipmentIcons } from "../components/DrillCard";

const ROLE_LABEL = { warmup: "Warm-up", main: "Main", finisher: "Finisher", cooldown: "Cool-down" } as const;

export default function Plan() {
  const { state, apply, prefs, dispatch } = usePlanOps();
  const navigate = useNavigate();
  const { search } = useLocation();
  const seed = useSeed();
  const reduce = useReducedMotion();
  const plan = state.plan;
  const profile = state.profile;
  const today = state.today;

  const todayWeek = useMemo(() => plan?.weeks.findIndex((w) => w.days.some((d) => d.date === today)) ?? 0, [plan, today]);
  const [sel, setSel] = useState<{ wi: number; di: number } | null>(null);
  const initial = useMemo(() => {
    const q = new URLSearchParams(search);
    const w = q.get("w");
    const d = q.get("d");
    const wiq = w !== null ? Math.min(3, Math.max(0, Number(w))) : todayWeek >= 0 ? todayWeek : 0;
    const wk = plan?.weeks[wiq];
    const diq = d !== null ? Math.min(6, Math.max(0, Number(d))) : wk ? Math.max(0, wk.days.findIndex((x) => x.date === today)) : 0;
    return { wi: wiq, di: diq };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, today, todayWeek]);
  const wi = sel?.wi ?? initial.wi;
  const di = sel?.di ?? initial.di;
  const week = plan?.weeks[wi];
  const day = week?.days[di];

  const syncUrl = (w: number, d: number) =>
    window.history.replaceState(null, "", import.meta.env.VITE_HASH_ROUTER ? `${window.location.pathname}#/app/plan?w=${w}&d=${d}` : `${window.location.pathname}?w=${w}&d=${d}`);
  const setWeek = (w: number) => {
    const wk = plan?.weeks[w];
    const d0 = wk ? Math.max(0, wk.days.findIndex((x) => x.sessions.length > 0)) : 0;
    setSel({ wi: w, di: d0 });
    syncUrl(w, d0);
  };
  const setDay = (d: number) => {
    setSel({ wi, di: d });
    syncUrl(wi, d);
  };

  const [dragging, setDragging] = useState<Session | null>(null);
  const [pendingMove, setPendingMove] = useState<{ session: Session; from: number; to: number; warnings: string[] } | null>(null);
  const [weekMenu, setWeekMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  if (!state.hydrated) return null;
  if (!plan || !profile || !week || !day) {
    return (
      <Page>
        <EmptyState title="No plan to edit" line="Build a plan first and it will show up here as a week you can re-cut." action={<Button variant="primary" size="lg" to="/start">Build my plan</Button>} />
      </Page>
    );
  }

  const advice = weekAdvice(week, profile);
  const planned = weekPlanned(week);
  const done = weekDone(week);

  /* ---------- drag to move ---------- */
  const warningsForMove = (s: Session, from: number, to: number): string[] => {
    const out: string[] = [];
    const target = week.days[to];
    if (target.teamDay) out.push(`${DOW_LONG[target.dow]} is a team day. Stacking ${s.minutes} min on top is a lot at ${profile.age}.`);
    const simulated = moveSession(plan, s.id, wi, to);
    const w2 = simulated.weeks[wi];
    const loads = w2.days.map(dayLoad);
    const hardNeighbors = [to - 1, to + 1].filter((i) => i >= 0 && i < 7 && loads[i] >= 45 && loads[to] >= 45);
    if (hardNeighbors.length) out.push(`That puts two hard days back to back (${DOW[w2.days[Math.min(to, hardNeighbors[0])].dow]} and ${DOW[w2.days[Math.max(to, hardNeighbors[0])].dow]}).`);
    if (target.date < today && from !== to) out.push(`${DOW_LONG[target.dow]} is already gone. It will show as a missed session.`);
    return out;
  };

  const commitMove = (s: Session, to: number, light: boolean) => {
    let next = moveSession(plan, s.id, wi, to);
    const target = week.days[to];
    let note = `Moved ${s.title.split(" · ")[0]} to ${DOW_LONG[target.dow]}.`;
    if (light) {
      next = setSessionMinutes(next, s.id, Math.max(20, Math.round(s.minutes * 0.65)));
      note += ` Trimmed it to ${Math.max(20, Math.round(s.minutes * 0.65))} min so the week stays balanced.`;
    }
    apply(next, note, "ai");
    setDay(to);
  };

  const onDragStart = (e: DragStartEvent) => {
    const s = week.days.flatMap((d) => d.sessions).find((x) => x.id === e.active.id);
    setDragging(s ?? null);
  };
  const onDragEnd = (e: DragEndEvent) => {
    setDragging(null);
    const s = week.days.flatMap((d) => d.sessions).find((x) => x.id === e.active.id);
    if (!s || !e.over) return;
    const to = Number(String(e.over.id).replace("day-", ""));
    const from = week.days.findIndex((d) => d.sessions.some((x) => x.id === s.id));
    if (Number.isNaN(to) || to === from) return;
    const warnings = warningsForMove(s, from, to);
    if (warnings.length) setPendingMove({ session: s, from, to, warnings });
    else commitMove(s, to, false);
  };

  /* ---------- week ops ---------- */
  const recutWeek = () => {
    let next = plan;
    for (const d of week.days) for (const s of d.sessions) if (s.status === "planned") next = regenerateSession(next, s.id, profile, prefs, seed());
    apply(next, `Week ${wi + 1} re-cut: same days and focus, fresh drills.`, "ai");
    setWeekMenu(false);
  };
  const lighter = () => {
    apply(scaleWeek(plan, wi, 0.8), `Week ${wi + 1} is 20% lighter. Every planned session lost a few main-block minutes.`, "ai");
    setWeekMenu(false);
  };
  const harder = () => {
    apply(scaleWeek(plan, wi, 1.15), `Week ${wi + 1} is 15% longer. Main blocks got the extra minutes.`, "ai");
    setWeekMenu(false);
  };

  const session = day.sessions[0];

  return (
    <Page wide>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="display text-[30px] md:text-[40px] text-ink-10">Your plan</h1>
          <p className="mt-1 text-[13.5px] text-ink-8">{plan.name}</p>
        </div>
        <div className="relative">
          <Button variant="secondary" icon={<ArrowsClockwise size={16} />} iconRight={<CaretDown size={14} />} onClick={() => setWeekMenu((v) => !v)} aria-expanded={weekMenu} aria-haspopup="menu">
            Re-cut week {wi + 1}
          </Button>
          <AnimatePresence>
            {weekMenu && (
              <motion.div
                role="menu"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 top-[calc(100%+6px)] z-30 w-[300px] rounded-lg bg-ink-2 hairline-strong shadow-lift p-1.5"
              >
                <MenuItem onClick={recutWeek} title="Fresh drills, same days" line="Keeps every focus and duration, swaps the drills." />
                <MenuItem onClick={lighter} title="Make it lighter" line="Trim 20% off every planned session." />
                <MenuItem onClick={harder} title="Make it harder" line="Add 15% to the main blocks." />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Week tabs: hard cut */}
      <div role="tablist" aria-label="Weeks" className="grid grid-cols-4 gap-1.5 mb-5 rounded-lg bg-ink-2 p-1.5 hairline">
        {plan.weeks.map((w) => {
          const active = w.index === wi;
          const isCurrent = w.index === todayWeek;
          return (
            <button
              key={w.index}
              role="tab"
              aria-selected={active}
              onClick={() => setWeek(w.index)}
              className={clsx("pressable rounded-md px-3 py-2.5 text-left", active ? "bg-ink-4 text-ink-10" : "text-ink-8 hover:bg-ink-3 hover:text-ink-9")}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={clsx("text-[14px] font-semibold truncate", active ? "text-ink-10" : "text-ink-9")}>{w.theme}</span>
                {isCurrent && <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-orange" aria-label="Current week" />}
              </div>
              <div className="timecode text-[11px] text-ink-8 mt-0.5">
                Week {w.index + 1}<span className="hidden sm:inline"> · {weekDone(w)}/{w.targetMinutes} min</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Draggable filmstrip */}
      <section aria-label={`Week ${wi + 1} filmstrip`} className="mb-2 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 mb-3">
          <div className="min-w-0 flex-1 basis-[260px]">
            <h2 className="display text-[22px] md:text-[26px] text-ink-10">
              Week {wi + 1} · {week.theme}
            </h2>
            <p className="text-ink-8 text-[13px] mt-1">{week.themeLine} Drag a clip onto another day to re-cut the week.</p>
          </div>
          <span className="timecode text-[12.5px] text-ink-8 whitespace-nowrap">
            <span className="text-ink-10">{planned}</span> planned · <span className="text-ink-10">{done}</span> done · {week.targetMinutes} target
          </span>
        </div>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragging(null)}>
          <div className="flex gap-1.5 items-stretch overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            {week.days.map((d, i) => (
              <DayCell key={d.date} day={d} index={i} today={today} selected={di === i} onSelect={() => setDay(i)} dragging={!!dragging} warn={dragging ? warningsForMove(dragging, week.days.findIndex((x) => x.sessions.some((s) => s.id === dragging.id)), i).length > 0 : false} />
            ))}
          </div>
          <DragOverlay dropAnimation={reduce ? null : { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}>
            {dragging ? (
              <div className="rounded-md bg-ink-4 hairline-strong shadow-lift p-2.5 w-[180px] rotate-[-1deg] scale-[1.03]">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-10">
                  <FocusIcon focus={dragging.focus} size={15} className="text-ink-8" />
                  {dragging.title.split(" · ")[0]}
                </div>
                <div className="timecode text-[11px] text-ink-8 mt-0.5">{timecode(dragging.minutes)}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <LoadRow week={week} today={today} />
      </section>

      {/* Move confirmation */}
      <AnimatePresence>
        {pendingMove && (
          <motion.div
            role="alertdialog"
            aria-labelledby="move-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="mt-4 rounded-lg bg-ink-2 hairline-strong p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="flex gap-3">
              <Warning size={20} weight="fill" className="text-amber shrink-0 mt-0.5" />
              <div>
                <h3 id="move-title" className="font-semibold text-ink-10">
                  Move {pendingMove.session.title.split(" · ")[0]} to {DOW_LONG[week.days[pendingMove.to].dow]}?
                </h3>
                <ul className="mt-1 text-[13.5px] text-ink-9 grid gap-0.5">
                  {pendingMove.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button variant="ghost" size="sm" onClick={() => setPendingMove(null)}>Keep it where it was</Button>
              <Button variant="secondary" size="sm" onClick={() => { commitMove(pendingMove.session, pendingMove.to, true); setPendingMove(null); }}>Move and make it light</Button>
              <Button variant="primary" size="sm" onClick={() => { commitMove(pendingMove.session, pendingMove.to, false); setPendingMove(null); }}>Move anyway</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day detail + coach notes */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)] items-start">
        <section aria-labelledby="day-title" key={`${wi}-${di}`} className="min-w-0">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2 id="day-title" className="display text-[22px] md:text-[30px] text-ink-10">
                {session ? session.title.split(" · ")[0] : day.teamDay ? "Team training" : "Rest day"}
                {session?.title.includes(" · ") && <span className="text-ink-8 font-semibold" style={{ fontStretch: "100%" }}> · {session.title.split(" · ")[1]}</span>}
              </h2>
              <p className="mt-1 text-[13.5px] text-ink-8">
                {day.date === today ? "Today" : DOW_LONG[day.dow]}, {formatDate(day.date)}
                {day.teamDay && <span className="ml-2 inline-flex items-center gap-1 text-ink-7"><UsersThree size={12} /> Team day</span>}
              </p>
            </div>
            {session && <TimeBadge minutes={session.minutes} tone="light" className="text-[13px] px-2 py-1" />}
          </div>

          {session ? (
            <SessionEditor
              session={session}
              day={day}
              today={today}
              onStart={() => navigate(`/app/session/${session.id}`)}
              onMinutes={(m) => apply(setSessionMinutes(plan, session.id, m), `${session.title.split(" · ")[0]} is now ${m} min. Main blocks absorbed the change.`, "ai")}
              onSwap={(blockId, drillId) => {
                const from = DRILL_BY_ID[session.blocks.find((b) => b.id === blockId)!.drillId]?.name;
                apply(swapBlock(plan, session.id, blockId, drillId), `${from} swapped for ${DRILL_BY_ID[drillId].name}. Same skill, same load.`, "ai");
              }}
              onRecut={() => apply(regenerateSession(plan, session.id, profile, prefs, seed()), `${session.title.split(" · ")[0]} re-cut with fresh drills.`, "ai")}
              onDelete={() => apply(deleteSession(plan, session.id), `Removed ${session.title.split(" · ")[0]} from ${DOW_LONG[day.dow]}.`, "ok")}
              onSkip={() => apply(setStatus(plan, session.id, "skipped"), `Marked skipped. Course AI will not reschedule it; the key drill rolls into your next ${session.focus} day.`, "ai")}
              onUnskip={() => apply(setStatus(plan, session.id, "planned"), `Back on the plan.`, "ok")}
              alternatives={(drillId) => alternativesFor(drillId, profile, prefs)}
              favorites={state.favorites}
              onFavorite={(id) => dispatch({ type: "toggleFavorite", id })}
            />
          ) : (
            <AddSession
              day={day}
              onAdd={(focus, minutes) => apply(addSession(plan, wi, di, focus, minutes, profile, prefs, seed()), `Added a ${minutes} min ${FOCUS_LABEL[focus].toLowerCase()} session on ${DOW_LONG[day.dow]}.`, "ai")}
            />
          )}
        </section>

        <aside className="grid gap-4 min-w-0">
          <section className="rounded-lg bg-ink-2 hairline p-4 md:p-5" aria-labelledby="notes-title">
            <h2 id="notes-title" className="display text-[20px] text-ink-10 mb-3">Coach notes</h2>
            <ul className="grid gap-3">
              {advice.map((a) => (
                <li key={a.text} className="flex gap-2.5 text-[13.5px] leading-snug text-pretty">
                  {a.kind === "warn" ? <Warning size={16} weight="fill" className="text-amber shrink-0 mt-0.5" /> : a.kind === "ok" ? <ShieldCheck size={16} weight="fill" className="text-teal shrink-0 mt-0.5" /> : <Sparkle size={16} weight="fill" className="text-teal shrink-0 mt-0.5" />}
                  <span className={a.kind === "warn" ? "text-ink-10" : "text-ink-9"}>{a.text}</span>
                </li>
              ))}
            </ul>
            {advice.some((a) => a.kind === "warn" && a.text.includes("back to back")) && (
              <Button size="sm" variant="secondary" className="mt-3" onClick={lighter} icon={<Sparkle size={14} weight="fill" className="text-teal" />}>
                Make the week lighter
              </Button>
            )}
          </section>

          <section className="rounded-lg bg-ink-2 hairline p-4 md:p-5" aria-labelledby="mix-title">
            <h2 id="mix-title" className="display text-[20px] text-ink-10 mb-3">This week's mix</h2>
            <FocusMix week={week} />
            <Link to="/app/progress" className="link mt-3 inline-flex items-center gap-1 text-[13px] text-ink-8">
              See the season <ArrowRight size={13} />
            </Link>
          </section>
        </aside>
      </div>
    </Page>
  );
}

/* ---------------- Day cell (droppable + holds a draggable clip) ---------------- */
function DayCell({ day, index, today, selected, onSelect, dragging, warn }: { day: Day; index: number; today: string; selected: boolean; onSelect: () => void; dragging: boolean; warn: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: `day-${index}` });
  const s = day.sessions[0];
  const minutes = day.sessions.reduce((a, x) => a + x.minutes, 0);
  const isToday = day.date === today;
  const isPast = day.date < today;
  return (
    <motion.div
      layout
      transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
      ref={setNodeRef}
      style={{ flexGrow: s ? Math.max(minutes, 20) : dragging ? 14 : 0, flexBasis: s || dragging ? 0 : "auto" }}
      className={clsx(
        "relative rounded-md min-w-[48px] md:min-w-[56px] transition-[box-shadow,background-color] duration-150",
        s && "min-w-[112px] md:min-w-[56px]",
        isOver && (warn ? "bg-amber/10 ring-2 ring-amber" : "bg-teal-dim ring-2 ring-teal"),
        !s && dragging && !isOver && "bg-ink-2 ring-1 ring-dashed ring-ink-5",
      )}
    >
      {s ? (
        <ClipDraggable session={s} day={day} isToday={isToday} isPast={isPast} selected={selected} onSelect={onSelect} />
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className={clsx(
            "pressable flex h-[88px] md:h-[96px] w-full flex-col justify-between rounded-md p-2.5 text-left bg-ink-2/60 hairline",
            selected && "ring-2 ring-teal ring-offset-2 ring-offset-ink-1",
          )}
          aria-label={`${DOW_LONG[day.dow]}, ${day.teamDay ? "team day" : "rest day"}`}
        >
          <div className="flex items-center justify-between">
            <span className={clsx("caption text-[10.5px] tracking-[0.1em]", isToday ? "text-orange" : "text-ink-7")}>{isToday ? "Now" : DOW[day.dow]}</span>
            {day.teamDay && <UsersThree size={13} className="text-ink-7" />}
          </div>
          <span className="caption text-[10px] tracking-[0.1em] text-ink-7">{dragging ? "Drop" : day.teamDay ? "Team" : "Rest"}</span>
          {isToday && <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-orange" />}
        </button>
      )}
    </motion.div>
  );
}

function ClipDraggable({ session: s, day, isToday, isPast, selected, onSelect }: { session: Session; day: Day; isToday: boolean; isPast: boolean; selected: boolean; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: s.id, disabled: s.status === "done" || s.status === "partial" });
  const status = s.status;
  const locked = status === "done" || status === "partial";
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "relative flex h-[88px] md:h-[96px] w-full flex-col justify-between rounded-md p-2.5 text-left bg-ink-3 hairline select-none",
        selected && "ring-2 ring-teal ring-offset-2 ring-offset-ink-1",
        isDragging && "opacity-30",
        status === "skipped" && "opacity-70",
        !locked && "cursor-grab active:cursor-grabbing",
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`${DOW_LONG[day.dow]}: ${s.title}, ${s.minutes} minutes, ${status}${locked ? "" : ". Drag to move."}`}
      {...(!locked ? { ...attributes, ...listeners } : {})}
    >
      <div className="flex items-center justify-between gap-1">
        <span className={clsx("caption text-[10.5px] tracking-[0.1em]", isToday ? "text-orange" : "text-ink-8")}>{isToday ? "Now" : DOW[day.dow]}</span>
        {status === "done" && <Check size={14} weight="bold" className="text-teal" />}
        {status === "partial" && <Check size={14} weight="bold" className="text-amber" />}
        {status === "skipped" && <X size={14} weight="bold" className="text-ink-7" />}
        {status === "planned" && <DotsSixVertical size={14} className="text-ink-7" aria-hidden />}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[13px] text-ink-10">
          <FocusIcon focus={s.focus} size={15} className="shrink-0 text-ink-8" />
          <span className={clsx("truncate font-semibold", status === "skipped" && "line-through text-ink-7")}>{s.title.split(" · ")[0]}</span>
        </div>
        <div className="timecode text-[11px] text-ink-8 mt-0.5">{timecode(s.minutes)}</div>
      </div>
      {isToday && <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-orange" />}
    </div>
  );
}

function LoadRow({ week, today }: { week: Week; today: string }) {
  const loads = week.days.map(dayLoad);
  const max = Math.max(40, ...loads);
  return (
    <div className="mt-2 hidden md:flex gap-1.5 items-end h-7" aria-hidden>
      {week.days.map((d, i) => {
        const s = d.sessions[0];
        const minutes = d.sessions.reduce((a, x) => a + x.minutes, 0);
        return (
          <div key={d.date} className="relative flex items-end min-w-[48px] md:min-w-[56px]" style={{ flexGrow: s ? Math.max(minutes, 20) : 0, flexBasis: s ? 0 : "auto" }}>
            <div className={clsx("w-full rounded-sm transition-[height] duration-500", d.date === today ? "bg-orange" : "bg-teal/50")} style={{ height: `${Math.max(2, (loads[i] / max) * 26)}px` }} />
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Session editor ---------------- */
function SessionEditor(props: {
  session: Session;
  day: Day;
  today: string;
  onStart: () => void;
  onMinutes: (m: number) => void;
  onSwap: (blockId: string, drillId: string) => void;
  onRecut: () => void;
  onDelete: () => void;
  onSkip: () => void;
  onUnskip: () => void;
  alternatives: (drillId: string) => ReturnType<typeof alternativesFor>;
  favorites: string[];
  onFavorite: (id: string) => void;
}) {
  const { session: s, day, today } = props;
  const reduce = useReducedMotion();
  const [openSwap, setOpenSwap] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(s.minutes);
  useEffect(() => setMinutes(s.minutes), [s.minutes, s.id]);
  const locked = s.status === "done" || s.status === "partial";

  return (
    <div className="rounded-lg bg-ink-2 hairline overflow-hidden">
      <div className="p-4 md:p-5 grid gap-4">
        <AIVoice label="Why this session">{s.reason}</AIVoice>

        {locked && s.log && (
          <div className="rounded-md bg-ink-3 p-3 grid grid-cols-3 gap-3 text-center">
            <Stat label="Logged" value={timecode(s.log.minutes)} />
            <Stat label="Effort" value={`${s.log.rpe}/10`} />
            <Stat label="Felt" value={s.log.feel ?? "right"} />
          </div>
        )}

        {/* Blocks */}
        <ol className="grid gap-1.5" aria-label="Session blocks">
          {s.blocks.map((b, i) => {
            const d = DRILL_BY_ID[b.drillId];
            if (!d) return null;
            const open = openSwap === b.id;
            return (
              <li key={b.id} className="rounded-md bg-ink-3 hairline">
                <div className="grid grid-cols-[32px_1fr_auto] items-center gap-3 p-2.5 md:p-3">
                  <span className="timecode text-[12px] text-ink-7">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Link to={`/app/drills/${d.id}`} className="font-semibold text-ink-10 hover:underline underline-offset-4 decoration-ink-6">{d.name}</Link>
                      <Tag>{ROLE_LABEL[b.role]}</Tag>
                      {b.weakFoot && <Tag tone="teal">Weak foot</Tag>}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-8">
                      <span className="timecode text-ink-9">{timecode(b.minutes)}</span>
                      <Difficulty level={d.difficulty} />
                      <EquipmentIcons list={d.equipment} size={13} />
                      <span className="hidden sm:inline truncate">{d.dose}</span>
                    </div>
                  </div>
                  {!locked && b.role === "main" && (
                    <Button size="sm" variant={open ? "secondary" : "ghost"} icon={<Swap size={14} />} onClick={() => setOpenSwap(open ? null : b.id)} aria-expanded={open}>
                      Swap
                    </Button>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0, transition: { duration: 0.16 } }}
                      transition={{ duration: 0.26, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-ink-4 p-2.5 md:p-3 grid gap-1.5">
                        <div className="text-[12px] text-ink-8 mb-0.5">Same skill, same equipment, similar load:</div>
                        {props.alternatives(d.id).map((alt) => (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => {
                              props.onSwap(b.id, alt.id);
                              setOpenSwap(null);
                            }}
                            className="pressable grid grid-cols-[1fr_auto] items-center gap-3 rounded-md bg-ink-2 hover:bg-ink-4 p-2.5 text-left"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-ink-10 text-[14px]">{alt.name}</div>
                              <div className="text-[12px] text-ink-8 truncate">{alt.why}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Difficulty level={alt.difficulty} />
                              <ArrowRight size={14} className="text-ink-7" />
                            </div>
                          </button>
                        ))}
                        {props.alternatives(d.id).length === 0 && <div className="text-[13px] text-ink-8">No alternative fits your equipment and space. Try a different focus.</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>

        {/* Duration */}
        {!locked && (
          <div>
            <div className="flex items-center justify-between text-[13px]">
              <label htmlFor="dur" className="text-ink-9">Session length</label>
              <span className="timecode text-ink-10">{timecode(minutes)}</span>
            </div>
            <input
              id="dur"
              type="range"
              min={20}
              max={75}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              onPointerUp={() => minutes !== s.minutes && props.onMinutes(minutes)}
              onKeyUp={(e) => (e.key === "ArrowLeft" || e.key === "ArrowRight") && minutes !== s.minutes && props.onMinutes(minutes)}
              className="scrubber"
              aria-valuetext={`${minutes} minutes`}
            />
            <div className="flex justify-between timecode text-[10.5px] text-ink-7 -mt-1">
              <span>20:00</span>
              <span>45:00</span>
              <span>75:00</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-ink-4 bg-ink-2 p-3 md:px-5">
        {s.status === "planned" && (
          <Button variant="primary" icon={<Play size={16} weight="fill" />} onClick={props.onStart}>
            {day.date === today ? "Start session" : day.date < today ? "Do it now" : "Start early"}
          </Button>
        )}
        {s.status === "skipped" && (
          <Button variant="secondary" onClick={props.onUnskip} icon={<Check size={14} />}>Put it back</Button>
        )}
        {locked && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-teal font-semibold"><Check size={16} weight="bold" /> Logged {s.log?.date ? formatDate(s.log.date) : ""}</span>
        )}
        {!locked && (
          <>
            <Button variant="ghost" icon={<ArrowsClockwise size={15} />} onClick={props.onRecut}>Re-cut session</Button>
            {s.status === "planned" && <Button variant="ghost" icon={<X size={15} />} onClick={props.onSkip}>Skip</Button>}
            <Button variant="ghost" icon={<Trash size={15} />} onClick={props.onDelete} className="ml-auto text-ink-8">Remove</Button>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="timecode text-[16px] text-ink-10">{value}</div>
      <div className="caption text-[10px] tracking-[0.12em] text-ink-8 mt-0.5">{label}</div>
    </div>
  );
}

function AddSession({ day, onAdd }: { day: Day; onAdd: (focus: Focus, minutes: number) => void }) {
  const [focus, setFocus] = useState<Focus>("dribbling");
  const [minutes, setMinutes] = useState(30);
  const focuses: Focus[] = ["dribbling", "passing", "shooting", "defending", "fitness", "mixed", "recovery"];
  return (
    <div className="rounded-lg bg-ink-2 hairline p-4 md:p-5 grid gap-4">
      <p className="text-ink-9 text-[14px]">
        {day.teamDay ? "You train with the team today. Add a short session only if you feel fresh." : "Nothing scheduled. Add a session and Course AI builds it from your library."}
      </p>
      <div>
        <div className="caption text-[10.5px] tracking-[0.12em] text-ink-8 mb-2">Focus</div>
        <div className="flex flex-wrap gap-2">
          {focuses.map((f) => (
            <Chip key={f} size="sm" selected={focus === f} onClick={() => setFocus(f)} icon={<FocusIcon focus={f} size={14} />}>
              {FOCUS_LABEL[f]}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <div className="caption text-[10.5px] tracking-[0.12em] text-ink-8 mb-2">Length</div>
        <div className="flex flex-wrap gap-2">
          {[20, 30, 45, 60].map((m) => (
            <Chip key={m} size="sm" selected={minutes === m} onClick={() => setMinutes(m)}>
              <span className="timecode">{timecode(m)}</span>
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <Button variant="primary" icon={<Plus size={16} weight="bold" />} onClick={() => onAdd(focus, minutes)}>
          Add session
        </Button>
      </div>
    </div>
  );
}

function FocusMix({ week }: { week: Week }) {
  const mix = new Map<Focus, number>();
  for (const d of week.days) for (const s of d.sessions) if (s.status !== "skipped") mix.set(s.focus, (mix.get(s.focus) ?? 0) + s.minutes);
  const total = Array.from(mix.values()).reduce((a, b) => a + b, 0) || 1;
  const entries = Array.from(mix.entries()).sort((a, b) => b[1] - a[1]);
  return (
    <ul className="grid gap-2">
      {entries.map(([f, m]) => (
        <li key={f} className="grid grid-cols-[18px_1fr_auto] items-center gap-2.5 text-[13px]">
          <FocusIcon focus={f} size={15} className="text-ink-8" />
          <div>
            <div className="flex justify-between text-ink-9"><span>{FOCUS_LABEL[f]}</span></div>
            <div className="mt-1 h-[3px] rounded-full bg-ink-4 overflow-hidden"><div className="h-full bg-teal rounded-full" style={{ width: `${(m / total) * 100}%` }} /></div>
          </div>
          <span className="timecode text-ink-10">{timecode(m)}</span>
        </li>
      ))}
    </ul>
  );
}

function MenuItem({ title, line, onClick }: { title: string; line: string; onClick: () => void }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className="pressable w-full rounded-md px-3 py-2.5 text-left hover:bg-ink-3">
      <div className="font-semibold text-ink-10 text-[14px]">{title}</div>
      <div className="text-[12.5px] text-ink-8">{line}</div>
    </button>
  );
}

export function formatDate(s: string) {
  const d = parseISO(s);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
