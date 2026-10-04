import clsx from "clsx";
import { Check } from "@phosphor-icons/react";
import {
  EQUIPMENT_LABEL,
  GOAL_LABEL,
  POSITION_LABEL,
  SPACE_LABEL,
  type Equipment,
  type Experience,
  type Foot,
  type Goal,
  type Position,
  type Space,
} from "../data/types";
import { Chip } from "./ui";
import { FocusIcon } from "./FocusIcon";
import { DOW } from "../lib/courseAI";
import { timecode } from "../lib/motion";

export function Field({ label, hint, children, id }: { label: string; hint?: string; children: React.ReactNode; id?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-semibold text-ink-10">{label}</label>
      {hint && <p className="text-[12.5px] text-ink-8 mt-0.5 mb-2">{hint}</p>}
      {!hint && <div className="h-2" />}
      {children}
    </div>
  );
}

export function TextInput({ id, value, onChange, placeholder, type = "text", autoFocus, inputMode, maxLength }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoFocus?: boolean; inputMode?: "text" | "numeric" | "email"; maxLength?: number }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      inputMode={inputMode}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-12 w-full rounded-md bg-ink-3 hairline px-3.5 text-[16px] text-ink-10 outline-none focus-visible:outline-2 focus-visible:outline-teal"
    />
  );
}

export function OptionGrid<T extends string>({ options, value, onChange, cols = 2, render }: { options: { v: T; label: string; line?: string; icon?: React.ReactNode }[]; value: T | null; onChange: (v: T) => void; cols?: 2 | 3 | 4; render?: (o: { v: T; label: string; line?: string }) => React.ReactNode }) {
  return (
    <div role="radiogroup" className={clsx("grid gap-2", cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
      {options.map((o) => {
        const sel = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(o.v)}
            className={clsx(
              "pressable relative rounded-md p-3.5 text-left min-h-[64px] transition-colors",
              sel ? "bg-ink-10 text-ink-0" : "bg-ink-3 text-ink-10 hairline hover:bg-ink-4",
            )}
          >
            {render ? render(o) : (
              <>
                <div className="flex items-center gap-2 font-semibold text-[15px]">{o.icon}{o.label}</div>
                {o.line && <div className={clsx("text-[12.5px] mt-0.5", sel ? "text-ink-0/70" : "text-ink-8")}>{o.line}</div>}
              </>
            )}
            {sel && <Check size={16} weight="bold" className="absolute right-3 top-3" />}
          </button>
        );
      })}
    </div>
  );
}

export function MultiChips<T extends string>({ options, value, onToggle, max }: { options: { v: T; label: string; icon?: React.ReactNode }[]; value: T[]; onToggle: (v: T) => void; max?: number }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((o) => {
        const sel = value.includes(o.v);
        const disabled = !sel && !!max && value.length >= max;
        return (
          <Chip key={o.v} selected={sel} onClick={() => onToggle(o.v)} icon={o.icon} disabled={disabled}>
            {o.label}
          </Chip>
        );
      })}
    </div>
  );
}

export const POSITION_OPTIONS: { v: Position; label: string; line: string }[] = (Object.keys(POSITION_LABEL) as Position[]).map((p) => ({
  v: p,
  label: POSITION_LABEL[p],
  line: { GK: "Hands and feet", CB: "Duels and long passing", FB: "Engine and crossing", CDM: "Shield and recycle", CM: "Everything, all game", CAM: "Between the lines", W: "Beat players, deliver", ST: "Finish" }[p],
}));

export const EXPERIENCE_OPTIONS: { v: Experience; label: string; line: string }[] = [
  { v: "beginner", label: "Just starting", line: "School or rec, learning the basics" },
  { v: "intermediate", label: "Club player", line: "Travel or club team, want to start" },
  { v: "advanced", label: "Academy level", line: "Serious training already, want the edge" },
];

export const FOOT_OPTIONS: { v: Foot; label: string }[] = [
  { v: "right", label: "Right" },
  { v: "left", label: "Left" },
  { v: "both", label: "Either" },
];

export const GOAL_OPTIONS: { v: Goal; label: string; icon?: React.ReactNode }[] = (Object.keys(GOAL_LABEL) as Goal[]).map((g) => ({
  v: g,
  label: GOAL_LABEL[g],
  icon: g === "weak-foot" || g === "first-touch" || g === "speed" ? undefined : <FocusIcon focus={g} size={14} />,
}));

export const EQUIPMENT_OPTIONS: { v: Equipment; label: string }[] = (["wall", "cones", "goal", "ladder", "hurdles", "rebounder", "partner"] as Equipment[]).map((e) => ({ v: e, label: EQUIPMENT_LABEL[e] }));

export const SPACE_OPTIONS: { v: Space; label: string; line: string }[] = (Object.keys(SPACE_LABEL) as Space[]).map((s) => ({ v: s, label: SPACE_LABEL[s].split(" (")[0], line: SPACE_LABEL[s].split(" (")[1]?.replace(")", "") ?? "" }));

export function DaysPicker({ value, onToggle, team }: { value: number[]; onToggle: (d: number) => void; team?: number[] }) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div className="grid grid-cols-7 gap-1.5" role="group">
      {order.map((d) => {
        const sel = value.includes(d);
        const isTeam = team?.includes(d);
        return (
          <button
            key={d}
            type="button"
            aria-pressed={sel}
            onClick={() => onToggle(d)}
            className={clsx("pressable h-14 rounded-md flex flex-col items-center justify-center gap-0.5", sel ? "bg-ink-10 text-ink-0" : "bg-ink-3 hairline text-ink-9 hover:bg-ink-4")}
          >
            <span className="caption text-[11px] tracking-[0.1em]">{DOW[d]}</span>
            {isTeam && !sel && <span className="caption text-[10px] tracking-[0.08em] text-ink-7">Team</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Stepper({ value, onChange, min, max, step, format }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number; format?: (v: number) => string }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Decrease" onClick={() => onChange(Math.max(min, value - step))} className="pressable grid h-12 w-12 place-items-center rounded-md bg-ink-3 hairline text-ink-10 text-xl">-</button>
      <span className="timecode display text-[32px] min-w-[80px] text-center text-ink-10">{format ? format(value) : value}</span>
      <button type="button" aria-label="Increase" onClick={() => onChange(Math.min(max, value + step))} className="pressable grid h-12 w-12 place-items-center rounded-md bg-ink-3 hairline text-ink-10 text-xl">+</button>
    </div>
  );
}

export const minutesLabel = (m: number) => timecode(m);
