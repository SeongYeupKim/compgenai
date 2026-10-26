"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { getClientAuth } from "@/lib/firebase";
import {
  completeSources,
  completeStudyConsent,
  completeSubmissionGuide,
  completeTaskIntro,
  ensureUserStudyDoc,
  getUserStudyDoc,
  recordPhaseEntered,
  recordRecordPdfDownloaded,
  recordSourceDownload,
  resetStudyFromBeginning,
  saveDemographics,
  saveEssay,
  saveEssayDraft,
  saveGenaiMessages,
  saveKnowledge,
  saveLikert,
} from "@/lib/userStudy";
import {
  clearStudySessionMarkers,
  hasStudyCompleteSessionAck,
  markStudyCompletedInThisBrowserSession,
} from "@/lib/studySessionMarkers";
import { phaseLabel, phaseStartField } from "@/lib/studyFlow";
import { getPhaseProgress } from "@/lib/studyProgress";
import { AIALI_ITEMS, TRUST_ITEMS } from "@/lib/scales";
import { READINGS, type ReadingSource } from "@/lib/studyContent";
import { stripMarkdownForChat } from "@/lib/chatPlainText";
import { InformedConsentScreen } from "@/components/InformedConsentScreen";
import { LikertSurvey } from "@/components/LikertSurvey";
import { KnowledgeTest } from "@/components/KnowledgeTest";
import { TaskMaterials } from "@/components/TaskMaterials";
import { SourceLibrary } from "@/components/SourceLibrary";
import { GenAIInteractionPanel } from "@/components/GenAIInteractionPanel";
import { EssaySubmissionPanel } from "@/components/EssaySubmissionPanel";
import { DemographicsSurvey } from "@/components/DemographicsSurvey";
import { SubmissionGuide } from "@/components/SubmissionGuide";
import { StudyRestartGate } from "@/components/StudyRestartGate";
import type {
  ChatMessage,
  DemographicsSubmission,
  KnowledgeSubmission,
  StudyPhase,
} from "@/types/study";

export default function StudyPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [phase, setPhase] = useState<StudyPhase | null>(null);
  const [genaiMessages, setGenaiMessages] = useState<ChatMessage[]>([]);
  const [essayDraft, setEssayDraft] = useState("");
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [postCompleteUI, setPostCompleteUI] = useState<
    "pending" | "gate" | "thanks"
  >("pending");

  useEffect(() => {
    const auth = getClientAuth();
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setUid(user.uid);
      setUserEmail(user.email ?? "");
      const info = await ensureUserStudyDoc(user);
      const doc = await getUserStudyDoc(user.uid);
      setPhase(info.phase);
      if (doc?.genaiMessages?.length) {
        setGenaiMessages(
          doc.genaiMessages.map((m) =>
            m.role === "assistant"
              ? { ...m, content: stripMarkdownForChat(m.content) }
              : m,
          ),
        );
      }
      if (doc?.essayText) setEssayDraft(doc.essayText);
      const ids = new Set(
        (doc?.sourceDownloads ?? []).map((event) => event.sourceId),
      );
      setDownloadedIds(Array.from(ids));
      setPdfDownloaded(!!doc?.recordPdfDownloadedAt);
      setReady(true);
    });
  }, [router]);

  useEffect(() => {
    if (!ready || phase !== "complete") {
      setPostCompleteUI("pending");
      return;
    }
    setPostCompleteUI(hasStudyCompleteSessionAck() ? "thanks" : "gate");
  }, [ready, phase]);

  useEffect(() => {
    if (!ready || !phase || !uid) return;
    const field = phaseStartField(phase);
    if (field) void recordPhaseEntered(uid, field);
  }, [ready, phase, uid]);

  useEffect(() => {
    if (!ready || !phase) return;
    window.scrollTo(0, 0);
  }, [phase, ready]);

  async function handleLogout() {
    clearStudySessionMarkers();
    await signOut(getClientAuth());
    router.replace("/");
  }

  async function handleRestartWithPassword(password: string) {
    const auth = getClientAuth();
    const user = auth.currentUser;
    if (!user?.email || !uid) throw new Error("Not signed in.");
    const cred = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, cred);
    await resetStudyFromBeginning(uid);
    clearStudySessionMarkers();
    setGenaiMessages([]);
    setEssayDraft("");
    setDownloadedIds([]);
    setPdfDownloaded(false);
    setPhase("study_consent");
  }

  const persistMessages = useCallback(
    async (messages: ChatMessage[]) => {
      setGenaiMessages(messages);
      if (uid) await saveGenaiMessages(uid, messages);
    },
    [uid],
  );

  const persistDraft = useCallback(
    (text: string) => {
      if (uid) void saveEssayDraft(uid, text);
    },
    [uid],
  );

  async function handleSourceDownload(source: ReadingSource) {
    setDownloadedIds((prev) =>
      prev.includes(source.id) ? prev : [...prev, source.id],
    );
    if (uid) await recordSourceDownload(uid, source.id);
  }

  if (!ready || !uid || !phase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-student-canvas px-6 text-student-muted">
        <div className="h-8 w-8 animate-pulse rounded-full bg-teal-200" />
        <p className="text-sm">Getting your session ready…</p>
      </div>
    );
  }

  const { step, total } = getPhaseProgress(phase);
  const wideMain = phase === "essay";
  const allSourcesOpened = READINGS.every((reading) =>
    downloadedIds.includes(reading.id),
  );

  return (
    <div className="min-h-screen bg-student-canvas pb-16">
      <header className="sticky top-0 z-10 border-b border-student-border bg-student-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1920px] px-4 py-4">
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-student-border">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${(step / total) * 100}%` }}
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-student-muted">
                Step {step} of {total}
              </p>
              <p className="mt-0.5 text-lg font-semibold text-student-ink">
                {phaseLabel(phase)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="shrink-0 rounded-xl border border-student-border bg-white px-3 py-2 text-sm text-student-muted transition hover:bg-student-canvas hover:text-student-ink"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto px-3 pt-8 sm:px-4 ${
          wideMain ? "max-w-[1920px]" : "max-w-4xl"
        }`}
      >
        {phase === "study_consent" && (
          <InformedConsentScreen
            variant="study"
            onAccepted={() => {
              void (async () => {
                await completeStudyConsent(uid);
                setPhase("aiali");
              })();
            }}
          />
        )}

        {phase === "aiali" && (
          <LikertSurvey
            title="GenAI and your learning"
            intro="Rate each statement from 1 (strongly disagree) to 5 (strongly agree). There are no wrong answers."
            items={AIALI_ITEMS}
            onSubmit={async (responses) => {
              await saveLikert(uid, "aiali", responses, "trust");
              setPhase("trust");
            }}
          />
        )}

        {phase === "trust" && (
          <LikertSurvey
            title="Trust in GenAI"
            intro="Rate each statement from 1 (strongly disagree) to 5 (strongly agree). There are no wrong answers."
            items={TRUST_ITEMS}
            onSubmit={async (responses) => {
              await saveLikert(uid, "trust", responses, "prior_knowledge");
              setPhase("prior_knowledge");
            }}
          />
        )}

        {phase === "prior_knowledge" && (
          <KnowledgeTest
            which="prior"
            onSubmit={async (submission: KnowledgeSubmission) => {
              await saveKnowledge(uid, "prior", submission, "task_intro");
              setPhase("task_intro");
            }}
          />
        )}

        {phase === "task_intro" && (
          <div className="mx-auto max-w-3xl space-y-6 pb-12">
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 px-5 py-6 shadow-student sm:px-7">
              <TaskMaterials />
            </div>
            <p className="text-sm text-student-muted">
              Next you will download the three readings. They stay available while
              you write.
            </p>
            <button
              type="button"
              onClick={() => {
                void (async () => {
                  await completeTaskIntro(uid);
                  setPhase("sources");
                })();
              }}
              className="rounded-2xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Continue to the readings
            </button>
          </div>
        )}

        {phase === "sources" && (
          <div className="mx-auto max-w-3xl space-y-6 pb-12">
            <div className="rounded-2xl border border-student-border bg-student-card px-5 py-6 shadow-student">
              <h2 className="text-xl font-semibold text-student-ink">
                Download the three readings
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-student-muted">
                These excerpts are the sources for your essay. Download each PDF
                before you continue. You can open them again from the essay page.
              </p>
            </div>
            <SourceLibrary
              downloadedIds={downloadedIds}
              onDownload={(source) => void handleSourceDownload(source)}
            />
            <button
              type="button"
              disabled={!allSourcesOpened}
              onClick={() => {
                void (async () => {
                  await completeSources(uid);
                  setPhase("essay");
                })();
              }}
              className="rounded-2xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
            >
              Continue to the essay
            </button>
            {!allSourcesOpened && (
              <p className="text-xs text-student-muted">
                Download all three PDFs to continue.
              </p>
            )}
          </div>
        )}

        {phase === "essay" && (
          <div className="mx-auto w-full max-w-[min(100%,1680px)] space-y-6">
            <details className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 px-5 py-5 shadow-student" open>
              <summary className="cursor-pointer text-sm font-semibold text-student-ink">
                Case and task instructions
              </summary>
              <div className="mt-4">
                <TaskMaterials compact />
              </div>
            </details>
            <div className="rounded-2xl border border-student-border bg-white px-5 py-5 shadow-sm">
              <h2 className="text-sm font-semibold text-student-ink">Readings</h2>
              <div className="mt-3">
                <SourceLibrary
                  downloadedIds={downloadedIds}
                  onDownload={(source) => void handleSourceDownload(source)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
              <div className="h-[min(72vh,640px)] min-h-0 min-w-0">
                <GenAIInteractionPanel
                  messages={genaiMessages}
                  onMessagesChange={persistMessages}
                  className="h-full min-h-0"
                />
              </div>
              <div className="h-[min(72vh,640px)] min-h-0 min-w-0">
                <EssaySubmissionPanel
                  initialText={essayDraft}
                  onDraftChange={persistDraft}
                  onSubmit={async (text) => {
                    await saveEssay(uid, text, genaiMessages);
                    setEssayDraft(text);
                    setPhase("post_knowledge");
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {phase === "post_knowledge" && (
          <KnowledgeTest
            which="post"
            onSubmit={async (submission) => {
              await saveKnowledge(uid, "post", submission, "demographics");
              setPhase("demographics");
            }}
          />
        )}

        {phase === "demographics" && (
          <DemographicsSurvey
            onSubmit={async (data: DemographicsSubmission) => {
              await saveDemographics(uid, data);
              setPhase("submission_guide");
            }}
          />
        )}

        {phase === "submission_guide" && (
          <SubmissionGuide
            email={userEmail}
            essay={essayDraft}
            messages={genaiMessages}
            alreadyDownloaded={pdfDownloaded}
            onDownloaded={async () => {
              await recordRecordPdfDownloaded(uid);
              setPdfDownloaded(true);
            }}
            onFinish={async () => {
              await completeSubmissionGuide(uid);
              markStudyCompletedInThisBrowserSession();
              setPhase("complete");
            }}
          />
        )}

        {phase === "complete" && postCompleteUI === "pending" && (
          <p className="text-center text-sm font-medium text-student-muted">
            Loading…
          </p>
        )}

        {phase === "complete" && postCompleteUI === "thanks" && (
          <div className="mx-auto max-w-lg rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 px-8 py-10 text-center shadow-student">
            <h1 className="text-2xl font-semibold text-student-ink">Thank you</h1>
            <p className="mt-3 text-sm font-medium leading-relaxed text-student-muted">
              Your responses are saved. Keep the PDF you downloaded and upload
              it to Canvas if you have not already.
            </p>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="mt-8 rounded-2xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Log out
            </button>
          </div>
        )}

        {phase === "complete" && postCompleteUI === "gate" && (
          <StudyRestartGate
            emailHint={userEmail}
            onKeepSubmission={() => {
              markStudyCompletedInThisBrowserSession();
              setPostCompleteUI("thanks");
            }}
            onRestartWithPassword={(pw) => handleRestartWithPassword(pw)}
          />
        )}
      </main>
    </div>
  );
}
