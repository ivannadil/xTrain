import clsx from "clsx";
import { Check, X, UsersThree } from "@phosphor-icons/react";
import type { Week } from "../data/types";
import { DOW, dayLoad } from "../lib/courseAI";
import { timecode } from "../lib/motion";
import { FocusIcon } from "./FocusIcon";

type Props = {
  week: Week;
  today: string;
  selected?: number;
  onSelect?: (dayIndex: number) => void;
  compact?: boolean;
  className?: string;
  showWave?: boolean;
};

/**
 * The week as a filmstrip: each day is a clip whose width is exactly its minutes.
 * The playhead marks today. A load waveform runs underneath.
 */
export function Filmstrip({ week, today, selected, onSelect, compact, className, showWave = true }: Props) {
  const loads = week.days.map(dayLoad);
  const maxLoad = Math.max(40, ...loads);
  const todayIdx = week.days.findIndex((d) => d.date === today);

  return (
    <div className={clsx("w-full", className)}>
      <div className="relative flex gap-1.5 items-stretch overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible" role="list" aria-label={`Week ${week.index + 1} sessions`}>
        {week.days.map((day, i) => {
          const s = day.sessions[0];
          const minutes = day.sessions.reduce((a, x) => a + x.minutes, 0);
          const isToday = i === todayIdx;
          const isPast = day.date < today;
          const grow = s ? Math.max(minutes, 20) : 0;
          const status = s?.status;
          return (
            <button
              key={day.date}
              type="button"
              role="listitem"
              onClick={() => onSelect?.(i)}
              aria-current={isToday ? "date" : undefined}
              aria-label={`${DOW[day.dow]}${s ? `, ${s.title}, ${minutes} minutes, ${status}` : ", rest day"}`}
              className={clsx(
                "pressable relative flex flex-col justify-between rounded-md text-left overflow-hidden",
                compact ? "h-[64px] p-2" : "h-[88px] md:h-[96px] p-2.5",
                s ? "bg-ink-3 hairline" : "bg-ink-2/60 hairline",
                selected === i && "ring-2 ring-teal ring-offset-2 ring-offset-ink-1",
                status === "skipped" && "opacity-70",
                !s && "min-w-[44px] md:min-w-[52px]",
                s && "min-w-[112px] md:min-w-0",
              )}
              style={{ flexGrow: s ? grow : 0, flexBasis: s ? 0 : "auto" }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={clsx("caption text-[10.5px] tracking-[0.1em]", isToday ? "text-orange" : "text-ink-8")}>
                  {isToday ? "Now" : DOW[day.dow]}
                </span>
                {s && status === "done" && <Check size={14} weight="bold" className="text-teal" />}
                {s && status === "partial" && <Check size={14} weight="bold" className="text-amber" />}
                {s && status === "skipped" && <X size={14} weight="bold" className="text-ink-7" />}
                {!s && day.teamDay && <UsersThree size={13} className="text-ink-7" />}
              </div>
              {s ? (
                <div className="min-w-0">
                  <div className={clsx("flex items-center gap-1.5 text-ink-10", compact ? "text-[12px]" : "text-[13px]")}>
                    <FocusIcon focus={s.focus} size={compact ? 13 : 15} className="shrink-0 text-ink-8" />
                    <span className={clsx("truncate font-semibold", status === "skipped" && "line-through text-ink-7")}>{s.title.split(" · ")[0]}</span>
                  </div>
                  <div className="timecode text-[11px] text-ink-8 mt-0.5">{timecode(minutes)}</div>
                </div>
              ) : (
                <div className="caption text-[10px] tracking-[0.1em] text-ink-7">{day.teamDay ? "Team" : "Rest"}</div>
              )}
              {isToday && (
                <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-orange" />
              )}
            </button>
          );
        })}
      </div>

      {showWave && (
        <div className="relative mt-1.5 h-9 w-full hidden md:block">
          <LoadWave loads={loads} max={maxLoad} widths={week.days.map((d) => (d.sessions.length ? Math.max(d.sessions.reduce((a, x) => a + x.minutes, 0), 20) : 0))} restW={compact ? 44 : 52} todayIdx={todayIdx} />
        </div>
      )}
    </div>
  );
}

/** Area chart of daily training load, aligned to the clip widths above it. */
function LoadWave({ loads, max, widths, restW, todayIdx }: { loads: number[]; max: number; widths: number[]; restW: number; todayIdx: number }) {
  // Approximate x centres in percentage using the same flex math as the strip.
  const gap = 6;
  const restCount = widths.filter((w) => w === 0).length;
  const growTotal = widths.reduce((a, b) => a + b, 0) || 1;
  const W = 1000;
  const fixed = restCount * restW + gap * 6;
  const flex = W - fixed;
  const xs: number[] = [];
  let x = 0;
  widths.forEach((w) => {
    const cw = w === 0 ? restW : (w / growTotal) * flex;
    xs.push(x + cw / 2);
    x += cw + gap;
  });
  const H = 36;
  const ys = loads.map((l) => H - 4 - (l / max) * (H - 8));
  let curve = "";
  for (let i = 0; i < xs.length; i++) {
    const px = i === 0 ? 0 : xs[i - 1];
    const py = i === 0 ? ys[0] : ys[i - 1];
    const cx1 = px + (xs[i] - px) / 2;
    curve += ` C ${cx1} ${py}, ${cx1} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  const stroke = `M 0 ${ys[0]}${curve} L ${W} ${ys[ys.length - 1]}`;
  const path = `M 0 ${H} L 0 ${ys[0]}${curve} L ${W} ${ys[ys.length - 1]} L ${W} ${H} Z`;
  const todayX = todayIdx >= 0 ? xs[todayIdx] : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <path d={path} fill="rgb(66 226 195 / 0.12)" />
      <path d={stroke} fill="none" stroke="rgb(66 226 195 / 0.7)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {todayX !== null && <line x1={todayX} x2={todayX} y1="0" y2={H} stroke="var(--color-orange)" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}
