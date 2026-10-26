import { STUDY_PHASES } from "@/lib/studyFlow";
import type { StudyPhase } from "@/types/study";

export function getPhaseProgress(phase: StudyPhase): {
  step: number;
  total: number;
} {
  const idx = STUDY_PHASES.indexOf(phase);
  if (idx < 0) return { step: 1, total: STUDY_PHASES.length };
  return { step: idx + 1, total: STUDY_PHASES.length };
}
