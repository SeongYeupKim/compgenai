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
  if (compact) {
    return (
      <div className="space-y-6 text-student-ink">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
            Case
          </p>
          <h2 className="mt-1 font-reading text-2xl font-semibold leading-snug">
            {CASE_TITLE}
          </h2>
          <div className="mt-4 space-y-4 font-reading text-base leading-7">
            {CASE_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-student-muted">
            Task
          </p>
          <p className="mt-3 font-reading text-base leading-7">{TASK_INTRO}</p>
          <ol className="mt-4 space-y-3">
            {TASK_PROMPTS.map((prompt, index) => (
              <li key={prompt.title} className="text-base leading-7">
                <span className="font-semibold">
                  {index + 1}. {prompt.title}
                </span>{" "}
                {prompt.detail}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-base leading-7">{TASK_GENAI_NOTE}</p>
          <p className="mt-3 text-base font-semibold leading-7">{TASK_DO_NOT_PASTE}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <article className="rounded-2xl border border-student-border bg-white px-6 py-8 shadow-student sm:px-10 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
          Case
        </p>
        <h2 className="mt-3 font-reading text-3xl font-semibold leading-tight text-student-ink">
          {CASE_TITLE}
        </h2>
        <div className="mt-6 space-y-5 font-reading text-lg leading-8 text-student-ink">
          {CASE_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="rounded-2xl border border-student-border bg-white px-6 py-8 shadow-student sm:px-10 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
          Your task
        </p>
        <p className="mt-4 font-reading text-lg leading-8 text-student-ink">
          {TASK_INTRO}
        </p>
        <ol className="mt-6 space-y-4">
          {TASK_PROMPTS.map((prompt, index) => (
            <li
              key={prompt.title}
              className="rounded-xl border border-student-border bg-student-canvas/60 px-5 py-4"
            >
              <p className="text-base font-semibold text-student-ink">
                {index + 1}. {prompt.title}
              </p>
              <p className="mt-2 text-base leading-7 text-student-ink">
                {prompt.detail}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-xl bg-teal-50 px-5 py-4 text-base leading-7 text-student-ink">
          {TASK_GENAI_NOTE}
        </p>
        <p className="mt-4 text-base font-semibold leading-7 text-student-ink">
          {TASK_DO_NOT_PASTE}
        </p>
      </section>
    </div>
  );
}
