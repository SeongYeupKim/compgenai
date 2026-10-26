"use client";

import type { ReactNode } from "react";
import { CaseReading } from "@/components/CaseReading";
import {
  CASE_PARAGRAPHS,
  CASE_TITLE,
  TASK_DO_NOT_PASTE,
} from "@/lib/studyContent";

function Mark({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold underline decoration-2 underline-offset-[3px]">
      {children}
    </strong>
  );
}

export function TaskRequirements() {
  return (
    <ol className="space-y-3 text-base leading-7 text-student-ink">
      <li>
        <span className="font-semibold">1. </span>
        Identify <Mark>at least three</Mark> learning or motivational problems
        Daniel is experiencing.
      </li>
      <li>
        <span className="font-semibold">2. </span>
        Interpret the problems with{" "}
        <Mark>educational psychology theories or concepts</Mark>.
      </li>
      <li>
        <span className="font-semibold">3. </span>
        <Mark>Recommend solutions</Mark> to address the identified problems.
      </li>
      <li>
        <span className="font-semibold">4. </span>
        Essays should be <Mark>under 550 words</Mark>.
      </li>
      <li>
        <span className="font-semibold">5. </span>
        Cite a source when you use it. For example, (Ormrod &amp; Jones, 2023;
        Chatbot).
      </li>
    </ol>
  );
}

export function TaskMaterials({
  caseOnly = false,
  readerId,
}: {
  caseOnly?: boolean;
  readerId?: string;
}) {
  if (caseOnly) return <CaseReading readerId={readerId} />;

  const caseCard = (
    <article className="border border-student-border bg-white px-6 py-6 sm:px-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">
        Case
      </p>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-student-ink">
        {CASE_TITLE}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-student-ink">
        {CASE_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {caseCard}
      <section className="border border-student-border bg-white px-6 py-6 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">
          Task
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-student-ink">
          What to write
        </h2>
        <p className="mt-3 text-base leading-7 text-student-ink">
          You are helping Ms. Carter understand Daniel. Use the case and the
          three readings. Your essay needs these four things:
        </p>
        <div className="mt-4">
          <TaskRequirements />
        </div>
        <p className="mt-5 text-base leading-7 text-student-ink">
          You may use the chatbot. Your own essay still has to use the case and
          the readings. When you use a source, cite it.
        </p>
        <p className="mt-3 text-base font-semibold leading-7 text-student-ink">
          <Mark>{TASK_DO_NOT_PASTE}</Mark>
        </p>
      </section>
    </div>
  );
}
