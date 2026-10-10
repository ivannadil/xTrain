// Top-down drill diagrams drawn from data (see drills.js).
// One Field owns one <svg>; it keeps a pool of objects so a new setup
// moves the same cones and ball to their new spots instead of redrawing.

import { DRILLS } from './drills.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
};

let uid = 0;
let maskId = 0;

// Shapes. Depth comes only from flat layers overlapping, never from shading.
function makeCone(parent) {
  const g = el('g', { class: 'f-cone' }, parent);
  el('circle', { r: 23, class: 'f-cone-brim' }, g);
  el('circle', { r: 14, class: 'f-cone-top' }, g);
  el('circle', { r: 6, class: 'f-cone-hole' }, g);
  return g;
}

function makeBall(parent) {
  const g = el('g', { class: 'f-ball' }, parent);
  el('circle', { r: 16, class: 'f-ball-skin' }, g);
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = (-90 + i * 72) * (Math.PI / 180);
    pts.push([Math.cos(a) * 7, Math.sin(a) * 7].map((v) => v.toFixed(2)).join(','));
  }
  el('polygon', { points: pts.join(' '), class: 'f-ball-panel' }, g);
  return g;
}

function makePlayer(parent, mate) {
  const g = el('g', { class: mate ? 'f-mate' : 'f-me' }, parent);
  const turn = el('g', { class: 'f-turn' }, g);
  el('circle', { r: 26, class: 'f-player-disc' }, turn);
  el('path', { d: 'M-8 -4 L0 -15 L8 -4', class: 'f-player-nose' }, turn);
  return g;
}

function makeWall(parent) {
  const g = el('g', { class: 'f-wall' }, parent);
  el('rect', { x: 0, y: -8, width: 100, height: 32, class: 'f-wall-face' }, g);
  el('g', { class: 'f-wall-joints' }, g);
  return g;
}

function makeGoal(parent) {
  const g = el('g', { class: 'f-goal' }, parent);
  el('g', { class: 'f-goal-net' }, g);
  el('path', { class: 'f-goal-frame' }, g);
  return g;
}

// A wavy line along any path: the coaching mark for "dribble".
function wavy(svg, d, amp = 6, wave = 30) {
  const probe = el('path', { d }, svg);
  const len = probe.getTotalLength();
  const steps = Math.max(24, Math.round(len / 4));
  let out = '';
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * len;
    const p = probe.getPointAtLength(s);
    const q = probe.getPointAtLength(Math.min(len, s + 0.5));
    const r = probe.getPointAtLength(Math.max(0, s - 0.5));
    const dx = q.x - r.x, dy = q.y - r.y;
    const m = Math.hypot(dx, dy) || 1;
    // taper the wave to zero at both ends so the arrow lands cleanly
    const taper = Math.min(1, s / 30, (len - s) / 40);
    const off = Math.sin((s / wave) * Math.PI * 2) * amp * Math.max(0, taper);
    const x = p.x + (-dy / m) * off;
    const y = p.y + (dx / m) * off;
    out += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  probe.remove();
  return out;
}

export class Field {
  constructor(svg, { labels = true, compact = false, slab = false } = {}) {
    this.svg = svg;
    this.labels = labels;
    this.compact = compact;
    this.slab = slab;
    this.id = ++uid;
    svg.setAttribute('viewBox', '0 0 1000 640');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const defs = el('defs', {}, svg);
    this.defs = defs;
    const mk = el('marker', { id: `arrow-${this.id}`, viewBox: '0 0 10 10', refX: 7, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse', markerUnits: 'strokeWidth' }, defs);
    el('path', { d: 'M0 0 L10 5 L0 10 z', class: 'f-arrowhead' }, mk);
    if (slab) {
      // the driveway: one concrete slab with its expansion joints
      const g = el('g', { class: 'f-slab' }, svg);
      el('rect', { x: 40, y: 34, width: 920, height: 590, rx: 22, class: 'f-slab-face' }, g);
      el('line', { x1: 500, y1: 34, x2: 500, y2: 624, class: 'f-slab-joint' }, g);
      el('line', { x1: 40, y1: 330, x2: 960, y2: 330, class: 'f-slab-joint' }, g);
    }
    this.layers = {
      zone: el('g', { class: 'f-zones' }, svg),
      fixtures: el('g', { class: 'f-fixtures' }, svg),
      paths: el('g', { class: 'f-paths' }, svg),
      labels: el('g', { class: 'f-labels' }, svg),
      cones: el('g', { class: 'f-cones' }, svg),
      players: el('g', { class: 'f-players' }, svg),
      ball: el('g', { class: 'f-balls' }, svg),
    };
    this.cones = [];
    this.wall = makeWall(this.layers.fixtures);
    this.goal = makeGoal(this.layers.fixtures);
    this.me = makePlayer(this.layers.players, false);
    this.mate = makePlayer(this.layers.players, true);
    this.ball = makeBall(this.layers.ball);
    gsap.set([this.ball, this.me, this.mate], { transformOrigin: '50% 50%' });
    [this.wall, this.goal, this.mate, this.me, this.ball].forEach((n) => gsap.set(n, { autoAlpha: 0 }));
    this.loop = null;
    this.current = null;
    this.view = [0, 0, 1000, 640];
  }

  // Frame a setup: bounds of everything in it, padded, at the field's aspect.
  frame(drill) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    drill.objects.forEach((o) => {
      if (o.kind === 'wall') { add(o.x, o.y); add(o.x + o.w, o.y + 24); }
      else if (o.kind === 'goal') { add(o.x, o.y); add(o.x + o.w, o.y + 46); }
      else { add(o.x - 22, o.y - 22); add(o.x + 22, o.y + 22); }
    });
    drill.paths.forEach((p) => {
      const nums = p.d.match(/-?\d+(\.\d+)?/g).map(Number);
      for (let i = 0; i + 1 < nums.length; i += 2) add(nums[i], nums[i + 1]);
    });
    if (drill.zone) { add(drill.zone.x, drill.zone.y); add(drill.zone.x + drill.zone.w, drill.zone.y + drill.zone.h); }
    const pad = this.compact ? 46 : 70;
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    const aspect = 1000 / 640;
    let w = Math.max(x1 - x0, this.compact ? 300 : 560), h = Math.max(y1 - y0, w / aspect);
    w = Math.max(w, h * aspect); h = w / aspect;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return [cx - w / 2, cy - h / 2, w, h].map((v) => +v.toFixed(1));
  }

  cone(i) {
    while (this.cones.length <= i) {
      const c = makeCone(this.layers.cones);
      gsap.set(c, { x: 500, y: 320, scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' });
      this.cones.push(c);
    }
    return this.cones[i];
  }

  sizeWall(o) {
    const face = this.wall.querySelector('.f-wall-face');
    face.setAttribute('width', o.w);
    const joints = this.wall.querySelector('.f-wall-joints');
    joints.innerHTML = '';
    // a plain slab: the wall is one object, not a strip of bricks
  }

  sizeGoal(o) {
    const w = o.w, depth = 54;
    this.goal.querySelector('.f-goal-frame').setAttribute('d', `M0 ${depth} L0 0 L${w} 0 L${w} ${depth}`);
    const net = this.goal.querySelector('.f-goal-net');
    net.innerHTML = '';
    for (let x = 12; x < w; x += 14) el('line', { x1: x, y1: 0, x2: x, y2: depth - 6, class: 'f-net' }, net);
    for (let y = 10; y < depth - 4; y += 12) el('line', { x1: 0, y1: y, x2: w, y2: y, class: 'f-net' }, net);
  }

  // Place a drill. animate=false snaps everything (first paint, reduced motion).
  set(id, { animate = true, onDrawn } = {}) {
    const drill = typeof id === 'string' ? DRILLS[id] : id;
    if (!drill) return;
    const prev = this.current;
    this.current = id;
    this.stopLoop();

    const D = animate ? 1 : 0;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // old marks out
    const oldPaths = [...this.layers.paths.children, ...this.layers.labels.children, ...this.layers.zone.children];
    if (oldPaths.length) {
      tl.to(oldPaths, { autoAlpha: 0, duration: 0.18 * D, ease: 'power1.in', onComplete: () => oldPaths.forEach((n) => { if (n._mask) n._mask.remove(); n.remove(); }) }, 0);
    }

    const view = this.fixedView || (this.slab ? [0, 0, 1000, 640] : this.frame(drill));
    if (D) tl.to(this.view, { 0: view[0], 1: view[1], 2: view[2], 3: view[3], duration: 1.1, ease: 'expo.inOut', onUpdate: () => this.svg.setAttribute('viewBox', this.view.join(' ')) }, 0);
    else { this.view = view.slice(); this.svg.setAttribute('viewBox', view.join(' ')); }

    const objs = drill.objects;
    const cones = objs.filter((o) => o.kind === 'cone');
    const t0 = prev ? 0.12 * D : 0;

    // cones: reuse in order, extras leave
    cones.forEach((o, i) => {
      const c = this.cone(i);
      const visible = gsap.getProperty(c, 'autoAlpha') > 0.01;
      if (visible) {
        tl.to(c, { x: o.x, y: o.y, scale: 1, autoAlpha: 1, duration: 0.75 * D, ease: 'expo.inOut' }, t0 + i * 0.025 * D);
      } else {
        gsap.set(c, { x: o.x, y: o.y });
        tl.fromTo(c, { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5 * D, ease: 'power3.out' }, t0 + 0.2 * D + i * 0.05 * D);
      }
    });
    this.cones.slice(cones.length).forEach((c, i) => {
      tl.to(c, { scale: 0.4, autoAlpha: 0, duration: 0.3 * D, ease: 'power2.in' }, t0 + i * 0.02 * D);
    });

    const place = (node, o, kind) => {
      if (o) {
        const shown = gsap.getProperty(node, 'autoAlpha') > 0.01;
        if (kind === 'wall') this.sizeWall(o);
        if (kind === 'goal') this.sizeGoal(o);
        const target = { x: o.x, y: o.y, autoAlpha: 1 };
        if (shown) tl.to(node, { ...target, duration: 0.7 * D, ease: 'expo.inOut' }, t0);
        else {
          const from = kind === 'wall' || kind === 'goal' ? { x: o.x, y: o.y - 90, autoAlpha: 0 } : { x: o.x, y: o.y, autoAlpha: 0, scale: 1.4 };
          tl.fromTo(node, from, { ...target, scale: 1, duration: 0.7 * D, ease: 'expo.out' }, t0 + 0.08 * D);
        }
        const turn = node.querySelector('.f-turn');
        if (turn && o.r !== undefined) tl.to(turn, { rotation: o.r, transformOrigin: '50% 50%', duration: 0.6 * D, ease: 'power3.inOut' }, t0);
      } else if (gsap.getProperty(node, 'autoAlpha') > 0.01) {
        const away = kind === 'wall' || kind === 'goal' ? { y: '-=90' } : { scale: 0.6 };
        tl.to(node, { ...away, autoAlpha: 0, duration: 0.35 * D, ease: 'power2.in' }, 0);
      }
    };
    place(this.wall, objs.find((o) => o.kind === 'wall'), 'wall');
    place(this.goal, objs.find((o) => o.kind === 'goal'), 'goal');
    place(this.mate, objs.find((o) => o.kind === 'mate'), 'mate');
    place(this.me, objs.find((o) => o.kind === 'me'), 'me');
    place(this.ball, objs.find((o) => o.kind === 'ball'), 'ball');

    // new marks in
    const drawAt = t0 + 0.55 * D;
    if (drill.zone) {
      const z = drill.zone;
      const r = el('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 6, class: 'f-zone' }, this.layers.zone);
      tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 * D }, drawAt);
    }
    this.pathEls = drill.paths.map((p, i) => {
      const d = p.kind === 'dribble' && p.wave !== false ? wavy(this.svg, p.d) : p.d;
      const path = el('path', { d, class: `f-path f-${p.kind}` }, this.layers.paths);
      path.dataset.route = p.d;
      path.dataset.kind = p.kind;
      // arrowheads go on once the line has finished drawing, so none float ahead of it
      const arm = () => {
        path.setAttribute('marker-end', `url(#arrow-${this.id})`);
        if (p.both) path.setAttribute('marker-start', `url(#arrow-${this.id})`);
      };
      let drawn = path;
      if (p.kind === 'run') {
        // dotted lines keep their dots: draw a mask over them instead of the line itself
        const mid = `m-${this.id}-${++maskId}`;
        const mask = el('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -500, y: -500, width: 2000, height: 1700 }, this.defs);
        drawn = el('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': 44, 'stroke-linecap': 'round' }, mask);
        path.setAttribute('mask', `url(#${mid})`);
        path._mask = mask;
      }
      tl.fromTo(drawn, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6 * D, ease: 'power2.inOut', onComplete: arm }, drawAt + i * 0.16 * D);
      if (!D) arm();
      if (this.labels && p.label) {
        const guide = el('path', { d: p.d }, this.svg);
        const len = guide.getTotalLength();
        const at = guide.getPointAtLength(len * 0.5);
        const a = guide.getPointAtLength(Math.max(0, len * 0.5 - 2));
        const b = guide.getPointAtLength(Math.min(len, len * 0.5 + 2));
        guide.remove();
        let nx = -(b.y - a.y), ny = b.x - a.x;
        const m = Math.hypot(nx, ny) || 1;
        nx /= m; ny /= m;
        // label on the side away from the nearest other route (or the setup's centre)
        const others = drill.paths.filter((q) => q !== p).map((q) => midpoint(this.svg, q.d));
        let ref = centre(drill);
        if (others.length) ref = others.reduce((best, m) => (Math.hypot(m[0] - at.x, m[1] - at.y) < Math.hypot(best[0] - at.x, best[1] - at.y) ? m : best));
        if ((at.x - ref[0]) * nx + (at.y - ref[1]) * ny < 0) { nx = -nx; ny = -ny; }
        const off = p.kind === 'dribble' ? 34 : 26;
        const anchor = Math.abs(nx) > 0.6 ? (nx > 0 ? 'start' : 'end') : 'middle';
        const t = el('text', { x: at.x + nx * off, y: at.y + ny * off + 7, class: 'f-label', 'text-anchor': anchor }, this.layers.labels);
        t.textContent = p.label;
        tl.fromTo(t, { autoAlpha: 0, y: '+=6' }, { autoAlpha: 1, y: '-=6', duration: 0.4 * D, ease: 'power3.out' }, drawAt + 0.25 * D + i * 0.16 * D);
      }
      return path;
    });

    tl.call(() => { onDrawn && onDrawn(); if (animate) this.play(); });
    if (!animate) tl.progress(1);
    return tl;
  }

  // The ball (and the player, on runs) travel the routes, then reset. Loops.
  play() {
    const drill = typeof this.current === 'string' ? DRILLS[this.current] : this.current;
    if (!drill || !drill.paths.length) return;
    this.stopLoop();
    const ballStart = drill.objects.find((o) => o.kind === 'ball');
    const meStart = drill.objects.find((o) => o.kind === 'me');
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 0.4 });
    drill.paths.forEach((p, i) => {
      const route = this.layers.paths.children[i];
      if (!route) return;
      const target = p.kind === 'run' ? this.me : this.ball;
      const dur = p.kind === 'pass' ? 0.7 : 1.3;
      const motion = { path: p.d, align: false, autoRotate: false };
      tl.to(target, { motionPath: motion, duration: dur, ease: p.kind === 'pass' ? 'power2.out' : 'sine.inOut' }, i === 0 ? 0 : '>-0.05');
      if (p.both) tl.to(target, { motionPath: { ...motion, path: reverse(p.d) }, duration: dur, ease: 'power2.out' });
    });
    tl.to(this.ball, { autoAlpha: 0, duration: 0.2 }, '+=0.25')
      .set(this.ball, { x: ballStart.x, y: ballStart.y })
      .set(this.me, { x: meStart.x, y: meStart.y })
      .to(this.ball, { autoAlpha: 1, duration: 0.25 });
    this.loop = tl;
  }

  stopLoop() {
    if (this.loop) { this.loop.kill(); this.loop = null; }
  }

  pause() { this.loop && this.loop.pause(); }
  resume() { this.loop && this.loop.resume(); }
}

function midpoint(svg, d) {
  const g = el('path', { d }, svg);
  const p = g.getPointAtLength(g.getTotalLength() / 2);
  g.remove();
  return [p.x, p.y];
}

function centre(drill) {
  const pts = drill.objects.filter((o) => o.kind !== 'wall' && o.kind !== 'goal');
  return [pts.reduce((a, o) => a + o.x, 0) / pts.length, pts.reduce((a, o) => a + o.y, 0) / pts.length];
}

// Reverse a simple "M x y L x y" route (used for there-and-back touches).
function reverse(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  if (nums.length === 4) return `M${nums[2]} ${nums[3]} L${nums[0]} ${nums[1]}`;
  return d;
}

// Static mini diagram for the drill strip: no pooling, no loop.
export function drawStatic(svg, id) {
  const f = new Field(svg, { labels: false, compact: true });
  f.set(id, { animate: false });
  return f;
}
