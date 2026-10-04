import { useCallback, useMemo } from "react";
import type { Plan } from "../data/types";
import { useStore } from "./store";
import type { Prefs } from "./courseAI";

/** Apply a plan change with an Undo toast. Every single-step edit goes through here. */
export function usePlanOps() {
  const { state, dispatch } = useStore();
  const prefs: Prefs = useMemo(() => ({ favorites: state.favorites, excluded: state.excluded }), [state.favorites, state.excluded]);
  const apply = useCallback(
    (next: Plan, text: string, kind: "ok" | "ai" | "warn" = "ok", undoable = true) => {
      const prev = state.plan;
      dispatch({ type: "setPlan", plan: next });
      dispatch({ type: "toast", text, kind, undo: undoable && prev ? () => dispatch({ type: "setPlan", plan: prev }) : undefined });
    },
    [state.plan, dispatch],
  );
  return { state, dispatch, prefs, apply };
}

export function useSeed() {
  return () => Math.floor(Math.random() * 1e9);
}
