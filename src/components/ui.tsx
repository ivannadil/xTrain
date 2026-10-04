import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Sparkle, Fire } from "@phosphor-icons/react";
import { timecode } from "../lib/motion";

/* ---------------- Button ---------------- */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "teal";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-orange text-ink-0 hover:bg-orange-hot active:bg-orange-deep",
  secondary: "bg-ink-3 text-ink-10 hairline hover:bg-ink-4",
  ghost: "bg-transparent text-ink-9 hover:bg-ink-3 hover:text-ink-10",
  danger: "bg-transparent text-red hairline hover:bg-red/10",
  teal: "bg-teal text-ink-0 hover:brightness-110",
};
const SIZE: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px] gap-1.5 rounded-md",
  md: "h-11 px-4 text-[14px] gap-2 rounded-md",
  lg: "h-14 px-6 text-[16px] gap-2.5 rounded-lg",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  to?: string;
  full?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", icon, iconRight, to, full, className, children, ...rest },
  ref,
) {
  const cls = clsx(
    "pressable inline-flex items-center justify-center font-semibold whitespace-nowrap select-none disabled:opacity-40 disabled:pointer-events-none",
    VARIANT[variant],
    SIZE[size],
    full && "w-full",
    className,
  );
  if (to) {
    return (
      <Link to={to} className={cls} aria-disabled={rest.disabled}>
        {icon}
        {children}
        {iconRight}
      </Link>
    );
  }
  return (
    <button ref={ref} type="button" className={cls} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
});

/* ---------------- Chip (filter / toggle) ---------------- */
export function Chip({
  selected,
  children,
  onClick,
  icon,
  className,
  size = "md",
  disabled,
}: {
  selected?: boolean;
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      disabled={disabled}
      className={clsx(
        "pressable inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap disabled:opacity-40",
        size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-10 px-4 text-[13.5px]",
        selected ? "bg-ink-10 text-ink-0" : "bg-ink-3 text-ink-9 hairline hover:bg-ink-4 hover:text-ink-10",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------------- Tag (static label) ---------------- */
export function Tag({ children, tone = "ink", className }: { children: ReactNode; tone?: "ink" | "teal" | "amber" | "red" | "orange"; className?: string }) {
  const t = {
    ink: "bg-ink-4 text-ink-9",
    teal: "bg-teal-dim text-teal",
    amber: "bg-amber/15 text-amber",
    red: "bg-red/15 text-red",
    orange: "bg-orange/15 text-orange",
  }[tone];
  return <span className={clsx("inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 caption text-[10.5px] tracking-[0.08em]", t, className)}>{children}</span>;
}

/* ---------------- Section heading ---------------- */
export function SectionHead({ title, sub, action, className }: { title: ReactNode; sub?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={clsx("flex items-end justify-between gap-4 mb-4", className)}>
      <div>
        <h2 className="display text-[22px] md:text-[26px] text-ink-10">{title}</h2>
        {sub && <p className="text-ink-8 text-[13.5px] mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Course AI voice ---------------- */
/** Course AI speaking: identified by the teal sparkle and teal-tinted text, never a label. */
export function AIVoice({ children, label, className, compact }: { children: ReactNode; label?: string; className?: string; compact?: boolean }) {
  return (
    <div className={clsx("flex gap-3", className)} aria-label={label ?? "Course AI"}>
      <span className={clsx("mt-[2px] grid shrink-0 place-items-center rounded-full bg-teal-dim text-teal", compact ? "h-6 w-6" : "h-7 w-7")} aria-hidden>
        <Sparkle size={compact ? 13 : 15} weight="fill" />
      </span>
      <div className={clsx("min-w-0 text-ink-9 text-pretty", compact ? "text-[13.5px]" : "text-[14px] leading-relaxed")}>{children}</div>
    </div>
  );
}

/* ---------------- Timecode badge ---------------- */
export function TimeBadge({ minutes, className, tone = "dark" }: { minutes: number; className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={clsx(
        "timecode inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px]",
        tone === "dark" ? "bg-ink-0/80 text-ink-10" : "bg-ink-4 text-ink-9",
        className,
      )}
    >
      {timecode(minutes)}
    </span>
  );
}

/* ---------------- Streak ---------------- */
export function StreakChip({ days, className }: { days: number; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full bg-ink-3 hairline px-3 h-9 text-[13px] font-semibold text-ink-10", className)} title="Training streak">
      <Fire size={16} weight="fill" className={days > 0 ? "text-teal" : "text-ink-7"} />
      <span className="tnum">{days}</span>
      <span className="text-ink-8 font-medium">day{days === 1 ? "" : "s"}</span>
    </span>
  );
}

/* ---------------- Difficulty ticks ---------------- */
export function Difficulty({ level, className }: { level: number; className?: string }) {
  return (
    <span className={clsx("inline-flex items-end gap-[2px]", className)} aria-label={`Difficulty ${level} of 5`} title={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={clsx("w-[3px] rounded-[1px]", i <= level ? "bg-ink-9" : "bg-ink-5")} style={{ height: 4 + i * 1.6 }} />
      ))}
    </span>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ title, line, action, icon }: { title: string; line: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="clip-frame letterbox p-8 md:p-12 text-center grid place-items-center gap-3 min-h-[260px]">
      {icon && <div className="text-ink-7">{icon}</div>}
      <h3 className="display text-2xl">{title}</h3>
      <p className="text-ink-8 max-w-[44ch] text-pretty">{line}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ---------------- Page wrapper ---------------- */
export function Page({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={clsx("mx-auto w-full px-4 md:px-8 py-5 md:py-8", wide ? "max-w-[1480px]" : "max-w-[1280px]", className)}>{children}</div>;
}
