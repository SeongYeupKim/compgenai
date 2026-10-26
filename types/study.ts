/** Linear progress through the study UI. One path for every participant. */
export type StudyPhase =
  | "study_consent"
  | "aiali"
  | "trust"
  | "prior_knowledge"
  | "task_intro"
  | "sources"
  | "essay"
  | "source_reflection"
  | "post_knowledge"
  | "demographics"
  | "submission_guide"
  | "complete";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export type CourseInstructorChoice =
  | "cristin_hall"
  | "matt_mccrudden"
  | "rayne_sperling"
  | "other";

export interface DemographicsSubmission {
  psuEmail: string;
  ageYears: string;
  gender: string[];
  raceEthnicity: string[];
  nameForCredit: string;
  followUpInterview: boolean;
  courseInstructor: CourseInstructorChoice;
  courseInstructorOther: string;
  submittedAt: string;
}

export interface KnowledgeSubmission {
  mcAnswers: string[];
  crAnswers: string[];
  mcAnsweredAt: (string | null)[];
  crAnsweredAt: (string | null)[];
  startedAt: string;
  completedAt: string;
}

export interface SourceDownloadEvent {
  sourceId: string;
  downloadedAt: string;
}

export interface SourceUseRating {
  sourceId: string;
  rating: number;
  reason: string;
}

export interface SourceUseReflection {
  ratings: SourceUseRating[];
  completedAt: string;
}

export interface UserStudyDoc {
  email?: string;
  studyKey?: string;
  phase: StudyPhase;
  studyConsentCompletedAt?: string;
  aialiResponses?: number[];
  aialiStartedAt?: string;
  aialiCompletedAt?: string;
  trustResponses?: number[];
  trustStartedAt?: string;
  trustCompletedAt?: string;
  priorKnowledge?: KnowledgeSubmission;
  priorKnowledgeStartedAt?: string;
  priorKnowledgeCompletedAt?: string;
  taskIntroStartedAt?: string;
  taskIntroCompletedAt?: string;
  sourcesStartedAt?: string;
  sourcesCompletedAt?: string;
  sourceDownloads?: SourceDownloadEvent[];
  essayWorkspaceStartedAt?: string;
  essayDraftUpdatedAt?: string;
  genaiMessages?: ChatMessage[];
  essayText?: string;
  essaySubmittedAt?: string;
  sourceUseReflectionStartedAt?: string;
  sourceUseReflection?: SourceUseReflection;
  sourceUseReflectionCompletedAt?: string;
  postKnowledge?: KnowledgeSubmission;
  postKnowledgeStartedAt?: string;
  postKnowledgeCompletedAt?: string;
  demographicsStartedAt?: string;
  demographics?: DemographicsSubmission;
  demographicsSubmittedAt?: string;
  submissionGuideReachedAt?: string;
  recordPdfDownloadedAt?: string;
  studyCompletedAt?: string;
  studyRestartedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}
