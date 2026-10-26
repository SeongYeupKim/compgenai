"use client";

import { useMemo, useState } from "react";
import {
  KNOWLEDGE_CR_ITEMS,
  KNOWLEDGE_MC_ITEMS,
  MC_LETTERS,
} from "@/lib/scales";
import type { KnowledgeSubmission } from "@/types/study";

type Props = {
  which: "prior" | "post";
  onSubmit: (submission: KnowledgeSubmission) => Promise<void>;
};

export function KnowledgeTest({ which, onSubmit }: Props) {
  const startedAt = useMemo(() => new Date().toISOString(), []);
  const [mc, setMc] = useState<(string | null)[]>(() =>
    KNOWLEDGE_MC_ITEMS.map(() => null),
  );
  const [mcAt, setMcAt] = useState<(string | null)[]>(() =>
    KNOWLEDGE_MC_ITEMS.map(() => null),
  );
  const [cr, setCr] = useState<string[]>(() =>
    KNOWLEDGE_CR_ITEMS.map(() => ""),
  );
  const [crAt, setCrAt] = useState<(string | null)[]>(() =>
    KNOWLEDGE_CR_ITEMS.map(() => null),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete =
    mc.every((a) => a !== null) && cr.every((a) => a.trim().length > 0);

  function chooseMc(index: number, letter: string) {
    const now = new Date().toISOString();
    setMc((prev) => {
      const next = [...prev];
      next[index] = letter;
      return next;
    });
    setMcAt((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = now;
      return next;
    });
  }

  function editCr(index: number, value: string) {
    const now = new Date().toISOString();
    setCr((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setCrAt((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = now;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        mcAnswers: mc as string[],
        crAnswers: cr.map((a) => a.trim()),
        mcAnsweredAt: mcAt,
        crAnsweredAt: crAt,
        startedAt,
        completedAt: new Date().toISOString(),
      });
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const title =
    which === "prior" ? "What you know now" : "What you know after the task";
  const intro =
    which === "prior"
      ? "Answer from your own knowledge. The readings and the chatbot come later. Choose one option for each multiple-choice item, then write a short answer for each open question."
      : "Answer again from what you know now. The readings and the chatbot are not available on this page. Choose one option for each item, then write a short answer for each open question.";

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto max-w-3xl space-y-6 pb-12"
    >
      <div className="rounded-md border border-student-border bg-student-card px-5 py-6 shadow-student sm:px-8">
        <h2 className="text-xl font-semibold text-student-ink">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-student-muted">{intro}</p>
      </div>

      {KNOWLEDGE_MC_ITEMS.map((item, index) => (
        <fieldset
          key={item.id}
          className="rounded-md border border-student-border bg-white px-6 py-6 shadow-sm"
        >
          <legend className="sr-only">Question {index + 1}</legend>
          <p className="text-base font-semibold leading-7 text-student-ink">
            <span className="mr-2 tabular-nums text-navy-900">{index + 1}.</span>
            {item.stem}
          </p>
          <div className="mt-4 space-y-2">
            {item.options.map((option, optionIndex) => {
              const letter = MC_LETTERS[optionIndex];
              return (
                <label
                  key={letter}
                  className="flex cursor-pointer gap-3 rounded-md border border-student-border px-4 py-3 text-base leading-7 text-student-ink hover:bg-navy-50"
                >
                  <input
                    type="radio"
                    name={item.id}
                    className="mt-1 h-4 w-4 accent-navy-800"
                    checked={mc[index] === letter}
                    onChange={() => chooseMc(index, letter)}
                  />
                  <span>
                    <span className="font-semibold">{letter}.</span> {option}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {KNOWLEDGE_CR_ITEMS.map((item, index) => (
        <div
          key={item.id}
          className="rounded-md border border-student-border bg-white px-6 py-6 shadow-sm"
        >
          <label
            htmlFor={item.id}
            className="block text-base font-semibold leading-7 text-student-ink"
          >
            {KNOWLEDGE_MC_ITEMS.length + index + 1}. {item.prompt}
          </label>
          <textarea
            id={item.id}
            value={cr[index]}
            onChange={(e) => editCr(index, e.target.value)}
            rows={5}
            className="mt-4 w-full rounded-md border border-student-border px-4 py-3 text-base leading-7 text-student-ink focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20"
            placeholder="Write your answer…"
          />
        </div>
      ))}

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
        {saving ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
