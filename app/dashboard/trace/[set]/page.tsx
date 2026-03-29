"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TRACE_DATA, SET_META, TraceSet, TraceChar } from "@/lib/trace-data";
import { sm2, isDue, defaultSRS, loadSRSData, saveSRSData, CardSRSData } from "@/lib/sm2";

type SessionCard = TraceChar & { srs: CardSRSData; isNew: boolean };
type Phase = "trace" | "evaluate" | "done";

const STORAGE_NS = (set: string) => `trace_${set}`;

function buildSession(set: TraceSet): SessionCard[] {
  const stored = loadSRSData(STORAGE_NS(set));
  const all = TRACE_DATA[set] ?? [];
  const due: SessionCard[] = [];
  const newCards: SessionCard[] = [];
  for (const card of all) {
    const srs = stored[card.id] ?? defaultSRS();
    const isNew = !stored[card.id];
    if (isNew || isDue(srs)) {
      (isNew ? newCards : due).push({ ...card, srs, isNew });
    }
  }
  const shuffle = <T,>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  return [...shuffle(due), ...shuffle(newCards)];
}

export default function TraceSessionPage() {
  const params = useParams();
  const set = params.set as TraceSet;
  const meta = SET_META[set];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("trace");
  const [stats, setStats] = useState({ known: 0, again: 0 });
  const [srsStore, setSrsStore] = useState<Record<string, CardSRSData>>({});
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const session = buildSession(set);
    setQueue(session);
    setSrsStore(loadSRSData(STORAGE_NS(set)));
    if (session.length === 0) setPhase("done");
  }, [set]);

  const current = queue[index];

  // Draw guide character on canvas
  const drawGuide = useCallback((opacity = 0.08) => {
    const canvas = canvasRef.current;
    if (!canvas || !current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${canvas.width * 0.72}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(108,99,255,${opacity})`;
    ctx.fillText(current.character, canvas.width / 2, canvas.height / 2);
  }, [current]);

  useEffect(() => {
    if (phase === "trace") {
      drawGuide(0.08);
      setHasDrawn(false);
    } else if (phase === "evaluate") {
      drawGuide(0.5);
    }
  }, [current, phase, drawGuide]);

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (phase !== "trace") return;
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
    setHasDrawn(true);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current || phase !== "trace") return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) { lastPos.current = pos; return; }
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1A1A2E";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }

  function endDraw() {
    drawing.current = false;
    lastPos.current = null;
  }

  function clearCanvas() {
    drawGuide(0.08);
    setHasDrawn(false);
  }

  function handleGrade(grade: 0 | 4) {
    if (!current) return;
    const updated = sm2(grade, current.srs);
    const newStore = { ...srsStore, [current.id]: updated };
    setSrsStore(newStore);
    saveSRSData(STORAGE_NS(set), newStore);

    if (grade === 0) {
      setStats((s) => ({ ...s, again: s.again + 1 }));
      setQueue((q) => {
        const next = [...q];
        const [card] = next.splice(index, 1);
        const insertAt = Math.min(index + 4, next.length);
        next.splice(insertAt, 0, { ...card, srs: updated });
        return next;
      });
    } else {
      setStats((s) => ({ ...s, known: s.known + 1 }));
      if (index + 1 >= queue.length) {
        setPhase("done");
        return;
      }
      setIndex((i) => i + 1);
    }
    setPhase("trace");
  }

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9B9BAD]">Invalid set.</p>
      </div>
    );
  }

  // ── All caught up ────────────────────────────────────────────────────
  if (phase === "done" && stats.known === 0 && stats.again === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl text-[#1A1A2E] mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
          All caught up!
        </h1>
        <p className="text-[#6B6B80] mb-8">No characters due for {meta.label} right now.</p>
        <Link href="/dashboard/trace" className="rounded-xl bg-[#6C63FF] text-white font-semibold px-6 py-3 text-sm hover:bg-[#5A52E0] transition-colors">
          Back to sets
        </Link>
      </div>
    );
  }

  // ── Session done ─────────────────────────────────────────────────────
  if (phase === "done") {
    const accuracy = Math.round((stats.known / (stats.known + stats.again)) * 100) || 0;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">{accuracy >= 80 ? "🖊️" : "📝"}</div>
        <h1 className="text-3xl text-[#1A1A2E] mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {accuracy >= 80 ? "Nice handwriting!" : "Keep practicing!"}
        </h1>
        <p className="text-[#6B6B80] mb-8">{stats.known} nailed · {stats.again} to review</p>
        <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-8">
          <div className="flex justify-around">
            <div><p className="text-3xl font-bold text-[#30C06E]">{stats.known}</p><p className="text-xs text-[#9B9BAD] mt-1">Nailed</p></div>
            <div className="w-px bg-[#EEECE8]" />
            <div><p className="text-3xl font-bold text-[#FF9340]">{stats.again}</p><p className="text-xs text-[#9B9BAD] mt-1">Again</p></div>
            <div className="w-px bg-[#EEECE8]" />
            <div><p className="text-3xl font-bold text-[#6C63FF]">{accuracy}%</p><p className="text-xs text-[#9B9BAD] mt-1">Accuracy</p></div>
          </div>
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <Link href="/dashboard/trace" className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm text-center hover:bg-[#F7F5F0] transition-colors">
            All sets
          </Link>
          <Link href="/dashboard" className="flex-1 rounded-xl bg-[#6C63FF] text-white font-semibold py-3 text-sm text-center hover:bg-[#5A52E0] transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  // ── Tracing / Evaluate ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col px-5 pt-12 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/dashboard/trace" className="text-[#9B9BAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold rounded-full px-3 py-1" style={{ color: meta.color, backgroundColor: meta.bg }}>
            {meta.label}
          </span>
          {current.isNew && (
            <span className="text-xs font-semibold bg-[#E8F7EE] text-[#30C06E] rounded-full px-2 py-0.5">New</span>
          )}
        </div>
        <span className="text-xs text-[#9B9BAD]">{index + 1} / {queue.length}</span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-[#EEECE8] rounded-full overflow-hidden mb-6">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(index / queue.length) * 100}%`, backgroundColor: meta.color }} />
      </div>

      {/* Reading + meaning */}
      <div className="text-center mb-4">
        <p className="text-2xl font-semibold text-[#1A1A2E]">{current.reading}</p>
        {current.meaning && <p className="text-sm text-[#9B9BAD] mt-0.5">{current.meaning}</p>}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-xs aspect-square mb-4">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-sm border-2 border-dashed border-[#E4E2DD]" />
          {/* Grid lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-[#F0EDF8]" />
          </div>
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="h-full w-px bg-[#F0EDF8]" />
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="absolute inset-0 w-full h-full rounded-3xl touch-none"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Phase: trace */}
        {phase === "trace" && (
          <div className="w-full max-w-xs space-y-3">
            <p className="text-center text-xs text-[#9B9BAD]">
              Trace the character · guide is shown faintly
            </p>
            <div className="flex gap-3">
              <button
                onClick={clearCanvas}
                className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm hover:bg-[#F7F5F0] transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setPhase("evaluate")}
                disabled={!hasDrawn}
                className="flex-1 rounded-xl bg-[#6C63FF] text-white font-semibold py-3 text-sm hover:bg-[#5A52E0] transition-colors disabled:opacity-40"
              >
                Done →
              </button>
            </div>
          </div>
        )}

        {/* Phase: evaluate */}
        {phase === "evaluate" && (
          <div className="w-full max-w-xs space-y-3">
            <p className="text-center text-xs text-[#9B9BAD]">
              Compare your tracing to the guide
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleGrade(0)}
                className="flex-1 rounded-2xl border-2 border-[#FFE8CC] bg-[#FFE8CC] text-[#FF9340] font-semibold py-4 text-sm hover:bg-[#FFD5A8] transition-colors"
              >
                <span className="block">Again</span>
                <span className="text-xs font-normal opacity-70">&lt; 1 day</span>
              </button>
              <button
                onClick={() => handleGrade(4)}
                className="flex-1 rounded-2xl border-2 border-[#E8F7EE] bg-[#E8F7EE] text-[#30C06E] font-semibold py-4 text-sm hover:bg-[#D0F0E0] transition-colors"
              >
                <span className="block">Nailed it ✓</span>
                <span className="text-xs font-normal opacity-70">
                  {current.srs.repetitions === 0 ? "1 day" : current.srs.repetitions === 1 ? "6 days" : `~${Math.round(current.srs.interval * current.srs.easeFactor)}d`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
