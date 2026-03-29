import Link from "next/link";
import { SET_META, TraceSet } from "@/lib/trace-data";

const SETS: TraceSet[] = ["hiragana", "katakana", "kanji-n5"];

export default function TracePage() {
  return (
    <div className="px-5 pt-12 pb-4">
      <div className="mb-8">
        <h1
          className="text-3xl text-[#1A1A2E]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Tracing
        </h1>
        <p className="text-sm text-[#9B9BAD] mt-1">Practice writing kana and kanji</p>
      </div>

      <div className="space-y-3">
        {SETS.map((set) => {
          const meta = SET_META[set];
          return (
            <Link key={set} href={`/dashboard/trace/${set}`}>
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98] transition-transform">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: meta.bg }}
                >
                  <span className="text-2xl" style={{ fontFamily: "var(--font-dm-serif)", color: meta.color }}>
                    {set === "hiragana" ? "あ" : set === "katakana" ? "ア" : "字"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-[#1A1A2E]">{meta.label}</h3>
                    <span
                      className="text-xs font-semibold rounded-full px-2 py-0.5"
                      style={{ color: meta.color, backgroundColor: meta.bg }}
                    >
                      {meta.count} chars
                    </span>
                  </div>
                  <p className="text-xs text-[#9B9BAD]">{meta.description}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <path d="M9 18L15 12L9 6" stroke="#C4C2CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 bg-[#1A1A2E] rounded-2xl p-4">
        <p className="text-xs font-semibold text-[#A78BFA] mb-1">How it works</p>
        <p className="text-sm text-[#E0DEFF] leading-relaxed">
          Each character is shown as a faint guide. Trace over it with your finger or stylus, then rate yourself. Cards use spaced repetition — ones you know well appear less often.
        </p>
      </div>
    </div>
  );
}
