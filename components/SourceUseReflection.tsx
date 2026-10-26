"use client";

import { useState } from "react";
import { SOURCE_USE_TARGETS } from "@/lib/studyContent";
import type { SourceUseReflection as SourceUseReflectionData } from "@/types/study";

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

type Props = {
  onSubmit: (submission: SourceUseReflectionData) => Promise<void>;
};

export function SourceUseReflection({ onSubmit }: Props) {
  const [ratings, setRatings] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(SOURCE_USE_TARGETS.map((item) => [item.id, null])),
  );
  const [reasons, setReasons] = useState<Record<string, string>>(() =>
    Object.fromEntries(SOURCE_USE_TARGETS.map((item) => [item.id, ""])),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = SOURCE_USE_TARGETS.every(
    (item) => ratings[item.id] !== null && reasons[item.id].trim().length > 0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) {
      setError("Rate every source and explain each rating before you continue.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ratings: SOURCE_USE_TARGETS.map((item) => ({
          sourceId: item.id,
          rating: ratings[item.id] as number,
          reason: reasons[item.id].trim(),
        })),
        completedAt: new Date().toISOString(),
      });
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 pb-12">
      <div className="rounded-md border border-student-border bg-white px-6 py-6">
        <h2 className="text-xl font-semibold text-student-ink">
          Reflection of source use
        </h2>
        <p className="mt-3 text-base leading-7 text-student-ink">
          For each source, rate how much you used it while working on the essay.
          1 means you did not use it. 10 means you used it a great deal. Then
          explain the rating. Be as specific as you can about how you used it.
        </p>
      </div>

      {SOURCE_USE_TARGETS.map((item) => (
        <section
          key={item.id}
          className="rounded-md border border-student-border bg-white px-6 py-5"
        >
          <h3 className="text-base font-semibold leading-7 text-student-ink">
            {item.label}
          </h3>
          <p className="mt-3 text-sm text-student-muted">
            1 = did not use it · 10 = used it a great deal
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SCALE.map((value) => {
              const selected = ratings[item.id] === value;
              return (
                <label
                  key={value}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm font-semibold tabular-nums ${
                    selected
                      ? "border-navy-800 bg-navy-800 text-white"
                      : "border-student-border bg-white text-student-ink hover:bg-navy-50"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`source-use-${item.id}`}
                    value={value}
                    checked={selected}
                    onChange={() =>
                      setRatings((prev) => ({ ...prev, [item.id]: value }))
                    }
                  />
                  {value}
                </label>
              );
            })}
          </div>
          <label
            htmlFor={`reason-${item.id}`}
            className="mt-4 block text-sm font-medium text-student-ink"
          >
            Why this rating? Describe your use as specifically as you can.
          </label>
          <textarea
            id={`reason-${item.id}`}
            value={reasons[item.id]}
            onChange={(e) =>
              setReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
            rows={4}
            className="mt-2 w-full resize-y rounded-md border border-student-border bg-white px-3 py-2 text-base leading-7 text-student-ink focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20"
          />
        </section>
      ))}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={saving || !complete}
        className="rounded-md bg-navy-800 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-navy-900 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
