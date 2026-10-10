import { DRILLS, LIBRARY, buildSession } from './drills.js';
import { Field } from './field.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, DrawSVGPlugin, MotionPathPlugin, Draggable, InertiaPlugin);
// Curves measured on the reference sites (see docs/research/design-references.md).
CustomEase.create('out', '0.23, 1, 0.32, 1');     // states, hovers
CustomEase.create('reveal', '0.19, 1, 0.22, 1');  // entrances
CustomEase.create('inOut', '0.77, 0, 0.175, 1');  // large moves

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const still = matchMedia('(prefers-reduced-motion: reduce)').matches || params.get('motion') === 'off';
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------- shared state: one kit drives the whole page ---------------- */
const state = { kit: ['wall'], minutes: 30, prefer: null, session: null, touched: false };
// ?kit=wall,cones&min=45 opens the page on that setup (for sharing and review captures)
const kitParam = params.get('kit');
if (kitParam !== null) state.kit = kitParam.split(',').filter((k) => ['wall', 'cones', 'goal', 'mate'].includes(k));
if ([15, 30, 45].includes(+params.get('min'))) state.minutes = +params.get('min');
const listeners = new Set();
const onChange = (fn) => listeners.add(fn);
function update(patch, why) {
  Object.assign(state, patch);
  state.session = buildSession(state.kit, state.minutes, state.prefer);
  listeners.forEach((fn) => fn(state, why));
}

/* ---------------- smooth scroll ---------------- */
let lenis = null;
if (!still) {
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const target = id === '#top' ? 0 : $(id);
  if (target === null) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else (target === 0 ? window : target).scrollTo ? (target === 0 ? window.scrollTo(0, 0) : target.scrollIntoView()) : null;
  if (id === '#join') setTimeout(() => $('#close-email').focus({ preventScroll: true }), lenis ? 1300 : 0);
}));

/* ---------------- top bar ---------------- */
const top = $('[data-top]');

/* ---------------- hero ---------------- */
const heroField = new Field($('[data-field]'), { slab: true });
const focusName = $('[data-focus-name]');
const focusCue = $('[data-focus-cue]');
const laneTrack = $('[data-lane-track]');

function renderLane(s, animate) {
  const keep = new Map([...laneTrack.children].map((li) => [li.dataset.id, li]));
  const next = s.ids.map((id, i) => {
    let li = keep.get(id);
    const fresh = !li;
    if (fresh) {
      li = document.createElement('li');
      li.className = 'lane-seg';
      li.dataset.id = id;
      li.innerHTML = `<span class="lane-name"><span class="nm"></span></span><span class="lane-min"><span class="n">0</span> min</span>`;
      li.querySelector('.nm').textContent = DRILLS[id].name;
      li.dataset.name = DRILLS[id].name;
      li.style.flexBasis = '0';
      li.style.flexGrow = animate ? 0 : s.mins[i];
    }
    keep.delete(id);
    li.classList.toggle('is-focus', id === s.focus);
    const n = li.querySelector('.n');
    const from = +n.textContent || 0;
    if (animate) {
      gsap.to(li, { flexGrow: s.mins[i], duration: 0.8, ease: 'inOut' });
      if (fresh) gsap.fromTo(li, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: 0.25, ease: 'out' });
      if (from !== s.mins[i]) gsap.to({ v: from }, { v: s.mins[i], duration: 0.8, ease: 'out', onUpdate() { n.textContent = Math.round(this.targets()[0].v); } });
    } else {
      li.style.flexGrow = s.mins[i];
      n.textContent = s.mins[i];
    }
    return li;
  });
  keep.forEach((li) => li.remove());
  next.forEach((li) => laneTrack.appendChild(li));
  if (animate) rollLane(next);
}

// The plan gets laid: a ball rolls down the lane and each drill name slides in as it passes.
const laneBall = $('[data-lane-ball]');
function rollLane(items) {
  const lane = $('[data-lane]').getBoundingClientRect();
  const desktop = innerWidth > 1023;
  gsap.killTweensOf(laneBall);
  const tl = gsap.timeline({ delay: 0.1 });
  items.forEach((li, i) => {
    const wrap = li.querySelector('.lane-name');
    const was = wrap.querySelector('.nm');
    const at = i * 0.1;
    // the name text is always the drill's; slide it in from below under a mask
    gsap.set(was, { yPercent: 0 });
    tl.fromTo(was, { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: 'reveal' }, at);
  });
  if (desktop) {
    const track = laneTrack.getBoundingClientRect();
    const y = track.top - lane.top + 21 - 13;
    tl.fromTo(laneBall, { x: track.left - lane.left - 13, y, autoAlpha: 1, rotation: 0 },
      { x: track.right - lane.left - 13, rotation: 540, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(laneBall, { autoAlpha: 0, duration: 0.25 }, '>-0.05');
  }
}

function renderCaption(s, animate) {
  const d = DRILLS[s.focus];
  if (focusName.textContent === d.name && focusCue.textContent === d.cue) return;
  if (!animate) { focusName.textContent = d.name; focusCue.textContent = d.cue; return; }
  gsap.timeline()
    .to([focusName, focusCue], { autoAlpha: 0, y: -6, duration: 0.2, ease: 'power2.in' })
    .add(() => { focusName.textContent = d.name; focusCue.textContent = d.cue; })
    .fromTo([focusName, focusCue], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'out', stagger: 0.06 });
}

let lastFocus = null;
onChange((s, why) => {
  const animate = !still && why !== 'init';
  if (s.session.focus !== lastFocus) {
    heroField.set(s.session.focus, { animate: !still && why !== 'init-still' });
    lastFocus = s.session.focus;
  }
  renderLane(s.session, animate);
  renderCaption(s.session, animate);
  $$('.kit-item[data-kit]').forEach((b) => {
    const on = b.dataset.kit === 'ball' || s.kit.includes(b.dataset.kit);
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on);
  });
  renderJoin(s.session, s.minutes);
  $$('.lane-time button').forEach((b) => {
    const on = +b.dataset.min === s.minutes;
    b.setAttribute('aria-checked', on);
    b.tabIndex = on ? 0 : -1; // one tab stop for the group; arrows move inside it
  });
});
const joinLane = $('[data-join-lane]');
const joinTitle = $('[data-join-title]');
function renderJoin(ses, minutes) {
  joinTitle.textContent = `Your ${minutes} minutes`;
  joinLane.innerHTML = ses.ids.map((id, i) => `<li style="flex-grow:${ses.mins[i]}"><span>${DRILLS[id].name}</span><span class="m">${ses.mins[i]} min</span></li>`).join('');
}

function toggleKit(k) {
  const adding = !state.kit.includes(k);
  const kit = adding ? [...state.kit, k] : state.kit.filter((x) => x !== k);
  update({ kit, prefer: adding ? k : null }, 'kit');
}
$$('.kit-item[data-kit]:not([disabled])').forEach((b) => b.addEventListener('click', (e) => {
  if (e.isTrusted) stopDemo();
  toggleKit(b.dataset.kit);
}));
$$('.lane-time button').forEach((b) => b.addEventListener('click', (e) => {
  if (e.isTrusted) stopDemo();
  update({ minutes: +b.dataset.min }, 'time');
}));
// arrow keys inside the minutes radio group
$('.lane-time').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  const opts = [15, 30, 45];
  const i = opts.indexOf(state.minutes) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
  const m = opts[(i + opts.length) % opts.length];
  stopDemo();
  update({ minutes: m }, 'time');
  $(`.lane-time button[data-min="${m}"]`).focus();
});

// Until someone touches the kit, the hero shows what the kit does on its own.
const demoSteps = [['wall', 'cones'], ['cones'], ['goal', 'cones'], ['mate', 'goal'], ['wall']];
let demoTimer = null, demoIndex = 0, demoOn = !still && kitParam === null;
function scheduleDemo(ms) {
  clearTimeout(demoTimer);
  demoTimer = demoOn ? setTimeout(demoTick, ms) : null;
}
function demoTick() {
  if (!demoOn) return;
  const next = demoSteps[demoIndex++ % demoSteps.length];
  update({ kit: next, prefer: next[0] }, 'demo');
  scheduleDemo(4400);
}
// hovering the kit means a tap may be coming: hold the demo still until the pointer leaves
const kitEl = $('.kit');
kitEl.addEventListener('pointerenter', () => { clearTimeout(demoTimer); demoTimer = null; });
kitEl.addEventListener('pointerleave', () => { if (demoOn && !demoTimer) scheduleDemo(2600); });
kitEl.addEventListener('focusin', () => stopDemo());
function stopDemo() {
  demoOn = false;
  clearTimeout(demoTimer);
  state.touched = true;
}
ScrollTrigger.create({
  trigger: '[data-hero]', start: 'top bottom', end: 'bottom top',
  onToggle: (s) => {
    if (s.isActive) { heroField.resume(); if (demoOn && !demoTimer) scheduleDemo(3000); }
    else { heroField.pause(); clearTimeout(demoTimer); demoTimer = null; }
  },
});

/* ---------------- run: the session plays as you scroll ---------------- */
const runField = new Field($('[data-run-field]'), { slab: true, room: innerWidth > 1023 ? 0.55 : 0.5 });
const ph = {
  count: $('[data-ph-count]'), name: $('[data-ph-name]'), time: $('[data-ph-time]'),
  cue: $('[data-ph-cue]'), bar: $('[data-ph-bar]'), next: $('[data-ph-next]'),
};
const runSteps = $$('[data-run-steps] li');
let runIndex = -1;
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

function runDrills() {
  // the same session the lane built, every drill in order
  const s = state.session;
  return s.ids.map((id, i) => [id, s.mins[i]]);
}
function showRun(i, progress = 0, animate = true) {
  const list = runDrills();
  i = Math.min(i, list.length - 1);
  const [id, min] = list[i];
  if (i !== runIndex || runField.current !== id) {
    runIndex = i;
    runField.set(id, { animate: animate && !still });
    const d = DRILLS[id];
    ph.count.textContent = `Drill ${i + 1} of ${list.length}`;
    ph.cue.textContent = d.cue;
    ph.next.textContent = list[i + 1] ? `Next: ${DRILLS[list[i + 1][0]].name}` : 'Last one. Finish strong.';
    if (animate && !still) {
      gsap.fromTo(ph.name, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'out' });
      gsap.fromTo(ph.cue, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.1 });
    }
    ph.name.textContent = d.name;
  }
  const left = min * 60 * (1 - progress);
  ph.time.textContent = fmt(left);
  gsap.set(ph.bar, { scaleX: 1 - progress, autoAlpha: progress > 0.985 ? 0 : 1 });
}
const runPin = $('[data-run-pin]');
if (!still) {
  ScrollTrigger.create({
    trigger: runPin, start: 'top top', end: '+=220%', pin: true, scrub: true,
    onUpdate: (st) => {
      const n = runDrills().length;
      const p = st.progress * n;
      const i = Math.min(n - 1, Math.floor(p));
      showRun(i, Math.min(0.999, p - i));
      const step = Math.min(runSteps.length - 1, Math.floor(st.progress * runSteps.length));
      runSteps.forEach((li, k) => li.classList.toggle('is-on', k === step));
    },
    onToggle: (st) => (st.isActive ? runField.resume() : runField.pause()),
  });
}

/* ---------------- adapt: one answer changes tomorrow ---------------- */
const adaptField = new Field($('[data-adapt-field]'), { slab: true, labels: false });
const todayField = new Field($('[data-today-field]'), { slab: true, labels: false });
const adaptName = $('[data-adapt-name]');
const adaptChange = $('[data-adapt-change]');
let rating = 'easy';
let adaptPlayed = false;

// Tomorrow's version of a drill: tighter or looser, further from or closer to the wall.
function variant(id, how) {
  const d = DRILLS[id];
  if (how === 'right') return d;
  const hasFixture = d.objects.some((o) => o.kind === 'wall' || o.kind === 'goal');
  const cones = d.objects.filter((o) => o.kind === 'cone');
  let f;
  if (hasFixture) {
    const k = how === 'easy' ? 1.3 : 0.76;
    f = (x, y) => [x, y < 110 ? y : 105 + (y - 105) * k];
  } else if (cones.length > 1) {
    const cx = cones.reduce((a, o) => a + o.x, 0) / cones.length;
    const cy = cones.reduce((a, o) => a + o.y, 0) / cones.length;
    const k = how === 'easy' ? 0.72 : 1.22;
    f = (x, y) => [cx + (x - cx) * k, cy + (y - cy) * k];
  } else {
    const k = how === 'easy' ? 1.15 : 0.88;
    f = (x, y) => [500 + (x - 500) * k, 320 + (y - 320) * k];
  }
  const mapPath = (p) => p.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (_, a, b) => f(+a, +b).map((v) => v.toFixed(1)).join(' '));
  return {
    ...d,
    objects: d.objects.map((o) => (o.kind === 'wall' || o.kind === 'goal' ? o : { ...o, x: f(o.x, o.y)[0], y: f(o.x, o.y)[1] })),
    paths: d.paths.map((p) => ({ ...p, d: mapPath(p.d) })),
    zone: d.zone && (() => { const [x1, y1] = f(d.zone.x, d.zone.y); const [x2, y2] = f(d.zone.x + d.zone.w, d.zone.y + d.zone.h); return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }; })(),
  };
}
// Says exactly what the drawing changes (see variant()).
function changeText(d, harder) {
  const has = (k) => d.objects.some((o) => o.kind === k);
  const cones = d.objects.filter((o) => o.kind === 'cone').length;
  if (has('wall')) return harder ? 'Harder: start further from the wall.' : 'Easier: start closer to the wall.';
  if (has('goal')) return harder ? 'Harder: shoot from further out.' : 'Easier: move in closer to the goal.';
  if (cones > 1) return harder ? 'Harder: the cones move closer together.' : 'Easier: the cones move further apart.';
  if (has('mate')) return harder ? 'Harder: your friend stands further away.' : 'Easier: your friend moves closer.';
  return harder ? 'Harder: more ground to cover.' : 'Easier: a smaller space.';
}
function showAdapt(animate) {
  const id = state.session.focus;
  const d = DRILLS[id];
  adaptName.textContent = d.name;
  if (todayField.current !== id) {
    // one camera for both days, framed on everything any answer could produce
    const fr = [d, variant(id, 'easy'), variant(id, 'hard')].map((v) => todayField.frame(v));
    const x0 = Math.min(...fr.map((f) => f[0])), y0 = Math.min(...fr.map((f) => f[1]));
    const x1 = Math.max(...fr.map((f) => f[0] + f[2])), y1 = Math.max(...fr.map((f) => f[1] + f[3]));
    const w = Math.max(x1 - x0, (y1 - y0) * 1000 / 640), h = w * 640 / 1000;
    const view = [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
    todayField.fixedView = view;
    adaptField.fixedView = view;
    todayField.set(id, { animate: false });
  }
  adaptField.set(variant(id, rating), { animate: animate && !still });
  const text = rating === 'right' ? 'Same drill tomorrow, two minutes longer.' : changeText(d, rating === 'easy');
  if (animate && !still) {
    gsap.timeline().to(adaptChange, { autoAlpha: 0, y: -6, duration: 0.18 })
      .add(() => { adaptChange.textContent = text; })
      .to(adaptChange, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'out' });
  } else adaptChange.textContent = text;
}
$$('[data-rate]').forEach((b) => b.addEventListener('click', () => {
  rating = b.dataset.rate;
  $$('[data-rate]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
  showAdapt(true);
}));
ScrollTrigger.create({
  trigger: '[data-adapt]', start: 'top bottom', end: 'bottom top',
  onToggle: (s) => {
    if (s.isActive) {
      if (state.session.focus !== todayField.current) showAdapt(false);
      if (!still && !adaptPlayed) {
        // the first time it comes into view, play the answer: tomorrow starts as today, then tightens
        adaptPlayed = true;
        adaptField.set(DRILLS[state.session.focus], { animate: false });
        setTimeout(() => showAdapt(true), 900);
      } else if (!still) adaptField.play();
    }
    else adaptField.stopLoop();
  },
});

/* ---------------- library strip ---------------- */
const libTrack = $('[data-lib-track]');
const gearWords = { wall: 'wall', cones: 'cones', goal: 'goal', mate: 'a friend' };
LIBRARY.forEach((id) => {
  const d = DRILLS[id];
  const li = document.createElement('li');
  li.className = 'lib-card';
  const need = d.needs.length ? `Ball, ${d.needs.map((n) => gearWords[n]).join(', ')}` : 'Just a ball';
  li.innerHTML = `<p class="lib-tag"><span class="lib-name"></span><span class="lib-meta"></span></p><svg class="field" role="img" aria-label="${d.name} setup"></svg>`;
  li.querySelector('.lib-name').textContent = d.name;
  li.querySelector('.lib-meta').textContent = `${d.block} · ${need}`;
  libTrack.appendChild(li);
  const svg = li.querySelector('svg');
  const f = new Field(svg, { labels: false, compact: true });
  // each drill takes the room its setup needs, so the strip reads as one ground, not panes
  const ext = Math.max(...d.objects.map((o) => o.x + (o.w || 0))) - Math.min(...d.objects.map((o) => o.x));
  svg.style.width = `${Math.round(Math.min(440, Math.max(240, 170 + ext * 0.5)))}px`;
  f.set(id, { animate: false });
  if (fine && !still) {
    li.addEventListener('pointerenter', () => f.play());
    li.addEventListener('pointerleave', () => { f.stopLoop(); f.set(id, { animate: false }); });
  }
});
const libViewport = $('[data-lib-viewport]');
function libBounds() {
  const max = libTrack.scrollWidth - libViewport.clientWidth;
  return { minX: -Math.max(0, max), maxX: 0 };
}
const [libDrag] = Draggable.create(libTrack, {
  type: 'x', inertia: true, bounds: libBounds(), edgeResistance: 0.85, dragClickables: true,
  onPress() { this.applyBounds(libBounds()); },
});
window.addEventListener('resize', () => libDrag.applyBounds(libBounds()));
if (!still) {
  // a little drift as it comes into view, so it reads as something that moves
  gsap.fromTo(libTrack, { x: 0 }, { x: () => Math.max(libBounds().minX, -260), ease: 'none', scrollTrigger: { trigger: '[data-lib]', start: 'top bottom', end: 'bottom top', scrub: 0.6 }, onUpdate: () => libDrag.update() });
}

/* ---------------- headings ---------------- */
// Headline lines come into focus: blur to sharp, lines 120ms apart (measured on linear.app).
function blurIn(target, opts = {}) {
  return gsap.from(target, { autoAlpha: 0, filter: 'blur(12px)', y: 18, duration: 1.1, ease: 'reveal', stagger: 0.12, clearProps: 'filter', ...opts });
}
function lift(target, opts = {}) {
  const split = SplitText.create(target, { type: 'lines', mask: 'lines', linesClass: 'ln' });
  return gsap.from(split.lines, { yPercent: 105, duration: 1.05, ease: 'out', stagger: 0.08, ...opts });
}
if (!still) {
  document.fonts.ready.then(() => {
    // hero entrance: type rises, kit lands, the lane is laid cone by cone
    const tl = gsap.timeline({ defaults: { ease: 'reveal' } });
    tl.add(blurIn('.hero-title .line'), 0.05)
      .from('.hero-line', { autoAlpha: 0, y: 12, filter: 'blur(6px)', duration: 0.8 }, 0.4)
      .from('.hero .signup', { autoAlpha: 0, y: 12, duration: 0.8 }, 0.5)
      .from('.kit', { autoAlpha: 0, y: 12, duration: 0.8 }, 0.6)
      .from('.lane', { autoAlpha: 0, duration: 0.7 }, 0.8)
      .from('.field-cap', { autoAlpha: 0, y: 8, duration: 0.6 }, 1.0)
      .from('[data-field]', { autoAlpha: 0, duration: 0.9, ease: 'out' }, 0.2);
    $$('.run h2, .adapt h2, .lib h2, .join h2').forEach((h) => lift(h, { scrollTrigger: { trigger: h, start: 'top 86%' } }));
  });
}

/* ---------------- signup ---------------- */
const more = $('[data-more]');
let lastEmail = null;
async function send(payload) {
  const r = await fetch('/api/join', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    const err = new Error(j.error || 'server');
    err.code = j.error || 'server';
    throw err;
  }
}
$$('[data-signup]').forEach((form) => {
  const input = form.querySelector('input[type=email]');
  const btn = form.querySelector('button[type=submit]');
  const msg = form.querySelector('.signup-msg');
  const say = (t, tone) => { msg.textContent = t; msg.dataset.tone = tone || ''; };
  input.addEventListener('input', () => { if (msg.dataset.tone === 'bad') say(''); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say('That email looks off. Check it and try again.', 'bad');
      input.focus();
      return;
    }
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    const label = btn.querySelector('span');
    const was = label.textContent;
    label.textContent = 'Saving';
    try {
      await send({ email, kit: state.kit, minutes: state.minutes, source: form.dataset.source, company: form.company.value, step: 1 });
      lastEmail = email;
      form.classList.add('is-done');
      say("You're on the list.");
      label.textContent = 'Saved';
      openMore();
    } catch (err) {
      label.textContent = was;
      btn.disabled = false;
      say(err.code === 'email' ? 'That email looks off. Check it and try again.' : "We couldn't save that just now. Try again in a minute.", 'bad');
    } finally {
      btn.removeAttribute('aria-busy');
    }
  });
});

const picks = {};
$$('[data-more] .chips').forEach((group) => group.addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  const on = !b.classList.contains('is-on');
  $$('.chip', group).forEach((c) => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
  if (on) { b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); }
  picks[group.dataset.group] = on ? b.dataset.v : null;
}));
function openMore() {
  if (typeof more.showModal === 'function' && !more.open) {
    more.showModal();
    lenis && lenis.stop();
  }
}
function closeMore() {
  if (more.open) more.close();
}
more.addEventListener('close', () => lenis && lenis.start());
$('[data-more-skip]').addEventListener('click', closeMore);
$('[data-more-save]').addEventListener('click', async () => {
  const btn = $('[data-more-save]');
  if (!picks.position && !picks.level) return closeMore();
  btn.disabled = true;
  btn.textContent = 'Saving';
  try {
    await send({ email: lastEmail, position: picks.position, level: picks.level, kit: state.kit, minutes: state.minutes, source: 'close', step: 2 });
  } catch (e) { /* the email is already saved; the extras are optional */ }
  btn.textContent = 'Saved';
  setTimeout(closeMore, 450);
});

/* ---------------- top bar (created last, after the pin adds its spacer) ---------------- */
ScrollTrigger.create({ start: 40, onToggle: (s) => top.classList.toggle('is-stuck', s.isActive) });
ScrollTrigger.create({ trigger: '[data-join]', start: 'top 72px', end: 'bottom 72px', onToggle: (s) => top.classList.toggle('on-cone', s.isActive) });

/* ---------------- start ---------------- */
update({}, still ? 'init-still' : 'init');
showAdapt(false);
showRun(0, 0, false);
scheduleDemo(4600);
window.addEventListener('load', () => ScrollTrigger.refresh());
