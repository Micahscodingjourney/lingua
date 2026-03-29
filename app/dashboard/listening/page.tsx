"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Token = {
  text: string;
  reading?: string;
  translation?: string;
  tappable?: boolean;
  charStart: number;
};

type Screen = "listen" | "dictation" | "complete";

// Full text string (must match token charStart positions exactly)
const FULL_TEXT = "今日は晴れています。公園で子供たちが遊んでいます。";
const EXPECTED = "today it is sunny children are playing in the park";

const TOKENS: Token[] = [
  { text: "今日",     reading: "きょう",     translation: "today",           tappable: true,  charStart: 0  },
  { text: "は",                                                                tappable: false, charStart: 2  },
  { text: "晴れて",   reading: "はれて",     translation: "sunny / clear",   tappable: true,  charStart: 3  },
  { text: "います",   reading: "います",     translation: "is (continuous)", tappable: true,  charStart: 6  },
  { text: "。",                                                                tappable: false, charStart: 9  },
  { text: "公園",     reading: "こうえん",   translation: "park",            tappable: true,  charStart: 10 },
  { text: "で",                                                                tappable: false, charStart: 12 },
  { text: "子供たち", reading: "こどもたち", translation: "children",        tappable: true,  charStart: 13 },
  { text: "が",                                                                tappable: false, charStart: 17 },
  { text: "遊んで",   reading: "あそんで",   translation: "playing",         tappable: true,  charStart: 18 },
  { text: "います",   reading: "います",     translation: "is (continuous)", tappable: true,  charStart: 21 },
  { text: "。",                                                                tappable: false, charStart: 24 },
];

const LESSON = {
  title: "晴れた日",
  titleReading: "Hareta Hi",
  titleTranslation: "A Sunny Day",
  level: "N5",
  xpReward: 60,
};

function scoreAnswer(input: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[.,!?]/g, "").trim().split(/\s+/);
  const expected = normalize(EXPECTED);
  const given = normalize(input);
  const hits = expected.filter((w) => given.includes(w)).length;
  return Math.round((hits / expected.length) * 100);
}

export default function ListeningPage() {
  const [screen, setScreen] = useState<Screen>("listen");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChar, setActiveChar] = useState(-1);
  const [selected, setSelected] = useState<Token | null>(null);
  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [dictation, setDictation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const accuracy = submitted ? scoreAnswer(dictation) : 0;
  const xpEarned = Math.round((accuracy / 100) * LESSON.xpReward);

  async function play() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsLoading(true);
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: FULL_TEXT }),
    });
    if (!res.ok) { setIsLoading(false); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => { setIsPlaying(false); setActiveChar(-1); };
    setIsLoading(false);
    setIsPlaying(true);
    audio.play();
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setActiveChar(-1);
  }

  function selectToken(token: Token) {
    const isSame = selected?.charStart === token.charStart;
    setSelected(isSame ? null : token);
    setTranslationRevealed(false);
  }

  // ── Complete screen ──────────────────────────────────────────────────
  if (screen === "complete") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">
          {accuracy === 100 ? "🏆" : accuracy >= 60 ? "⭐" : "👂"}
        </div>
        <h1
          className="text-3xl text-[#1A1A2E] mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {accuracy === 100 ? "Perfect!" : accuracy >= 60 ? "Nice work!" : "Keep listening!"}
        </h1>
        <p className="text-[#6B6B80] mb-8">{accuracy}% accuracy</p>

        <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-6">
          <p className="text-sm text-[#9B9BAD] mb-1">XP earned</p>
          <p className="text-4xl font-bold text-[#6C63FF]">+{xpEarned}</p>
          <div className="mt-3 h-2 bg-[#F0EDF8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]"
              style={{ width: `${Math.min(100, (340 + xpEarned) / 500 * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#9B9BAD]">Listening — Level 4</p>
        </div>

        <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-sm mb-8 text-left">
          <p className="text-xs font-semibold text-[#9B9BAD] mb-1">Correct translation</p>
          <p className="text-sm text-[#1A1A2E]">
            Today it is sunny. Children are playing in the park.
          </p>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => { setScreen("listen"); setDictation(""); setSubmitted(false); stop(); }}
            className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm hover:bg-[#F7F5F0] transition-colors"
          >
            Try again
          </button>
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

  // ── Dictation screen ─────────────────────────────────────────────────
  if (screen === "dictation") {
    return (
      <div className="min-h-screen px-5 pt-12 pb-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => { setScreen("listen"); stop(); }} className="text-[#9B9BAD]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest">Dictation</p>
          <div className="w-5" />
        </div>

        <p
          className="text-2xl text-[#1A1A2E] mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          What did you hear?
        </p>
        <p className="text-sm text-[#9B9BAD] mb-8">Type the English translation of what was said.</p>

        {/* Replay */}
        <button
          onClick={isPlaying ? stop : play}
          className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm mb-8 w-full"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isPlaying ? "bg-[#FF9340]" : "bg-[#6C63FF]"}`}>
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="5" width="4" height="14" rx="1"/>
                <rect x="14" y="5" width="4" height="14" rx="1"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5.14v14l11-7-11-7z"/>
              </svg>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1A1A2E]">{isLoading ? "Loading…" : isPlaying ? "Playing…" : "Replay audio"}</p>
            <p className="text-xs text-[#9B9BAD]">{LESSON.titleTranslation} · {LESSON.level}</p>
          </div>
        </button>

        <textarea
          value={dictation}
          onChange={(e) => setDictation(e.target.value)}
          disabled={submitted}
          placeholder="Type what you heard in English…"
          rows={4}
          className="w-full rounded-2xl border border-[#E4E2DD] bg-white px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#B0AFBB] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40 resize-none mb-4"
        />

        {submitted && (
          <div className={`rounded-2xl px-4 py-3 mb-4 text-sm ${accuracy >= 60 ? "bg-[#E8F7EE] text-[#1A5C35]" : "bg-red-50 text-red-700"}`}>
            <p className="font-semibold mb-1">{accuracy >= 60 ? `${accuracy}% — good!` : `${accuracy}% — keep practicing`}</p>
            <p className="text-xs opacity-80">Expected: <em>Today it is sunny. Children are playing in the park.</em></p>
          </div>
        )}

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!dictation.trim()}
            className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3.5 text-sm hover:bg-[#5A52E0] transition-colors disabled:opacity-40"
          >
            Check my answer
          </button>
        ) : (
          <button
            onClick={() => setScreen("complete")}
            className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3.5 text-sm hover:bg-[#5A52E0] transition-colors"
          >
            See results →
          </button>
        )}
      </div>
    );
  }

  // ── Listen screen ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[#9B9BAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest">Listening</p>
        <span className="text-xs bg-[#FFE8CC] text-[#FF9340] font-semibold rounded-full px-2.5 py-1">
          {LESSON.level}
        </span>
      </div>

      <div className="flex-1 px-5 pb-32">
        {/* Title */}
        <div className="mb-8">
          <h1
            className="text-3xl text-[#1A1A2E]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {LESSON.title}
          </h1>
          <p className="text-sm text-[#9B9BAD] mt-1">{LESSON.titleReading} — {LESSON.titleTranslation}</p>
        </div>

        {/* Player card */}
        <div
          className="rounded-3xl p-6 mb-8 flex flex-col items-center"
          style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)" }}
        >
          {/* Waveform visualiser (decorative) */}
          <div className="flex items-center gap-1 h-10 mb-6">
            {Array.from({ length: 28 }).map((_, i) => {
              const heights = [3, 5, 8, 12, 16, 20, 24, 20, 16, 24, 18, 12, 20, 28, 20, 16, 24, 18, 12, 20, 16, 12, 8, 6, 10, 14, 8, 4];
              return (
                <div
                  key={i}
                  className="w-1 rounded-full transition-all duration-150"
                  style={{
                    height: `${heights[i]}px`,
                    backgroundColor: isPlaying ? "#A78BFA" : "#6C63FF",
                    opacity: isPlaying ? 0.6 + Math.random() * 0.4 : 0.4,
                  }}
                />
              );
            })}
          </div>

          {/* Play / Stop button */}
          <button
            onClick={isPlaying ? stop : play}
            disabled={isLoading}
            className="w-16 h-16 rounded-full bg-[#6C63FF] flex items-center justify-center hover:bg-[#5A52E0] transition-colors mb-4 shadow-lg disabled:opacity-60"
          >
            {isLoading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-spin">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
              </svg>
            ) : isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="5" width="4" height="14" rx="1"/>
                <rect x="14" y="5" width="4" height="14" rx="1"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5.14v14l11-7-11-7z"/>
              </svg>
            )}
          </button>

          <p className="text-xs text-[#A78BFA]">
            {isLoading ? "Loading audio…" : isPlaying ? "Playing…" : "Tap to play"}
          </p>
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest mb-4">
            Tap words to explore
          </p>
          <div className="text-2xl leading-loose text-[#1A1A2E]">
            {TOKENS.map((token, i) => {
              const isActive =
                activeChar >= token.charStart &&
                activeChar < token.charStart + token.text.length;
              const isSelected = selected?.charStart === token.charStart;

              if (!token.tappable) return <span key={i}>{token.text}</span>;

              return (
                <button
                  key={i}
                  onClick={() => selectToken(token)}
                  className={`inline rounded px-0.5 transition-colors ${
                    isActive
                      ? "bg-[#FF9340]/30 text-[#FF9340]"
                      : isSelected
                      ? "bg-[#6C63FF]/20 text-[#6C63FF]"
                      : "hover:bg-[#6C63FF]/10"
                  }`}
                >
                  {token.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Word tooltip */}
      {selected && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm bg-[#1A1A2E] rounded-2xl px-5 py-4 shadow-xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white text-2xl font-medium">{selected.text}</p>
              {selected.reading && (
                <p className="text-[#A78BFA] text-sm mt-0.5">{selected.reading}</p>
              )}
              {translationRevealed ? (
                <p className="text-[#E0DEFF] text-sm mt-2">{selected.translation}</p>
              ) : (
                <button
                  onClick={() => setTranslationRevealed(true)}
                  className="mt-2 text-xs font-semibold text-[#6C63FF] bg-[#6C63FF]/20 rounded-full px-3 py-1 hover:bg-[#6C63FF]/30 transition-colors"
                >
                  Reveal translation
                </button>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="text-[#6B6B80] mt-1 ml-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4 bg-gradient-to-t from-[#F7F5F0] to-transparent">
        <button
          onClick={() => { stop(); setScreen("dictation"); }}
          className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3.5 text-sm hover:bg-[#5A52E0] transition-colors"
        >
          I'm ready → Dictation exercise
        </button>
      </div>
    </div>
  );
}
