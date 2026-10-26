"use client";

import { useEffect, useState } from "react";
import { countWords, ESSAY_WORD_LIMIT } from "@/lib/studyContent";

type Props = {
  initialText: string;
  onDraftChange: (text: string) => void;
  onSubmit: (text: string) => Promise<void>;
};

export function EssaySubmissionPanel({
  initialText,
  onDraftChange,
  onSubmit,
}: Props) {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const words = countWords(text);
  const overLimit = words > ESSAY_WORD_LIMIT;

  useEffect(() => {
    const handle = window.setTimeout(() => onDraftChange(text), 800);
    return () => window.clearTimeout(handle);
  }, [text, onDraftChange]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (words < 20) {
      setError("Write a bit more before you submit.");
      return;
    }
    if (overLimit) {
      setError(`The essay must be ${ESSAY_WORD_LIMIT} words or fewer.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(text.trim());
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-2xl border border-student-border bg-student-card p-5 shadow-student"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <p className="text-xs font-semibold uppercase tracking-wide text-student-muted">
          Your essay
        </p>
        <h2 className="mt-1 text-lg font-semibold text-student-ink">
          Write in your own words
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-student-muted">
          Use the case, the three readings, and the chat if you want. Stay at or
          under {ESSAY_WORD_LIMIT} words. When you submit, your essay and the full
          chat log are saved together.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 min-h-[16rem] w-full resize-none rounded-xl border border-student-border bg-white px-3 py-3 text-sm leading-relaxed text-student-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          placeholder="Start typing your essay…"
        />
        <p
          className={`mt-2 text-xs ${overLimit ? "font-semibold text-red-600" : "text-student-muted"}`}
        >
          {words} / {ESSAY_WORD_LIMIT} words
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={saving || overLimit}
        className="mt-4 w-full shrink-0 rounded-2xl bg-teal-600 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
      >
        {saving ? "Submitting…" : "Submit essay and continue"}
      </button>
    </form>
  );
}
