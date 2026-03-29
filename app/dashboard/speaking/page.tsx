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

type Screen = "learn" | "speak" | "complete";

const FULL_TEXT = "おはようございます。今日もいい天気ですね。";
const LESSON = {
  title: "朝の挨拶",
  titleReading: "Asa no Aisatsu",
  titleTranslation: "Morning Greeting",
  level: "N5",
  xpReward: 60,
};

const TOKENS: Token[] = [
  { text: "おはようございます", reading: "おはようございます", translation: "good morning", tappable: true, charStart: 0 },
  { text: "。", tappable: false, charStart: 9 },
  { text: "今日", reading: "きょう", translation: "today", tappable: true, charStart: 10 },
  { text: "も", tappable: false, charStart: 12 },
  { text: "いい", reading: "いい", translation: "good / nice", tappable: true, charStart: 13 },
  { text: "天気", reading: "てんき", translation: "weather", tappable: true, charStart: 15 },
  { text: "ですね", reading: "ですね", translation: "isn't it (seeking agreement)", tappable: true, charStart: 17 },
  { text: "。", tappable: false, charStart: 20 },
];

function scoreTranscript(heard: string, target: string): number {
  const normalize = (s: string) => s.replace(/[。、！？\s]/g, "").toLowerCase();
  const h = normalize(heard);
  const t = normalize(target);
  if (h === t) return 100;
  let matches = 0;
  for (let i = 0; i < t.length; i++) {
    if (h.includes(t[i])) matches++;
  }
  return Math.round((matches / t.length) * 100);
}

type SpeechRecognitionResult = { transcript: string };
type SpeechRecognitionResultList = { length: number; [key: number]: { length: number; [key: number]: SpeechRecognitionResult } };
type SpeechRecognitionEvent = { results: SpeechRecognitionResultList };

type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (e: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

export default function SpeakingPage() {
  const [screen, setScreen] = useState<Screen>("learn");
  const [selected, setSelected] = useState<Token | null>(null);
  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  const xpEarned = Math.round((accuracy / 100) * LESSON.xpReward);

  function playAudio() {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(FULL_TEXT);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }

  function startRecording() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return alert("Your browser doesn't support speech recognition. Try Chrome.");
    const recognition = new SR();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      let result = "";
      for (let i = 0; i < e.results.length; i++) {
        result += e.results[i][0].transcript;
      }
      setTranscript(result);
    };
    recognition.onend = () => {
      setRecording(false);
      setTranscript((t) => {
        const score = scoreTranscript(t, FULL_TEXT);
        setAccuracy(score);
        return t;
      });
      setScreen("complete");
    };
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setTranscript("");
  }

  function stopRecording() {
    recognitionRef.current?.stop();
  }

  function selectToken(token: Token) {
    const isSame = selected?.charStart === token.charStart;
    setSelected(isSame ? null : token);
    setTranslationRevealed(false);
  }

  // ── Complete ─────────────────────────────────────────────────────────
  if (screen === "complete") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">
          {accuracy >= 90 ? "🎤" : accuracy >= 60 ? "⭐" : "💬"}
        </div>
        <h1
          className="text-3xl text-[#1A1A2E] mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {accuracy >= 90 ? "Excellent!" : accuracy >= 60 ? "Good effort!" : "Keep practicing!"}
        </h1>
        <p className="text-[#6B6B80] mb-8">{accuracy}% accuracy</p>

        {/* Transcript comparison */}
        <div className="w-full max-w-xs space-y-3 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-left">
            <p className="text-xs font-semibold text-[#9B9BAD] mb-1">Target</p>
            <p className="text-lg text-[#1A1A2E]">{FULL_TEXT}</p>
          </div>
          <div className={`rounded-2xl p-4 shadow-sm text-left ${accuracy >= 60 ? "bg-[#E8F7EE]" : "bg-red-50"}`}>
            <p className={`text-xs font-semibold mb-1 ${accuracy >= 60 ? "text-[#30C06E]" : "text-red-400"}`}>You said</p>
            <p className="text-lg text-[#1A1A2E]">{transcript || "—"}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-8">
          <p className="text-sm text-[#9B9BAD] mb-1">XP earned</p>
          <p className="text-4xl font-bold text-[#6C63FF]">+{xpEarned}</p>
          <div className="mt-3 h-2 bg-[#F0EDF8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]"
              style={{ width: `${Math.min(100, (210 + xpEarned) / 500 * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#9B9BAD]">Speaking — Level 2</p>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => { setScreen("speak"); setTranscript(""); setAccuracy(0); }}
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

  // ── Speak ────────────────────────────────────────────────────────────
  if (screen === "speak") {
    return (
      <div className="min-h-screen px-5 pt-12 pb-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setScreen("learn")} className="text-[#9B9BAD]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest">Your turn</p>
          <div className="w-5" />
        </div>

        {/* Target sentence */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-8">
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest mb-3">Say this</p>
          <p className="text-2xl text-[#1A1A2E] leading-relaxed mb-1">{FULL_TEXT}</p>
          <p className="text-sm text-[#9B9BAD]">Good morning. The weather is nice today, isn't it.</p>
        </div>

        {/* Mic area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Pulse rings when recording */}
          <div className="relative flex items-center justify-center mb-8">
            {recording && (
              <>
                <div className="absolute w-32 h-32 rounded-full bg-[#6C63FF]/10 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-[#6C63FF]/20 animate-ping" style={{ animationDelay: "150ms" }} />
              </>
            )}
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                recording ? "bg-red-500 hover:bg-red-600" : "bg-[#6C63FF] hover:bg-[#5A52E0]"
              }`}
            >
              {recording ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12V9C18.5 5.41015 15.5899 2.5 12 2.5C8.41015 2.5 5.5 5.41015 5.5 9V12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 12C3 12 3 21 12 21C21 21 21 12 21 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          <p className="text-sm font-medium text-[#6B6B80] mb-4">
            {recording ? "Listening… tap to stop" : "Tap the mic to start"}
          </p>

          {/* Live transcript */}
          {transcript && (
            <div className="w-full bg-white rounded-2xl px-4 py-3 shadow-sm text-center">
              <p className="text-xs font-semibold text-[#9B9BAD] mb-1">Hearing…</p>
              <p className="text-lg text-[#1A1A2E]">{transcript}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Learn ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[#9B9BAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest">Speaking</p>
        <span className="text-xs bg-[#E6F0FF] text-[#4C8BF5] font-semibold rounded-full px-2.5 py-1">
          {LESSON.level}
        </span>
      </div>

      <div className="flex-1 px-5 pb-32">
        <div className="mb-8">
          <h1
            className="text-3xl text-[#1A1A2E]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {LESSON.title}
          </h1>
          <p className="text-sm text-[#9B9BAD] mt-1">{LESSON.titleReading} — {LESSON.titleTranslation}</p>
        </div>

        {/* Listen card */}
        <button
          onClick={isPlaying ? undefined : playAudio}
          className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 mb-6 hover:shadow-md transition-shadow"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPlaying ? "bg-[#E6F0FF]" : "bg-[#6C63FF]"}`}>
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="#4C8BF5"/>
                <rect x="14" y="5" width="4" height="14" rx="1" fill="#4C8BF5"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5.14v14l11-7-11-7z"/>
              </svg>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1A1A2E]">{isPlaying ? "Playing…" : "Hear the phrase"}</p>
            <p className="text-xs text-[#9B9BAD]">Tap to listen before speaking</p>
          </div>
        </button>

        {/* Transcript */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest mb-4">
            Tap words to explore
          </p>
          <div className="text-2xl leading-loose text-[#1A1A2E]">
            {TOKENS.map((token, i) => {
              if (!token.tappable) return <span key={i}>{token.text}</span>;
              const isSelected = selected?.charStart === token.charStart;
              return (
                <button
                  key={i}
                  onClick={() => selectToken(token)}
                  className={`inline rounded px-0.5 transition-colors ${
                    isSelected ? "bg-[#E6F0FF] text-[#4C8BF5]" : "hover:bg-[#E6F0FF]/60"
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
          onClick={() => setScreen("speak")}
          className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3.5 text-sm hover:bg-[#5A52E0] transition-colors"
        >
          I'm ready → Start speaking
        </button>
      </div>
    </div>
  );
}
