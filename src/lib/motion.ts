/**
 * Shared motion grammar for xTrain.
 * Hard cuts for navigation and frequent toggles; eased motion is spent on authored moments.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
/** Speed ramp: fast in, slow-mo through the middle, snap out. Authored moments only. */
export const EASE_RAMP = [0.1, 0.9, 0.9, 0.1] as const;
export const EASE_SNAP = [0.32, 0.72, 0, 1] as const;

export const DUR = {
  press: 0.16,
  ui: 0.2,
  reveal: 0.52,
  moment: 0.9,
} as const;

/** Apple-style spring: easy to reason about. */
export const SPRING_SNAPPY = { type: "spring", duration: 0.45, bounce: 0.12 } as const;
export const SPRING_SOFT = { type: "spring", duration: 0.7, bounce: 0.18 } as const;
export const SPRING_DRAG = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;

export const reveal = (i = 0, reduce = false) =>
  reduce
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: DUR.reveal, ease: EASE_OUT, delay: i * 0.06 },
      };

export const stagger = (reduce = false) => ({
  hidden: {},
  show: { transition: reduce ? {} : { staggerChildren: 0.06, delayChildren: 0.05 } },
});

export const riseItem = (reduce = false) => ({
  hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.reveal, ease: EASE_OUT },
  },
});

/** Format minutes as a timecode: 45 -> "45:00", 7.5 -> "07:30" */
export function timecode(minutes: number): string {
  const total = Math.round(minutes * 60);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Seconds -> "mm:ss" */
export function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
