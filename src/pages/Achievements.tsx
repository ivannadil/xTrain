import { useMemo } from "react";
import { Trophy, Lock, Check } from "@phosphor-icons/react";
import clsx from "clsx";
import { useStore } from "../lib/store";
import { levelFor, xpFor } from "../lib/courseAI";
import { evaluateBadges } from "../lib/achievements";
import { BADGES } from "../data/badges";
import { Page } from "../components/ui";

const TIERS = [
  { name: "Rookie", at: 0 },
  { name: "Prospect", at: 300 },
  { name: "Starter", at: 800 },
  { name: "Captain", at: 1600 },
  { name: "Pro", at: 3000 },
];

export default function Achievements() {
  const { state } = useStore();
  const xp = xpFor(state.plan);
  const lvl = levelFor(xp);
  const states = useMemo(() => evaluateBadges(state.plan, state.profile, state.today), [state.plan, state.profile, state.today]);
  const unlockedCount = states.filter((s) => s.unlocked).length;

  return (
    <Page wide>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="display text-[30px] md:text-[40px] text-ink-10">Achievements</h1>
          <p className="mt-1 text-[13.5px] text-ink-8">{unlockedCount} of {BADGES.length} unlocked. Unlock percentages are sample data.</p>
        </div>
      </div>

      {/* Level ladder */}
      <section className="rounded-lg bg-ink-2 hairline p-5 md:p-6 mb-6" aria-labelledby="ladder-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="ladder-title" className="display text-[22px] text-ink-10">Level {lvl.level} · {lvl.name}</h2>
            <p className="text-[12.5px] text-ink-8 mt-0.5">Every logged session earns XP. {lvl.nextName !== "Max" ? `${lvl.next - xp} XP to ${lvl.nextName}.` : "Top level reached."}</p>
          </div>
          <div className="timecode text-[14px] text-ink-9">{xp} XP</div>
        </div>
        <ol className="mt-5 grid grid-cols-5 gap-2">
          {TIERS.map((t, i) => {
            const reached = xp >= t.at;
            const current = lvl.level === i + 1;
            return (
              <li key={t.name} className="relative">
                <div className={clsx("h-[6px] rounded-full", reached ? "bg-teal" : "bg-ink-4")}>
                  {current && lvl.nextName !== "Max" && <div className="h-full bg-teal/50 rounded-full" style={{ width: `${lvl.progress * 100}%`, marginLeft: "100%" }} />}
                </div>
                <div className={clsx("mt-2 caption text-[10.5px] tracking-[0.12em]", reached ? "text-ink-10" : "text-ink-7")}>{t.name}</div>
                <div className="timecode text-[11px] text-ink-7">{t.at}</div>
                {current && <span className="absolute -top-2 left-0 h-[3px] w-6 rounded-full bg-orange" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Badges */}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Badges">
        {BADGES.map((b) => {
          const st = states.find((s) => s.id === b.id)!;
          return (
            <li key={b.id} className={clsx("rounded-lg hairline p-4 flex gap-4", st.unlocked ? "bg-ink-2" : "bg-ink-2/60")}>
              <div
                className={clsx(
                  "grid h-14 w-14 shrink-0 place-items-center rounded-full",
                  st.unlocked ? (b.tier === "gold" ? "bg-amber/20 text-amber" : b.tier === "silver" ? "bg-ink-9/15 text-ink-10" : "bg-teal-dim text-teal") : "bg-ink-3 text-ink-7",
                )}
                aria-hidden
              >
                {st.unlocked ? <Trophy size={26} weight="fill" /> : <Lock size={22} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={clsx("font-semibold text-[15px] truncate", st.unlocked ? "text-ink-10" : "text-ink-9")}>{b.name}</h3>
                  {st.unlocked && <Check size={16} weight="bold" className="text-teal shrink-0" />}
                </div>
                <p className="text-[13px] text-ink-8 mt-0.5">{b.line}</p>
                {!st.unlocked && (
                  <div className="mt-2">
                    <div className="h-[3px] rounded-full bg-ink-4 overflow-hidden"><div className="h-full bg-ink-8 rounded-full" style={{ width: `${st.progress * 100}%` }} /></div>
                    <div className="mt-1 text-[12px] text-ink-8">{st.label}</div>
                  </div>
                )}
                <div className="mt-2 timecode text-[11px] text-ink-7">{b.pct}% of players have this</div>
              </div>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
