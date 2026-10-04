import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import clsx from "clsx";
import { SKILLS, SKILL_LABEL, type Ratings } from "../data/types";

/* ---------------- Radar: five axes, baseline ghost vs current ---------------- */
export function Radar({ ratings, baseline, size = 260, className, start = true }: { ratings: Ratings; baseline?: Ratings; size?: number; className?: string; start?: boolean }) {
  const reduce = useReducedMotion();
  const [k, setK] = useState(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce || !start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 1400);
      const e = 1 - Math.pow(1 - t, 3);
      setK(e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, ratings, start]);

  const c = 120;
  const r = 74;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const rr = (v / 100) * r;
    return [c + Math.cos(a) * rr, c + Math.sin(a) * rr] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(",")).join(" ");
  const cur = SKILLS.map((s) => ratings[s] * k);
  const base = baseline ? SKILLS.map((s) => baseline[s]) : null;
  return (
    <svg viewBox="0 0 240 200" width={size * 1.2} height={size} className={clsx("mx-auto", className)} role="img" aria-label={`Skill radar: ${SKILLS.map((s) => `${SKILL_LABEL[s]} ${ratings[s]}`).join(", ")}`}>
      {[25, 50, 75, 100].map((g) => (
        <polygon key={g} points={poly([g, g, g, g, g])} fill="none" stroke="var(--color-ink-4)" strokeWidth="1" />
      ))}
      {SKILLS.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--color-ink-4)" strokeWidth="1" />;
      })}
      {base && <polygon points={poly(base)} fill="rgb(242 245 240 / 0.05)" stroke="rgb(242 245 240 / 0.35)" strokeWidth="1" strokeDasharray="3 3" />}
      <polygon points={poly(cur)} fill="rgb(66 226 195 / 0.18)" stroke="var(--color-teal)" strokeWidth="2" strokeLinejoin="round" />
      {SKILLS.map((s, i) => {
        const [x, y] = pt(i, cur[i]);
        const [lx, ly] = pt(i, 116);
        return (
          <g key={s}>
            <circle cx={x} cy={y} r="3" fill="var(--color-teal)" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fontWeight="700" fill="var(--color-ink-8)" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {SKILL_LABEL[s]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- Season line chart with a playhead ---------------- */
export type SeriesPoint = { date: string; ratings: Ratings };

export function SeasonChart({ points, index, onIndex, className, height = 180 }: { points: SeriesPoint[]; index: number; onIndex: (i: number) => void; className?: string; height?: number }) {
  const W = 600;
  const H = height;
  const padL = 28;
  const padR = 12;
  const padT = 10;
  const padB = 22;
  const n = points.length;
  const all = points.flatMap((p) => SKILLS.map((s) => p.ratings[s]));
  const min = Math.max(0, Math.floor((Math.min(...all) - 6) / 10) * 10);
  const max = Math.min(100, Math.ceil((Math.max(...all) + 6) / 10) * 10);
  const x = (i: number) => (n === 1 ? padL : padL + (i / (n - 1)) * (W - padL - padR));
  const y = (v: number) => padT + (1 - (v - min) / (max - min || 1)) * (H - padT - padB);
  const line = (s: keyof Ratings) => points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.ratings[s])}`).join(" ");
  const strokes: Record<keyof Ratings, string> = {
    dribbling: "var(--color-teal)",
    passing: "rgb(242 245 240 / 0.85)",
    shooting: "rgb(66 226 195 / 0.55)",
    defending: "rgb(148 173 166 / 0.8)",
    fitness: "rgb(245 184 61 / 0.85)",
  };
  const px = x(index);
  return (
    <div className={clsx("relative", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Ratings over the season">
        {[min, (min + max) / 2, max].map((g) => (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} stroke="var(--color-ink-4)" strokeWidth="1" />
            <text x={padL - 6} y={y(g)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="var(--color-ink-7)" fontFamily="var(--font-mono)">
              {Math.round(g)}
            </text>
          </g>
        ))}
        {SKILLS.map((s) => (
          <path key={s} d={line(s)} fill="none" stroke={strokes[s]} strokeWidth={s === "dribbling" ? 2 : 1.5} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        <line x1={px} x2={px} y1={padT - 4} y2={H - padB + 4} stroke="var(--color-orange)" strokeWidth="2" />
        <path d={`M ${px - 5} ${padT - 8} L ${px + 5} ${padT - 8} L ${px} ${padT - 2} Z`} fill="var(--color-orange)" />
        {SKILLS.map((s) => (
          <circle key={s} cx={px} cy={y(points[index].ratings[s])} r="3.2" fill={strokes[s]} stroke="var(--color-ink-1)" strokeWidth="1.5" />
        ))}
        {points.map((p, i) => (i === 0 || i === n - 1 || i === index) && (
          <text key={p.date} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="9" fill={i === index ? "var(--color-orange)" : "var(--color-ink-7)"} fontFamily="var(--font-mono)">
            {p.date.slice(5).replace("-", "/")}
          </text>
        ))}
      </svg>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-8" aria-hidden>
        {SKILLS.map((s) => (
          <li key={s} className="inline-flex items-center gap-1.5"><span className="h-[2px] w-3 rounded-full" style={{ background: strokes[s] }} /> {SKILL_LABEL[s]}</li>
        ))}
      </ul>
      <input
        type="range"
        min={0}
        max={Math.max(0, n - 1)}
        value={index}
        onChange={(e) => onIndex(Number(e.target.value))}
        className="scrubber mt-1"
        aria-label="Scrub through the season"
        aria-valuetext={points[index].date}
      />
    </div>
  );
}

/* ---------------- Consistency grid ---------------- */
export function ConsistencyGrid({ cells, className }: { cells: { date: string; status: "done" | "partial" | "skipped" | "planned" | "rest" | "team"; today: boolean }[]; className?: string }) {
  return (
    <div className={clsx("grid grid-cols-7 gap-1.5", className)} role="img" aria-label="Training days over the plan">
      {cells.map((c) => (
        <div
          key={c.date}
          title={`${c.date}: ${c.status}`}
          className={clsx(
            "aspect-square rounded-sm",
            c.status === "done" && "bg-teal",
            c.status === "partial" && "bg-teal/50",
            c.status === "skipped" && "bg-ink-5",
            c.status === "planned" && "bg-ink-3 hairline",
            c.status === "rest" && "bg-ink-2",
            c.status === "team" && "bg-ink-3",
            c.today && "ring-2 ring-orange ring-offset-1 ring-offset-ink-1",
          )}
        />
      ))}
    </div>
  );
}

/* ---------------- Count-up number ---------------- */
export function CountUp({ value, className, duration = 1200 }: { value: number; className?: string; duration?: number }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      setV(value);
      return;
    }
    let raf = 0;
    const from = v;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.round(from + (value - from) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce, duration]);
  return <span className={clsx("tnum", className)}>{v}</span>;
}
