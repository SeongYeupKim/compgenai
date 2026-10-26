"use client";

import {
  CASE_PARAGRAPHS,
  CASE_TITLE,
  TASK_DO_NOT_PASTE,
  TASK_GENAI_NOTE,
  TASK_INTRO,
  TASK_PROMPTS,
} from "@/lib/studyContent";

type Props = {
  compact?: boolean;
};

export function TaskMaterials({ compact = false }: Props) {
  return (
    <div className="space-y-5 text-sm leading-relaxed text-student-ink">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">
          Case
        </p>
        <h2
          className={`mt-1 font-semibold text-student-ink ${compact ? "text-lg" : "text-xl"}`}
        >
          {CASE_TITLE}
        </h2>
        <div className="mt-3 space-y-3">
          {CASE_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-student-muted">
          Task
        </p>
        <p className="mt-2">{TASK_INTRO}</p>
        <ul className="mt-3 space-y-3">
          {TASK_PROMPTS.map((prompt) => (
            <li
              key={prompt.title}
              className="border-l-[3px] border-teal-500 pl-4"
            >
              <span className="font-semibold">{prompt.title}</span> {prompt.detail}
            </li>
          ))}
        </ul>
        <p className="mt-4">{TASK_GENAI_NOTE}</p>
        <p className="mt-3 font-semibold">{TASK_DO_NOT_PASTE}</p>
      </div>
    </div>
  );
}
