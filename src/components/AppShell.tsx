import { NavLink, Outlet, useLocation } from "react-router-dom";
import { House, FilmStrip, SoccerBall, ChartLineUp, Sparkle, UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import { Wordmark } from "./Wordmark";
import { useStore } from "../lib/store";

type NavItem = { to: string; label: string; icon: typeof House; end?: boolean };
const NAV: NavItem[] = [
  { to: "/app", label: "Home", icon: House, end: true },
  { to: "/app/plan", label: "Plan", icon: FilmStrip },
  { to: "/app/drills", label: "Drills", icon: SoccerBall },
  { to: "/app/progress", label: "Progress", icon: ChartLineUp },
  { to: "/app/coach", label: "Coach", icon: Sparkle },
];

export function AppShell() {
  const { pathname } = useLocation();
  const { state } = useStore();
  const initials = state.profile?.name?.slice(0, 1).toUpperCase() ?? "X";

  return (
    <div className="min-h-dvh bg-ink-1 text-ink-10">
      {/* Desktop rail */}
      <nav
        aria-label="Primary"
        className="hidden md:flex fixed inset-y-0 left-0 w-[var(--rail-w)] flex-col items-center bg-ink-2 hairline z-40"
      >
        <NavLink to="/app" className="mt-4 mb-6 grid place-items-center h-10 w-10 rounded-md hover:bg-ink-3 pressable" aria-label="xTrain home">
          <Wordmark compact />
        </NavLink>
        <ul className="flex flex-col gap-1 w-full px-2">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex flex-col items-center gap-1 rounded-md py-2.5 text-[10.5px] caption tracking-[0.06em]",
                    isActive ? "text-ink-10 bg-ink-3" : "text-ink-7 hover:text-ink-9 hover:bg-ink-3/60",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r bg-orange" />
                    )}
                    <Icon size={22} weight={isActive ? "fill" : "regular"} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto mb-4 w-full px-2">
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 rounded-md py-2.5 text-[10.5px] caption",
                isActive ? "text-ink-10 bg-ink-3" : "text-ink-7 hover:text-ink-9 hover:bg-ink-3/60",
              )
            }
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-4 text-ink-9 text-xs font-bold">
              {initials}
            </span>
            <span>You</span>
          </NavLink>
        </div>
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-ink-1/90 backdrop-blur hairline">
        <NavLink to="/app" aria-label="xTrain home"><Wordmark /></NavLink>
        <NavLink to="/app/profile" aria-label="Your profile" className="grid h-9 w-9 place-items-center rounded-full bg-ink-3 text-ink-9">
          <UserCircle size={22} />
        </NavLink>
      </header>

      <main
        key={pathname}
        className="md:pl-[var(--rail-w)] pb-[calc(var(--tabbar-h)+var(--sat)+16px)] md:pb-0 min-h-dvh"
      >
        <Outlet />
      </main>

      {/* Mobile tab bar */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-2/95 backdrop-blur hairline"
        style={{ paddingBottom: "var(--sat)" }}
      >
        <ul className="grid grid-cols-5 h-[var(--tabbar-h)]">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    "relative flex h-full flex-col items-center justify-center gap-1 text-[10px] caption tracking-[0.06em]",
                    isActive ? "text-ink-10" : "text-ink-7",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span aria-hidden className="absolute top-0 h-[2px] w-8 rounded-b bg-orange" />}
                    <Icon size={22} weight={isActive ? "fill" : "regular"} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
