"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { VOCAB, LEVEL_META, JLPTLevel, VocabCard } from "@/lib/vocab";

type CardState = VocabCard & { bucket: number }; // bucket 0=new, 1=learning, 2=known

export default function VocabSessionPage() {
  const params = useParams();
  const level = (params.level as string).toUpperCase() as JLPTLevel;
  const meta = LEVEL_META[level];

  const [cards, setCards] = useState<CardState[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [stats, setStats] = useState({ known: 0, again: 0 });

  useEffect(() => {
    const initial = VOCAB[level]?.map((c) => ({ ...c, bucket: 0 })) ?? [];
    // Shuffle
    for (let i = initial.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initial[i], initial[j]] = [initial[j], initial[i]];
    }
    setCards(initial);
  }, [level]);

  const current = cards[index];
  const progress = cards.length > 0 ? (index / cards.length) * 100 : 0;

  function handleKnow() {
    setStats((s) => ({ ...s, known: s.known + 1 }));
    advance();
  }

  function handleAgain() {
    setStats((s) => ({ ...s, again: s.again + 1 }));
    // Move card to end of queue
    setCards((prev) => {
      const updated = [...prev];
      const [card] = updated.splice(index, 1);
      updated.push({ ...card, bucket: 0 });
      return updated;
    });
    setRevealed(false);
  }

  function advance() {
    if (index + 1 >= cards.length) {
      setSessionDone(true);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
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

  // ── Session complete ─────────────────────────────────────────────────
  if (sessionDone) {
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
          {accuracy >= 80 ? "Excellent!" : accuracy >= 50 ? "Good session!" : "Keep reviewing!"}
        </h1>
        <p className="text-[#6B6B80] mb-8">
          {stats.known} known · {stats.again} to review
        </p>

        <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-8">
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

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              const initial = VOCAB[level].map((c) => ({ ...c, bucket: 0 }));
              for (let i = initial.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [initial[i], initial[j]] = [initial[j], initial[i]];
              }
              setCards(initial);
              setIndex(0);
              setRevealed(false);
              setSessionDone(false);
              setStats({ known: 0, again: 0 });
            }}
            className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm hover:bg-[#F7F5F0] transition-colors"
          >
            Study again
          </button>
          <Link
            href="/dashboard/vocab"
            className="flex-1 rounded-xl bg-[#6C63FF] text-white font-semibold py-3 text-sm text-center hover:bg-[#5A52E0] transition-colors"
          >
            All levels
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

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
        <span
          className="text-sm font-bold rounded-full px-3 py-1"
          style={{ color: meta.color, backgroundColor: meta.bg }}
        >
          {level}
        </span>
        <span className="text-xs text-[#9B9BAD]">{index + 1} / {cards.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#EEECE8] rounded-full overflow-hidden mb-8">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: meta.color }}
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center text-center mb-6">
          {/* Japanese word */}
          <p
            className="text-5xl text-[#1A1A2E] mb-3"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {current.japanese}
          </p>

          {/* Audio button */}
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

          {/* Divider */}
          <div className="w-full h-px bg-[#EEECE8] mb-6" />

          {/* Revealed content */}
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

        {/* Action buttons */}
        {revealed && (
          <div className="flex gap-3 w-full">
            <button
              onClick={handleAgain}
              className="flex-1 rounded-2xl border-2 border-[#FFE8CC] bg-[#FFE8CC] text-[#FF9340] font-semibold py-4 text-sm hover:bg-[#FFD5A8] transition-colors"
            >
              Again
            </button>
            <button
              onClick={handleKnow}
              className="flex-1 rounded-2xl border-2 border-[#E8F7EE] bg-[#E8F7EE] text-[#30C06E] font-semibold py-4 text-sm hover:bg-[#D0F0E0] transition-colors"
            >
              Got it ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
