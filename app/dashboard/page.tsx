import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WordOfDayCard from "@/components/WordOfDayCard";
import ModuleCard from "@/components/ModuleCard";
import { signout } from "@/app/auth/actions";

const MODULES = [
  {
    id: "listening",
    title: "Listening",
    description: "Train your ear with native audio",
    xp: 340,
    maxXp: 500,
    level: 4,
    color: "#FFE8CC",
    accent: "#FF9340",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 19C6.23858 19 4 16.7614 4 14V10C4 7.23858 6.23858 5 9 5H15C17.7614 5 20 7.23858 20 10V14C20 16.7614 17.7614 19 15 19M9 19V21M9 19H15M15 19V21M12 9V15M9 11V13M15 10V14"
          stroke="#FF9340"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Practice pronunciation with AI",
    xp: 210,
    maxXp: 500,
    level: 2,
    color: "#E6F0FF",
    accent: "#4C8BF5",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12V9C18.5 5.41015 15.5899 2.5 12 2.5C8.41015 2.5 5.5 5.41015 5.5 9V12C5.5 15.5899 8.41015 18.5 12 18.5Z"
          stroke="#4C8BF5"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12C3 12 3 21 12 21C21 21 21 12 21 12"
          stroke="#4C8BF5"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "reading",
    title: "Reading",
    description: "Build comprehension with real texts",
    xp: 480,
    maxXp: 500,
    level: 5,
    color: "#E8F7EE",
    accent: "#30C06E",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
          stroke="#30C06E"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="px-5 pt-12 pb-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#9B9BAD] font-medium">{greeting} 👋</p>
          <h1
            className="text-3xl text-[#1A1A2E] mt-0.5"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {firstName}
          </h1>
        </div>

        {/* Streak badge */}
        <div className="flex items-center gap-1.5 bg-[#FFF3E0] rounded-full px-3 py-1.5">
          <span className="text-base">🔥</span>
          <span className="text-sm font-semibold text-[#E65100]">7 day streak</span>
        </div>
      </div>

      {/* Total XP bar */}
      <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#6B6B80] uppercase tracking-wider">
            Total XP
          </span>
          <span className="text-xs font-bold text-[#6C63FF]">1,030 / 1,500</span>
        </div>
        <div className="h-2 bg-[#F0EDF8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]"
            style={{ width: "68.7%" }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[#9B9BAD]">470 XP until Level 8</p>
      </div>

      {/* Word of the Day */}
      <WordOfDayCard />

      {/* Modules */}
      <div>
        <h2 className="text-base font-semibold text-[#1A1A2E] mb-3">
          Learning modules
        </h2>
        <div className="space-y-3">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} {...mod} />
          ))}
        </div>
      </div>

      {/* Sign out */}
      <form action={signout} className="pt-2">
        <button
          type="submit"
          className="text-xs text-[#9B9BAD] hover:text-[#6B6B80] transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
