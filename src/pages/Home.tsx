import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Play, ArrowRight, CaretRight, Clock, Wall, TrafficCone, ArrowsIn, Target, Trophy } from "@phosphor-icons/react";
import clsx from "clsx";
import { useStore } from "../lib/store";
import { usePlanOps } from "../lib/hooks";
import {
  DOW_LONG,
  adaptSession,
  baselineRatings,
  currentRatings,
  levelFor,
  nextSession,
  overall,
  streak,
  todayIndex,
  weekAdvice,
  weekDone,
  weekPlanned,
  xpFor,
} from "../lib/courseAI";
import { DRILLS, DRILL_BY_ID } from "../data/drills";
import { timecode, EASE_OUT, riseItem, stagger } from "../lib/motion";
import { AIVoice, Button, Chip, Page, StreakChip, TimeBadge, EmptyState } from "../components/ui";
import { PitchDiagram } from "../components/PitchDiagram";
import { Filmstrip } from "../components/Filmstrip";
import { RatingBars } from "../components/RatingBars";
import { DrillCard } from "../components/DrillCard";
import type { Session } from "../data/types";

export default function Home() {
  const { state } = useStore();
  const { plan, profile } = state;
  if (!state.hydrated) return null;
  if (!profile || !plan) {
    return (
      <Page>
        <EmptyState
          title="No plan yet"
          line="Tell Course AI who you are and how you train. It cuts a four-week plan in under a minute."
          action={<Button variant="primary" size="lg" to="/start" icon={<Play weight="fill" />}>Build my plan</Button>}
        />
      </Page>
    );
  }
  return <HomeReady />;
}

function HomeReady() {
  const { state, apply, prefs, dispatch } = usePlanOps();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const plan = state.plan!;
  const profile = state.profile!;
  const today = state.today;

  const ti = todayIndex(plan, today);
  const next = nextSession(plan, today);
  const week = ti ? plan.weeks[ti.wi] : plan.weeks[0];
  const ratings = useMemo(() => currentRatings(profile, plan), [profile, plan]);
  const base = useMemo(() => baselineRatings(profile), [profile]);
  const ovr = overall(ratings);
  const days = streak(plan, today);
  const xp = xpFor(plan);
  const lvl = levelFor(xp);
  const advice = weekAdvice(week, profile)[0];
  const planned = weekPlanned(week);
  const done = weekDone(week);
  const [chips, setChips] = useState<string[]>([]);

  const todaySession = ti ? plan.weeks[ti.wi].days[ti.di].sessions.find((s) => s.status !== "skipped") : undefined;
  const hero: Session | undefined = todaySession ?? next?.session;
  const heroIsToday = !!todaySession;
  const heroDay = heroIsToday && ti ? plan.weeks[ti.wi].days[ti.di] : next?.day;
  const mainDrill = hero ? DRILL_BY_ID[hero.blocks.find((b) => b.role === "main")?.drillId ?? ""] : undefined;

  const mobileStartRef = useRef<HTMLDivElement>(null);
  const [stickyStart, setStickyStart] = useState(false);
  useEffect(() => {
    const el = mobileStartRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStickyStart(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [hero?.id]);

  const toggleChip = (c: string) => setChips((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  const applyChips = () => {
    if (!hero || chips.length === 0) return;
    const nextPlan = adaptSession(plan, hero.id, profile, prefs, chips);
    apply(nextPlan, "Session adapted for today. Course AI kept the focus and swapped what it had to.", "ai");
    setChips([]);
  };

  const keepSharp = useMemo(() => {
    const goalSkills = new Set(profile.goals.map((g) => (g === "weak-foot" ? "passing" : g === "first-touch" ? "dribbling" : g === "speed" ? "fitness" : g)));
    const favs = DRILLS.filter((d) => state.favorites.includes(d.id));
    const recs = DRILLS.filter((d) => !state.favorites.includes(d.id) && goalSkills.has(d.skill) && !d.tags.includes("warm-up") && !d.tags.includes("cool-down"));
    return [...favs, ...recs].slice(0, 8);
  }, [profile.goals, state.favorites]);

  const planOver = !next && !todaySession;

  return (
    <Page wide>
      {/* Top strip */}
      <motion.div variants={stagger(!!reduce)} initial="hidden" animate="show" className="flex flex-wrap items-end justify-between gap-4 mb-5 md:mb-7">
        <motion.div variants={riseItem(!!reduce)}>
          <h1 className="display text-[30px] md:text-[40px] text-ink-10">
            {greeting()}, {profile.name}.
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-8">
            Week {week.index + 1} of {plan.weeks.length} · {week.theme}
          </p>
        </motion.div>
        <motion.div variants={riseItem(!!reduce)} className="flex items-center gap-2">
          <StreakChip days={days} />
          <Link to="/app/achievements" className="pressable inline-flex items-center gap-2 rounded-full bg-ink-3 hairline px-3 h-9 text-[13px] font-semibold text-ink-10 hover:bg-ink-4">
            <Trophy size={15} weight="fill" className="text-ink-8" />
            <span>{lvl.name}</span>
            <span className="timecode text-ink-8 text-[12px]">L{lvl.level}</span>
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)] lg:gap-6 items-start">
        {/* Today's clip */}
        <motion.section
          className="min-w-0"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          aria-labelledby="today-title"
        >
          {hero && heroDay ? (
            <div className="clip-frame letterbox">
              <div className="relative aspect-[4/3] sm:aspect-video">
                <div className="absolute inset-x-0 top-0 h-[64%]">{mainDrill && <PitchDiagram d={mainDrill.diagram} play={!reduce} />}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-0 via-ink-0/80 via-40% to-ink-0/5 z-[1]" aria-hidden />
                <div className="absolute left-4 right-4 top-[9%] z-[3] flex items-start justify-between gap-3">
                  <div className="caption caption-stroke text-[12px] md:text-[13px] tracking-[0.12em] text-ink-10">
                    {heroIsToday ? "Today" : `Next · ${DOW_LONG[heroDay.dow]}`} · {hero.focus} {hero.blocks.some((b) => b.weakFoot) ? "· weak foot" : ""}
                  </div>
                  <TimeBadge minutes={hero.minutes} />
                </div>
                <div className="absolute left-4 right-4 bottom-[10%] z-[3] hidden sm:block">
                  <HeroBody hero={hero} mainDrill={mainDrill} heroIsToday={heroIsToday} onStart={() => navigate(`/app/session/${hero.id}`)} planLink={`/app/plan?w=${(heroIsToday && ti ? ti.wi : next?.wi) ?? 0}&d=${(heroIsToday && ti ? ti.di : next?.di) ?? 0}`} />
                </div>
                <div className="absolute left-4 right-4 bottom-[10%] z-[3] sm:hidden">
                  <h2 id="today-title" className="display text-[36px] text-ink-10 max-w-[12ch]">
                    {hero.title.split(" · ")[0]}
                    <span className="block text-ink-9 text-[0.5em] font-semibold tracking-tight normal-case mt-1" style={{ fontStretch: "100%" }}>
                      {hero.title.split(" · ")[1] ?? mainDrill?.sub}
                    </span>
                  </h2>
                </div>
              </div>
              <div className="sm:hidden p-4 pt-3 bg-ink-2">
                <div className="flex gap-[3px] mb-3" aria-hidden>
                  {hero.blocks.map((b) => (
                    <span key={b.id} className={clsx("h-[3px] rounded-full", b.role === "main" ? "bg-ink-10" : "bg-ink-10/45")} style={{ flexGrow: b.minutes }} />
                  ))}
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2" ref={mobileStartRef}>
                  <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => navigate(`/app/session/${hero.id}`)}>
                    {heroIsToday ? "Start session" : "Start early"}
                  </Button>
                  <Button variant="secondary" size="lg" to={`/app/plan?w=${(heroIsToday && ti ? ti.wi : next?.wi) ?? 0}&d=${(heroIsToday && ti ? ti.di : next?.di) ?? 0}`} aria-label="Open in plan" icon={<CaretRight size={18} />} />
                </div>
              </div>
            </div>
          ) : planOver ? (
            <EmptyState
              title="Plan complete"
              line="Four weeks in the can. Re-cut a new plan with everything Course AI learned about you."
              icon={<Trophy size={40} weight="fill" />}
              action={<Button variant="primary" size="lg" to="/start" icon={<Play weight="fill" />}>Build the next plan</Button>}
            />
          ) : null}

          {hero && (
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <AIVoice>{hero.reason}</AIVoice>
            </div>
          )}

          {hero && heroIsToday && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[12.5px] text-ink-8 mr-1 inline-flex items-center gap-1.5">
                <ArrowsIn size={14} /> Adapt today
              </span>
              <Chip size="sm" selected={chips.includes("less-time")} onClick={() => toggleChip("less-time")} icon={<Clock size={14} />}>Less time</Chip>
              <Chip size="sm" selected={chips.includes("no-wall")} onClick={() => toggleChip("no-wall")} icon={<Wall size={14} />}>No wall</Chip>
              <Chip size="sm" selected={chips.includes("no-cones")} onClick={() => toggleChip("no-cones")} icon={<TrafficCone size={14} />}>No cones</Chip>
              <Chip size="sm" selected={chips.includes("no-goal")} onClick={() => toggleChip("no-goal")} icon={<Target size={14} />}>No goal</Chip>
              <Chip size="sm" selected={chips.includes("small-space")} onClick={() => toggleChip("small-space")}>Small space</Chip>
              {chips.length > 0 && (
                <Button size="sm" variant="teal" onClick={applyChips} iconRight={<ArrowRight size={14} weight="bold" />}>
                  Re-cut session
                </Button>
              )}
            </div>
          )}
        </motion.section>

        {/* Ratings + week */}
        <motion.aside
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.08 }}
          className="grid gap-4 min-w-0"
        >
          <section className="rounded-lg bg-ink-2 hairline p-4 md:p-5" aria-labelledby="ratings-title">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 id="ratings-title" className="display text-[20px] text-ink-10">Your ratings</h2>
                <p className="text-[12.5px] text-ink-8 mt-0.5">Earned from logged sessions, not guesses.</p>
              </div>
              <Link to="/app/progress" className="text-right">
                <span className="display text-[40px] leading-none text-ink-10 tnum">{ovr}</span>
                <span className="block caption text-[10px] tracking-[0.14em] text-ink-8 mt-1">Overall</span>
              </Link>
            </div>
            <RatingBars ratings={ratings} baseline={base} />
          </section>

          <section className="rounded-lg bg-ink-2 hairline p-4 md:p-5" aria-labelledby="week-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="week-title" className="display text-[20px] text-ink-10">This week</h2>
              <span className="timecode text-[12.5px] text-ink-8">
                <span className="text-ink-10">{done}</span> of {week.targetMinutes} min
              </span>
            </div>
            <div className="mt-3 flex h-[6px] w-full gap-[2px] overflow-hidden rounded-full" aria-hidden>
              <span className="h-full bg-teal rounded-l-full" style={{ width: `${Math.min(100, (done / week.targetMinutes) * 100)}%` }} />
              <span className="h-full bg-ink-6" style={{ width: `${Math.max(0, Math.min(100 - (done / week.targetMinutes) * 100, ((planned - done) / week.targetMinutes) * 100))}%` }} />
              <span className="h-full bg-ink-4 flex-1" />
            </div>
            <div className="mt-2 flex items-center gap-4 text-[12px] text-ink-8">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal" /> Done</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-6" /> Planned</span>
            </div>
            {advice && (
              <p className={clsx("mt-3 text-[13px] leading-snug text-pretty", advice.kind === "warn" ? "text-amber" : "text-ink-9")}>{advice.text}</p>
            )}
          </section>
        </motion.aside>
      </div>

      {/* Week filmstrip */}
      <section className="mt-8 md:mt-10 min-w-0" aria-labelledby="strip-title">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <h2 id="strip-title" className="display text-[22px] md:text-[26px] text-ink-10">Week {week.index + 1} reel</h2>
            <p className="text-ink-8 text-[13px] mt-1">{week.themeLine} Drag clips around in the plan.</p>
          </div>
          <Button variant="ghost" size="sm" to={`/app/plan?w=${week.index}`} iconRight={<ArrowRight size={14} />}>
            Edit week
          </Button>
        </div>
        <Filmstrip week={week} today={today} onSelect={(di) => navigate(`/app/plan?w=${week.index}&d=${di}`)} />
      </section>

      {/* Sticky Start on phones once the card's button has scrolled away */}
      {hero && stickyStart && (
        <div className="md:hidden fixed inset-x-0 z-30 px-4 pb-3 pt-2 bg-ink-1/95 backdrop-blur" style={{ bottom: "calc(var(--tabbar-h) + var(--sat))" }}>
          <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => navigate(`/app/session/${hero.id}`)} full>
            {heroIsToday ? "Start session" : "Start early"} · {timecode(hero.minutes)}
          </Button>
        </div>
      )}

      {/* Keep sharp rail */}
      <section className="mt-8 md:mt-10 min-w-0" aria-labelledby="rail-title">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <h2 id="rail-title" className="display text-[22px] md:text-[26px] text-ink-10">Keep sharp</h2>
            <p className="text-ink-8 text-[13px] mt-1">Favourites first, then drills for your goals.</p>
          </div>
          <Button variant="ghost" size="sm" to="/app/drills" iconRight={<ArrowRight size={14} />}>
            All drills
          </Button>
        </div>
        <div className="rail no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 snap-x scroll-pl-4 md:scroll-pl-8">
          {keepSharp.map((d) => (
            <div key={d.id} className="snap-start shrink-0">
              <DrillCard drill={d} size="sm" favorite={state.favorites.includes(d.id)} onFavorite={() => dispatch({ type: "toggleFavorite", id: d.id })} />
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}

function HeroBody({ hero, mainDrill, heroIsToday, onStart, planLink }: { hero: Session; mainDrill?: { sub: string }; heroIsToday: boolean; onStart: () => void; planLink: string }) {
  return (
    <>
      <h2 id="today-title" className="display text-[40px] md:text-[52px] text-ink-10 max-w-[14ch]">
        {hero.title.split(" · ")[0]}
        <span className="block text-ink-9 text-[0.55em] font-semibold tracking-tight normal-case mt-1" style={{ fontStretch: "100%" }}>
          {hero.title.split(" · ")[1] ?? mainDrill?.sub}
        </span>
      </h2>
      <div className="mt-4 flex gap-[3px]" aria-hidden>
        {hero.blocks.map((b) => (
          <span key={b.id} className={clsx("h-[3px] rounded-full", b.role === "main" ? "bg-ink-10" : "bg-ink-10/45")} style={{ flexGrow: b.minutes }} title={`${DRILL_BY_ID[b.drillId]?.name} ${timecode(b.minutes)}`} />
        ))}
      </div>
      <ol className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-9">
        {hero.blocks.map((b, i) => (
          <li key={b.id} className="flex items-center gap-1.5">
            <span className="timecode text-ink-8">{String(i + 1).padStart(2, "0")}</span>
            <span className={clsx(b.role === "main" ? "text-ink-10" : "text-ink-8")}>{DRILL_BY_ID[b.drillId]?.name}</span>
            <span className="timecode text-ink-7">{timecode(b.minutes)}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <Button variant="primary" size="lg" icon={<Play size={18} weight="fill" />} onClick={onStart}>
          {heroIsToday ? "Start session" : "Start early"}
        </Button>
        <Button variant="secondary" size="lg" to={planLink} iconRight={<CaretRight size={16} />}>
          Open in plan
        </Button>
      </div>
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
}
