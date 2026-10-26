"use client";

import { STUDY_PHASES, phaseShortLabel } from "@/lib/studyFlow";
import type { StudyPhase } from "@/types/study";

const STEPS = STUDY_PHASES.filter((phase) => phase !== "complete");

export function StudyProgress({ phase }: { phase: StudyPhase }) {
  const currentIndex =
    phase === "complete" ? STEPS.length : Math.max(0, STEPS.indexOf(phase));
  const percent = Math.round((currentIndex / STEPS.length) * 100);

  return (
    <nav
      aria-label="Study progress"
      className="rounded-md border border-student-border bg-white px-4 py-5 shadow-student"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-student-ink">Progress</h2>
        <p className="text-sm tabular-nums text-student-muted">{percent}%</p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-student-border">
        <div
          className="h-full rounded-full bg-navy-800 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="mt-4 space-y-1.5">
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const current = phase !== "complete" && index === currentIndex;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 rounded-md px-2 py-2 ${
                current ? "bg-navy-50" : ""
              }`}
              aria-current={current ? "step" : undefined}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  current
                    ? "bg-navy-800 text-white"
                    : done
                      ? "bg-navy-100 text-navy-800"
                      : "bg-student-canvas text-student-muted"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={`min-w-0 flex-1 text-sm leading-5 ${
                  current
                    ? "font-semibold text-student-ink"
                    : done
                      ? "text-student-ink"
                      : "text-student-muted"
                }`}
              >
                {phaseShortLabel(step)}
              </span>
              {current && (
                <span className="shrink-0 text-xs font-semibold text-navy-800">
                  Current
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
