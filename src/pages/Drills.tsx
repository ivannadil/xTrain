import { useDeferredValue, useMemo, useState } from "react";
import { MagnifyingGlass, Heart, X, Wall, TrafficCone, Target, SoccerBall, Prohibit } from "@phosphor-icons/react";
import clsx from "clsx";
import { useStore } from "../lib/store";
import { DRILLS } from "../data/drills";
import { SKILLS, SKILL_LABEL, type Drill, type Skill } from "../data/types";
import { Button, Chip, Page, EmptyState } from "../components/ui";
import { DrillCard } from "../components/DrillCard";
import { FocusIcon } from "../components/FocusIcon";

type Diff = "all" | "easy" | "medium" | "hard";
type Equip = "all" | "ball" | "wall" | "cones" | "goal" | "none";
type Sort = "recommended" | "easiest" | "hardest" | "shortest";

export default function Drills() {
  const { state, dispatch } = useStore();
  const profile = state.profile;
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [skill, setSkill] = useState<Skill | "all">("all");
  const [diff, setDiff] = useState<Diff>("all");
  const [equip, setEquip] = useState<Equip>("all");
  const [favOnly, setFavOnly] = useState(false);
  const [forMe, setForMe] = useState(false);
  const [sort, setSort] = useState<Sort>("recommended");

  const filtering = dq.trim() !== "" || skill !== "all" || diff !== "all" || equip !== "all" || favOnly || forMe || sort !== "recommended";

  const goalSkills = useMemo(() => new Set((profile?.goals ?? []).map((g) => (g === "weak-foot" ? "passing" : g === "first-touch" ? "dribbling" : g === "speed" ? "fitness" : g))), [profile]);

  const results = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    let list = DRILLS.filter((d) => {
      if (skill !== "all" && d.skill !== skill) return false;
      if (diff === "easy" && d.difficulty > 2) return false;
      if (diff === "medium" && d.difficulty !== 3) return false;
      if (diff === "hard" && d.difficulty < 4) return false;
      if (equip === "ball" && d.equipment.some((e) => e !== "ball")) return false;
      if (equip === "none" && d.equipment.length > 0) return false;
      if (equip === "wall" && !d.equipment.includes("wall")) return false;
      if (equip === "cones" && !d.equipment.includes("cones")) return false;
      if (equip === "goal" && !d.equipment.includes("goal")) return false;
      if (favOnly && !state.favorites.includes(d.id)) return false;
      if (forMe && profile && !(d.positions?.includes(profile.position) || goalSkills.has(d.skill))) return false;
      if (needle) {
        const hay = `${d.name} ${d.skill} ${d.sub} ${d.tags.join(" ")} ${d.why}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const score = (d: Drill) => (state.favorites.includes(d.id) ? 3 : 0) + (goalSkills.has(d.skill) ? 2 : 0) + (profile && d.positions?.includes(profile.position) ? 1 : 0);
    if (sort === "recommended") list = list.sort((a, b) => score(b) - score(a));
    if (sort === "easiest") list = list.sort((a, b) => a.difficulty - b.difficulty);
    if (sort === "hardest") list = list.sort((a, b) => b.difficulty - a.difficulty);
    if (sort === "shortest") list = list.sort((a, b) => a.minutes - b.minutes);
    return list;
  }, [dq, skill, diff, equip, favOnly, forMe, sort, state.favorites, profile, goalSkills]);

  const clear = () => {
    setQ("");
    setSkill("all");
    setDiff("all");
    setEquip("all");
    setFavOnly(false);
    setForMe(false);
    setSort("recommended");
  };

  const forYou = useMemo(() => DRILLS.filter((d) => goalSkills.has(d.skill) || (profile && d.positions?.includes(profile.position))).slice(0, 10), [goalSkills, profile]);

  return (
    <Page wide>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="display text-[30px] md:text-[40px] text-ink-10">Drill library</h1>
          <p className="mt-1 text-[13.5px] text-ink-8">{DRILLS.length} drills. Every one works alone.</p>
        </div>
        <label className="relative w-full md:w-[340px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-8" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search drills, skills, problems"
            aria-label="Search drills"
            className="h-11 w-full rounded-md bg-ink-3 hairline pl-9 pr-9 text-[14px] text-ink-10 outline-none focus-visible:outline-2 focus-visible:outline-teal"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded text-ink-8 hover:text-ink-10">
              <X size={14} weight="bold" />
            </button>
          )}
        </label>
      </div>

      {/* Filters: hard cuts, no animation */}
      <div className="grid gap-2.5 mb-6">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0 md:flex-wrap" role="group" aria-label="Skill">
          <Chip size="sm" selected={skill === "all"} onClick={() => setSkill("all")}>All skills</Chip>
          {SKILLS.map((s) => (
            <Chip key={s} size="sm" selected={skill === s} onClick={() => setSkill(skill === s ? "all" : s)} icon={<FocusIcon focus={s} size={14} />}>
              {SKILL_LABEL[s]}
            </Chip>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0 md:flex-wrap" role="group" aria-label="Equipment, difficulty and more">
          <Chip size="sm" selected={equip === "ball"} onClick={() => setEquip(equip === "ball" ? "all" : "ball")} icon={<SoccerBall size={14} />}>Ball only</Chip>
          <Chip size="sm" selected={equip === "none"} onClick={() => setEquip(equip === "none" ? "all" : "none")} icon={<Prohibit size={14} />}>No equipment</Chip>
          <Chip size="sm" selected={equip === "wall"} onClick={() => setEquip(equip === "wall" ? "all" : "wall")} icon={<Wall size={14} />}>Wall</Chip>
          <Chip size="sm" selected={equip === "cones"} onClick={() => setEquip(equip === "cones" ? "all" : "cones")} icon={<TrafficCone size={14} />}>Cones</Chip>
          <Chip size="sm" selected={equip === "goal"} onClick={() => setEquip(equip === "goal" ? "all" : "goal")} icon={<Target size={14} />}>Goal</Chip>
          <span className="w-px bg-ink-5 mx-1 self-stretch" aria-hidden />
          <Chip size="sm" selected={diff === "easy"} onClick={() => setDiff(diff === "easy" ? "all" : "easy")}>Easy</Chip>
          <Chip size="sm" selected={diff === "medium"} onClick={() => setDiff(diff === "medium" ? "all" : "medium")}>Medium</Chip>
          <Chip size="sm" selected={diff === "hard"} onClick={() => setDiff(diff === "hard" ? "all" : "hard")}>Hard</Chip>
          <span className="w-px bg-ink-5 mx-1 self-stretch" aria-hidden />
          {profile && (
            <Chip size="sm" selected={forMe} onClick={() => setForMe((v) => !v)}>
              For {profile.position === "W" ? "wingers" : profile.position === "ST" ? "strikers" : profile.position === "GK" ? "keepers" : "my position"}
            </Chip>
          )}
          <Chip size="sm" selected={favOnly} onClick={() => setFavOnly((v) => !v)} icon={<Heart size={14} weight={favOnly ? "fill" : "regular"} />}>Favourites</Chip>
          <label className="ml-auto inline-flex items-center gap-2 text-[12.5px] text-ink-8 whitespace-nowrap">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-8 rounded-md bg-ink-3 hairline px-2 text-[13px] text-ink-10 outline-none focus-visible:outline-2 focus-visible:outline-teal">
              <option value="recommended">Recommended</option>
              <option value="easiest">Easiest first</option>
              <option value="hardest">Hardest first</option>
              <option value="shortest">Shortest first</option>
            </select>
          </label>
        </div>
      </div>

      {filtering ? (
        <section aria-live="polite">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="display text-[22px] text-ink-10">
              {results.length} {results.length === 1 ? "drill" : "drills"}
              {dq.trim() && <span className="text-ink-8 font-semibold" style={{ fontStretch: "100%" }}> for "{dq.trim()}"</span>}
            </h2>
            <Button variant="ghost" size="sm" onClick={clear} icon={<X size={14} />}>Clear filters</Button>
          </div>
          {results.length === 0 ? (
            <EmptyState
              title="Nothing matches"
              line="Try fewer filters. If you are looking for a problem to fix, search words like 'weak foot', 'first touch' or 'speed'."
              action={<Button variant="secondary" onClick={clear}>Clear filters</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((d) => (
                <DrillCard key={d.id} drill={d} favorite={state.favorites.includes(d.id)} excluded={state.excluded.includes(d.id)} onFavorite={() => dispatch({ type: "toggleFavorite", id: d.id })} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="grid gap-9 min-w-0">
          {profile && forYou.length > 0 && (
            <Rail title="For you" sub={`Your goals and your position as a ${profile.position === "W" ? "winger" : profile.position.toLowerCase()}.`} drills={forYou} favorites={state.favorites} excluded={state.excluded} onFavorite={(id) => dispatch({ type: "toggleFavorite", id })} />
          )}
          {SKILLS.map((s) => (
            <Rail
              key={s}
              title={SKILL_LABEL[s]}
              sub={railLine(s)}
              drills={DRILLS.filter((d) => d.skill === s)}
              favorites={state.favorites}
              excluded={state.excluded}
              onFavorite={(id) => dispatch({ type: "toggleFavorite", id })}
              action={<Button variant="ghost" size="sm" onClick={() => setSkill(s)}>See all</Button>}
            />
          ))}
        </div>
      )}
    </Page>
  );
}

function railLine(s: Skill) {
  return {
    dribbling: "Ball mastery, first touch, beating a player.",
    passing: "Wall work, gates, long balls, turning to play forward.",
    shooting: "Placement before power, then patterns from your position.",
    defending: "Footwork and duels you can rehearse alone.",
    fitness: "Speed, agility, strength and the engine for the last 20 minutes.",
  }[s];
}

function Rail({ title, sub, drills, favorites, excluded, onFavorite, action }: { title: string; sub?: string; drills: Drill[]; favorites: string[]; excluded: string[]; onFavorite: (id: string) => void; action?: React.ReactNode }) {
  return (
    <section aria-label={title} className="min-w-0">
      <div className="flex items-end justify-between gap-4 mb-3">
        <div>
          <h2 className="display text-[22px] md:text-[26px] text-ink-10">{title}</h2>
          {sub && <p className="text-ink-8 text-[13px] mt-1">{sub}</p>}
        </div>
        {action}
      </div>
      <div className={clsx("rail no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 snap-x scroll-pl-4 md:scroll-pl-8")}>
        {drills.map((d) => (
          <div key={d.id} className="snap-start shrink-0">
            <DrillCard drill={d} size="sm" favorite={favorites.includes(d.id)} excluded={excluded.includes(d.id)} onFavorite={() => onFavorite(d.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
