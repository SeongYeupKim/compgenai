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
      <div className="rounded-2xl border border-student-border bg-student-card px-5 py-6 shadow-student sm:px-8 sm:py-8">
        <h2 className="text-xl font-semibold text-student-ink">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-student-muted">{intro}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-student-border bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-student-border bg-student-canvas/80">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[220px] max-w-[min(50vw,420px)] bg-student-canvas/95 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-student-muted backdrop-blur-sm sm:min-w-[280px]"
              >
                Statement
              </th>
              {LIKERT_SCALE.map(({ value, label }) => (
                <th
                  key={value}
                  scope="col"
                  className="w-14 min-w-[3.25rem] px-1 py-2 text-center align-bottom text-xs font-semibold text-student-ink sm:w-16"
                >
                  <span className="block tabular-nums text-base text-teal-700">
                    {value}
                  </span>
                  <span className="mt-1 hidden leading-tight text-[10px] font-normal text-student-muted sm:block">
                    {label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item}
                className="border-b border-student-border/80 odd:bg-white even:bg-student-canvas/30"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-inherit px-3 py-3 text-left text-sm font-medium leading-snug text-student-ink"
                >
                  <span className="mr-2 tabular-nums text-student-muted">
                    {index + 1}.
                  </span>
                  {item}
                </th>
                {LIKERT_SCALE.map(({ value }) => (
                  <td key={value} className="px-1 py-2 text-center">
                    <input
                      type="radio"
                      name={`item-${index}`}
                      aria-label={`${index + 1}: ${value}`}
                      checked={answers[index] === value}
                      onChange={() =>
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[index] = value;
                          return next;
                        })
                      }
                      className="h-4 w-4 accent-teal-700"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!complete || saving}
        className="rounded-2xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
