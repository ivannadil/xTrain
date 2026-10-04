import { lazy, Suspense } from "react";
import { createBrowserRouter, createHashRouter, Navigate, Outlet, ScrollRestoration } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { StoreProvider } from "./lib/store";
import { Toaster } from "./components/Toaster";

const Landing = lazy(() => import("./pages/Landing"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Home = lazy(() => import("./pages/Home"));
const Plan = lazy(() => import("./pages/Plan"));
const Drills = lazy(() => import("./pages/Drills"));
const DrillDetail = lazy(() => import("./pages/DrillDetail"));
const Session = lazy(() => import("./pages/Session"));
const Progress = lazy(() => import("./pages/Progress"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Coach = lazy(() => import("./pages/Coach"));
const Profile = lazy(() => import("./pages/Profile"));

function Root() {
  return (
    <StoreProvider>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
      <Toaster />
      <ScrollRestoration />
    </StoreProvider>
  );
}

function PageFallback() {
  return (
    <div className="min-h-dvh grid place-items-center" aria-busy="true" aria-live="polite">
      <div className="caption text-ink-7 text-xs">Loading</div>
    </div>
  );
}

/** Hash routing for static hosts (the published artifact); path routing locally and in tests. */
const createRouter = import.meta.env.VITE_HASH_ROUTER ? createHashRouter : createBrowserRouter;

export const router = createRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/start", element: <Onboarding /> },
      { path: "/app/session/:id", element: <Session /> },
      {
        path: "/app",
        element: <AppShell />,
        children: [
          { index: true, element: <Home /> },
          { path: "plan", element: <Plan /> },
          { path: "drills", element: <Drills /> },
          { path: "drills/:id", element: <DrillDetail /> },
          { path: "progress", element: <Progress /> },
          { path: "achievements", element: <Achievements /> },
          { path: "coach", element: <Coach /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
