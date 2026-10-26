/**
 * One wide CSV row per participant.
 * Order: identity and timestamps, scales, knowledge tests, essay, chat turns, demographics.
 */

import { READINGS, SOURCE_USE_TARGETS } from "@/lib/studyContent";
import {
  AIALI_ITEMS,
  KNOWLEDGE_CR_ITEMS,
  KNOWLEDGE_MC_ITEMS,
  TRUST_ITEMS,
} from "@/lib/scales";
import type { KnowledgeSubmission } from "@/types/study";

export type WideExportParticipant = Record<string, unknown> & { uid: string };

function csvCell(value: string): string {
  if (value === "") return "";
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function str(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
}

function durationSecondsIso(isoStart: unknown, isoEnd: unknown): string {
  if (typeof isoStart !== "string" || typeof isoEnd !== "string") return "";
  const a = Date.parse(isoStart);
  const b = Date.parse(isoEnd);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return "";
  return String(Math.round((b - a) / 1000));
}

function numberList(raw: unknown, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    if (!Array.isArray(raw) || raw[i] === undefined || raw[i] === null) {
      out.push("");
    } else {
      out.push(str(raw[i]));
    }
  }
  return out;
}

function knowledgeFlat(raw: unknown): {
  mc: string[];
  cr: string[];
  mcAt: string[];
  crAt: string[];
  startedAt: string;
  completedAt: string;
} {
  const empty = {
    mc: KNOWLEDGE_MC_ITEMS.map(() => ""),
    cr: KNOWLEDGE_CR_ITEMS.map(() => ""),
    mcAt: KNOWLEDGE_MC_ITEMS.map(() => ""),
    crAt: KNOWLEDGE_CR_ITEMS.map(() => ""),
    startedAt: "",
    completedAt: "",
  };
  if (!raw || typeof raw !== "object") return empty;
  const k = raw as Partial<KnowledgeSubmission>;
  return {
    mc: numberList(k.mcAnswers, KNOWLEDGE_MC_ITEMS.length),
    cr: numberList(k.crAnswers, KNOWLEDGE_CR_ITEMS.length),
    mcAt: numberList(k.mcAnsweredAt, KNOWLEDGE_MC_ITEMS.length),
    crAt: numberList(k.crAnsweredAt, KNOWLEDGE_CR_ITEMS.length),
    startedAt: str(k.startedAt),
    completedAt: str(k.completedAt),
  };
}

type ChatTurn = { user: string; userAt: string; assistant: string; assistantAt: string };

function chatTurns(messages: unknown): ChatTurn[] {
  const turns: ChatTurn[] = [];
  if (!Array.isArray(messages)) return turns;
  let pending: { content: string; createdAt: string } | null = null;
  for (const m of messages) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: string }).role;
    const content = str((m as { content?: unknown }).content);
    const createdAt = str((m as { createdAt?: unknown }).createdAt);
    if (role === "user") {
      if (pending) {
        turns.push({
          user: pending.content,
          userAt: pending.createdAt,
          assistant: "",
          assistantAt: "",
        });
      }
      pending = { content, createdAt };
    } else if (role === "assistant") {
      if (pending) {
        turns.push({
          user: pending.content,
          userAt: pending.createdAt,
          assistant: content,
          assistantAt: createdAt,
        });
        pending = null;
      } else {
        turns.push({
          user: "",
          userAt: "",
          assistant: content,
          assistantAt: createdAt,
        });
      }
    }
  }
  if (pending) {
    turns.push({
      user: pending.content,
      userAt: pending.createdAt,
      assistant: "",
      assistantAt: "",
    });
  }
  return turns;
}

function maxChatDepth(participants: WideExportParticipant[]): number {
  let max = 0;
  for (const p of participants) {
    max = Math.max(max, chatTurns(p.genaiMessages).length);
  }
  return max;
}

function courseInstructorLabel(raw: unknown): string {
  if (raw === "cristin_hall") return "Dr. Cristin Hall";
  if (raw === "matt_mccrudden") return "Dr. Matt McCrudden";
  if (raw === "rayne_sperling") return "Dr. Rayne Sperling";
  if (raw === "other") return "Other";
  return raw == null || raw === "" ? "" : String(raw);
}

function demographicsFlat(p: WideExportParticipant) {
  const d = p.demographics;
  if (!d || typeof d !== "object") {
    return {
      psuEmail: "",
      ageYears: "",
      gender: "",
      raceEthnicity: "",
      nameForCredit: "",
      followUpInterview: "",
      courseInstructor: "",
      courseInstructorOther: "",
      submittedAt: "",
    };
  }
  const g = (d as { gender?: unknown }).gender;
  const gender = Array.isArray(g) ? g.map((x) => String(x)).join("|") : str(g);
  const re = (d as { raceEthnicity?: unknown }).raceEthnicity;
  const raceEthnicity = Array.isArray(re)
    ? re.map((x) => String(x)).join("|")
    : str(re);
  const fu = (d as { followUpInterview?: unknown }).followUpInterview;
  const ci = (d as { courseInstructor?: unknown }).courseInstructor;
  return {
    psuEmail: str((d as { psuEmail?: unknown }).psuEmail),
    ageYears: str((d as { ageYears?: unknown }).ageYears),
    gender,
    raceEthnicity,
    nameForCredit: str((d as { nameForCredit?: unknown }).nameForCredit),
    followUpInterview: fu === true ? "true" : fu === false ? "false" : "",
    courseInstructor: courseInstructorLabel(ci),
    courseInstructorOther: str(
      (d as { courseInstructorOther?: unknown }).courseInstructorOther,
    ),
    submittedAt: str((d as { submittedAt?: unknown }).submittedAt),
  };
}

function sourceUseCells(p: WideExportParticipant): string[] {
  const raw = p.sourceUseReflection;
  const ratings =
    raw && typeof raw === "object" && Array.isArray((raw as { ratings?: unknown }).ratings)
      ? ((raw as { ratings: { sourceId?: string; rating?: unknown; reason?: unknown }[] })
          .ratings)
      : [];
  const cells: string[] = [];
  for (const item of SOURCE_USE_TARGETS) {
    const hit = ratings.find((row) => row?.sourceId === item.id);
    cells.push(hit ? str(hit.rating) : "");
    cells.push(hit ? str(hit.reason) : "");
  }
  return cells;
}

function sourceDownloadCells(p: WideExportParticipant): string[] {
  const events = Array.isArray(p.sourceDownloads) ? p.sourceDownloads : [];
  const cells: string[] = [];
  for (const reading of READINGS) {
    const hits = events.filter(
      (e) =>
        e &&
        typeof e === "object" &&
        (e as { sourceId?: string }).sourceId === reading.id,
    );
    const first = hits[0] as { downloadedAt?: string } | undefined;
    cells.push(str(first?.downloadedAt));
    cells.push(String(hits.length));
  }
  cells.push(str(events));
  return cells;
}

export function buildStudyWideExportCsv(
  participants: WideExportParticipant[],
): string {
  const depth = maxChatDepth(participants);
  const header = [
    "student_email",
    "firebase_uid",
    "study_key",
    "phase",
    "createdAt",
    "updatedAt",
    "studyRestartedAt",
    "studyConsentCompletedAt",
    "aialiStartedAt",
    "aialiCompletedAt",
    "aiali_seconds",
    ...AIALI_ITEMS.map((_, i) => `aiali_${String(i + 1).padStart(2, "0")}`),
    "trustStartedAt",
    "trustCompletedAt",
    "trust_seconds",
    ...TRUST_ITEMS.map((_, i) => `trust_${String(i + 1).padStart(2, "0")}`),
    "priorKnowledgeStartedAt",
    "priorKnowledgeCompletedAt",
    "prior_knowledge_seconds",
    ...KNOWLEDGE_MC_ITEMS.map((_, i) => `prior_mc_${String(i + 1).padStart(2, "0")}`),
    ...KNOWLEDGE_MC_ITEMS.map((_, i) => `prior_mc_${String(i + 1).padStart(2, "0")}_at`),
    ...KNOWLEDGE_CR_ITEMS.map((_, i) => `prior_cr_${String(i + 1).padStart(2, "0")}`),
    ...KNOWLEDGE_CR_ITEMS.map((_, i) => `prior_cr_${String(i + 1).padStart(2, "0")}_at`),
    "taskIntroStartedAt",
    "taskIntroCompletedAt",
    "sourcesStartedAt",
    "sourcesCompletedAt",
    ...READINGS.flatMap((r) => [`source_${r.id}_first_download`, `source_${r.id}_download_count`]),
    "source_downloads_json",
    "essayWorkspaceStartedAt",
    "essayDraftUpdatedAt",
    "essaySubmittedAt",
    "essay_workspace_seconds",
    "essay_text",
    "sourceUseReflectionStartedAt",
    "sourceUseReflectionCompletedAt",
    "source_use_reflection_seconds",
    ...SOURCE_USE_TARGETS.flatMap((item) => [
      `source_use_${item.id}_rating`,
      `source_use_${item.id}_reason`,
    ]),
    "postKnowledgeStartedAt",
    "postKnowledgeCompletedAt",
    "post_knowledge_seconds",
    ...KNOWLEDGE_MC_ITEMS.map((_, i) => `post_mc_${String(i + 1).padStart(2, "0")}`),
    ...KNOWLEDGE_MC_ITEMS.map((_, i) => `post_mc_${String(i + 1).padStart(2, "0")}_at`),
    ...KNOWLEDGE_CR_ITEMS.map((_, i) => `post_cr_${String(i + 1).padStart(2, "0")}`),
    ...KNOWLEDGE_CR_ITEMS.map((_, i) => `post_cr_${String(i + 1).padStart(2, "0")}_at`),
    "demographicsStartedAt",
    "submissionGuideReachedAt",
    "recordPdfDownloadedAt",
    "studyCompletedAt",
    ...Array.from({ length: depth }, (_, i) => [
      `st_${i + 1}`,
      `st_${i + 1}_at`,
      `ai_${i + 1}`,
      `ai_${i + 1}_at`,
    ]).flat(),
    "demographics_psuEmail",
    "demographics_ageYears",
    "demographics_gender",
    "demographics_raceEthnicity",
    "demographics_nameForCredit",
    "demographics_followUpInterview",
    "demographics_courseInstructor",
    "demographics_courseInstructor_other",
    "demographics_submittedAt",
  ];

  const rows: string[][] = [];
  for (const p of participants) {
    const prior = knowledgeFlat(p.priorKnowledge);
    const post = knowledgeFlat(p.postKnowledge);
    const demo = demographicsFlat(p);
    const turns = chatTurns(p.genaiMessages);
    const cells = [
      str(p.email),
      str(p.uid),
      str(p.studyKey),
      str(p.phase),
      str(p.createdAt),
      str(p.updatedAt),
      str(p.studyRestartedAt),
      str(p.studyConsentCompletedAt),
      str(p.aialiStartedAt),
      str(p.aialiCompletedAt),
      durationSecondsIso(p.aialiStartedAt, p.aialiCompletedAt),
      ...numberList(p.aialiResponses, AIALI_ITEMS.length),
      str(p.trustStartedAt),
      str(p.trustCompletedAt),
      durationSecondsIso(p.trustStartedAt, p.trustCompletedAt),
      ...numberList(p.trustResponses, TRUST_ITEMS.length),
      str(p.priorKnowledgeStartedAt) || prior.startedAt,
      str(p.priorKnowledgeCompletedAt) || prior.completedAt,
      durationSecondsIso(
        p.priorKnowledgeStartedAt || prior.startedAt,
        p.priorKnowledgeCompletedAt || prior.completedAt,
      ),
      ...prior.mc,
      ...prior.mcAt,
      ...prior.cr,
      ...prior.crAt,
      str(p.taskIntroStartedAt),
      str(p.taskIntroCompletedAt),
      str(p.sourcesStartedAt),
      str(p.sourcesCompletedAt),
      ...sourceDownloadCells(p),
      str(p.essayWorkspaceStartedAt),
      str(p.essayDraftUpdatedAt),
      str(p.essaySubmittedAt),
      durationSecondsIso(p.essayWorkspaceStartedAt, p.essaySubmittedAt),
      str(p.essayText),
      str(p.sourceUseReflectionStartedAt),
      str(p.sourceUseReflectionCompletedAt),
      durationSecondsIso(
        p.sourceUseReflectionStartedAt,
        p.sourceUseReflectionCompletedAt,
      ),
      ...sourceUseCells(p),
      str(p.postKnowledgeStartedAt) || post.startedAt,
      str(p.postKnowledgeCompletedAt) || post.completedAt,
      durationSecondsIso(
        p.postKnowledgeStartedAt || post.startedAt,
        p.postKnowledgeCompletedAt || post.completedAt,
      ),
      ...post.mc,
      ...post.mcAt,
      ...post.cr,
      ...post.crAt,
      str(p.demographicsStartedAt),
      str(p.submissionGuideReachedAt),
      str(p.recordPdfDownloadedAt),
      str(p.studyCompletedAt),
    ];
    for (let i = 0; i < depth; i++) {
      const t = turns[i];
      cells.push(t?.user ?? "", t?.userAt ?? "", t?.assistant ?? "", t?.assistantAt ?? "");
    }
    cells.push(
      demo.psuEmail,
      demo.ageYears,
      demo.gender,
      demo.raceEthnicity,
      demo.nameForCredit,
      demo.followUpInterview,
      demo.courseInstructor,
      demo.courseInstructorOther,
      demo.submittedAt,
    );
    rows.push(cells.map(csvCell));
  }

  return [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
