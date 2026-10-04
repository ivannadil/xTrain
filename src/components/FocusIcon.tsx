import { SoccerBall, PaperPlaneTilt, Target, Shield, Lightning, Shuffle, Leaf } from "@phosphor-icons/react";
import type { Focus } from "../data/types";

export function FocusIcon({ focus, size = 16, className, weight = "regular" }: { focus: Focus; size?: number; className?: string; weight?: "regular" | "fill" | "bold" }) {
  const p = { size, className, weight } as const;
  switch (focus) {
    case "dribbling":
      return <SoccerBall {...p} />;
    case "passing":
      return <PaperPlaneTilt {...p} />;
    case "shooting":
      return <Target {...p} />;
    case "defending":
      return <Shield {...p} />;
    case "fitness":
      return <Lightning {...p} />;
    case "mixed":
      return <Shuffle {...p} />;
    case "recovery":
      return <Leaf {...p} />;
  }
}
