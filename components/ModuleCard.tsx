import Link from "next/link";
import { ReactNode } from "react";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  xp: number;
  maxXp: number;
  level: number;
  color: string;
  accent: string;
  icon: ReactNode;
}

export default function ModuleCard({
  id,
  title,
  description,
  xp,
  maxXp,
  level,
  color,
  accent,
  icon,
}: ModuleCardProps) {
  const progress = (xp / maxXp) * 100;

  return (
    <Link href={`/dashboard/${id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98] transition-transform">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="text-sm font-semibold text-[#1A1A2E]">{title}</h3>
            <span
              className="text-xs font-bold rounded-full px-2 py-0.5"
              style={{ color: accent, backgroundColor: color }}
            >
              Lv {level}
            </span>
          </div>
          <p className="text-xs text-[#9B9BAD] mb-2 truncate">{description}</p>

          {/* XP bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#F0EDF8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: accent }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#9B9BAD] flex-shrink-0">
              {xp} XP
            </span>
          </div>
        </div>

        {/* Arrow */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path
            d="M9 18L15 12L9 6"
            stroke="#C4C2CE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
