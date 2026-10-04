import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import clsx from "clsx";
import type { Diagram } from "../data/types";

type Props = {
  d: Diagram;
  /** Auto-play the run and ball paths (loops). */
  play?: boolean;
  /** Scrub position 0..1; overrides play. */
  progress?: number;
  className?: string;
  /** Lower-contrast rendering for backgrounds. */
  muted?: boolean;
  id?: string;
};

const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(" ");

function pathLen(points: [number, number][]) {
  let L = 0;
  for (let i = 1; i < points.length; i++) L += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  return L;
}
function pointAt(points: [number, number][], t: number): [number, number] {
  if (points.length === 0) return [0, 0];
  if (points.length === 1) return points[0];
  const total = pathLen(points);
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < points.length; i++) {
    const seg = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    if (target <= seg) {
      const k = seg === 0 ? 0 : target / seg;
      return [points[i - 1][0] + (points[i][0] - points[i - 1][0]) * k, points[i - 1][1] + (points[i][1] - points[i - 1][1]) * k];
    }
    target -= seg;
  }
  return points[points.length - 1];
}

/** Authored SVG pitch plan rendered from a drill's Diagram spec. */
export function PitchDiagram({ d, play = false, progress, className, muted = false }: Props) {
  const reduce = useReducedMotion();
  const runRef = useRef<SVGPolylineElement>(null);
  const ballPathRef = useRef<SVGPolylineElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);
  const playerRef = useRef<SVGGElement>(null);
  const raf = useRef<number | null>(null);

  const run = d.run;
  const ball = d.ball;

  // Apply a scrub position to the paths and the moving pieces.
  const apply = (t: number) => {
    if (runRef.current) runRef.current.style.strokeDashoffset = String(1 - t);
    if (ballPathRef.current) ballPathRef.current.style.strokeDashoffset = String(1 - Math.min(1, t * 1.15));
    if (playerRef.current && run && run.length > 1) {
      const [x, y] = pointAt(run, t);
      playerRef.current.setAttribute("transform", `translate(${x - d.player[0]} ${y - d.player[1]})`);
    }
    if (ballRef.current && ball && ball.length > 1) {
      const [x, y] = pointAt(ball, Math.min(1, t * 1.15));
      ballRef.current.setAttribute("cx", String(x));
      ballRef.current.setAttribute("cy", String(y));
    }
  };

  useEffect(() => {
    if (progress !== undefined) {
      apply(progress);
      return;
    }
    if (!play || reduce) {
      apply(1);
      return;
    }
    const dur = 2600;
    const hold = 700;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const e = (now - start) % (dur + hold);
      const t = Math.min(1, e / dur);
      // speed ramp: quick start, slow middle, snap end
      const ramp = t < 0.5 ? 0.5 * Math.pow(2 * t, 0.65) : 1 - 0.5 * Math.pow(2 * (1 - t), 0.65);
      apply(ramp);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, progress, reduce, d]);

  const line = muted ? "rgb(242 245 240 / 0.28)" : "rgb(242 245 240 / 0.55)";
  const faint = muted ? "rgb(242 245 240 / 0.08)" : "rgb(242 245 240 / 0.14)";
  const teal = muted ? "rgb(66 226 195 / 0.55)" : "var(--color-teal)";
  const cone = muted ? "rgb(201 214 209 / 0.6)" : "rgb(201 214 209)";

  return (
    <svg viewBox="0 0 160 90" className={clsx("h-full w-full", className)} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="turf-stripes" width="20" height="90" patternUnits="userSpaceOnUse">
          <rect width="10" height="90" fill="rgb(66 226 195 / 0.035)" />
        </pattern>
        <pattern id="wall-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={line} strokeWidth="1" />
        </pattern>
        <marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 z" fill={line} />
        </marker>
      </defs>
      <rect width="160" height="90" fill="var(--color-ink-3)" />
      <rect width="160" height="90" fill="url(#turf-stripes)" />

      {/* Markings */}
      {d.area === "corridor" && (
        <g stroke={faint} strokeWidth="1">
          <line x1="8" y1="14" x2="152" y2="14" />
          <line x1="8" y1="76" x2="152" y2="76" />
        </g>
      )}
      {d.area === "square" && <rect x="44" y="16" width="72" height="58" fill="none" stroke={faint} strokeWidth="1" strokeDasharray="3 3" />}
      {d.area === "box" && (
        <g fill="none" stroke={faint} strokeWidth="1">
          <rect x="30" y="-2" width="100" height="44" />
          <rect x="56" y="-2" width="48" height="18" />
          <path d="M 62 42 A 20 20 0 0 0 98 42" />
          <line x1="0" y1="88" x2="160" y2="88" />
        </g>
      )}
      {d.goal === "top" && (
        <g>
          <rect x="62" y="0" width="36" height="7" fill="url(#wall-hatch)" stroke={line} strokeWidth="1.4" />
        </g>
      )}
      {d.wall && (
        <g>
          <line x1={d.wall[0]} y1={d.wall[1]} x2={d.wall[2]} y2={d.wall[3]} stroke={line} strokeWidth="3" />
          <rect x={d.wall[0]} y={d.wall[1]} width="6" height={d.wall[3] - d.wall[1]} fill="url(#wall-hatch)" opacity="0.7" />
        </g>
      )}
      {d.ladder && (
        <g stroke={line} strokeWidth="1">
          <line x1={d.ladder.x} y1={d.ladder.y - 6} x2={d.ladder.x + d.ladder.len} y2={d.ladder.y - 6} />
          <line x1={d.ladder.x} y1={d.ladder.y + 6} x2={d.ladder.x + d.ladder.len} y2={d.ladder.y + 6} />
          {Array.from({ length: Math.floor(d.ladder.len / 8) + 1 }).map((_, i) => (
            <line key={i} x1={d.ladder!.x + i * 8} y1={d.ladder!.y - 6} x2={d.ladder!.x + i * 8} y2={d.ladder!.y + 6} />
          ))}
        </g>
      )}
      {d.gates?.map(([a, b], i) => (
        <g key={i}>
          <Cone x={a[0]} y={a[1]} fill={cone} />
          <Cone x={b[0]} y={b[1]} fill={cone} />
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={faint} strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
      {d.cones?.map(([x, y], i) => <Cone key={i} x={x} y={y} fill={cone} />)}
      {d.mannequins?.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="var(--color-ink-5)" stroke={line} strokeWidth="1" />
      ))}

      {/* Paths */}
      {run && run.length > 1 && (
        <polyline
          ref={runRef}
          points={pts(run)}
          fill="none"
          stroke={line}
          strokeWidth="1.2"
          strokeDasharray="1"
          strokeDashoffset="1"
          pathLength={1}
          strokeLinejoin="round"
          strokeLinecap="round"
          markerEnd="url(#arrow)"
        />
      )}
      {ball && ball.length > 1 && (
        <polyline
          ref={ballPathRef}
          points={pts(ball)}
          fill="none"
          stroke={teal}
          strokeWidth="1.1"
          strokeDasharray="1"
          strokeDashoffset="1"
          pathLength={1}
          strokeLinejoin="round"
          style={{ strokeDasharray: "0.04 0.025", strokeDashoffset: 1 }}
        />
      )}

      {/* Player */}
      <g ref={playerRef}>
        <circle cx={d.player[0]} cy={d.player[1]} r="4.4" fill={teal} />
        <circle cx={d.player[0]} cy={d.player[1]} r="1.6" fill="var(--color-ink-0)" />
      </g>
      {/* Ball */}
      {ball && ball.length > 0 && (
        <circle ref={ballRef} cx={ball[0][0]} cy={ball[0][1]} r="2.2" fill="var(--color-ink-10)" stroke="var(--color-ink-0)" strokeWidth="0.6" />
      )}
      {d.marker && !ball && <circle cx={d.marker[0]} cy={d.marker[1]} r="2.2" fill="var(--color-ink-10)" />}
    </svg>
  );
}

function Cone({ x, y, fill }: { x: number; y: number; fill: string }) {
  return <path d={`M ${x} ${y - 3.4} L ${x + 2.8} ${y + 2.2} L ${x - 2.8} ${y + 2.2} Z`} fill={fill} stroke="var(--color-ink-0)" strokeWidth="0.5" strokeLinejoin="round" />;
}
