import { test, expect, type Page } from "@playwright/test";

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

async function resetDemo(page: Page) {
  await page.goto("/app");
  await page.evaluate(() => localStorage.removeItem("xtrain:v1"));
  await page.goto("/app");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Alex/);
}

test.describe("Home", () => {
  test("shows today's session, ratings and the week reel", async ({ page }) => {
    await resetDemo(page);
    await expect(page.getByRole("button", { name: /Start (session|early)/ })).toBeVisible();
    await expect(page.locator('[aria-label="Course AI"]').first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your ratings" })).toBeVisible();
    await expect(page.getByRole("list", { name: /Week \d sessions/ })).toBeVisible();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.reload();
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });

  test("adapt chips re-cut today's session with Undo", async ({ page }) => {
    await resetDemo(page);
    const lessTime = page.getByRole("button", { name: "Less time" });
    if (await lessTime.isVisible()) {
      await lessTime.click();
      await page.getByRole("button", { name: "Re-cut session" }).click();
      await expect(page.getByTestId("toast")).toContainText(/adapted/i);
      await page.getByRole("button", { name: "Undo" }).click();
      await expect(page.getByTestId("toast")).toHaveCount(0);
    }
  });
});

test.describe("Plan", () => {
  test("drag a clip to another day, warn, move anyway, undo", async ({ page, isMobile }) => {
    test.skip(isMobile, "pointer drag is a desktop test");
    await resetDemo(page);
    await page.goto("/app/plan");
    const strip = page.getByLabel(/Week \d filmstrip/);
    await expect(strip).toBeVisible();
    const clips = strip.locator('[role="button"][aria-label*="Drag to move"]');
    const count = await clips.count();
    expect(count).toBeGreaterThan(0);
    const clip = clips.first();
    const label = (await clip.getAttribute("aria-label")) ?? "";
    const from = await clip.boundingBox();
    const rest = strip.locator('button[aria-label*="rest day"], button[aria-label*="team day"]').first();
    const to = await rest.boundingBox();
    expect(from && to).toBeTruthy();
    await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(from!.x + ((to!.x + to!.width / 2 - from!.x) * i) / 8, from!.y + from!.height / 2, { steps: 2 });
    await page.mouse.up();
    const dialog = page.getByRole("alertdialog");
    if (await dialog.isVisible({ timeout: 800 }).catch(() => false)) {
      await page.getByRole("button", { name: "Move anyway" }).click();
    }
    await expect(page.getByTestId("toast")).toContainText(/Moved/);
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByTestId("toast")).toHaveCount(0);
    await expect(strip.locator(`[aria-label="${label}"]`)).toHaveCount(1);
  });

  test("swap a main drill and change the session length", async ({ page }) => {
    await resetDemo(page);
    await page.goto("/app/plan");
    const li = page.locator("ol li").filter({ has: page.getByRole("button", { name: "Swap" }) }).first();
    await li.getByRole("button", { name: "Swap" }).click();
    await li.locator("div.border-t button").first().click();
    await expect(page.getByTestId("toast")).toContainText(/swapped/i);
    const slider = page.getByLabel("Session length");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("toast").last()).toContainText(/min/);
  });

  test("re-cut week menu works", async ({ page }) => {
    await resetDemo(page);
    await page.goto("/app/plan");
    await page.getByRole("button", { name: /Re-cut week/ }).click();
    await page.getByRole("menuitem", { name: /Make it lighter/ }).click();
    await expect(page.getByTestId("toast")).toContainText(/lighter/);
  });
});

test.describe("Drills", () => {
  test("filters narrow the library and detail page renders", async ({ page }) => {
    await resetDemo(page);
    await page.goto("/app/drills");
    await page.getByRole("button", { name: "Shooting" }).click();
    await expect(page.getByRole("heading", { level: 2 }).first()).toContainText(/drills/);
    await page.getByRole("button", { name: "Wall" }).click();
    await expect(page.getByRole("heading", { level: 2 }).first()).toContainText(/1 drill/);
    await page.getByRole("link", { name: /Wall Rebound Finishing/ }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Wall Rebound Finishing");
    await expect(page.getByLabel("Scrub through the drill diagram")).toBeVisible();
    await page.getByRole("button", { name: "Exclude from my plans" }).click();
    await page.getByRole("button", { name: "Exclude anyway" }).click();
    await expect(page.getByRole("button", { name: "Allow in my plans again" })).toBeVisible();
  });

  test("selected chip text is readable", async ({ page }) => {
    await resetDemo(page);
    await page.goto("/app/drills");
    const chip = page.getByRole("button", { name: "All skills" });
    const color = await chip.evaluate((el) => getComputedStyle(el).color);
    const bg = await chip.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(color).not.toEqual(bg);
  });
});

test.describe("Session", () => {
  test("runs a drill, rests, logs and shows XP", async ({ page }) => {
    await resetDemo(page);
    await page.goto("/app");
    await page.getByRole("button", { name: /Start (session|early)/ }).click();
    await expect(page).toHaveURL(/\/app\/session\//);
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.getByText(/Drill 1 of/)).toBeVisible();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Next drill" }).click();
    await page.getByRole("button", { name: "Next drill" }).click();
    const goNow = page.getByRole("button", { name: "Go now" });
    if (await goNow.isVisible({ timeout: 500 }).catch(() => false)) await goNow.click();
    await page.getByRole("button", { name: "End" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Log what you did|wrap/);
    await page.getByRole("button", { name: "Save log" }).click();
    await expect(page.getByText("XP earned")).toBeVisible();
    await page.getByRole("button", { name: "Home" }).click();
    await expect(page).toHaveURL(/\/app$/);
  });
});

test.describe("Coach", () => {
  test("answers and applies a plan action", async ({ page }) => {
    await resetDemo(page);
    await page.goto("/app/coach");
    await page.getByLabel("Message Course AI").fill("Make this week lighter");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: /20% lighter/ }).click({ timeout: 15000 });
    await expect(page.getByTestId("toast")).toContainText(/lighter/);
  });
});

test.describe("Onboarding", () => {
  test("fresh player builds a plan end to end", async ({ page }) => {
    await page.goto("/start?fresh=1");
    await page.getByPlaceholder("Your first name").fill("Bella");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Decrease" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: /Striker/ }).click();
    await page.getByRole("radio", { name: /Just starting/ }).click();
    await page.getByRole("radio", { name: /^Left/ }).click();
    await page.getByRole("button", { name: "Score more" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /^Tue/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: /Small/ }).click();
    await page.getByRole("button", { name: "Cones" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/cut from/);
    await page.getByRole("button", { name: "Cut my plan" }).click();
    await expect(page.getByText(/Your plan is cut/)).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Go to my plan" }).click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Bella/);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("xtrain:v1") || "{}"));
    expect(saved.profile.position).toBe("ST");
    expect(saved.plan.weeks.length).toBe(4);
    expect(saved.plan.weeks[0].days.filter((d: { sessions: unknown[] }) => d.sessions.length).length).toBe(3);
  });
});

test.describe("Landing", () => {
  test("hero fits the viewport with CTA visible", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Build my plan" }).nth(1);
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    const vh = page.viewportSize()!.height;
    expect(box!.y + box!.height).toBeLessThan(vh);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/[—–]/);
  });
});

test("today helper is sane", () => {
  expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
