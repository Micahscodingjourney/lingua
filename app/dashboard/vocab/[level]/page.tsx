"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { VOCAB, LEVEL_META, JLPTLevel, VocabCard } from "@/lib/vocab";
import { sm2, isDue, defaultSRS, loadSRSData, saveSRSData, CardSRSData } from "@/lib/sm2";

type SessionCard = VocabCard & { srs: CardSRSData; isNew: boolean };

function buildSession(level: JLPTLevel): SessionCard[] {
  const stored = loadSRSData(level);
  const all = VOCAB[level] ?? [];

  const due: SessionCard[] = [];
  const newCards: SessionCard[] = [];

  for (const card of all) {
    const srs = stored[card.id] ?? defaultSRS();
    const isNew = !stored[card.id];
    if (isNew || isDue(srs)) {
      (isNew ? newCards : due).push({ ...card, srs, isNew });
    }
  }

  // Due cards first, then new — shuffle each group
  const shuffle = <T,>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  return [...shuffle(due), ...shuffle(newCards)];
}

export default function VocabSessionPage() {
  const params = useParams();
  const level = (params.level as string).toUpperCase() as JLPTLevel;
  const meta = LEVEL_META[level];

  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ known: 0, again: 0 });
  const [srsStore, setSrsStore] = useState<Record<string, CardSRSData>>({});

  useEffect(() => {
    const session = buildSession(level);
    setQueue(session);
    setSrsStore(loadSRSData(level));
    setDone(session.length === 0);
  }, [level]);

  const current = queue[index];

  function handleGrade(grade: 0 | 4) {
    if (!current) return;

    const updated = sm2(grade, current.srs);
    const newStore = { ...srsStore, [current.id]: updated };
    setSrsStore(newStore);
    saveSRSData(level, newStore);

    if (grade === 0) {
      // Re-queue the card ~4 positions ahead
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
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    }
    setRevealed(false);
  }

  function playWord(text: string) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }

  if (!VOCAB[level]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9B9BAD]">Invalid level.</p>
      </div>
    );
  }

  // ── Nothing due ──────────────────────────────────────────────────────
  if (done && stats.known === 0 && stats.again === 0) {
    const stored = srsStore;
    const nextDue = Object.values(stored)
      .map((d) => new Date(d.dueDate))
      .filter((d) => d > new Date())
      .sort((a, b) => a.getTime() - b.getTime())[0];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1
          className="text-3xl text-[#1A1A2E] mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          All caught up!
        </h1>
        <p className="text-[#6B6B80] mb-2">No cards due for {level} right now.</p>
        {nextDue && (
          <p className="text-sm text-[#9B9BAD] mb-8">
            Next review: {nextDue.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </p>
        )}
        <Link
          href="/dashboard/vocab"
          className="rounded-xl bg-[#6C63FF] text-white font-semibold px-6 py-3 text-sm hover:bg-[#5A52E0] transition-colors"
        >
          Back to levels
        </Link>
      </div>
    );
  }

  // ── Session complete ─────────────────────────────────────────────────
  if (done) {
    const accuracy = Math.round((stats.known / (stats.known + stats.again)) * 100) || 0;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">
          {accuracy >= 80 ? "🏆" : accuracy >= 50 ? "⭐" : "📚"}
        </div>
        <h1
          className="text-3xl text-[#1A1A2E] mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {accuracy >= 80 ? "Great session!" : accuracy >= 50 ? "Good work!" : "Keep going!"}
        </h1>
        <p className="text-[#6B6B80] mb-8">{stats.known} known · {stats.again} review</p>

        <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-4">
          <div className="flex justify-around">
            <div>
              <p className="text-3xl font-bold text-[#30C06E]">{stats.known}</p>
              <p className="text-xs text-[#9B9BAD] mt-1">Known</p>
            </div>
            <div className="w-px bg-[#EEECE8]" />
            <div>
              <p className="text-3xl font-bold text-[#FF9340]">{stats.again}</p>
              <p className="text-xs text-[#9B9BAD] mt-1">Again</p>
            </div>
            <div className="w-px bg-[#EEECE8]" />
            <div>
              <p className="text-3xl font-bold text-[#6C63FF]">{accuracy}%</p>
              <p className="text-xs text-[#9B9BAD] mt-1">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Next review info */}
        <p className="text-xs text-[#9B9BAD] mb-8">
          Cards you got right won't appear again for 1–6+ days based on your performance.
        </p>

        <div className="flex gap-3 w-full max-w-xs">
          <Link
            href="/dashboard/vocab"
            className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm text-center hover:bg-[#F7F5F0] transition-colors"
          >
            All levels
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl bg-[#6C63FF] text-white font-semibold py-3 text-sm text-center hover:bg-[#5A52E0] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const totalDue = queue.length;
  const progress = (index / totalDue) * 100;

  // ── Flashcard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col px-5 pt-12 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/vocab" className="text-[#9B9BAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-bold rounded-full px-3 py-1"
            style={{ color: meta.color, backgroundColor: meta.bg }}
          >
            {level}
          </span>
          {current.isNew && (
            <span className="text-xs font-semibold bg-[#E8F7EE] text-[#30C06E] rounded-full px-2 py-0.5">
              New
            </span>
          )}
        </div>
        <span className="text-xs text-[#9B9BAD]">{index + 1} / {totalDue}</span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-[#EEECE8] rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: meta.color }}
        />
      </div>

      {/* SRS interval hint */}
      <div className="flex justify-end mb-6">
        <span className="text-xs text-[#9B9BAD]">
          {current.srs.repetitions > 0
            ? `Last interval: ${current.srs.interval}d`
            : "First time"}
        </span>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center text-center mb-6">
          <p
            className="text-5xl text-[#1A1A2E] mb-3"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {current.japanese}
          </p>

          <button
            onClick={() => playWord(current.japanese)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#9B9BAD] hover:text-[#6C63FF] transition-colors mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12V9C18.5 5.41015 15.5899 2.5 12 2.5C8.41015 2.5 5.5 5.41015 5.5 9V12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M3 12C3 12 3 21 12 21C21 21 21 12 21 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Pronounce
          </button>

          <div className="w-full h-px bg-[#EEECE8] mb-6" />

          {revealed ? (
            <div className="space-y-2">
              <p className="text-[#6B6B80] text-lg">{current.reading}</p>
              <p className="text-2xl font-semibold text-[#1A1A2E]">{current.english}</p>
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="text-sm font-semibold text-[#6C63FF] bg-[#6C63FF]/10 rounded-full px-5 py-2 hover:bg-[#6C63FF]/20 transition-colors"
            >
              Reveal answer
            </button>
          )}
        </div>

        {/* Grade buttons */}
        {revealed && (
          <div className="flex gap-3 w-full">
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
              <span className="block">Got it ✓</span>
              <span className="text-xs font-normal opacity-70">
                {current.srs.repetitions === 0 ? "1 day" : current.srs.repetitions === 1 ? "6 days" : `~${Math.round(current.srs.interval * current.srs.easeFactor)}d`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
