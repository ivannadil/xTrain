import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, Heart, Plus, Prohibit, Check, Play, Warning, ArrowUp, ArrowDown, Ruler, Timer } from "@phosphor-icons/react";
import { usePlanOps } from "../lib/hooks";
import { DRILLS, DRILL_BY_ID } from "../data/drills";
import { EQUIPMENT_LABEL, SPACE_LABEL, SKILL_LABEL } from "../data/types";
import { addBlock, drillHistory, todayIndex } from "../lib/courseAI";
import { timecode } from "../lib/motion";
import { AIVoice, Button, Difficulty, Page, Tag, TimeBadge } from "../components/ui";
import { PitchDiagram } from "../components/PitchDiagram";
import { DrillCard, EquipmentIcons } from "../components/DrillCard";
import { FocusIcon } from "../components/FocusIcon";
import { formatDate } from "./Plan";

export default function DrillDetail() {
  const { id } = useParams();
  const drill = id ? DRILL_BY_ID[id] : undefined;
  const { state, dispatch, apply } = usePlanOps();
  const reduce = useReducedMotion();
  const [scrub, setScrub] = useState<number | null>(null);
  const [confirmExclude, setConfirmExclude] = useState(false);

  const history = useMemo(() => drillHistory(state.plan, drill?.id ?? ""), [state.plan, drill]);
  const todaySession = useMemo(() => {
    if (!state.plan) return null;
    const ti = todayIndex(state.plan, state.today);
    if (!ti) return null;
    return state.plan.weeks[ti.wi].days[ti.di].sessions.find((s) => s.status === "planned") ?? null;
  }, [state.plan, state.today]);

  if (!drill) return <Navigate to="/app/drills" replace />;

  const fav = state.favorites.includes(drill.id);
  const excluded = state.excluded.includes(drill.id);
  const inToday = todaySession?.blocks.some((b) => b.drillId === drill.id);
  const related = DRILLS.filter((d) => d.skill === drill.skill && d.id !== drill.id).slice(0, 6);

  const addToToday = () => {
    if (!state.plan || !todaySession) return;
    apply(addBlock(state.plan, todaySession.id, drill.id, drill.minutes), `${drill.name} added to today's session (${timecode(drill.minutes)} more).`, "ai");
  };

  return (
    <Page wide>
      <Link to="/app/drills" className="inline-flex items-center gap-1.5 text-[13px] text-ink-8 hover:text-ink-10 mb-4">
        <ArrowLeft size={14} /> Drill library
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] items-start">
        {/* Media */}
        <div className="min-w-0">
          <div className="clip-frame letterbox">
            <div className="aspect-video">
              <PitchDiagram d={drill.diagram} play={scrub === null && !reduce} progress={scrub ?? undefined} />
            </div>
            <span className="absolute left-4 top-[9%] z-[3] caption caption-stroke text-[12px] tracking-[0.12em] text-ink-10">
              {SKILL_LABEL[drill.skill]} · {drill.sub}
            </span>
            <TimeBadge minutes={drill.minutes} className="absolute right-4 top-[9%] z-[3] text-[12px]" />
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="caption text-[10.5px] tracking-[0.12em] text-ink-8 whitespace-nowrap">Scrub the drill</span>
            <input
              type="range"
              min={0}
              max={100}
              value={scrub === null ? 100 : Math.round(scrub * 100)}
              onChange={(e) => setScrub(Number(e.target.value) / 100)}
              className="scrubber"
              aria-label="Scrub through the drill diagram"
            />
            <Button size="sm" variant={scrub === null ? "secondary" : "ghost"} icon={<Play size={13} weight="fill" />} onClick={() => setScrub(null)}>
              Play
            </Button>
          </div>

          <h1 className="display text-[32px] md:text-[44px] text-ink-10 mt-6">{drill.name}</h1>
          <p className="mt-2 text-[16px] text-ink-9 measure text-pretty">{drill.why}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 text-[13px]">
            <div>
              <dt className="caption text-[10.5px] tracking-[0.12em] text-ink-8">Difficulty</dt>
              <dd className="mt-1.5 flex items-center gap-2 text-ink-10"><Difficulty level={drill.difficulty} /> {["", "Easy", "Easy+", "Medium", "Hard", "Elite"][drill.difficulty]}</dd>
            </div>
            <div>
              <dt className="caption text-[10.5px] tracking-[0.12em] text-ink-8">Needs</dt>
              <dd className="mt-1.5 text-ink-10 flex items-center gap-2"><EquipmentIcons list={drill.equipment} /> <span className="text-ink-9">{drill.equipment.length ? drill.equipment.filter((e) => e !== "ball").map((e) => EQUIPMENT_LABEL[e].split(" ")[0]).join(", ") || "Ball" : "Nothing"}</span></dd>
            </div>
            <div>
              <dt className="caption text-[10.5px] tracking-[0.12em] text-ink-8">Space</dt>
              <dd className="mt-1.5 text-ink-10 flex items-center gap-1.5"><Ruler size={14} className="text-ink-8" /> {SPACE_LABEL[drill.space].split(" (")[0]}</dd>
            </div>
            <div>
              <dt className="caption text-[10.5px] tracking-[0.12em] text-ink-8">Dose</dt>
              <dd className="mt-1.5 text-ink-10 flex items-center gap-1.5"><Timer size={14} className="text-ink-8" /> {drill.dose}</dd>
            </div>
          </dl>

          <section className="mt-8" aria-labelledby="setup">
            <h2 id="setup" className="display text-[22px] text-ink-10">Set up</h2>
            <p className="mt-2 text-ink-9 measure">{drill.setup}</p>
          </section>

          <section className="mt-8" aria-labelledby="steps">
            <h2 id="steps" className="display text-[22px] text-ink-10">How to run it</h2>
            <ol className="mt-3 grid gap-2">
              {drill.steps.map((s, i) => (
                <li key={i} className="grid grid-cols-[36px_1fr] gap-3 rounded-md bg-ink-2 hairline p-3.5">
                  <span className="timecode text-[13px] text-ink-7">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-ink-10 text-[15px]">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8" aria-labelledby="cues">
            <h2 id="cues" className="display text-[22px] text-ink-10">Coaching cues</h2>
            <p className="text-ink-8 text-[13px] mt-1">These are the three lines the session player will show you mid-drill.</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {drill.cues.map((c, i) => (
                <li key={i} className="clip-frame letterbox p-4 pt-6 pb-6 min-h-[120px] flex items-end">
                  <span className="caption text-[16px] leading-[1.15] tracking-[0.02em] text-ink-10">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8" aria-labelledby="mistakes">
            <h2 id="mistakes" className="display text-[22px] text-ink-10">Common mistakes</h2>
            <ul className="mt-3 grid gap-2">
              {drill.mistakes.map((m, i) => (
                <li key={i} className="flex gap-2.5 text-ink-9 text-[15px]"><Warning size={18} weight="fill" className="text-amber shrink-0 mt-0.5" /> {m}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Easier and harder versions">
            <div className="rounded-md bg-ink-2 hairline p-4">
              <h3 className="flex items-center gap-2 font-semibold text-ink-10"><ArrowUp size={16} className="text-teal" /> Make it harder</h3>
              <p className="mt-1.5 text-ink-9 text-[14px]">{drill.progression}</p>
            </div>
            <div className="rounded-md bg-ink-2 hairline p-4">
              <h3 className="flex items-center gap-2 font-semibold text-ink-10"><ArrowDown size={16} className="text-ink-8" /> Make it easier</h3>
              <p className="mt-1.5 text-ink-9 text-[14px]">{drill.regression}</p>
            </div>
          </section>
        </div>

        {/* Actions */}
        <aside className="lg:sticky lg:top-6 grid gap-3">
          <div className="rounded-lg bg-ink-2 hairline p-4 md:p-5 grid gap-3">
            <div className="flex items-center gap-2">
              <FocusIcon focus={drill.skill} size={16} className="text-ink-8" />
              <span className="text-[13px] text-ink-9">{SKILL_LABEL[drill.skill]}</span>
              {drill.positions && <Tag tone="teal">{drill.positions.join(" · ")}</Tag>}
            </div>
            {todaySession ? (
              <Button variant="primary" size="lg" icon={inToday ? <Check size={18} weight="bold" /> : <Plus size={18} weight="bold" />} onClick={addToToday} disabled={!!inToday} full>
                {inToday ? "In today's session" : "Add to today's session"}
              </Button>
            ) : (
              <Button variant="primary" size="lg" to="/app/plan" icon={<Plus size={18} weight="bold" />} full>
                Add to a session
              </Button>
            )}
            <Button variant="secondary" icon={<Heart size={16} weight={fav ? "fill" : "regular"} className={fav ? "text-orange" : undefined} />} onClick={() => dispatch({ type: "toggleFavorite", id: drill.id })} full>
              {fav ? "Favourited" : "Favourite"}
            </Button>
            {!excluded ? (
              confirmExclude ? (
                <div className="rounded-md bg-ink-3 p-3 grid gap-2">
                  <AIVoice compact>
                    Before you exclude it: this is the drill that {drill.why.charAt(0).toLowerCase() + drill.why.slice(1)} Course AI will stop scheduling it and pick the next best fit.
                  </AIVoice>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setConfirmExclude(false)}>Keep it</Button>
                    <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: "toggleExcluded", id: drill.id }); setConfirmExclude(false); }}>Exclude anyway</Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" icon={<Prohibit size={16} />} onClick={() => setConfirmExclude(true)} full className="text-ink-8">
                  Exclude from my plans
                </Button>
              )
            ) : (
              <Button variant="ghost" icon={<Check size={16} />} onClick={() => dispatch({ type: "toggleExcluded", id: drill.id })} full>
                Allow in my plans again
              </Button>
            )}
          </div>

          <div className="rounded-lg bg-ink-2 hairline p-4 md:p-5">
            <h2 className="display text-[18px] text-ink-10">Your history</h2>
            {history.times === 0 ? (
              <p className="mt-1.5 text-[13.5px] text-ink-8">You have not logged this drill yet.</p>
            ) : (
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div><dt className="caption text-[10px] tracking-[0.12em] text-ink-8">Times</dt><dd className="timecode text-[18px] text-ink-10 mt-1">{history.times}</dd></div>
                <div><dt className="caption text-[10px] tracking-[0.12em] text-ink-8">Minutes</dt><dd className="timecode text-[18px] text-ink-10 mt-1">{history.minutes}</dd></div>
                <div><dt className="caption text-[10px] tracking-[0.12em] text-ink-8">Last</dt><dd className="timecode text-[13px] text-ink-10 mt-2">{history.last ? formatDate(history.last) : ""}</dd></div>
              </dl>
            )}
          </div>

          {drill.tracks && (
            <div className="rounded-lg bg-ink-2 hairline p-4 md:p-5">
              <h2 className="display text-[18px] text-ink-10">Coach AI, later</h2>
              <p className="mt-1.5 text-[13.5px] text-ink-8">This drill is planned for camera tracking in a later version: rep counting and technique cues from your phone. Not available yet.</p>
            </div>
          )}
        </aside>
      </div>

      <section className="mt-10 min-w-0" aria-label="More drills like this">
        <h2 className="display text-[22px] md:text-[26px] text-ink-10 mb-3">More {SKILL_LABEL[drill.skill].toLowerCase()}</h2>
        <div className="rail no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 snap-x scroll-pl-4 md:scroll-pl-8">
          {related.map((d) => (
            <div key={d.id} className="snap-start shrink-0">
              <DrillCard drill={d} size="sm" favorite={state.favorites.includes(d.id)} onFavorite={() => dispatch({ type: "toggleFavorite", id: d.id })} />
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
