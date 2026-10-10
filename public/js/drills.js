// Drill data for the landing page demos.
// Names, gear, and cues come from the team's Drill Library and "5 drills" documents.
// Geometry is in a 1000 x 640 top-down field; 1 yard is roughly 60 units.
//
// Object kinds: cone, ball, wall, goal, me (the player), mate (a friend).
// Path kinds follow coaching-diagram notation:
//   pass    solid line with an arrow (the ball travelling)
//   run     dashed line (the player moving without the ball)
//   dribble wavy line (the player moving with the ball)

export const KIT = [
  { id: 'wall', label: 'Wall' },
  { id: 'cones', label: 'Cones' },
  { id: 'goal', label: 'Goal' },
  { id: 'mate', label: 'A friend' },
];

export const TIMES = [15, 30, 45];

export const DRILLS = {
  'toe-taps': {
    name: 'Toe Taps',
    block: 'Warm-up',
    needs: [],
    cue: 'Tap the ball. Never step on it.',
    harder: 'Taps while circling the ball',
    easier: 'Slow taps, hands on hips',
    objects: [
      { kind: 'ball', x: 500, y: 330 },
      { kind: 'me', x: 500, y: 410, r: 0 },
    ],
    paths: [
      { kind: 'run', d: 'M455 300 C430 330 430 360 455 390', label: 'left' },
      { kind: 'run', d: 'M545 300 C570 330 570 360 545 390', label: 'right' },
    ],
    zone: { x: 440, y: 270, w: 120, h: 120 },
  },
  'bell-touches': {
    name: 'Bell Touches',
    block: 'Warm-up',
    needs: [],
    cue: 'Inside, inside. Eyes up.',
    harder: 'Walk forward, eyes on a target',
    easier: 'Stop the ball between touches',
    objects: [
      { kind: 'ball', x: 500, y: 330 },
      { kind: 'me', x: 500, y: 410, r: 0 },
    ],
    paths: [{ kind: 'pass', d: 'M430 330 L570 330', both: true, label: 'inside, inside' }],
    zone: { x: 420, y: 270, w: 160, h: 120 },
  },
  'sole-rolls': {
    name: 'Sole Rolls',
    block: 'Ball mastery',
    needs: [],
    cue: 'Roll it across. Do not push it.',
    harder: 'Every fourth roll, push out and go',
    easier: 'Roll, stop, reset',
    objects: [
      { kind: 'ball', x: 440, y: 320 },
      { kind: 'me', x: 500, y: 400, r: 0 },
    ],
    paths: [{ kind: 'pass', d: 'M380 320 L620 320', both: true, label: 'sole' }],
    zone: { x: 370, y: 270, w: 260, h: 110 },
  },
  'juggling': {
    name: 'Juggling Ladder',
    block: 'First touch',
    needs: [],
    cue: 'Count your touches. Beat it next time.',
    harder: 'Alternate feet every touch',
    easier: 'One bounce between touches',
    objects: [
      { kind: 'ball', x: 500, y: 300 },
      { kind: 'me', x: 500, y: 380, r: 0 },
    ],
    paths: [
      { kind: 'pass', d: 'M470 330 C440 280 450 230 490 215', label: 'right' },
      { kind: 'pass', d: 'M530 330 C560 280 550 230 510 215', label: 'left' },
    ],
    zone: { x: 400, y: 190, w: 200, h: 170 },
  },
  'pull-push': {
    name: 'Pull Push',
    block: 'Ball mastery',
    needs: ['cones'],
    cue: 'Pull with the sole. Push with the laces.',
    harder: 'Travel to the cone and back',
    easier: 'Stay on your strong foot',
    objects: [
      { kind: 'cone', x: 500, y: 150 },
      { kind: 'ball', x: 500, y: 360 },
      { kind: 'me', x: 500, y: 440, r: 0 },
    ],
    paths: [{ kind: 'pass', d: 'M500 410 L500 300', both: true, label: 'pull, push' }],
  },
  'inside-outside': {
    name: 'Inside Outside',
    block: 'Ball mastery',
    needs: ['cones'],
    cue: 'Inside, outside. Same foot the whole lane.',
    harder: 'Eyes on the far cone',
    easier: 'Walk the lane first',
    objects: [
      { kind: 'cone', x: 230, y: 470 },
      { kind: 'cone', x: 770, y: 470 },
      { kind: 'ball', x: 270, y: 440 },
      { kind: 'me', x: 260, y: 500, r: 90 },
    ],
    paths: [{ kind: 'dribble', d: 'M280 455 C340 410 380 500 440 455 S540 410 600 455 S700 500 740 455', label: 'inside, outside' }],
  },
  'l-turn': {
    name: 'L Turn',
    block: 'Skill',
    needs: ['cones'],
    cue: 'Pull it back, push it across, turn.',
    harder: 'Add a hop and speed it up',
    easier: 'Walk it through, one side',
    objects: [
      { kind: 'cone', x: 500, y: 300 },
      { kind: 'ball', x: 560, y: 330 },
      { kind: 'me', x: 600, y: 360, r: -90 },
    ],
    paths: [
      { kind: 'dribble', d: 'M560 340 L620 340 L620 250', label: 'pull' },
      { kind: 'pass', d: 'M620 250 L420 250', label: 'push across' },
    ],
  },
  'wall-passes': {
    name: 'Wall Passes',
    block: 'Passing',
    needs: ['wall'],
    cue: 'Check your shoulder before it comes back.',
    harder: 'One touch, then back up two yards',
    easier: 'Two touches, closer to the wall',
    objects: [
      { kind: 'wall', x: 220, y: 70, w: 560 },
      { kind: 'ball', x: 470, y: 420 },
      { kind: 'me', x: 500, y: 470, r: 0 },
    ],
    paths: [
      { kind: 'pass', d: 'M480 400 L470 105', label: 'pass' },
      { kind: 'pass', d: 'M530 105 L520 400', label: 'back' },
    ],
  },
  'first-touch-wall': {
    name: 'Directional First Touch',
    block: 'Passing',
    needs: ['wall', 'cones'],
    cue: 'Your first touch goes past the cones.',
    harder: 'Touch with the back foot, both sides',
    easier: 'Stop it, then move it past',
    objects: [
      { kind: 'wall', x: 220, y: 70, w: 560 },
      { kind: 'cone', x: 480, y: 300 },
      { kind: 'cone', x: 520, y: 300 },
      { kind: 'ball', x: 370, y: 390 },
      { kind: 'me', x: 380, y: 440, r: 0 },
    ],
    paths: [
      { kind: 'pass', d: 'M380 370 L470 105', label: 'pass' },
      { kind: 'pass', d: 'M490 105 L410 360', label: 'back' },
      { kind: 'dribble', d: 'M420 370 C500 380 560 380 640 360', label: 'first touch' },
    ],
  },
  'cone-weave': {
    name: 'Straight-Line Cone Weave',
    block: 'Dribbling',
    needs: ['cones'],
    cue: 'Small touches. The ball never leaves your feet.',
    harder: 'Cones closer, weak foot only',
    easier: 'Cones further apart',
    objects: [
      { kind: 'cone', x: 280, y: 330 },
      { kind: 'cone', x: 370, y: 330 },
      { kind: 'cone', x: 460, y: 330 },
      { kind: 'cone', x: 550, y: 330 },
      { kind: 'cone', x: 640, y: 330 },
      { kind: 'cone', x: 730, y: 330 },
      { kind: 'ball', x: 210, y: 330 },
      { kind: 'me', x: 170, y: 330, r: 90 },
    ],
    paths: [{ kind: 'dribble', wave: false, d: 'M225 330 C250 290 300 290 325 330 S400 370 415 330 S490 290 505 330 S580 370 595 330 S670 290 685 330 S760 370 790 330', label: 'weave' }],
  },
  'figure-8': {
    name: 'Figure-8 Close Control',
    block: 'Dribbling',
    needs: ['cones'],
    cue: 'Use every part of both feet.',
    harder: 'Outside of the foot only',
    easier: 'Wider loops, slower',
    objects: [
      { kind: 'cone', x: 400, y: 320 },
      { kind: 'cone', x: 600, y: 320 },
      { kind: 'ball', x: 500, y: 260 },
      { kind: 'me', x: 500, y: 220, r: 90 },
    ],
    paths: [{ kind: 'dribble', wave: false, d: 'M500 320 C560 240 690 250 690 320 C690 390 560 400 500 320 C440 240 310 250 310 320 C310 390 440 400 500 320', label: 'figure 8' }],
  },
  'cruyff': {
    name: 'Cruyff Turn',
    block: 'Skill',
    needs: ['cones'],
    cue: 'Fake the pass. Drag it behind your standing leg.',
    harder: 'At full speed into the turn',
    easier: 'Walk it through, then jog',
    objects: [
      { kind: 'cone', x: 250, y: 330 },
      { kind: 'cone', x: 700, y: 330 },
      { kind: 'ball', x: 300, y: 330 },
      { kind: 'me', x: 270, y: 380, r: 90 },
    ],
    paths: [
      { kind: 'dribble', d: 'M310 330 C420 310 560 310 640 330', label: 'drive' },
      { kind: 'dribble', d: 'M640 330 C600 380 520 400 420 395', label: 'cut back' },
    ],
  },
  'half-volley': {
    name: 'Half Volley at Goal',
    block: 'Finishing',
    needs: ['goal'],
    cue: 'Strike it as it comes off the ground.',
    harder: 'Weak foot, aim for the corners',
    easier: 'Drop it, one bounce, side foot',
    objects: [
      { kind: 'goal', x: 380, y: 60, w: 240 },
      { kind: 'ball', x: 500, y: 450 },
      { kind: 'me', x: 500, y: 510, r: 0 },
    ],
    paths: [
      { kind: 'run', d: 'M500 500 L500 430', label: 'drop' },
      { kind: 'pass', d: 'M500 430 C520 300 560 180 570 95', label: 'strike' },
    ],
  },
  'gate-passing': {
    name: 'Ball to Gate Passing',
    block: 'Passing',
    needs: ['cones'],
    cue: 'Hit it through the gate, on the ground.',
    harder: 'Step back. Gate gets narrower.',
    easier: 'Step closer. Wider gate.',
    objects: [
      { kind: 'cone', x: 470, y: 170 },
      { kind: 'cone', x: 530, y: 170 },
      { kind: 'ball', x: 500, y: 440 },
      { kind: 'me', x: 500, y: 500, r: 0 },
    ],
    paths: [{ kind: 'pass', d: 'M500 425 L500 110', label: 'through' }],
  },
  'give-and-go': {
    name: 'Give and Go',
    block: 'Passing',
    needs: ['mate'],
    cue: 'Pass, move, get it back in stride.',
    harder: 'One touch on the return',
    easier: 'Stop it, then pass',
    objects: [
      { kind: 'mate', x: 640, y: 260, r: 180 },
      { kind: 'ball', x: 360, y: 440 },
      { kind: 'me', x: 340, y: 480, r: 0 },
    ],
    paths: [
      { kind: 'pass', d: 'M370 425 L625 280', label: 'give' },
      { kind: 'run', d: 'M350 460 C380 330 430 250 470 170', label: 'go' },
      { kind: 'pass', d: 'M625 240 L490 175', label: 'back' },
    ],
  },
  'goal-give-and-go': {
    name: 'Give and Go to Goal',
    block: 'Finishing',
    needs: ['mate', 'goal'],
    cue: 'Give it, go, finish first time.',
    harder: 'Weak foot finish',
    easier: 'Take a touch before you shoot',
    objects: [
      { kind: 'goal', x: 380, y: 60, w: 240 },
      { kind: 'mate', x: 680, y: 300, r: 180 },
      { kind: 'ball', x: 380, y: 480 },
      { kind: 'me', x: 360, y: 520, r: 0 },
    ],
    paths: [
      { kind: 'pass', d: 'M395 465 L665 320', label: 'give' },
      { kind: 'run', d: 'M370 500 C400 380 440 300 470 240', label: 'go' },
      { kind: 'pass', d: 'M665 285 L490 245', label: 'back' },
      { kind: 'pass', d: 'M490 230 L560 95', label: 'finish' },
    ],
  },
  'wall-juggles': {
    name: 'Wall Juggles',
    block: 'First touch',
    needs: ['wall'],
    cue: 'Keep it off the ground. Wall, thigh, foot, wall.',
    harder: 'Weak foot only',
    easier: 'One bounce allowed',
    objects: [
      { kind: 'wall', x: 220, y: 70, w: 560 },
      { kind: 'ball', x: 500, y: 300 },
      { kind: 'me', x: 500, y: 360, r: 0 },
    ],
    paths: [
      { kind: 'pass', d: 'M490 280 C470 200 470 140 480 105', label: 'up' },
      { kind: 'pass', d: 'M520 105 C530 150 530 220 510 280', label: 'down' },
    ],
  },
};

// The session builder: a small, honest stand-in for the real planner.
// Warm-up first, then ball mastery, then the drill your gear unlocks most.
export function buildSession(kit, minutes, prefer = null) {
  const has = (k) => kit.includes(k);
  const warm = ['toe-taps', 'bell-touches'];
  const mastery = has('cones') ? ['sole-rolls', 'pull-push'] : ['sole-rolls'];

  let main;
  if (has('mate') && has('goal')) main = ['goal-give-and-go', 'give-and-go'];
  else if (has('mate')) main = has('cones') ? ['give-and-go', 'gate-passing'] : ['give-and-go'];
  else if (has('wall') && has('cones')) main = ['first-touch-wall', 'wall-passes'];
  else if (has('wall') && has('goal')) main = ['wall-passes', 'half-volley'];
  else if (has('wall')) main = ['wall-passes', 'wall-juggles'];
  else if (has('goal') && has('cones')) main = ['half-volley', 'cone-weave'];
  else if (has('goal')) main = ['half-volley'];
  else if (has('cones')) main = ['cone-weave', 'l-turn'];
  else main = ['juggling', 'bell-touches'];

  // show off the thing you just added: a drill that uses it goes first
  if (prefer) {
    const i = main.findIndex((id) => DRILLS[id].needs.includes(prefer));
    if (i > 0) main = [main[i], ...main.filter((_, k) => k !== i)];
  }

  let ids;
  if (minutes <= 15) ids = [warm[0], main[0]];
  else if (minutes <= 30) ids = [warm[0], mastery[0], ...main];
  else ids = [warm[0], warm[1], ...mastery, ...main];
  ids = [...new Set(ids)];

  // Minutes: short warm-ups, most of the time goes to the main work.
  const weight = (id) => (DRILLS[id].block === 'Warm-up' ? 1 : DRILLS[id].block === 'Ball mastery' ? 1.5 : 2.4);
  const total = ids.reduce((a, id) => a + weight(id), 0);
  const mins = ids.map((id) => Math.max(3, Math.round((weight(id) / total) * minutes)));
  // warm-ups stay short; spare minutes go to the main drill
  ids.forEach((id, i) => { if (DRILLS[id].block === 'Warm-up' && mins[i] > 5) mins[i] = 5; });
  const fi = ids.indexOf(main[0]);
  mins[fi] += minutes - mins.reduce((a, b) => a + b, 0);

  return { ids, mins, focus: main[0] };
}

// Library strip order: the drills a solo player meets first.
export const LIBRARY = [
  'toe-taps', 'bell-touches', 'sole-rolls', 'juggling', 'pull-push', 'inside-outside', 'l-turn',
  'wall-passes', 'first-touch-wall', 'wall-juggles', 'cone-weave', 'figure-8', 'cruyff',
  'gate-passing', 'half-volley', 'give-and-go', 'goal-give-and-go',
];
