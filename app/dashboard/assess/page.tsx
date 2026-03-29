"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Kana, KanaRow,
  HIRAGANA_MAIN, HIRAGANA_DAKUTEN, HIRAGANA_COMBO,
  KATAKANA_MAIN, KATAKANA_DAKUTEN, KATAKANA_COMBO,
} from "@/lib/kana-data";

type Tab = "hiragana" | "katakana";
type QuizState = { cards: Kana[]; index: number; chosen: string | null; results: boolean[] };

// ── helpers ──────────────────────────────────────────────────────────────────
function allInRows(rows: KanaRow[]): Kana[] {
  return rows.flatMap((r) => r.kana);
}

function getOptions(correct: Kana, pool: Kana[]): string[] {
  const wrong = pool
    .filter((k) => k.romaji !== correct.romaji)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((k) => k.romaji);
  return [...wrong, correct.romaji].sort(() => Math.random() - 0.5);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── sub-components ────────────────────────────────────────────────────────────
function SectionToggle({
  title, rows, selected, onToggleRow, onToggleAll,
}: {
  title: string;
  rows: KanaRow[];
  selected: Set<string>;
  onToggleRow: (chars: string[]) => void;
  onToggleAll: (chars: string[]) => void;
}) {
  const allChars = rows.flatMap((r) => r.kana.map((k) => k.char));
  const allSelected = allChars.every((c) => selected.has(c));

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1A1A2E]">{title}</h3>
        <button
          onClick={() => onToggleAll(allChars)}
          className={`text-xs font-semibold rounded-full px-3 py-1 transition-colors ${
            allSelected
              ? "bg-[#6C63FF] text-white"
              : "border border-[#6C63FF] text-[#6C63FF]"
          }`}
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>

      <div className="space-y-2">
        {rows.map((row) => {
          const rowChars = row.kana.map((k) => k.char);
          const rowAllSelected = rowChars.every((c) => selected.has(c));
          return (
            <div key={row.label} className="flex items-center gap-2 flex-wrap">
              {/* Row group button */}
              <button
                onClick={() => onToggleRow(rowChars)}
                className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors flex-shrink-0 ${
                  rowAllSelected
                    ? "bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]"
                    : "border-[#E4E2DD] text-[#9B9BAD]"
                }`}
              >
                {row.label}
              </button>
              {/* Individual kana */}
              {row.kana.map((k) => {
                const sel = selected.has(k.char);
                return (
                  <button
                    key={k.char}
                    onClick={() => onToggleRow([k.char])}
                    className={`text-sm rounded-lg px-3 py-1.5 border transition-colors font-medium ${
                      sel
                        ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                        : "border-[#E4E2DD] text-[#1A1A2E] bg-white"
                    }`}
                  >
                    {k.char}
                    <span className={`text-[10px] ml-1 ${sel ? "text-[#C4BFFF]" : "text-[#9B9BAD]"}`}>
                      {k.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function Quiz({ cards, allPool, onFinish }: { cards: Kana[]; allPool: Kana[]; onFinish: (results: boolean[]) => void }) {
  const [state, setState] = useState<QuizState>({ cards, index: 0, chosen: null, results: [] });

  const current = state.cards[state.index];
  const options = useMemo(() => getOptions(current, allPool.length >= 4 ? allPool : cards), [current, allPool, cards]);

  function choose(opt: string) {
    if (state.chosen) return;
    setState((s) => ({ ...s, chosen: opt }));
    setTimeout(() => {
      const correct = opt === current.romaji;
      const newResults = [...state.results, correct];
      if (state.index + 1 >= state.cards.length) {
        onFinish(newResults);
      } else {
        setState((s) => ({ ...s, index: s.index + 1, chosen: null, results: newResults }));
      }
    }, 600);
  }

  const progress = (state.index / state.cards.length) * 100;

  return (
    <div className="flex flex-col min-h-screen px-5 pt-10 pb-8">
      {/* Progress */}
      <div className="h-1.5 bg-[#EEECE8] rounded-full overflow-hidden mb-2">
        <div className="h-full bg-[#6C63FF] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between text-xs text-[#9B9BAD] mb-10">
        <span>{state.index + 1} / {state.cards.length}</span>
        <span>{state.results.filter(Boolean).length} correct</span>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-8xl text-[#1A1A2E] mb-12" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {current.char}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {options.map((opt) => {
            const isChosen = state.chosen === opt;
            const isCorrect = opt === current.romaji;
            const revealed = !!state.chosen;

            let cls = "border-[#E4E2DD] bg-white text-[#1A1A2E]";
            if (revealed && isCorrect) cls = "border-[#30C06E] bg-[#E8F7EE] text-[#1A5C35]";
            else if (revealed && isChosen && !isCorrect) cls = "border-red-300 bg-red-50 text-red-700";

            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className={`rounded-2xl border-2 py-4 text-lg font-semibold transition-all ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────────
function Results({ results, total, onRetry, onBack }: { results: boolean[]; total: number; onRetry: () => void; onBack: () => void }) {
  const correct = results.filter(Boolean).length;
  const accuracy = Math.round((correct / total) * 100);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">{accuracy >= 90 ? "🏆" : accuracy >= 60 ? "⭐" : "📖"}</div>
      <h1 className="text-3xl text-[#1A1A2E] mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
        {accuracy >= 90 ? "Excellent!" : accuracy >= 60 ? "Good work!" : "Keep studying!"}
      </h1>
      <p className="text-[#6B6B80] mb-8">{correct} / {total} correct · {accuracy}%</p>

      <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-8">
        <div className="flex justify-around">
          <div><p className="text-3xl font-bold text-[#30C06E]">{correct}</p><p className="text-xs text-[#9B9BAD] mt-1">Correct</p></div>
          <div className="w-px bg-[#EEECE8]" />
          <div><p className="text-3xl font-bold text-[#FF9340]">{total - correct}</p><p className="text-xs text-[#9B9BAD] mt-1">Missed</p></div>
          <div className="w-px bg-[#EEECE8]" />
          <div><p className="text-3xl font-bold text-[#6C63FF]">{accuracy}%</p><p className="text-xs text-[#9B9BAD] mt-1">Score</p></div>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={onRetry} className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm hover:bg-[#F7F5F0] transition-colors">
          Try again
        </button>
        <button onClick={onBack} className="flex-1 rounded-xl bg-[#6C63FF] text-white font-semibold py-3 text-sm hover:bg-[#5A52E0] transition-colors">
          Change selection
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AssessPage() {
  const [tab, setTab] = useState<Tab>("hiragana");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<"select" | "quiz" | "results">("select");
  const [results, setResults] = useState<boolean[]>([]);
  const [quizCards, setQuizCards] = useState<Kana[]>([]);

  const mainRows    = tab === "hiragana" ? HIRAGANA_MAIN    : KATAKANA_MAIN;
  const dakutenRows = tab === "hiragana" ? HIRAGANA_DAKUTEN : KATAKANA_DAKUTEN;
  const comboRows   = tab === "hiragana" ? HIRAGANA_COMBO   : KATAKANA_COMBO;
  const allPool     = [...allInRows(mainRows), ...allInRows(dakutenRows), ...allInRows(comboRows)];
  const allChars    = allPool.map((k) => k.char);

  const allSelected = allChars.length > 0 && allChars.every((c) => selected.has(c));

  function toggleChars(chars: string[]) {
    setSelected((prev) => {
      const next = new Set(prev);
      const allIn = chars.every((c) => next.has(c));
      if (allIn) chars.forEach((c) => next.delete(c));
      else chars.forEach((c) => next.add(c));
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allChars));
  }

  function startQuiz() {
    const cards = shuffle(allPool.filter((k) => selected.has(k.char)));
    setQuizCards(cards);
    setPhase("quiz");
  }

  function handleFinish(r: boolean[]) {
    setResults(r);
    setPhase("results");
  }

  if (phase === "quiz") {
    return <Quiz cards={quizCards} allPool={allPool} onFinish={handleFinish} />;
  }

  if (phase === "results") {
    return (
      <Results
        results={results}
        total={quizCards.length}
        onRetry={() => { setQuizCards(shuffle([...quizCards])); setPhase("quiz"); }}
        onBack={() => setPhase("select")}
      />
    );
  }

  return (
    <div className="px-5 pt-12 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-[#1A1A2E]" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Assessment
          </h1>
          <p className="text-sm text-[#9B9BAD] mt-0.5">Choose kana to be tested on</p>
        </div>
        <Link href="/dashboard" className="text-[#9B9BAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Hiragana / Katakana tabs */}
      <div className="flex rounded-2xl bg-[#EEECE8] p-1 mb-4">
        {(["hiragana", "katakana"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelected(new Set()); }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              tab === t ? "bg-white text-[#1A1A2E] shadow-sm" : "text-[#6B6B80]"
            }`}
          >
            {t === "hiragana" ? "Hiragana" : "Katakana"}
          </button>
        ))}
      </div>

      {/* Select All */}
      <button
        onClick={toggleAll}
        className={`w-full rounded-xl py-3 text-sm font-semibold border-2 transition-colors mb-6 ${
          allSelected
            ? "bg-[#6C63FF] border-[#6C63FF] text-white"
            : "border-[#E4E2DD] text-[#6B6B80] bg-white"
        }`}
      >
        {allSelected ? "Deselect all kana" : `Select all ${tab === "hiragana" ? "Hiragana" : "Katakana"}`}
      </button>

      {/* Sections */}
      <SectionToggle title="Main Kana"        rows={mainRows}    selected={selected} onToggleRow={toggleChars} onToggleAll={toggleChars} />
      <SectionToggle title="Dakuten Kana"     rows={dakutenRows} selected={selected} onToggleRow={toggleChars} onToggleAll={toggleChars} />
      <SectionToggle title="Combination Kana" rows={comboRows}   selected={selected} onToggleRow={toggleChars} onToggleAll={toggleChars} />

      {/* Start CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4 bg-gradient-to-t from-[#F7F5F0] to-transparent">
        <button
          onClick={startQuiz}
          disabled={selected.size === 0}
          className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3.5 text-sm hover:bg-[#5A52E0] transition-colors disabled:opacity-40"
        >
          {selected.size === 0 ? "Select kana to start" : `Start quiz · ${selected.size} kana selected`}
        </button>
      </div>
    </div>
  );
}
