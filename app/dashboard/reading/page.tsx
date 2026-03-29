"use client";

import { useState } from "react";
import Link from "next/link";

type Token = {
  text: string;
  reading?: string;
  translation?: string;
  tappable?: boolean;
};

type Question = {
  question: string;
  options: string[];
  correct: number;
};

const PASSAGE = {
  title: "朝の散歩",
  titleReading: "Asa no Sanpo",
  titleTranslation: "Morning Walk",
  level: "N5",
  xpReward: 60,
  tokens: [
    { text: "田中", reading: "たなか", translation: "Tanaka (a surname)", tappable: true },
    { text: "さん" },
    { text: "は" },
    { text: "毎朝", reading: "まいあさ", translation: "every morning", tappable: true },
    { text: "、" },
    { text: "近く", reading: "ちかく", translation: "nearby", tappable: true },
    { text: "の" },
    { text: "公園", reading: "こうえん", translation: "park", tappable: true },
    { text: "を" },
    { text: "散歩", reading: "さんぽ", translation: "walk / stroll", tappable: true },
    { text: "します。\n\n" },
    { text: "今日", reading: "きょう", translation: "today", tappable: true },
    { text: "は" },
    { text: "天気", reading: "てんき", translation: "weather", tappable: true },
    { text: "が" },
    { text: "いい", reading: "いい", translation: "good / nice", tappable: true },
    { text: "です。" },
    { text: "空気", reading: "くうき", translation: "air", tappable: true },
    { text: "も" },
    { text: "新鮮", reading: "しんせん", translation: "fresh", tappable: true },
    { text: "で、" },
    { text: "気持ち", reading: "きもち", translation: "feeling / mood", tappable: true },
    { text: "が" },
    { text: "いい", reading: "いい", translation: "good / nice", tappable: true },
    { text: "です。\n\n" },
    { text: "木", reading: "き", translation: "tree", tappable: true },
    { text: "の" },
    { text: "上", reading: "うえ", translation: "above / top", tappable: true },
    { text: "で" },
    { text: "鳥", reading: "とり", translation: "bird", tappable: true },
    { text: "が" },
    { text: "鳴いて", reading: "ないて", translation: "crying / singing (of a bird)", tappable: true },
    { text: "います。" },
    { text: "田中", reading: "たなか", translation: "Tanaka (a surname)", tappable: true },
    { text: "さん" },
    { text: "は" },
    { text: "この" },
    { text: "時間", reading: "じかん", translation: "time / this moment", tappable: true },
    { text: "が" },
    { text: "大好き", reading: "だいすき", translation: "loves / really likes", tappable: true },
    { text: "です。" },
  ] as Token[],
};

const QUESTIONS: Question[] = [
  {
    question: "What does Tanaka-san do every morning?",
    options: ["Goes to work by train", "Takes a walk in the nearby park", "Eats breakfast in a café", "Reads the news at home"],
    correct: 1,
  },
  {
    question: "How is the weather today?",
    options: ["Cloudy and cold", "Rainy", "Nice, with fresh air", "Hot and humid"],
    correct: 2,
  },
  {
    question: "What does Tanaka-san love about this time?",
    options: ["The silence", "This moment in the morning", "The exercise", "Meeting neighbours"],
    correct: 1,
  },
];

type Screen = "reading" | "quiz" | "complete";

export default function ReadingPage() {
  const [screen, setScreen] = useState<Screen>("reading");
  const [selected, setSelected] = useState<Token | null>(null);
  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [chosenOption, setChosenOption] = useState<number | null>(null);

  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const xpEarned = Math.round((score / QUESTIONS.length) * PASSAGE.xpReward);

  function handleAnswer(optionIndex: number) {
    if (chosenOption !== null) return;
    setChosenOption(optionIndex);
    setTimeout(() => {
      const newAnswers = [...answers, optionIndex];
      if (currentQ + 1 < QUESTIONS.length) {
        setAnswers(newAnswers);
        setCurrentQ(currentQ + 1);
        setChosenOption(null);
      } else {
        setAnswers(newAnswers);
        setScreen("complete");
      }
    }, 700);
  }

  if (screen === "complete") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">{score === 3 ? "🏆" : score >= 2 ? "⭐" : "📖"}</div>
        <h1
          className="text-3xl text-[#1A1A2E] mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {score === 3 ? "Perfect!" : score >= 2 ? "Well done!" : "Keep reading!"}
        </h1>
        <p className="text-[#6B6B80] mb-8">
          {score} of {QUESTIONS.length} correct
        </p>

        <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-sm mb-8">
          <p className="text-sm text-[#9B9BAD] mb-1">XP earned</p>
          <p className="text-4xl font-bold text-[#6C63FF]">+{xpEarned}</p>
          <div className="mt-3 h-2 bg-[#F0EDF8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] transition-all duration-1000"
              style={{ width: `${((480 + xpEarned) / 500) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#9B9BAD]">Reading — Level 5</p>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => { setScreen("reading"); setAnswers([]); setCurrentQ(0); setChosenOption(null); }}
            className="flex-1 rounded-xl border border-[#E4E2DD] bg-white text-[#4A4A5A] font-semibold py-3 text-sm hover:bg-[#F7F5F0] transition-colors"
          >
            Read again
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

  if (screen === "quiz") {
    const q = QUESTIONS[currentQ];
    return (
      <div className="min-h-screen px-5 pt-12 pb-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setScreen("reading")} className="text-[#9B9BAD]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < currentQ ? "w-6 bg-[#6C63FF]" : i === currentQ ? "w-6 bg-[#6C63FF]" : "w-6 bg-[#E4E2DD]"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-[#9B9BAD]">{currentQ + 1}/{QUESTIONS.length}</span>
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest mb-3">
            Question {currentQ + 1}
          </p>
          <h2
            className="text-2xl text-[#1A1A2E] mb-8 leading-snug"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((option, i) => {
              const isChosen = chosenOption === i;
              const isCorrect = i === q.correct;
              const revealed = chosenOption !== null;

              let style = "border-[#E4E2DD] bg-white text-[#1A1A2E]";
              if (revealed && isCorrect) style = "border-[#30C06E] bg-[#E8F7EE] text-[#1A5C35]";
              else if (revealed && isChosen && !isCorrect) style = "border-red-300 bg-red-50 text-red-700";

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${style}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {revealed && isCorrect ? "✓" : revealed && isChosen ? "✗" : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Reading screen
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[#9B9BAD]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="text-center">
          <p className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-widest">Reading</p>
        </div>
        <span className="text-xs bg-[#E8F7EE] text-[#30C06E] font-semibold rounded-full px-2.5 py-1">
          {PASSAGE.level}
        </span>
      </div>

      {/* Passage */}
      <div className="flex-1 px-5 pb-32 overflow-y-auto">
        <div className="mb-6">
          <h1
            className="text-3xl text-[#1A1A2E]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {PASSAGE.title}
          </h1>
          <p className="text-sm text-[#9B9BAD] mt-1">{PASSAGE.titleReading} — {PASSAGE.titleTranslation}</p>
        </div>

        <p className="text-xs text-[#9B9BAD] mb-4 flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Tap any word to see its meaning
        </p>

        <div className="text-xl leading-loose text-[#1A1A2E]">
          {PASSAGE.tokens.map((token, i) => {
            if (token.text.includes("\n")) {
              return <br key={i} />;
            }
            if (!token.tappable) {
              return <span key={i}>{token.text}</span>;
            }
            return (
              <button
                key={i}
                onClick={() => {
                  const isSame = selected?.text === token.text && selected?.reading === token.reading;
                  setSelected(isSame ? null : token);
                  setTranslationRevealed(false);
                }}
                className={`inline rounded px-0.5 transition-colors ${
                  selected?.text === token.text && selected?.reading === token.reading
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
          onClick={() => setScreen("quiz")}
          className="w-full rounded-xl bg-[#6C63FF] text-white font-semibold py-3.5 text-sm hover:bg-[#5A52E0] transition-colors"
        >
          I'm done reading → Take the quiz
        </button>
      </div>
    </div>
  );
}
