import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkle, CheckCircle, Warning, ArrowCounterClockwise, X } from "@phosphor-icons/react";
import clsx from "clsx";
import { useStore, type Toast } from "../lib/store";
import { EASE_OUT } from "../lib/motion";

function Item({ t, onClose }: { t: Toast; onClose: () => void }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const id = setTimeout(onClose, t.undo ? 9000 : 4200);
    return () => clearTimeout(id);
  }, [t, onClose]);
  const Icon = t.kind === "ai" ? Sparkle : t.kind === "warn" ? Warning : CheckCircle;
  return (
    <motion.div
      layout
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.16 } }}
      transition={{ duration: 0.32, ease: EASE_OUT }}
      role="status"
      data-testid="toast"
      className="pointer-events-auto flex items-center gap-3 rounded-lg bg-ink-10 text-ink-0 pl-3.5 pr-2 py-2.5 shadow-lift min-w-[280px] max-w-[460px]"
    >
      <Icon size={18} weight="fill" className={clsx(t.kind === "ai" ? "text-teal-deep" : t.kind === "warn" ? "text-ink-0" : "text-teal-deep", "shrink-0")} />
      <span className="text-[13.5px] font-medium leading-snug flex-1 text-pretty">{t.text}</span>
      {t.undo && (
        <button
          type="button"
          onClick={() => {
            t.undo?.();
            onClose();
          }}
          className="pressable inline-flex items-center gap-1 rounded-md bg-ink-0/10 hover:bg-ink-0/20 px-2.5 h-8 text-[12.5px] font-semibold"
        >
          <ArrowCounterClockwise size={14} weight="bold" /> Undo
        </button>
      )}
      <button type="button" onClick={onClose} aria-label="Dismiss" className="pressable grid h-8 w-8 place-items-center rounded-md hover:bg-ink-0/10">
        <X size={14} weight="bold" />
      </button>
    </motion.div>
  );
}

export function Toaster() {
  const { state, dispatch } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--tabbar-h)+var(--sat)+12px)] md:bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {state.toasts.map((t) => (
          <Item key={t.id} t={t} onClose={() => dispatch({ type: "dismissToast", id: t.id })} />
        ))}
      </AnimatePresence>
    </div>
  );
}
