import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Plan, Profile, Session, SessionLog } from "../data/types";
import { demoPlan, demoProfile } from "../data/demo";
import { iso } from "./courseAI";

export type Toast = { id: number; text: string; kind?: "ok" | "ai" | "warn"; undo?: () => void };

export type State = {
  hydrated: boolean;
  profile: Profile | null;
  plan: Plan | null;
  favorites: string[];
  excluded: string[];
  today: string;
  toasts: Toast[];
  seenCoachIntro: boolean;
};

export type Action =
  | { type: "hydrate"; state: Partial<State> }
  | { type: "setProfile"; profile: Profile }
  | { type: "setPlan"; plan: Plan }
  | { type: "toggleFavorite"; id: string }
  | { type: "toggleExcluded"; id: string }
  | { type: "toast"; text: string; kind?: Toast["kind"]; undo?: () => void }
  | { type: "dismissToast"; id: number }
  | { type: "seedDemo" }
  | { type: "reset" }
  | { type: "seenCoachIntro" };

const KEY = "xtrain:v1";

const empty: State = {
  hydrated: false,
  profile: null,
  plan: null,
  favorites: [],
  excluded: [],
  today: iso(new Date()),
  toasts: [],
  seenCoachIntro: false,
};

let toastId = 1;

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "hydrate":
      return { ...s, ...a.state, hydrated: true };
    case "setProfile":
      return { ...s, profile: a.profile };
    case "setPlan":
      return { ...s, plan: a.plan };
    case "toggleFavorite":
      return { ...s, favorites: s.favorites.includes(a.id) ? s.favorites.filter((x) => x !== a.id) : [...s.favorites, a.id] };
    case "toggleExcluded":
      return { ...s, excluded: s.excluded.includes(a.id) ? s.excluded.filter((x) => x !== a.id) : [...s.excluded, a.id] };
    case "toast":
      return { ...s, toasts: [...s.toasts.slice(-2), { id: toastId++, text: a.text, kind: a.kind, undo: a.undo }] };
    case "dismissToast":
      return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) };
    case "seedDemo": {
      const profile = demoProfile();
      return { ...s, profile, plan: demoPlan(profile), favorites: ["cut-inside-finish"], excluded: [], hydrated: true };
    }
    case "reset":
      return { ...empty, hydrated: true, today: iso(new Date()) };
    case "seenCoachIntro":
      return { ...s, seenCoachIntro: true };
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, empty);
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("fresh") === "1") {
      try {
        localStorage.removeItem(KEY);
      } catch {}
      dispatch({ type: "reset" });
      return;
    }
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        if (saved.profile && saved.plan) {
          dispatch({ type: "hydrate", state: { ...saved, toasts: [], today: iso(new Date()) } });
          return;
        }
      }
    } catch {}
    dispatch({ type: "seedDemo" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { profile, plan, favorites, excluded, seenCoachIntro } = state;
      localStorage.setItem(KEY, JSON.stringify({ profile, plan, favorites, excluded, seenCoachIntro }));
    } catch {}
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside StoreProvider");
  return v;
}

export function useToast() {
  const { dispatch } = useStore();
  return (text: string, kind?: Toast["kind"], undo?: () => void) => dispatch({ type: "toast", text, kind, undo });
}

export type { Session, SessionLog };
