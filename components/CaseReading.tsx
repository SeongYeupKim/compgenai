"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { CASE_PARAGRAPHS, CASE_TITLE } from "@/lib/studyContent";

type RangeMark = { start: number; end: number };

function storageKey(readerId: string) {
  return `compgenai-case-highlights:${readerId}`;
}

function addRange(existing: RangeMark[], start: number, end: number): RangeMark[] {
  const next = [...existing, { start, end }].sort((a, b) => a.start - b.start);
  const merged: RangeMark[] = [];
  for (const range of next) {
    const last = merged[merged.length - 1];
    if (!last || range.start > last.end) merged.push({ ...range });
    else last.end = Math.max(last.end, range.end);
  }
  return merged;
}

function segments(text: string, ranges: RangeMark[]) {
  const points = new Set<number>([0, text.length]);
  for (const range of ranges) {
    points.add(range.start);
    points.add(range.end);
  }
  const sorted = Array.from(points).sort((a, b) => a - b);
  const parts: { start: number; end: number; text: string; on: boolean }[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (end <= start) continue;
    parts.push({
      start,
      end,
      text: text.slice(start, end),
      on: ranges.some((range) => range.start <= start && range.end >= end),
    });
  }
  return parts;
}

function offsetInParagraph(paragraph: HTMLElement, node: Node, offset: number): number {
  if (node === paragraph) {
    let count = 0;
    for (let i = 0; i < offset && i < paragraph.childNodes.length; i++) {
      count += paragraph.childNodes[i].textContent?.length ?? 0;
    }
    return count;
  }
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
  let count = 0;
  let current: Node | null;
  while ((current = walker.nextNode())) {
    if (current === node) return count + offset;
    count += current.textContent?.length ?? 0;
  }
  return count;
}

function selectionInParagraph(
  paragraph: HTMLElement,
  range: Range,
): RangeMark | null {
    try {
      if (!range.intersectsNode(paragraph)) return null;
    } catch {
      return null;
    }
  const length = paragraph.textContent?.length ?? 0;
  const start = paragraph.contains(range.startContainer)
    ? offsetInParagraph(paragraph, range.startContainer, range.startOffset)
    : 0;
  const end = paragraph.contains(range.endContainer)
    ? offsetInParagraph(paragraph, range.endContainer, range.endOffset)
    : length;
  if (end - start < 1) return null;
  return { start: Math.max(0, start), end: Math.min(length, end) };
}

export function CaseReading({ readerId }: { readerId?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef({ top: 0, height: 36 });
  const [thumb, setThumb] = useState({ top: 0, height: 36 });
  const [armed, setArmed] = useState(false);
  const [highlights, setHighlights] = useState<Record<number, RangeMark[]>>({});
  const [loaded, setLoaded] = useState(false);
  const skipRemove = useRef(false);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const trackHeight = track.clientHeight;
    const ratio = el.scrollHeight <= 0 ? 1 : el.clientHeight / el.scrollHeight;
    const height = Math.max(36, Math.min(trackHeight, trackHeight * ratio));
    const maxTop = Math.max(0, trackHeight - height);
    const maxScroll = el.scrollHeight - el.clientHeight;
    const top = maxScroll <= 0 ? 0 : (el.scrollTop / maxScroll) * maxTop;
    const next = { top, height };
    thumbRef.current = next;
    setThumb(next);
  }, []);

  useEffect(() => {
    measure();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, highlights]);

  useEffect(() => {
    if (!readerId) {
      setLoaded(true);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(readerId));
      if (raw) {
        const parsed = JSON.parse(raw) as Record<number, RangeMark[]>;
        if (parsed && typeof parsed === "object") setHighlights(parsed);
      }
    } catch {
      /* ignore a bad local copy */
    }
    setLoaded(true);
  }, [readerId]);

  useEffect(() => {
    if (!loaded || !readerId) return;
    localStorage.setItem(storageKey(readerId), JSON.stringify(highlights));
  }, [highlights, loaded, readerId]);

  function onThumbDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const scroller = el;
    const startY = event.clientY;
    const startScroll = scroller.scrollTop;
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    const maxTop = Math.max(1, track.clientHeight - thumbRef.current.height);

    function move(ev: PointerEvent) {
      const next = startScroll + ((ev.clientY - startY) / maxTop) * maxScroll;
      scroller.scrollTop = next;
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onMouseUp() {
    if (!armed) return;
    const selection = window.getSelection();
    const root = textRef.current;
    if (!selection || selection.isCollapsed || !selection.rangeCount || !root) return;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return;

    const paragraphs = root.querySelectorAll<HTMLElement>("[data-p]");
    const found: { index: number; mark: RangeMark }[] = [];
    paragraphs.forEach((paragraph) => {
      const index = Number(paragraph.dataset.p);
      const mark = selectionInParagraph(paragraph, range);
      if (mark && mark.end > mark.start) found.push({ index, mark });
    });
    if (found.length === 0) return;
    skipRemove.current = true;

    setHighlights((prev) => {
      const next = { ...prev };
      for (const item of found) {
        next[item.index] = addRange(next[item.index] ?? [], item.mark.start, item.mark.end);
      }
      return next;
    });
    selection.removeAllRanges();
  }

  function removeMark(index: number, start: number, end: number) {
    if (skipRemove.current) {
      skipRemove.current = false;
      return;
    }
    setHighlights((prev) => {
      const current = prev[index] ?? [];
      const nextRanges = current
        .flatMap((range) => {
          if (range.end <= start || range.start >= end) return [range];
          const pieces: RangeMark[] = [];
          if (range.start < start) pieces.push({ start: range.start, end: start });
          if (range.end > end) pieces.push({ start: end, end: range.end });
          return pieces;
        })
        .filter((range) => range.end > range.start);
      return { ...prev, [index]: nextRanges };
    });
  }

  return (
    <article
      className={`border bg-white px-6 py-6 sm:px-7 ${
        armed ? "border-yellow-300" : "border-student-border"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">
          Case
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-student-muted">
            You can highlight while reading the case. Click
          </p>
          <span aria-hidden="true" className="text-sm text-student-muted">
            →
          </span>
          <button
            type="button"
            aria-pressed={armed}
            onClick={() => setArmed((value) => !value)}
            className={`rounded px-2 py-1 text-xs font-semibold ${
              armed
                ? "bg-yellow-200 text-student-ink"
                : "text-student-muted hover:bg-student-canvas"
            }`}
          >
            Highlight
          </button>
        </div>
      </div>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-student-ink">
        {CASE_TITLE}
      </h2>
      {armed && (
        <p className="mt-2 text-sm text-student-muted">
          Select words to mark them. Click a mark to remove it.
        </p>
      )}
      <div className="mt-4 flex h-72">
        <div
          ref={scrollerRef}
          onScroll={measure}
          className="case-hide-native h-full min-w-0 flex-1 overflow-y-scroll pr-3"
        >
          <div
            ref={textRef}
            onMouseUp={onMouseUp}
            className="space-y-4 text-base leading-7 text-student-ink"
          >
            {CASE_PARAGRAPHS.map((paragraph, index) => (
              <p key={paragraph.slice(0, 48)} data-p={index}>
                {segments(paragraph, highlights[index] ?? []).map((part) =>
                  part.on ? (
                    <mark
                      key={`${part.start}-${part.end}`}
                      className="cursor-pointer bg-yellow-200/90 text-inherit"
                      onClick={() => removeMark(index, part.start, part.end)}
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={`${part.start}-${part.end}`}>{part.text}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>
        <div
          ref={trackRef}
          className="relative ml-2 w-2.5 shrink-0 self-stretch rounded-full bg-navy-100"
          aria-hidden="true"
        >
          <div
            onPointerDown={onThumbDown}
            className="absolute inset-x-0 cursor-pointer rounded-full bg-navy-700"
            style={{ top: thumb.top, height: thumb.height }}
          />
        </div>
      </div>
    </article>
  );
}
