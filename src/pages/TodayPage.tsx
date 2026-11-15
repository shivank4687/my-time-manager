
import { DayProgressBar } from "../components/today/DayProgressBar";
import { CurrentTaskCard } from "../components/today/CurrentTaskCard";
import { TodayTimeline } from "../components/today/TodayTimeline";
import { DayPulse } from "../components/today/DayPulse";
import { BucketSuggestions } from "../components/today/BucketSuggestions";
import { TomorrowPreview } from "../components/today/TomorrowPreview";
import { ClockWidget } from "../components/today/ClockWidget";
import { ActiveGoals } from "../components/today/ActiveGoals";
import { DailyReflection } from "../components/today/DailyReflection";

export function TodayPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50 items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Column */}
          <main className="flex-1 flex flex-col gap-8 w-full min-w-0">
            <DayProgressBar />
            <CurrentTaskCard />
            <TodayTimeline />
            <DailyReflection />
          </main>

          {/* Secondary Column */}
          <aside className="w-full lg:w-96 flex flex-col gap-6 flex-none">
            <ClockWidget />
            <ActiveGoals />
            <DayPulse />
            <BucketSuggestions />
            <TomorrowPreview />
          </aside>
        </div>
      </div>
    </div>
  );
}
