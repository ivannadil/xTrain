import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, ArrowRight, Lock } from "@phosphor-icons/react";
import clsx from "clsx";
import { useStore } from "../lib/store";
import { baselineRatings, currentRatings, levelFor, overall, ratingHistory, streak, totals, xpFor } from "../lib/courseAI";
import { SKILLS, SKILL_LABEL } from "../data/types";
import { timecode } from "../lib/motion";
import { AIVoice, Button, Page, StreakChip, EmptyState } from "../components/ui";
import { Radar, SeasonChart, ConsistencyGrid, CountUp } from "../components/Charts";
import { RatingBars } from "../components/RatingBars";
import { FocusIcon } from "../components/FocusIcon";
import { evaluateBadges } from "../lib/achievements";
import { BADGES } from "../data/badges";
import { formatDate } from "./Plan";

export default function Progress() {
  const { state } = useStore();
  const { plan, profile, today } = state;
  const history = useMemo(() => (profile ? ratingHistory(profile, plan) : []), [profile, plan]);
  const [idx, setIdx] = useState<number | null>(null);
  if (!state.hydrated) return null;
  if (!profile) {
    return (
      <Page>
        <EmptyState title="No progress yet" line="Build a plan and log a session. Ratings start from your profile and grow from what you actually do." action={<Button variant="primary" size="lg" to="/start">Build my plan</Button>} />
      </Page>
    );
  }
  const base = baselineRatings(profile);
  const cur = currentRatings(profile, plan);
  const t = totals(plan);
  const xp = xpFor(plan);
  const lvl = levelFor(xp);
  const days = streak(plan, today);
  const unlocked = t.sessions >= 3;
  const i = idx ?? history.length - 1;
  const at = history[i]?.ratings ?? cur;
  const badges = evaluateBadges(plan, profile, today);
  const recent = badges.filter((b) => b.unlocked).slice(-3);

  const cells = plan
    ? plan.weeks.flatMap((w) =>
        w.days.map((d) => {
          const s = d.sessions[0];
          const status = s ? (s.status === "done" ? "done" : s.status === "partial" ? "partial" : s.status === "skipped" ? "skipped" : "planned") : d.teamDay ? "team" : "rest";
          return { date: d.date, status, today: d.date === today } as const;
        }),
      )
    : [];

  const balanceNote = (() => {
    const total = Object.values(t.bySkill).reduce((a, b) => a + b, 0) || 1;
    const sorted = SKILLS.map((k) => [k, t.bySkill[k] / total] as const).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    const low = sorted[sorted.length - 1];
    if (t.sessions === 0) return "Log your first session and I will tell you where the balance is off.";
    if (top[1] > 0.45) return `${Math.round(top[1] * 100)}% of your main-block minutes are ${SKILL_LABEL[top[0]].toLowerCase()}. That matches your goal, but ${SKILL_LABEL[low[0]].toLowerCase()} is at ${Math.round(low[1] * 100)}%. One short session would move it.`;
    return `Your minutes are spread across every skill. ${SKILL_LABEL[low[0]]} is the lightest; I have kept one block of it in next week.`;
  })();

  return (
    <Page wide>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="display text-[30px] md:text-[40px] text-ink-10">Your season</h1>
          <p className="mt-1 text-[13.5px] text-ink-8">Ratings are earned from minutes, consistency and difficulty. No guesses.</p>
        </div>
        <div className="flex items-center gap-2">
          <StreakChip days={days} />
          <Link to="/app/achievements" className="pressable inline-flex items-center gap-2 rounded-full bg-ink-3 hairline px-3 h-9 text-[13px] font-semibold text-ink-10 hover:bg-ink-4">
            <Trophy size={15} weight="fill" className="text-ink-8" /> {lvl.name} <span className="timecode text-ink-8 text-[12px]">L{lvl.level}</span>
          </Link>
        </div>
      </div>

      {/* Overall + radar + bars */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-start">
        <section className="rounded-lg bg-ink-2 hairline p-5 md:p-6 min-w-0" aria-labelledby="radar-title">
          <div className="flex items-start justify-between">
            <div>
              <h2 id="radar-title" className="display text-[22px] text-ink-10">Overall</h2>
              <p className="text-[12.5px] text-ink-8 mt-0.5">{unlocked ? "Dashed line is where you started." : `Unlocks after 3 sessions (${t.sessions} of 3).`}</p>
            </div>
            <div className="text-right">
              <div className="display text-[56px] leading-none text-ink-10"><CountUp value={unlocked ? overall(cur) : overall(base)} /></div>
            </div>
          </div>
          <div className={clsx("relative mt-2", !unlocked && "opacity-50")}>
            <Radar ratings={unlocked ? cur : base} baseline={unlocked ? base : undefined} size={280} />
            {!unlocked && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-ink-1/90 px-3 py-1.5 text-[12.5px] text-ink-9"><Lock size={14} /> {t.sessions} of 3 sessions</span>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg bg-ink-2 hairline p-5 md:p-6 min-w-0" aria-labelledby="season-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="season-title" className="display text-[22px] text-ink-10">Season reel</h2>
              <p className="text-[12.5px] text-ink-8 mt-0.5">Scrub the playhead to any logged session.</p>
            </div>
            <div className="text-right">
              <div className="timecode text-[12px] text-orange whitespace-nowrap">{formatDate(history[i]?.date ?? today)}</div>
              <div className="display text-[28px] leading-none text-ink-10 mt-1">{overall(at)}</div>
            </div>
          </div>
          {history.length > 1 ? (
            <SeasonChart points={history} index={i} onIndex={setIdx} className="mt-3" />
          ) : (
            <p className="mt-6 text-[13.5px] text-ink-8">The chart draws itself after your first logged session.</p>
          )}
          <div className="mt-3">
            <RatingBars ratings={Object.fromEntries(SKILLS.map((k) => [k, Math.round(at[k])])) as typeof cur} baseline={base} dense />
          </div>
        </section>
      </div>

      {/* Balance + consistency + totals */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3 items-start">
        <section className="rounded-lg bg-ink-2 hairline p-5" aria-labelledby="balance-title">
          <h2 id="balance-title" className="display text-[20px] text-ink-10 mb-3">Where your minutes go</h2>
          <ul className="grid gap-2.5">
            {SKILLS.map((k) => {
              const total = Object.values(t.bySkill).reduce((a, b) => a + b, 0) || 1;
              return (
                <li key={k} className="grid grid-cols-[18px_1fr_auto] items-center gap-2.5 text-[13px]">
                  <FocusIcon focus={k} size={15} className="text-ink-8" />
                  <div>
                    <div className="text-ink-9">{SKILL_LABEL[k]}</div>
                    <div className="mt-1 h-[3px] rounded-full bg-ink-4 overflow-hidden"><div className="h-full bg-teal rounded-full" style={{ width: `${(t.bySkill[k] / total) * 100}%` }} /></div>
                  </div>
                  <span className="timecode text-ink-10">{timecode(t.bySkill[k])}</span>
                </li>
              );
            })}
          </ul>
          <AIVoice compact className="mt-4">{balanceNote}</AIVoice>
        </section>

        <section className="rounded-lg bg-ink-2 hairline p-5" aria-labelledby="cons-title">
          <h2 id="cons-title" className="display text-[20px] text-ink-10 mb-1">Consistency</h2>
          <p className="text-[12.5px] text-ink-8 mb-3">Four weeks, Monday to Sunday. Teal is a logged session.</p>
          {cells.length ? <ConsistencyGrid cells={cells} /> : <p className="text-ink-8 text-[13px]">No plan yet.</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-8">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-teal" /> Done</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-teal/50" /> Partial</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink-5" /> Skipped</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink-3 hairline" /> Planned</span>
          </div>
        </section>

        <section className="rounded-lg bg-ink-2 hairline p-5" aria-labelledby="totals-title">
          <h2 id="totals-title" className="display text-[20px] text-ink-10 mb-3">Totals</h2>
          <dl className="grid grid-cols-3 gap-3 text-center">
            <div><dt className="caption text-[10px] tracking-[0.12em] text-ink-8">Sessions</dt><dd className="display text-[32px] text-ink-10 mt-1"><CountUp value={t.sessions} /></dd></div>
            <div><dt className="caption text-[10px] tracking-[0.12em] text-ink-8">Hours</dt><dd className="display text-[32px] text-ink-10 mt-1"><CountUp value={Math.round(t.minutes / 60)} /></dd></div>
            <div><dt className="caption text-[10px] tracking-[0.12em] text-ink-8">XP</dt><dd className="display text-[32px] text-ink-10 mt-1"><CountUp value={xp} /></dd></div>
          </dl>
          <div className="mt-4">
            <div className="flex justify-between text-[12px] text-ink-8"><span>{lvl.name}</span><span>{lvl.nextName} at <span className="timecode">{lvl.next}</span></span></div>
            <div className="mt-1 h-[4px] rounded-full bg-ink-4 overflow-hidden"><div className="h-full bg-teal rounded-full origin-left transition-transform duration-[1300ms]" style={{ transform: `scaleX(${lvl.progress})` }} /></div>
          </div>
          <div className="mt-4">
            <div className="caption text-[10px] tracking-[0.12em] text-ink-8 mb-2">Latest badges</div>
            {recent.length === 0 ? (
              <p className="text-[13px] text-ink-8">Finish a session to earn First Whistle.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {recent.map((b) => {
                  const meta = BADGES.find((x) => x.id === b.id)!;
                  return <li key={b.id} className="inline-flex items-center gap-1.5 rounded-full bg-teal-dim px-2.5 py-1 text-[12px] text-teal"><Trophy size={12} weight="fill" /> {meta.name}</li>;
                })}
              </ul>
            )}
            <Link to="/app/achievements" className="link mt-3 inline-flex items-center gap-1 text-[13px] text-ink-8">All achievements <ArrowRight size={13} /></Link>
          </div>
        </section>
      </div>
    </Page>
  );
}
