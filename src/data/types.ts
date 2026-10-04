export type Skill = "dribbling" | "passing" | "shooting" | "defending" | "fitness";
export type Focus = Skill | "mixed" | "recovery";
export type Position = "GK" | "CB" | "FB" | "CDM" | "CM" | "CAM" | "W" | "ST";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Equipment = "ball" | "cones" | "wall" | "goal" | "ladder" | "hurdles" | "rebounder" | "partner";
export type Space = "small" | "medium" | "large";
export type Foot = "right" | "left" | "both";
export type Goal = Skill | "weak-foot" | "first-touch" | "speed";

export const SKILLS: Skill[] = ["dribbling", "passing", "shooting", "defending", "fitness"];

export const SKILL_LABEL: Record<Skill, string> = {
  dribbling: "Dribbling",
  passing: "Passing",
  shooting: "Shooting",
  defending: "Defending",
  fitness: "Fitness",
};

export const FOCUS_LABEL: Record<Focus, string> = {
  ...SKILL_LABEL,
  mixed: "Mixed",
  recovery: "Recovery",
};

export const POSITION_LABEL: Record<Position, string> = {
  GK: "Goalkeeper",
  CB: "Centre back",
  FB: "Full back",
  CDM: "Defensive mid",
  CM: "Central mid",
  CAM: "Attacking mid",
  W: "Winger",
  ST: "Striker",
};

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  ball: "Ball",
  cones: "Cones",
  wall: "Wall or rebounder",
  goal: "Goal or target",
  ladder: "Agility ladder",
  hurdles: "Mini hurdles",
  rebounder: "Rebounder",
  partner: "A partner",
};

export const SPACE_LABEL: Record<Space, string> = {
  small: "Small (backyard, 10 x 10 m)",
  medium: "Medium (park corner, 20 x 20 m)",
  large: "Large (half pitch or more)",
};

export const GOAL_LABEL: Record<Goal, string> = {
  dribbling: "Beat players 1v1",
  passing: "Pass cleaner and longer",
  shooting: "Score more",
  defending: "Win more duels",
  fitness: "Last the full 90",
  "weak-foot": "Trust my weak foot",
  "first-touch": "Kill my first touch",
  speed: "Get faster",
};

/** Simple declarative pitch diagram, coordinates in a 160 x 90 box. */
export type Diagram = {
  area?: "square" | "corridor" | "box" | "wall";
  cones?: [number, number][];
  gates?: [[number, number], [number, number]][];
  wall?: [number, number, number, number];
  goal?: "top" | "right";
  ladder?: { x: number; y: number; len: number };
  mannequins?: [number, number][];
  player: [number, number];
  run?: [number, number][];
  ball?: [number, number][];
  marker?: [number, number];
};

export type Drill = {
  id: string;
  name: string;
  skill: Skill;
  sub: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  minutes: number;
  equipment: Equipment[];
  space: Space;
  positions?: Position[];
  tags: string[];
  setup: string;
  steps: string[];
  cues: string[];
  mistakes: string[];
  progression: string;
  regression: string;
  dose: string;
  work?: number;
  rest?: number;
  why: string;
  diagram: Diagram;
  tracks?: boolean;
};

export type Block = {
  id: string;
  drillId: string;
  minutes: number;
  note?: string;
  role: "warmup" | "main" | "finisher" | "cooldown";
  weakFoot?: boolean;
};

export type SessionStatus = "planned" | "done" | "partial" | "skipped";

export type SessionLog = {
  date: string;
  minutes: number;
  rpe: number;
  pain: boolean;
  feel?: "easy" | "right" | "hard";
  note?: string;
};

export type Session = {
  id: string;
  title: string;
  focus: Focus;
  minutes: number;
  blocks: Block[];
  reason: string;
  status: SessionStatus;
  log?: SessionLog;
  intensity: number;
};

export type Day = {
  date: string;
  dow: number;
  sessions: Session[];
  teamDay?: boolean;
};

export type Week = {
  index: number;
  theme: string;
  themeLine: string;
  targetMinutes: number;
  days: Day[];
};

export type Plan = {
  id: string;
  name: string;
  createdAt: string;
  startDate: string;
  weeks: Week[];
};

export type Profile = {
  name: string;
  age: number;
  position: Position;
  experience: Experience;
  foot: Foot;
  goals: Goal[];
  daysPerWeek: number;
  minutesPerSession: number;
  equipment: Equipment[];
  space: Space;
  teamDays: number[];
  injuries?: string;
  guardianEmail?: string;
  createdAt: string;
};

export type Ratings = Record<Skill, number>;

export type Badge = {
  id: string;
  name: string;
  line: string;
  rule: string;
  pct: number;
  tier: "bronze" | "silver" | "gold";
};
