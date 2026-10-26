"use client";

import { useState } from "react";
import { LIKERT_SCALE } from "@/lib/scales";

type Props = {
  title: string;
  intro: string;
  items: readonly string[];
  submitLabel?: string;
  onSubmit: (responses: number[]) => Promise<void>;
};

export function LikertSurvey({
  title,
  intro,
  items,
  submitLabel = "Continue",
  onSubmit,
}: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array.from({ length: items.length }, () => null),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const complete = answers.every((a) => a !== null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit(answers as number[]);
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto max-w-5xl space-y-6 pb-12"
    >
      <div className="rounded-md border border-student-border bg-student-card px-6 py-7 shadow-student sm:px-8 sm:py-8">
        <h2 className="text-2xl font-semibold tracking-tight text-student-ink">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-student-ink/80">
          {intro}
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-student-border bg-white shadow-sm">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[minmax(18rem,1fr)_repeat(5,6.5rem)] border-b border-student-border bg-student-canvas/70">
            <div className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-student-muted">
              Statement
            </div>
            {LIKERT_SCALE.map(({ value, label }) => (
              <div key={value} className="px-2 py-3 text-center">
                <span className="block text-lg font-semibold tabular-nums leading-none text-navy-900">
                  {value}
                </span>
                <span className="mt-2 flex h-8 items-end justify-center">
                  <span className="text-center text-xs font-medium leading-4 text-student-muted">
                    {label}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div>
            <ul>
              {items.map((item, index) => (
                <li
                  key={item}
                  className="grid grid-cols-[minmax(18rem,1fr)_repeat(5,6.5rem)] items-center border-b border-student-border/80 last:border-b-0 odd:bg-white even:bg-student-canvas/40"
                >
                  <p className="px-5 py-4 text-base font-medium leading-7 text-student-ink">
                    <span className="mr-2 tabular-nums text-student-muted">
                      {index + 1}.
                    </span>
                    {item}
                  </p>
                  {LIKERT_SCALE.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex h-full cursor-pointer items-center justify-center py-4"
                    >
                      <input
                        type="radio"
                        name={`item-${index}`}
                        aria-label={`${index + 1}. ${label}`}
                        checked={answers[index] === value}
                        onChange={() =>
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[index] = value;
                            return next;
                          })
                        }
                        className="h-5 w-5 accent-navy-800"
                      />
                    </label>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!complete || saving}
        className="rounded-md bg-navy-800 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-navy-900 disabled:opacity-50"
      >
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
