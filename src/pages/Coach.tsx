import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PaperPlaneRight, Sparkle, Check, ArrowRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { usePlanOps } from "../lib/hooks";
import { coachReply, STARTERS, type CoachReply } from "../lib/coachBrain";
import { DRILL_BY_ID } from "../data/drills";
import { GOAL_LABEL, POSITION_LABEL, EQUIPMENT_LABEL } from "../data/types";
import { EASE_OUT, timecode } from "../lib/motion";
import { Button, Chip, Page, Difficulty } from "../components/ui";
import { PitchDiagram } from "../components/PitchDiagram";

type Msg = { id: number; from: "you" | "ai"; text: string; reply?: CoachReply; applied?: boolean; done?: boolean };

let mid = 1;

export default function Coach() {
  const { state, apply, prefs, dispatch } = usePlanOps();
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: mid++,
      from: "ai",
      text: state.profile
        ? `Hey ${state.profile.name}. I cut your plan from your profile and I re-cut it whenever life changes. Ask me why a session exists, tell me what you are missing today, or ask how to get better at something.`
        : "Build a plan first and I can answer questions about every session in it.",
      done: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [msgs, thinking, reduce]);

  useEffect(() => {
    if (!state.seenCoachIntro) dispatch({ type: "seenCoachIntro" });
  }, [state.seenCoachIntro, dispatch]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { id: mid++, from: "you", text: q, done: true }]);
    setThinking(true);
    const reply = coachReply(q, state.plan, state.profile, prefs, state.today);
    setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [...m, { id: mid++, from: "ai", text: reply.text, reply }]);
    }, reduce ? 200 : 650 + Math.min(600, q.length * 12));
  };

  const applyAction = (msg: Msg) => {
    if (!msg.reply?.action || !state.plan) return;
    apply(msg.reply.action.apply(state.plan), msg.reply.action.toast, "ai");
    setMsgs((m) => m.map((x) => (x.id === msg.id ? { ...x, applied: true } : x)));
  };

  const profile = state.profile;

  return (
    <Page wide className="md:py-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] items-start min-w-0">
        <section aria-label="Chat with Course AI" className="flex flex-col min-w-0 min-h-[calc(100dvh-180px)] md:min-h-[calc(100dvh-120px)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-dim text-teal"><Sparkle size={18} weight="fill" /></span>
            <div>
              <h1 className="display text-[22px] md:text-[28px] text-ink-10 leading-none">Course AI</h1>
              <p className="text-[12.5px] text-ink-8 mt-1">Answers from your plan. Scripted for this prototype; the live model comes later.</p>
            </div>
          </div>

          <div className="flex-1 grid content-start gap-3 pb-4" role="log" aria-live="polite">
            {msgs.map((m) => (
              <Bubble key={m.id} msg={m} onDone={() => setMsgs((ms) => ms.map((x) => (x.id === m.id ? { ...x, done: true } : x)))} onApply={() => applyAction(m)} onFollow={send} reduce={!!reduce} />
            ))}
            <AnimatePresence>
              {thinking && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex items-center gap-2 text-ink-8 text-[13px] pl-1">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-dim text-teal"><Sparkle size={12} weight="fill" /></span>
                  <span className="inline-flex gap-1" aria-label="Course AI is thinking">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-teal" style={{ animation: `blink 1s ${i * 0.15}s infinite` }} />
                    ))}
                  </span>
                  Reading your plan
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <div className="sticky bottom-[calc(var(--tabbar-h)+var(--sat)+8px)] md:bottom-4 bg-ink-1/95 backdrop-blur pt-2">
            {msgs.length <= 2 && (
              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0 md:flex-wrap">
                {STARTERS.map((s) => (
                  <Chip key={s} size="sm" onClick={() => send(s)}>{s}</Chip>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 rounded-lg bg-ink-3 hairline p-2"
            >
              <label className="sr-only" htmlFor="coach-input">Message Course AI</label>
              <textarea
                id="coach-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask, or say what changed"
                className="flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] text-ink-10 outline-none max-h-32"
              />
              <Button type="submit" variant="primary" size="md" aria-label="Send" icon={<PaperPlaneRight size={18} weight="fill" />} disabled={!input.trim()} />
            </form>
          </div>
        </section>

        <aside className="hidden lg:grid gap-4">
          {profile && (
            <section className="rounded-lg bg-ink-2 hairline p-5" aria-labelledby="know-title">
              <h2 id="know-title" className="display text-[18px] text-ink-10">What I am working from</h2>
              <dl className="mt-3 grid gap-2 text-[13px]">
                <Row k="Player" v={`${profile.name}, ${profile.age}, ${POSITION_LABEL[profile.position].toLowerCase()}`} />
                <Row k="Level" v={profile.experience} />
                <Row k="Goals" v={profile.goals.map((g) => GOAL_LABEL[g]).join(" · ")} />
                <Row k="Week" v={`${profile.daysPerWeek} days · ${timecode(profile.minutesPerSession)} each`} />
                <Row k="Kit" v={profile.equipment.length ? profile.equipment.map((e) => EQUIPMENT_LABEL[e].split(" ")[0]).join(", ") : "Ball only"} />
                <Row k="Stronger foot" v={profile.foot} />
              </dl>
              <Link to="/app/profile" className="link mt-3 inline-flex items-center gap-1 text-[13px] text-ink-8">Change my specs <ArrowRight size={13} /></Link>
            </section>
          )}
          <section className="rounded-lg bg-ink-2 hairline p-5">
            <h2 className="display text-[18px] text-ink-10">What I can do here</h2>
            <ul className="mt-3 grid gap-2 text-[13.5px] text-ink-9">
              <li className="flex gap-2"><Check size={16} className="text-teal shrink-0 mt-0.5" /> Explain why any session is where it is.</li>
              <li className="flex gap-2"><Check size={16} className="text-teal shrink-0 mt-0.5" /> Re-cut a session around missing kit or less time.</li>
              <li className="flex gap-2"><Check size={16} className="text-teal shrink-0 mt-0.5" /> Make a week lighter or harder, with Undo.</li>
              <li className="flex gap-2"><Check size={16} className="text-teal shrink-0 mt-0.5" /> Point you to the right drills for a skill.</li>
            </ul>
          </section>
        </aside>
      </div>
    </Page>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2">
      <dt className="text-ink-8">{k}</dt>
      <dd className="text-ink-10 capitalize">{v}</dd>
    </div>
  );
}

function Bubble({ msg, onDone, onApply, onFollow, reduce }: { msg: Msg; onDone: () => void; onApply: () => void; onFollow: (s: string) => void; reduce: boolean }) {
  const you = msg.from === "you";
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} className={clsx("flex", you ? "justify-end" : "justify-start")}>
      <div className={clsx("max-w-[92%] md:max-w-[80%]", you ? "rounded-lg rounded-br-sm bg-ink-10 text-ink-0 px-4 py-2.5" : "")}>
        {you ? (
          <p className="text-[15px]">{msg.text}</p>
        ) : (
          <div className="flex gap-3">
            <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-dim text-teal"><Sparkle size={14} weight="fill" /></span>
            <div className="min-w-0">
              <p className="text-[15px] text-ink-10 leading-relaxed text-pretty">
                {msg.done ? msg.text : <Typewriter text={msg.text} onDone={onDone} reduce={reduce} />}
              </p>
              {msg.done && msg.reply?.drills && msg.reply.drills.length > 0 && (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {msg.reply.drills.map((id) => {
                    const d = DRILL_BY_ID[id];
                    if (!d) return null;
                    return (
                      <li key={id}>
                        <Link to={`/app/drills/${id}`} className="pressable flex gap-3 rounded-md bg-ink-2 hairline p-2 hover:bg-ink-3">
                          <span className="clip-frame w-[88px] shrink-0 aspect-video"><PitchDiagram d={d.diagram} muted /></span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-[13.5px] text-ink-10 truncate">{d.name}</span>
                            <span className="mt-1 flex items-center gap-2 text-[12px] text-ink-8"><span className="timecode">{timecode(d.minutes)}</span><Difficulty level={d.difficulty} /></span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              {msg.done && msg.reply?.action && (
                <div className="mt-3">
                  {msg.applied ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-dim px-3 h-9 text-[13px] font-semibold text-teal"><Check size={14} weight="bold" /> Applied. Undo is in the toast.</span>
                  ) : (
                    <Button variant="teal" size="sm" onClick={onApply} icon={<Sparkle size={14} weight="fill" />}>{msg.reply.action.label}</Button>
                  )}
                </div>
              )}
              {msg.done && msg.reply?.followups && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.reply.followups.map((f) => (
                    <Chip key={f} size="sm" onClick={() => onFollow(f)}>{f}</Chip>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Typewriter({ text, onDone, reduce }: { text: string; onDone: () => void; reduce: boolean }) {
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    const words = text.split(" ");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(words.slice(0, i).join(" ").length);
      if (i >= words.length) {
        clearInterval(id);
        onDone();
      }
    }, 28);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      <span className="inline-block w-[2px] h-[1em] align-[-0.15em] bg-teal ml-0.5" style={{ animation: "blink 0.9s infinite" }} aria-hidden />
    </>
  );
}
