import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const OUT = ".impeccable/review";
fs.mkdirSync(OUT, { recursive: true });

async function seed(page: Page) {
  await page.goto("/app");
  await page.evaluate(() => localStorage.removeItem("xtrain:v1"));
  await page.goto("/app");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Alex/);
}

async function settle(page: Page, ms = 1600) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
}

/** The body hides horizontal overflow from users; this makes sure there is none to hide. */
async function noOverflow(page: Page, label: string) {
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  expect(sw, `${label}: document ${sw}px wide in a ${iw}px viewport`).toBeLessThanOrEqual(iw);
}

const ROUTES: [string, string][] = [
  ["/", "landing"],
  ["/app", "home"],
  ["/app/plan", "plan"],
  ["/app/drills", "drills"],
  ["/app/drills/cut-inside-finish", "drill-detail"],
  ["/app/progress", "progress"],
  ["/app/achievements", "achievements"],
  ["/app/coach", "coach"],
  ["/app/profile", "profile"],
];

test.describe("captures", () => {
  test("desktop and mobile full pages", async ({ page }) => {
    test.setTimeout(240_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await seed(page);
    for (const [width, tag] of [[1440, "desktop"], [390, "mobile"]] as const) {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      for (const [route, name] of ROUTES) {
        await page.goto(route);
        await settle(page);
        await noOverflow(page, `${name} ${tag}`);
        await page.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: true });
      }
    }
    // Phone Home scrolled past the clip card: the sticky Start bar must be visible above the tab bar.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/app");
    await settle(page);
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(600);
    await expect(page.getByRole("button", { name: /Start (session|early)/ }).last()).toBeInViewport();
    await page.screenshot({ path: `${OUT}/home-scrolled-mobile.png` });

    // The contract viewports the reviewer expects by name: Home first viewport.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/app");
    await settle(page);
    await page.screenshot({ path: `${OUT}/desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/app");
    await settle(page);
    await page.screenshot({ path: `${OUT}/mobile.png`, fullPage: true });
  });

  test("session player, onboarding build and reveal", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await seed(page);
    await page.getByRole("button", { name: /Start (session|early)/ }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/session-pre-desktop.png`, fullPage: true });
    await page.getByRole("button", { name: "Start" }).click();
    await page.waitForTimeout(2200);
    await noOverflow(page, "session run desktop");
    await page.screenshot({ path: `${OUT}/session-run-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    await noOverflow(page, "session run mobile");
    await page.screenshot({ path: `${OUT}/session-run-mobile.png` });
    await page.getByRole("button", { name: "End" }).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/session-summary-mobile.png`, fullPage: true });
    await page.getByRole("button", { name: "Save log" }).click();
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/session-saved-mobile.png`, fullPage: true });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/start?fresh=1");
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/onboarding-1-desktop.png` });
    await page.getByPlaceholder("Your first name").fill("Bella");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Decrease" }).click();
    await page.getByRole("button", { name: "Decrease" }).click();
    await page.getByRole("button", { name: "Decrease" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/onboarding-age-guardian-desktop.png` });
    await page.getByPlaceholder("parent@example.com").fill("parent@example.com");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/onboarding-position-desktop.png` });
    await page.getByRole("radio", { name: /Striker/ }).click();
    await page.getByRole("radio", { name: /Just starting/ }).click();
    await page.getByRole("radio", { name: /^Left/ }).click();
    await page.getByRole("button", { name: "Score more" }).click();
    await page.getByRole("button", { name: "Trust my weak foot" }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/onboarding-goals-desktop.png` });
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /^Tue/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/onboarding-week-desktop.png` });
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: /Small/ }).click();
    await page.getByRole("button", { name: "Cones" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/onboarding-summary-desktop.png`, fullPage: true });
    await page.getByRole("button", { name: "Cut my plan" }).click();
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${OUT}/onboarding-building-desktop.png` });
    await expect(page.getByText(/Your plan is cut/)).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1800);
    await noOverflow(page, "onboarding reveal desktop");
    await page.screenshot({ path: `${OUT}/onboarding-reveal-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await noOverflow(page, "onboarding reveal mobile");
    await page.screenshot({ path: `${OUT}/onboarding-reveal-mobile.png`, fullPage: true });
    await page.getByRole("button", { name: "Go to my plan" }).click();
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/home-fresh-mobile.png`, fullPage: true });
    await page.goto("/app/progress");
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/progress-fresh-mobile.png`, fullPage: true });
  });

  test("landing with motion, first viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${OUT}/landing-hero-motion-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${OUT}/landing-hero-motion-mobile.png` });
  });
});
