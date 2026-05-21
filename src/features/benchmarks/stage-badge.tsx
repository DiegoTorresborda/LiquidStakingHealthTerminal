import type { Stage } from "@/lib/paf/types"

const STAGE_STYLES: Record<Stage, string> = {
  S0: "bg-ink-700/40 text-ink-200 border-ink-300/30",
  S1: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  S2: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  S3: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "S4.1": "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "S4.2": "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "S*": "bg-violet-500/15 text-violet-300 border-violet-500/30",
}

const STAGE_LABELS: Record<Stage, string> = {
  S0: "S0 · Pre-staking",
  S1: "S1 · Securing",
  S2: "S2 · Liquidizing",
  S3: "S3 · Productive",
  "S4.1": "S4.1 · Restaking",
  "S4.2": "S4.2 · Composable mature",
  "S*": "S* · Native LS",
}

export function StageBadge({ stage, compact = false }: { stage: Stage; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tracking-wide ${STAGE_STYLES[stage]}`}
    >
      {compact ? stage : STAGE_LABELS[stage]}
    </span>
  )
}

export const STAGE_ORDER: Stage[] = ["S0", "S1", "S2", "S3", "S4.1", "S4.2", "S*"]

export function stageColor(stage: Stage): string {
  switch (stage) {
    case "S0": return "#6B7280"
    case "S1": return "#38BDF8"
    case "S2": return "#34D399"
    case "S3": return "#FBBF24"
    case "S4.1": return "#FB923C"
    case "S4.2": return "#FB7185"
    case "S*": return "#A78BFA"
  }
}
