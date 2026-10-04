import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowsClockwise, Check, SignOut, ShieldCheck, Trash } from "@phosphor-icons/react";
import { usePlanOps, useSeed } from "../lib/hooks";
import { generatePlan, regenerateSession } from "../lib/courseAI";
import type { Equipment, Goal, Profile as ProfileT } from "../data/types";
import { Button, Page, AIVoice } from "../components/ui";
import { DaysPicker, EQUIPMENT_OPTIONS, EXPERIENCE_OPTIONS, Field, FOOT_OPTIONS, GOAL_OPTIONS, MultiChips, OptionGrid, POSITION_OPTIONS, SPACE_OPTIONS, Stepper, TextInput, minutesLabel } from "../components/ProfileFields";

export default function Profile() {
  const { state, dispatch, apply, prefs } = usePlanOps();
  const navigate = useNavigate();
  const seed = useSeed();
  const [draft, setDraft] = useState<ProfileT | null>(state.profile);
  const [saved, setSaved] = useState(false);
  if (!state.hydrated) return null;
  if (!draft) {
    return (
      <Page>
        <Button variant="primary" to="/start">Build my plan</Button>
      </Page>
    );
  }
  const set = <K extends keyof ProfileT>(k: K, v: ProfileT[K]) => {
    setDraft((d) => (d ? { ...d, [k]: v } : d));
    setSaved(false);
  };
  const toggle = <T extends string | number>(k: "goals" | "equipment" | "teamDays", v: T, max?: number) => {
    const arr = draft[k] as unknown as T[];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : max && arr.length >= max ? arr : [...arr, v];
    set(k, next as never);
  };
  const dirty = JSON.stringify(draft) !== JSON.stringify(state.profile);

  const save = () => {
    dispatch({ type: "setProfile", profile: draft });
    setSaved(true);
    dispatch({ type: "toast", text: "Profile saved. Re-cut the remaining weeks to apply it to the plan.", kind: "ok" });
  };
  const recutRemaining = () => {
    if (!state.plan) return;
    let next = state.plan;
    for (const w of state.plan.weeks) for (const d of w.days) for (const s of d.sessions) if (s.status === "planned") next = regenerateSession(next, s.id, draft, prefs, seed());
    dispatch({ type: "setProfile", profile: draft });
    apply(next, "Remaining sessions re-cut from your updated profile.", "ai");
  };
  const newPlan = () => {
    dispatch({ type: "setProfile", profile: draft });
    const start = state.plan?.startDate ?? state.today;
    apply(generatePlan(draft, prefs, start, seed()), "Brand-new four-week plan from your profile.", "ai", false);
    navigate("/app");
  };

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="display text-[30px] md:text-[40px] text-ink-10">Your specs</h1>
          <p className="mt-1 text-[13.5px] text-ink-8">Everything Course AI plans from.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={save} disabled={!dirty} icon={saved ? <Check size={16} weight="bold" /> : undefined}>{saved ? "Saved" : "Save"}</Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_300px] items-start">
        <div className="grid gap-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" id="name"><TextInput id="name" value={draft.name} onChange={(v) => set("name", v)} maxLength={24} /></Field>
            <Field label="Age" id="age"><TextInput id="age" value={String(draft.age)} inputMode="numeric" onChange={(v) => set("age", Math.max(8, Math.min(60, Number(v) || 0)))} /></Field>
          </div>
          <Field label="Position"><OptionGrid options={POSITION_OPTIONS} value={draft.position} onChange={(v) => set("position", v)} cols={4} /></Field>
          <Field label="Level"><OptionGrid options={EXPERIENCE_OPTIONS} value={draft.experience} onChange={(v) => set("experience", v)} cols={3} /></Field>
          <Field label="Stronger foot"><OptionGrid options={FOOT_OPTIONS} value={draft.foot} onChange={(v) => set("foot", v)} cols={3} /></Field>
          <Field label="Goals" hint="Pick up to two. The first one gets the freshest day of the week."><MultiChips options={GOAL_OPTIONS} value={draft.goals} onToggle={(v) => toggle<Goal>("goals", v, 2)} max={2} /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Solo days a week"><Stepper value={draft.daysPerWeek} onChange={(v) => set("daysPerWeek", v)} min={1} max={6} step={1} /></Field>
            <Field label="Minutes a session"><Stepper value={draft.minutesPerSession} onChange={(v) => set("minutesPerSession", v)} min={20} max={75} step={5} format={minutesLabel} /></Field>
          </div>
          <Field label="Team training days" hint="Course AI keeps these clear and caps the day before."><DaysPicker value={draft.teamDays} onToggle={(d) => toggle<number>("teamDays", d)} /></Field>
          <Field label="Kit" hint="A ball is assumed. Tick what else you can get to."><MultiChips options={EQUIPMENT_OPTIONS} value={draft.equipment} onToggle={(v) => toggle<Equipment>("equipment", v)} /></Field>
          <Field label="Space"><OptionGrid options={SPACE_OPTIONS} value={draft.space} onChange={(v) => set("space", v)} cols={3} /></Field>
          <Field label="Anything sore or recovering?" id="inj"><TextInput id="inj" value={draft.injuries ?? ""} onChange={(v) => set("injuries", v)} placeholder="Left ankle, rolled it two weeks ago" /></Field>
          {draft.age < 13 && (
            <Field label="Guardian email" hint="Required under 13. We send a consent request before any data is stored." id="guardian">
              <TextInput id="guardian" type="email" inputMode="email" value={draft.guardianEmail ?? ""} onChange={(v) => set("guardianEmail", v)} placeholder="parent@example.com" />
            </Field>
          )}
        </div>

        <aside className="grid gap-4 md:sticky md:top-6">
          <section className="rounded-lg bg-ink-2 hairline p-5 grid gap-3">
            <h2 className="display text-[18px] text-ink-10">Apply to the plan</h2>
            <AIVoice compact>Saving changes your profile. To change the plan too, re-cut the sessions that have not happened yet, or start a new four-week plan.</AIVoice>
            <Button variant="teal" icon={<ArrowsClockwise size={16} />} onClick={recutRemaining} full>Re-cut remaining weeks</Button>
            <Button variant="secondary" onClick={newPlan} full>Start a new plan</Button>
          </section>
          <section className="rounded-lg bg-ink-2 hairline p-5 grid gap-2">
            <h2 className="display text-[18px] text-ink-10 flex items-center gap-2"><ShieldCheck size={18} className="text-teal" /> Account</h2>
            <p className="text-[13px] text-ink-8">Sign-in, guardian consent, and coach or parent linking are not wired in this prototype. Your data stays in this browser.</p>
          </section>
          <section className="rounded-lg bg-ink-2 hairline p-5 grid gap-2">
            <h2 className="display text-[18px] text-ink-10">Demo controls</h2>
            <Button variant="ghost" icon={<Trash size={15} />} onClick={() => { dispatch({ type: "seedDemo" }); dispatch({ type: "toast", text: "Demo player reset.", kind: "ok" }); navigate("/app"); }} full>Reset demo player</Button>
            <Button variant="ghost" icon={<SignOut size={15} />} onClick={() => { dispatch({ type: "reset" }); navigate("/start"); }} full>Start fresh as a new player</Button>
          </section>
        </aside>
      </div>
    </Page>
  );
}
