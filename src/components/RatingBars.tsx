import { useEffect, useState } from "react";
import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import { SKILLS, SKILL_LABEL, type Ratings } from "../data/types";
import { FocusIcon } from "./FocusIcon";

export function RatingBars({ ratings, baseline, className, dense }: { ratings: Ratings; baseline?: Ratings; className?: string; dense?: boolean }) {
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(!!reduce);
  useEffect(() => {
    const t = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return (
    <ul className={clsx("grid", dense ? "gap-2" : "gap-3", className)}>
      {SKILLS.map((k, i) => {
        const v = ratings[k];
        const delta = baseline ? v - baseline[k] : 0;
        return (
          <li key={k} className="grid grid-cols-[20px_1fr_auto] items-center gap-3">
            <FocusIcon focus={k} size={16} className="text-ink-8" />
            <div className="min-w-0">
              <div className="flex items-center justify-between text-[12.5px] mb-1">
                <span className="text-ink-9">{SKILL_LABEL[k]}</span>
                {delta !== 0 && (
                  <span className={clsx("timecode text-[11px]", delta > 0 ? "text-teal" : "text-amber")}>
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </span>
                )}
              </div>
              <div className="h-[3px] w-full rounded-full bg-ink-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal origin-left"
                  style={{
                    width: `${v}%`,
                    transform: armed ? "scaleX(1)" : "scaleX(0)",
                    transition: reduce ? "none" : `transform 1300ms cubic-bezier(0.65, 0, 0.35, 1) ${i * 90}ms`,
                  }}
                />
              </div>
            </div>
            <span className="timecode text-[15px] text-ink-10 w-7 text-right">{v}</span>
          </li>
        );
      })}
    </ul>
  );
}
