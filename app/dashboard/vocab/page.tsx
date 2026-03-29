import Link from "next/link";
import { VOCAB, LEVEL_META, JLPTLevel } from "@/lib/vocab";

const LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export default function VocabPage() {
  return (
    <div className="px-5 pt-12 pb-4">
      <div className="mb-8">
        <h1
          className="text-3xl text-[#1A1A2E]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Vocabulary
        </h1>
        <p className="text-sm text-[#9B9BAD] mt-1">Spaced repetition by JLPT level</p>
      </div>

      <div className="space-y-3">
        {LEVELS.map((level) => {
          const meta = LEVEL_META[level];
          const count = VOCAB[level].length;
          return (
            <Link key={level} href={`/dashboard/vocab/${level}`}>
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98] transition-transform">
                {/* Level badge */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: meta.bg }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: meta.color }}
                  >
                    {level}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-[#1A1A2E]">{meta.description}</h3>
                    <span
                      className="text-xs font-semibold rounded-full px-2 py-0.5"
                      style={{ color: meta.color, backgroundColor: meta.bg }}
                    >
                      {count} cards
                    </span>
                  </div>
                  <p className="text-xs text-[#9B9BAD]">JLPT {level} vocabulary</p>
                </div>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <path d="M9 18L15 12L9 6" stroke="#C4C2CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
