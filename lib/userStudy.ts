import { deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getClientDb } from "@/lib/firebase";
import { STUDY_COLLECTION } from "@/lib/studyCollection";
import type {
  ChatMessage,
  DemographicsSubmission,
  KnowledgeSubmission,
  SourceDownloadEvent,
  SourceUseReflection,
  StudyPhase,
  UserStudyDoc,
} from "@/types/study";

const STUDY_KEY = "compgenai";

export async function getUserStudyDoc(
  uid: string,
): Promise<UserStudyDoc | null> {
  const db = getClientDb();
  const ref = doc(db, STUDY_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserStudyDoc;
}

export async function ensureUserStudyDoc(user: User): Promise<{
  phase: StudyPhase;
}> {
  const db = getClientDb();
  const ref = doc(db, STUDY_COLLECTION, user.uid);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();

  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? "",
      studyKey: STUDY_KEY,
      phase: "study_consent" as StudyPhase,
      createdAt: now,
      updatedAt: now,
    });
    return { phase: "study_consent" };
  }

  const data = snap.data() as UserStudyDoc;
  const phase = (data.phase ?? "study_consent") as StudyPhase;
  return { phase };
}

export async function completeStudyConsent(uid: string) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    studyConsentCompletedAt: now,
    phase: "aiali" as StudyPhase,
    updatedAt: now,
  });
}

export async function updateUserPhase(uid: string, phase: StudyPhase) {
  const db = getClientDb();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    phase,
    updatedAt: new Date().toISOString(),
  });
}

/** First time a phase is shown. Does nothing if that timestamp already exists. */
export async function recordPhaseEntered(uid: string, field: string) {
  const db = getClientDb();
  const ref = doc(db, STUDY_COLLECTION, uid);
  const snap = await getDoc(ref);
  const data = snap.data() as UserStudyDoc | undefined;
  if (data && data[field as keyof UserStudyDoc]) return;
  const now = new Date().toISOString();
  await updateDoc(ref, { [field]: now, updatedAt: now });
}

export async function saveLikert(
  uid: string,
  which: "aiali" | "trust",
  responses: number[],
  nextPhase: StudyPhase,
) {
  const db = getClientDb();
  const now = new Date().toISOString();
  const payload =
    which === "aiali"
      ? { aialiResponses: responses, aialiCompletedAt: now }
      : { trustResponses: responses, trustCompletedAt: now };
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    ...payload,
    phase: nextPhase,
    updatedAt: now,
  });
}

export async function saveKnowledge(
  uid: string,
  which: "prior" | "post",
  submission: KnowledgeSubmission,
  nextPhase: StudyPhase,
) {
  const db = getClientDb();
  const now = new Date().toISOString();
  const payload =
    which === "prior"
      ? {
          priorKnowledge: submission,
          priorKnowledgeCompletedAt: submission.completedAt,
        }
      : {
          postKnowledge: submission,
          postKnowledgeCompletedAt: submission.completedAt,
        };
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    ...payload,
    phase: nextPhase,
    updatedAt: now,
  });
}

export async function completeTaskIntro(uid: string) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    taskIntroCompletedAt: now,
    phase: "sources" as StudyPhase,
    updatedAt: now,
  });
}

export async function recordSourceDownload(uid: string, sourceId: string) {
  const db = getClientDb();
  const ref = doc(db, STUDY_COLLECTION, uid);
  const snap = await getDoc(ref);
  const data = snap.data() as UserStudyDoc | undefined;
  const prev: SourceDownloadEvent[] = Array.isArray(data?.sourceDownloads)
    ? data.sourceDownloads
    : [];
  const now = new Date().toISOString();
  await updateDoc(ref, {
    sourceDownloads: [...prev, { sourceId, downloadedAt: now }],
    updatedAt: now,
  });
}

export async function completeSources(uid: string) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    sourcesCompletedAt: now,
    phase: "essay" as StudyPhase,
    updatedAt: now,
  });
}

export async function saveEssayDraft(uid: string, essayText: string) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    essayText,
    essayDraftUpdatedAt: now,
    updatedAt: now,
  });
}

export async function saveGenaiMessages(uid: string, messages: ChatMessage[]) {
  const db = getClientDb();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    genaiMessages: messages,
    updatedAt: new Date().toISOString(),
  });
}

export async function saveEssay(
  uid: string,
  essayText: string,
  genaiMessages: ChatMessage[],
) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    essayText,
    genaiMessages,
    essaySubmittedAt: now,
    phase: "source_reflection" as StudyPhase,
    updatedAt: now,
  });
}

export async function saveSourceReflection(
  uid: string,
  submission: SourceUseReflection,
) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    sourceUseReflection: submission,
    sourceUseReflectionCompletedAt: submission.completedAt || now,
    phase: "post_knowledge" as StudyPhase,
    updatedAt: now,
  });
}

export async function saveDemographics(
  uid: string,
  data: DemographicsSubmission,
) {
  const db = getClientDb();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    demographics: data,
    demographicsSubmittedAt: data.submittedAt,
    phase: "submission_guide" as StudyPhase,
    updatedAt: new Date().toISOString(),
  });
}

export async function recordRecordPdfDownloaded(uid: string) {
  const db = getClientDb();
  const ref = doc(db, STUDY_COLLECTION, uid);
  const snap = await getDoc(ref);
  const data = snap.data() as UserStudyDoc | undefined;
  if (data?.recordPdfDownloadedAt) return;
  const now = new Date().toISOString();
  await updateDoc(ref, { recordPdfDownloadedAt: now, updatedAt: now });
}

export async function completeSubmissionGuide(uid: string) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    phase: "complete" as StudyPhase,
    studyCompletedAt: now,
    updatedAt: now,
  });
}

/** Clears responses and returns the participant to consent. Keeps email and createdAt. */
export async function resetStudyFromBeginning(uid: string) {
  const db = getClientDb();
  const now = new Date().toISOString();
  await updateDoc(doc(db, STUDY_COLLECTION, uid), {
    phase: "study_consent" as StudyPhase,
    studyConsentCompletedAt: deleteField(),
    aialiResponses: deleteField(),
    aialiStartedAt: deleteField(),
    aialiCompletedAt: deleteField(),
    trustResponses: deleteField(),
    trustStartedAt: deleteField(),
    trustCompletedAt: deleteField(),
    priorKnowledge: deleteField(),
    priorKnowledgeStartedAt: deleteField(),
    priorKnowledgeCompletedAt: deleteField(),
    taskIntroStartedAt: deleteField(),
    taskIntroCompletedAt: deleteField(),
    sourcesStartedAt: deleteField(),
    sourcesCompletedAt: deleteField(),
    sourceDownloads: deleteField(),
    essayWorkspaceStartedAt: deleteField(),
    essayDraftUpdatedAt: deleteField(),
    genaiMessages: deleteField(),
    essayText: deleteField(),
    essaySubmittedAt: deleteField(),
    sourceUseReflectionStartedAt: deleteField(),
    sourceUseReflection: deleteField(),
    sourceUseReflectionCompletedAt: deleteField(),
    postKnowledge: deleteField(),
    postKnowledgeStartedAt: deleteField(),
    postKnowledgeCompletedAt: deleteField(),
    demographicsStartedAt: deleteField(),
    demographics: deleteField(),
    demographicsSubmittedAt: deleteField(),
    submissionGuideReachedAt: deleteField(),
    recordPdfDownloadedAt: deleteField(),
    studyCompletedAt: deleteField(),
    studyRestartedAt: now,
    updatedAt: now,
  });
}
