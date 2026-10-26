"use client";

import type { ReactNode } from "react";
import {
  CASE_PARAGRAPHS,
  CASE_TITLE,
  TASK_DO_NOT_PASTE,
  TASK_GENAI_NOTE,
} from "@/lib/studyContent";

function Mark({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold underline decoration-2 underline-offset-[3px]">
      {children}
    </strong>
  );
}

export function TaskMaterials() {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <article className="border border-student-border bg-white px-6 py-7 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">
          Case
        </p>
        <h2 className="mt-2 font-reading text-2xl font-semibold leading-snug text-student-ink">
          {CASE_TITLE}
        </h2>
        <div className="mt-5 space-y-4 font-reading text-lg leading-8 text-student-ink">
          {CASE_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="border border-student-border bg-white px-6 py-7 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">
          Task
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-snug text-student-ink">
          What to write
        </h2>
        <p className="mt-4 font-reading text-lg leading-8 text-student-ink">
          Imagine that you are an educational consultant asked to help Ms. Carter
          understand and address Daniel&apos;s learning difficulties. Drawing on
          the classroom case and the three assigned educational psychology texts
          (you don&apos;t have to cite all three sources), write an essay (
          <Mark>no longer than 550 words</Mark>) addressing the following:
        </p>
        <ol className="mt-5 space-y-4">
          <li className="border border-student-border bg-student-canvas px-4 py-4">
            <p className="text-base font-semibold text-student-ink">
              1. Diagnose the problems.
            </p>
            <p className="mt-2 font-reading text-lg leading-8 text-student-ink">
              Identify <Mark>at least three</Mark> distinct learning or
              motivational problems Daniel is experiencing. For each problem,
              explain what evidence from the classroom case supports your
              identification.
            </p>
          </li>
          <li className="border border-student-border bg-student-canvas px-4 py-4">
            <p className="text-base font-semibold text-student-ink">
              2. Interpret the problems.
            </p>
            <p className="mt-2 font-reading text-lg leading-8 text-student-ink">
              Apply relevant educational psychology theories or concepts from the
              assigned texts to <Mark>explain why</Mark> Daniel may be
              experiencing these difficulties. Your explanations should connect
              their psychological mechanisms to specific case evidence.
            </p>
          </li>
          <li className="border border-student-border bg-student-canvas px-4 py-4">
            <p className="text-base font-semibold text-student-ink">
              3. Recommend solutions.
            </p>
            <p className="mt-2 font-reading text-lg leading-8 text-student-ink">
              <Mark>Propose instructional strategies</Mark> Ms. Carter could use
              to address the identified problems. Explain how each strategy
              follows from your theoretical interpretation and why it may support
              Daniel&apos;s learning.
            </p>
          </li>
        </ol>
        <p className="mt-5 font-reading text-lg leading-8 text-student-ink">
          {TASK_GENAI_NOTE}
        </p>
        <p className="mt-4 text-base font-semibold leading-7 text-student-ink">
          <Mark>{TASK_DO_NOT_PASTE}</Mark>
        </p>
      </section>
    </div>
  );
}
