import type { StudyPhase } from "@/types/study";

export const STUDY_PHASES: StudyPhase[] = [
  "study_consent",
  "aiali",
  "trust",
  "prior_knowledge",
  "task_intro",
  "sources",
  "essay",
  "source_reflection",
  "post_knowledge",
  "demographics",
  "submission_guide",
  "complete",
];

export function getNextPhaseAfter(completed: StudyPhase): StudyPhase | null {
  const idx = STUDY_PHASES.indexOf(completed);
  if (idx < 0 || idx >= STUDY_PHASES.length - 1) return null;
  return STUDY_PHASES[idx + 1];
}

export function phaseLabel(phase: StudyPhase): string {
  switch (phase) {
    case "study_consent":
      return "Informed consent";
    case "aiali":
      return "GenAI and learning";
    case "trust":
      return "Trust in GenAI";
    case "prior_knowledge":
      return "Knowledge check";
    case "task_intro":
      return "The case and the task";
    case "sources":
      return "Assigned readings";
    case "essay":
      return "Essay and chatbot";
    case "source_reflection":
      return "Reflection of source use";
    case "post_knowledge":
      return "Knowledge check again";
    case "demographics":
      return "Demographics";
    case "submission_guide":
      return "Submission record";
    case "complete":
      return "You’re done";
    default:
      return phase;
  }
}

export function phaseShortLabel(phase: StudyPhase): string {
  switch (phase) {
    case "study_consent":
      return "Consent";
    case "aiali":
      return "GenAI and learning";
    case "trust":
      return "Trust in GenAI";
    case "prior_knowledge":
      return "Knowledge check";
    case "task_intro":
      return "Case and task";
    case "sources":
      return "Readings";
    case "essay":
      return "Essay";
    case "source_reflection":
      return "Source reflection";
    case "post_knowledge":
      return "Knowledge check again";
    case "demographics":
      return "About you";
    case "submission_guide":
      return "Submission";
    case "complete":
      return "Done";
    default:
      return phase;
  }
}

/** Top-level timestamp written the first time a phase is shown. */
export function phaseStartField(phase: StudyPhase): string | null {
  switch (phase) {
    case "aiali":
      return "aialiStartedAt";
    case "trust":
      return "trustStartedAt";
    case "prior_knowledge":
      return "priorKnowledgeStartedAt";
    case "task_intro":
      return "taskIntroStartedAt";
    case "sources":
      return "sourcesStartedAt";
    case "essay":
      return "essayWorkspaceStartedAt";
    case "source_reflection":
      return "sourceUseReflectionStartedAt";
    case "post_knowledge":
      return "postKnowledgeStartedAt";
    case "demographics":
      return "demographicsStartedAt";
    case "submission_guide":
      return "submissionGuideReachedAt";
    default:
      return null;
  }
}
