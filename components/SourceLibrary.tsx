"use client";

import { READINGS, type ReadingSource } from "@/lib/studyContent";

type Props = {
  downloadedIds: string[];
  onDownload: (source: ReadingSource) => void;
};

export function SourceLibrary({ downloadedIds, onDownload }: Props) {
  return (
    <ul className="space-y-3">
      {READINGS.map((reading, index) => {
        const opened = downloadedIds.includes(reading.id);
        return (
          <li
            key={reading.id}
            className="flex flex-col gap-3 rounded-md border border-student-border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-student-muted">
                Reading {index + 1}
              </p>
              <p className="mt-1 text-base font-semibold text-student-ink">
                {reading.title}
              </p>
              <p className="mt-1 text-xs text-student-muted">{reading.filename}</p>
            </div>
            <a
              href={reading.href}
              download={reading.filename}
              onClick={() => onDownload(reading)}
              className="shrink-0 rounded-md bg-navy-800 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-navy-900"
            >
              {opened ? "Download again" : "Download PDF"}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
