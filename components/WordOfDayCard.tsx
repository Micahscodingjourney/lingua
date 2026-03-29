export default function WordOfDayCard() {
  return (
    <div
      className="relative rounded-3xl overflow-hidden p-5"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)",
      }}
    >
      {/* Decorative circle */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#6C63FF]/20" />
      <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-[#A78BFA]/10" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-widest">
            Word of the day
          </span>
          <span className="text-xs bg-[#6C63FF]/30 text-[#C4BFFF] rounded-full px-2.5 py-0.5 font-medium">
            🇯🇵 Japanese
          </span>
        </div>

        <div className="mb-3">
          <h3
            className="text-4xl text-white mb-1"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            木漏れ日
          </h3>
          <p className="text-[#C4BFFF] text-sm font-medium">komorebi</p>
        </div>

        <p className="text-[#E0DEFF] text-sm leading-relaxed mb-4">
          The interplay of light and leaves when sunlight filters through trees
        </p>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-[#6C63FF] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#5A52E0] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12V9C18.5 5.41015 15.5899 2.5 12 2.5C8.41015 2.5 5.5 5.41015 5.5 9V12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 12C3 12 3 21 12 21C21 21 21 12 21 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Pronounce
          </button>
          <button className="flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-white/20 transition-colors">
            + Save word
          </button>
        </div>
      </div>
    </div>
  );
}
