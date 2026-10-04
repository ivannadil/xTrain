import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Heart, TrafficCone, Wall, Target, Ladder, Users, SoccerBall, Barricade } from "@phosphor-icons/react";
import type { Drill, Equipment } from "../data/types";
import { PitchDiagram } from "./PitchDiagram";
import { Difficulty, TimeBadge } from "./ui";

export function EquipmentIcons({ list, size = 14, className }: { list: Equipment[]; size?: number; className?: string }) {
  const Icon = (e: Equipment) =>
    e === "cones" ? TrafficCone : e === "wall" || e === "rebounder" ? Wall : e === "goal" ? Target : e === "ladder" ? Ladder : e === "hurdles" ? Barricade : e === "partner" ? Users : SoccerBall;
  const shown = list.filter((e) => e !== "ball");
  if (shown.length === 0) return <span className={clsx("text-[11px] text-ink-8", className)}>Ball only</span>;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-ink-8", className)} aria-label={`Needs ${shown.join(", ")}`}>
      {shown.map((e) => {
        const I = Icon(e);
        return <I key={e} size={size} />;
      })}
    </span>
  );
}

type Props = {
  drill: Drill;
  favorite?: boolean;
  onFavorite?: () => void;
  className?: string;
  size?: "sm" | "md";
  to?: string;
  excluded?: boolean;
};

export function DrillCard({ drill, favorite, onFavorite, className, size = "md", to, excluded }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <article
      className={clsx("group relative flex flex-col", size === "sm" ? "w-[220px]" : "w-full", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Link to={to ?? `/app/drills/${drill.id}`} className="clip-frame letterbox block aspect-video" aria-label={`${drill.name}, ${drill.skill}, ${drill.minutes} minutes`}>
        <PitchDiagram d={drill.diagram} play={hover} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-0/85 to-transparent z-[1]" aria-hidden />
        <span className="absolute left-2.5 right-[64px] top-[10%] z-[3] caption caption-stroke text-[11px] tracking-[0.1em] text-ink-10/90 truncate">
          {size === "sm" ? drill.skill : `${drill.skill} · ${drill.sub}`}
        </span>
        <TimeBadge minutes={drill.minutes} className="absolute right-2.5 top-[10%] z-[3]" />
        {excluded && <span className="absolute left-2.5 bottom-[12%] z-[3] caption text-[10px] tracking-[0.1em] text-amber">Excluded from plans</span>}
      </Link>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={to ?? `/app/drills/${drill.id}`} className={clsx("block font-semibold text-ink-10 leading-tight truncate", size === "sm" ? "text-[14px]" : "text-[15px]")}>
            {drill.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-3">
            <Difficulty level={drill.difficulty} />
            <EquipmentIcons list={drill.equipment} />
          </div>
        </div>
        {onFavorite && (
          <button
            type="button"
            onClick={onFavorite}
            aria-pressed={favorite}
            aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
            className="pressable grid h-9 w-9 shrink-0 place-items-center rounded-md text-ink-8 hover:bg-ink-3 hover:text-ink-10"
          >
            <Heart size={18} weight={favorite ? "fill" : "regular"} className={favorite ? "text-orange" : undefined} />
          </button>
        )}
      </div>
    </article>
  );
}
