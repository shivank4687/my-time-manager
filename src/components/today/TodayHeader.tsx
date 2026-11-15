
import { format } from "date-fns";

export function TodayHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {greeting} <span className="hover:rotate-12 transition-transform duration-300 inline-block origin-bottom-right">👋</span>
        </h1>
        <p className="text-gray-500 font-medium">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
      </div>
    </header>
  );
}
